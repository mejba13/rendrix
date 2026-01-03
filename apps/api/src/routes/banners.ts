import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@rendrix/database';
import { paginate, createPaginationMeta } from '@rendrix/utils';
import {
  authenticate,
  requireOrganization,
  requireStore,
  requirePermission,
} from '../lib/auth';
import { NotFoundError } from '../lib/error-handler';

// Banner Placement Types
const bannerPlacements = ['homepage_hero', 'section_banner', 'collection_banner', 'announcement_bar'] as const;

// Banner Status Types
const bannerStatuses = ['draft', 'active', 'scheduled', 'inactive'] as const;

// Schemas
const createBannerSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  imageUrlTablet: z.string().url().optional().nullable(),
  imageUrlMobile: z.string().url().optional().nullable(),
  ctaText: z.string().max(100).optional().nullable(),
  ctaUrl: z.string().max(500).optional().nullable(),
  ctaTarget: z.enum(['_self', '_blank']).default('_self'),
  placement: z.enum(bannerPlacements).default('homepage_hero'),
  status: z.enum(bannerStatuses).default('draft'),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  priority: z.number().int().default(0),
  sortOrder: z.number().int().default(0),
  backgroundColor: z.string().max(20).optional().nullable(),
  textColor: z.string().max(20).optional().nullable(),
  overlayOpacity: z.number().int().min(0).max(100).default(0),
  metadata: z.record(z.any()).optional(),
});

const updateBannerSchema = createBannerSchema.partial();

const listBannersSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(50),
  placement: z.enum(bannerPlacements).optional(),
  status: z.enum(bannerStatuses).optional(),
  search: z.string().optional(),
});

