import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@rendrix/database';
import { generateUniqueSlug, paginate, createPaginationMeta } from '@rendrix/utils';
import {
  authenticate,
  requireOrganization,
  requirePermission,
} from '../lib/auth';
import { NotFoundError, ConflictError, ForbiddenError } from '../lib/error-handler';

const createStoreSchema = z.object({
  name: z.string().min(2).max(255),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  industry: z
    .enum([
      'toys',
      'kitchen',
      'nail_care',
      'home_decor',
      'garments',
      'beauty',
      'sports',
      'gadgets',
      'home_appliances',
      'general',
    ])
    .default('general'),
  description: z.string().max(1000).optional(),
  templateId: z.string().uuid().optional(),
});

const updateStoreSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  faviconUrl: z.string().url().optional().nullable(),
  status: z.enum(['active', 'inactive']).optional(),
});

const updateSettingsSchema = z.object({
  currency: z.string().length(3).optional(),
  timezone: z.string().optional(),
  weightUnit: z.enum(['kg', 'lb', 'g', 'oz']).optional(),
  dimensionUnit: z.enum(['cm', 'in', 'm', 'ft']).optional(),
  taxesIncluded: z.boolean().optional(),
  enableReviews: z.boolean().optional(),
  enableWishlist: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
});

const updateSeoSchema = z.object({
  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  ogImage: z.string().url().optional().nullable(),
  googleAnalyticsId: z.string().optional().nullable(),
  facebookPixelId: z.string().optional().nullable(),
});

const listStoresSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  industry: z.string().optional(),
  search: z.string().optional(),
});