export async function bannerRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireOrganization);
  app.addHook('preHandler', requireStore);

  // List banners
  app.get('/', async (request, reply) => {
    const query = listBannersSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });
    const storeId = request.currentStore!.id;

    const where = {
      storeId,
      ...(query.placement && { placement: query.placement }),
      ...(query.status && { status: query.status }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' as const } },
          { description: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [banners, total] = await Promise.all([
      prisma.banner.findMany({
        where,
        skip,
        take,
        orderBy: [{ sortOrder: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.banner.count({ where }),
    ]);

    // Add computed "isLive" status
    const now = new Date();
    const bannersWithLiveStatus = banners.map((banner) => ({
      ...banner,
      isLive:
        banner.status === 'active' &&
        (!banner.startDate || new Date(banner.startDate) <= now) &&
        (!banner.endDate || new Date(banner.endDate) >= now),
    }));

    return reply.send({
      success: true,
      data: bannersWithLiveStatus,
      meta: createPaginationMeta(total, page, limit),
    });
  });

  // Get banner stats
  app.get('/stats', async (request, reply) => {
    const storeId = request.currentStore!.id;
    const now = new Date();

    const [total, active, scheduled, draft] = await Promise.all([
      prisma.banner.count({ where: { storeId } }),
      prisma.banner.count({
        where: {
          storeId,
          status: 'active',
          OR: [{ startDate: null }, { startDate: { lte: now } }],
          AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
        },
      }),
      prisma.banner.count({
        where: {
          storeId,
          status: 'scheduled',
          startDate: { gt: now },
        },
      }),
      prisma.banner.count({ where: { storeId, status: 'draft' } }),
    ]);

    // Get counts by placement
    const placementCounts = await prisma.banner.groupBy({
      by: ['placement'],
      where: { storeId },
      _count: { placement: true },
    });

    return reply.send({
      success: true,
      data: {
        total,
        active,
        scheduled,
        draft,
        byPlacement: placementCounts.reduce(
          (acc, item) => ({
            ...acc,
            [item.placement]: item._count.placement,
          }),
          {} as Record<string, number>
        ),
      },
    });
  });

  // Get banner by ID
  app.get('/:bannerId', async (request, reply) => {
    const { bannerId } = request.params as { bannerId: string };
    const storeId = request.currentStore!.id;

    const banner = await prisma.banner.findFirst({
      where: { id: bannerId, storeId },
    });

    if (!banner) {
      throw new NotFoundError('Banner');
    }

    const now = new Date();
    const isLive =
      banner.status === 'active' &&
      (!banner.startDate || new Date(banner.startDate) <= now) &&
      (!banner.endDate || new Date(banner.endDate) >= now);

    return reply.send({
      success: true,
      data: { ...banner, isLive },
    });
  });

  // Create banner
  app.post(
    '/',
    { preHandler: [requirePermission('content:create')] },
    async (request, reply) => {
      const body = createBannerSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Get max sort order for the placement
      const maxSortOrder = await prisma.banner.findFirst({
        where: { storeId, placement: body.placement },
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      });

      const banner = await prisma.banner.create({
        data: {
          storeId,
          ...body,
          startDate: body.startDate ? new Date(body.startDate) : null,
          endDate: body.endDate ? new Date(body.endDate) : null,
          sortOrder: body.sortOrder || (maxSortOrder?.sortOrder ?? 0) + 1,
          metadata: body.metadata || {},
        },
      });

      return reply.status(201).send({
        success: true,
        data: banner,
      });
    }
  );

  // Update banner
  app.patch(
    '/:bannerId',
    { preHandler: [requirePermission('content:update')] },
    async (request, reply) => {
      const { bannerId } = request.params as { bannerId: string };
      const body = updateBannerSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      const existing = await prisma.banner.findFirst({
        where: { id: bannerId, storeId },
      });

      if (!existing) {
        throw new NotFoundError('Banner');
      }

      const banner = await prisma.banner.update({
        where: { id: bannerId },
        data: {
          ...body,
          ...(body.startDate !== undefined && {
            startDate: body.startDate ? new Date(body.startDate) : null,
          }),
          ...(body.endDate !== undefined && {
            endDate: body.endDate ? new Date(body.endDate) : null,
          }),
        },
      });

      return reply.send({
        success: true,
        data: banner,
      });
    }
  );

  // Delete banner
  app.delete(
    '/:bannerId',
    { preHandler: [requirePermission('content:delete')] },
    async (request, reply) => {
      const { bannerId } = request.params as { bannerId: string };
      const storeId = request.currentStore!.id;

      const banner = await prisma.banner.findFirst({
        where: { id: bannerId, storeId },
      });

      if (!banner) {
        throw new NotFoundError('Banner');
      }

      await prisma.banner.delete({ where: { id: bannerId } });

      return reply.send({
        success: true,
        data: { message: 'Banner deleted successfully' },
      });
    }
  );

  // Reorder banners
  app.post(
    '/reorder',
    { preHandler: [requirePermission('content:update')] },
    async (request, reply) => {
      const storeId = request.currentStore!.id;

      const reorderSchema = z.object({
        items: z.array(
          z.object({
            id: z.string().uuid(),
            sortOrder: z.number().int(),
          })
        ),
      });

      const body = reorderSchema.parse(request.body);

      // Verify all banners belong to this store
      const bannerIds = body.items.map((i) => i.id);
      const existingBanners = await prisma.banner.findMany({
        where: { id: { in: bannerIds }, storeId },
        select: { id: true },
      });

      const validIds = new Set(existingBanners.map((b) => b.id));

      // Update each banner's sort order
      await prisma.$transaction(
        body.items
          .filter((i) => validIds.has(i.id))
          .map((item) =>
            prisma.banner.update({
              where: { id: item.id },
              data: { sortOrder: item.sortOrder },
            })
          )
      );

      return reply.send({
        success: true,
        data: { message: 'Banners reordered successfully' },
      });
    }
  );

  // Duplicate banner
  app.post(
    '/:bannerId/duplicate',
    { preHandler: [requirePermission('content:create')] },
    async (request, reply) => {
      const { bannerId } = request.params as { bannerId: string };
      const storeId = request.currentStore!.id;

      const original = await prisma.banner.findFirst({
        where: { id: bannerId, storeId },
      });

      if (!original) {
        throw new NotFoundError('Banner');
      }

      // Get max sort order
      const maxSortOrder = await prisma.banner.findFirst({
        where: { storeId, placement: original.placement },
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      });

      const duplicate = await prisma.banner.create({
        data: {
          storeId,
          title: `${original.title} (Copy)`,
          description: original.description,
          imageUrl: original.imageUrl,
          imageUrlTablet: original.imageUrlTablet,
          imageUrlMobile: original.imageUrlMobile,
          ctaText: original.ctaText,
          ctaUrl: original.ctaUrl,
          ctaTarget: original.ctaTarget,
          placement: original.placement,
          status: 'draft',
          priority: original.priority,
          sortOrder: (maxSortOrder?.sortOrder ?? 0) + 1,
          backgroundColor: original.backgroundColor,
          textColor: original.textColor,
          overlayOpacity: original.overlayOpacity,
          metadata: original.metadata || {},
        },
      });

      return reply.status(201).send({
        success: true,
        data: duplicate,
      });
    }
  );

  // Bulk actions
  app.post(
    '/bulk',
    { preHandler: [requirePermission('content:update')] },
    async (request, reply) => {
      const storeId = request.currentStore!.id;

      const bulkSchema = z.object({
        action: z.enum(['activate', 'deactivate', 'delete', 'draft']),
        bannerIds: z.array(z.string().uuid()).min(1).max(100),
      });

      const body = bulkSchema.parse(request.body);

      const banners = await prisma.banner.findMany({
        where: { id: { in: body.bannerIds }, storeId },
        select: { id: true },
      });

      const validIds = banners.map((b) => b.id);

      let result;
      switch (body.action) {
        case 'activate':
          result = await prisma.banner.updateMany({
            where: { id: { in: validIds } },
            data: { status: 'active' },
          });
          break;
        case 'deactivate':
          result = await prisma.banner.updateMany({
            where: { id: { in: validIds } },
            data: { status: 'inactive' },
          });
          break;
        case 'draft':
          result = await prisma.banner.updateMany({
            where: { id: { in: validIds } },
            data: { status: 'draft' },
          });
          break;
        case 'delete':
          result = await prisma.banner.deleteMany({
            where: { id: { in: validIds } },
          });
          break;
      }

      return reply.send({
        success: true,
        data: {
          action: body.action,
          affected: result.count,
        },
      });
    }
  );
}