export async function storeRoutes(app: FastifyInstance) {
  // All routes require authentication and organization context
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireOrganization);

  // List stores
  app.get('/', async (request, reply) => {
    const query = listStoresSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });

    const where = {
      organizationId: request.currentOrganization!.id,
      ...(query.status && { status: query.status }),
      ...(query.industry && { industry: query.industry }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' as const } },
          { slug: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          theme: {
            select: { name: true, thumbnailUrl: true },
          },
          _count: {
            select: { products: true, orders: true, customers: true },
          },
        },
      }),
      prisma.store.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: stores.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        subdomain: s.subdomain,
        customDomain: s.customDomain,
        industry: s.industry,
        logoUrl: s.logoUrl,
        status: s.status,
        theme: s.theme,
        stats: {
          products: s._count.products,
          orders: s._count.orders,
          customers: s._count.customers,
        },
        createdAt: s.createdAt,
      })),
      meta: createPaginationMeta(total, page, limit),
    });
  });

  // Create store
  app.post(
    '/',
    { preHandler: [requirePermission('stores:create')] },
    async (request, reply) => {
      const body = createStoreSchema.parse(request.body);
      const orgId = request.currentOrganization!.id;

      // Check plan limits
      const subscription = await prisma.subscription.findFirst({
        where: { organizationId: orgId },
        include: { plan: true },
      });

      if (subscription) {
        const limits = subscription.plan.limits as { maxStores?: number | null };
        if (limits.maxStores !== null) {
          const currentStores = await prisma.store.count({
            where: { organizationId: orgId },
          });

          if (currentStores >= limits.maxStores) {
            throw new ForbiddenError(
              `Your plan allows a maximum of ${limits.maxStores} stores. Upgrade to add more.`
            );
          }
        }
      }

      // Generate unique slug
      const slug =
        body.slug ||
        (await generateUniqueSlug(body.name, async (s) => {
          const exists = await prisma.store.findUnique({
            where: { organizationId_slug: { organizationId: orgId, slug: s } },
          });
          return !!exists;
        }));

      // Check slug uniqueness
      const existingStore = await prisma.store.findUnique({
        where: { organizationId_slug: { organizationId: orgId, slug } },
      });

      if (existingStore) {
        throw new ConflictError('Store with this slug already exists');
      }

      // Generate subdomain
      const subdomain = `${slug}-${orgId.slice(0, 8)}`.toLowerCase();

      // Get default theme if no template specified
      let themeId = body.templateId;
      if (!themeId) {
        const defaultTheme = await prisma.theme.findFirst({
          where: { slug: 'minimal-store' },
        });
        themeId = defaultTheme?.id;
      }

      // Create store
      const store = await prisma.store.create({
        data: {
          organizationId: orgId,
          name: body.name,
          slug,
          subdomain,
          industry: body.industry,
          description: body.description,
          themeId,
          settings: {
            currency: 'USD',
            timezone: 'America/New_York',
            weightUnit: 'lb',
            dimensionUnit: 'in',
            taxesIncluded: false,
            enableReviews: true,
            enableWishlist: true,
            maintenanceMode: false,
          },
          seoSettings: {
            metaTitle: body.name,
            metaDescription: body.description || null,
          },
        },
        include: {
          theme: {
            select: { name: true, thumbnailUrl: true },
          },
        },
      });

      return reply.status(201).send({
        success: true,
        data: {
          id: store.id,
          name: store.name,
          slug: store.slug,
          subdomain: store.subdomain,
          industry: store.industry,
          theme: store.theme,
        },
      });
    }
  );

  // Get store by ID
  app.get('/:storeId', async (request, reply) => {
    const { storeId } = request.params as { storeId: string };

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        organizationId: request.currentOrganization!.id,
      },
      include: {
        theme: true,
        _count: {
          select: { products: true, orders: true, customers: true },
        },
      },
    });

    if (!store) {
      throw new NotFoundError('Store');
    }

    return reply.send({
      success: true,
      data: {
        ...store,
        stats: {
          products: store._count.products,
          orders: store._count.orders,
          customers: store._count.customers,
        },
      },
    });
  });

  // Update store
  app.patch(
    '/:storeId',
    { preHandler: [requirePermission('stores:update')] },
    async (request, reply) => {
      const { storeId } = request.params as { storeId: string };
      const body = updateStoreSchema.parse(request.body);

      // Verify store belongs to organization
      const existing = await prisma.store.findFirst({
        where: {
          id: storeId,
          organizationId: request.currentOrganization!.id,
        },
      });

      if (!existing) {
        throw new NotFoundError('Store');
      }

      const store = await prisma.store.update({
        where: { id: storeId },
        data: body,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          logoUrl: true,
          faviconUrl: true,
          status: true,
          updatedAt: true,
        },
      });

      return reply.send({
        success: true,
        data: store,
      });
    }
  );

  // Delete store
  app.delete(
    '/:storeId',
    { preHandler: [requirePermission('stores:delete')] },
    async (request, reply) => {
      const { storeId } = request.params as { storeId: string };

      // Verify store belongs to organization
      const store = await prisma.store.findFirst({
        where: {
          id: storeId,
          organizationId: request.currentOrganization!.id,
        },
      });

      if (!store) {
        throw new NotFoundError('Store');
      }

      await prisma.store.delete({ where: { id: storeId } });

      return reply.send({
        success: true,
        data: { message: 'Store deleted successfully' },
      });
    }
  );

  // Get store settings
  app.get('/:storeId/settings', async (request, reply) => {
    const { storeId } = request.params as { storeId: string };

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        organizationId: request.currentOrganization!.id,
      },
      select: { settings: true },
    });

    if (!store) {
      throw new NotFoundError('Store');
    }

    return reply.send({
      success: true,
      data: store.settings,
    });
  });

  // Update store settings
  app.patch(
    '/:storeId/settings',
    { preHandler: [requirePermission('stores:settings:manage')] },
    async (request, reply) => {
      const { storeId } = request.params as { storeId: string };
      const body = updateSettingsSchema.parse(request.body);

      const store = await prisma.store.findFirst({
        where: {
          id: storeId,
          organizationId: request.currentOrganization!.id,
        },
        select: { settings: true },
      });

      if (!store) {
        throw new NotFoundError('Store');
      }

      const updatedSettings = { ...(store.settings as object), ...body };

      const updated = await prisma.store.update({
        where: { id: storeId },
        data: { settings: updatedSettings },
        select: { settings: true },
      });

      return reply.send({
        success: true,
        data: updated.settings,
      });
    }
  );

  // Get store SEO settings
  app.get('/:storeId/seo', async (request, reply) => {
    const { storeId } = request.params as { storeId: string };

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        organizationId: request.currentOrganization!.id,
      },
      select: { seoSettings: true },
    });

    if (!store) {
      throw new NotFoundError('Store');
    }

    return reply.send({
      success: true,
      data: store.seoSettings,
    });
  });

  // Update store SEO settings
  app.patch(
    '/:storeId/seo',
    { preHandler: [requirePermission('stores:settings:manage')] },
    async (request, reply) => {
      const { storeId } = request.params as { storeId: string };
      const body = updateSeoSchema.parse(request.body);

      const store = await prisma.store.findFirst({
        where: {
          id: storeId,
          organizationId: request.currentOrganization!.id,
        },
        select: { seoSettings: true },
      });

      if (!store) {
        throw new NotFoundError('Store');
      }

      const updatedSeo = { ...(store.seoSettings as object), ...body };

      const updated = await prisma.store.update({
        where: { id: storeId },
        data: { seoSettings: updatedSeo },
        select: { seoSettings: true },
      });

      return reply.send({
        success: true,
        data: updated.seoSettings,
      });
    }
  );
}
