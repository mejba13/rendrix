import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@rendrix/database';
import { generateUniqueSlug, paginate, createPaginationMeta } from '@rendrix/utils';
import {
  authenticate,
  requireOrganization,
  requireStore,
  requirePermission,
} from '../lib/auth';
import { NotFoundError, ConflictError } from '../lib/error-handler';

const createPageSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  content: z.string().optional(),
  template: z.enum(['default', 'full-width', 'sidebar', 'landing', 'contact', 'faq']).default('default'),
  status: z.enum(['draft', 'published']).default('draft'),
  visibility: z.enum(['public', 'private']).default('public'),
  showInNav: z.boolean().default(false),
  navOrder: z.number().int().default(0),
  parentId: z.string().uuid().optional().nullable(),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
  featuredImage: z.string().url().optional().nullable(),
});

const updatePageSchema = createPageSchema.partial();

const listPagesSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(50),
  status: z.enum(['draft', 'published']).optional(),
  template: z.enum(['default', 'full-width', 'sidebar', 'landing', 'contact', 'faq']).optional(),
  showInNav: z.coerce.boolean().optional(),
  parentId: z.string().uuid().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['title', 'createdAt', 'updatedAt', 'navOrder']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export async function pageRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireOrganization);
  app.addHook('preHandler', requireStore);

  // List pages
  app.get('/', async (request, reply) => {
    const query = listPagesSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });
    const storeId = request.currentStore!.id;

    const where = {
      storeId,
      ...(query.status && { status: query.status }),
      ...(query.template && { template: query.template }),
      ...(query.showInNav !== undefined && { showInNav: query.showInNav }),
      ...(query.parentId !== undefined && { parentId: query.parentId || null }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' as const } },
          { content: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        skip,
        take,
        orderBy: { [query.sortBy]: query.sortOrder },
        include: {
          parent: {
            select: { id: true, title: true, slug: true },
          },
          _count: { select: { children: true } },
        },
      }),
      prisma.page.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: pages.map((p) => ({
        ...p,
        childrenCount: p._count.children,
      })),
      meta: createPaginationMeta(total, page, limit),
    });
  });

  // Get pages tree (hierarchical structure for navigation)
  app.get('/tree', async (request, reply) => {
    const storeId = request.currentStore!.id;

    const pages = await prisma.page.findMany({
      where: { storeId },
      orderBy: [{ navOrder: 'asc' }, { title: 'asc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        template: true,
        showInNav: true,
        navOrder: true,
        parentId: true,
      },
    });

    // Build tree structure
    const buildTree = (parentId: string | null): any[] => {
      return pages
        .filter((p) => p.parentId === parentId)
        .map((page) => ({
          ...page,
          children: buildTree(page.id),
        }));
    };

    return reply.send({
      success: true,
      data: buildTree(null),
    });
  });

  // Create page
  app.post(
    '/',
    { preHandler: [requirePermission('content:create')] },
    async (request, reply) => {
      const body = createPageSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Verify parent page exists if provided
      if (body.parentId) {
        const parent = await prisma.page.findFirst({
          where: { id: body.parentId, storeId },
        });
        if (!parent) {
          throw new NotFoundError('Parent page');
        }
      }

      const slug =
        body.slug ||
        (await generateUniqueSlug(body.title, async (s) => {
          const exists = await prisma.page.findUnique({
            where: { storeId_slug: { storeId, slug: s } },
          });
          return !!exists;
        }));

      const page = await prisma.page.create({
        data: {
          storeId,
          ...body,
          slug,
          publishedAt: body.status === 'published' ? new Date() : null,
        },
        include: {
          parent: {
            select: { id: true, title: true, slug: true },
          },
        },
      });

      return reply.status(201).send({
        success: true,
        data: page,
      });
    }
  );

  // Get page by ID
  app.get('/:pageId', async (request, reply) => {
    const { pageId } = request.params as { pageId: string };

    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        storeId: request.currentStore!.id,
      },
      include: {
        parent: {
          select: { id: true, title: true, slug: true },
        },
        children: {
          select: { id: true, title: true, slug: true, status: true },
          orderBy: { navOrder: 'asc' },
        },
      },
    });

    if (!page) {
      throw new NotFoundError('Page');
    }

    return reply.send({
      success: true,
      data: page,
    });
  });

  // Update page
  app.patch(
    '/:pageId',
    { preHandler: [requirePermission('content:update')] },
    async (request, reply) => {
      const { pageId } = request.params as { pageId: string };
      const body = updatePageSchema.parse(request.body);

      const existing = await prisma.page.findFirst({
        where: {
          id: pageId,
          storeId: request.currentStore!.id,
        },
      });

      if (!existing) {
        throw new NotFoundError('Page');
      }

      // Prevent circular parent reference
      if (body.parentId === pageId) {
        throw new ConflictError('A page cannot be its own parent');
      }

      // Verify parent page exists if provided
      if (body.parentId) {
        const parent = await prisma.page.findFirst({
          where: { id: body.parentId, storeId: request.currentStore!.id },
        });
        if (!parent) {
          throw new NotFoundError('Parent page');
        }

        // Check for circular reference in hierarchy
        let currentParent = parent;
        while (currentParent.parentId) {
          if (currentParent.parentId === pageId) {
            throw new ConflictError('Circular parent reference detected');
          }
          const nextParent = await prisma.page.findFirst({
            where: { id: currentParent.parentId },
          });
          if (!nextParent) break;
          currentParent = nextParent;
        }
      }

      if (body.slug && body.slug !== existing.slug) {
        const slugExists = await prisma.page.findFirst({
          where: {
            storeId: request.currentStore!.id,
            slug: body.slug,
            id: { not: pageId },
          },
        });

        if (slugExists) {
          throw new ConflictError('Page with this slug already exists');
        }
      }

      const page = await prisma.page.update({
        where: { id: pageId },
        data: {
          ...body,
          publishedAt:
            body.status === 'published' && !existing.publishedAt
              ? new Date()
              : existing.publishedAt,
        },
        include: {
          parent: {
            select: { id: true, title: true, slug: true },
          },
        },
      });

      return reply.send({
        success: true,
        data: page,
      });
    }
  );

  // Delete page
  app.delete(
    '/:pageId',
    { preHandler: [requirePermission('content:delete')] },
    async (request, reply) => {
      const { pageId } = request.params as { pageId: string };

      const page = await prisma.page.findFirst({
        where: {
          id: pageId,
          storeId: request.currentStore!.id,
        },
        include: {
          _count: { select: { children: true } },
        },
      });

      if (!page) {
        throw new NotFoundError('Page');
      }

      // Check if page has children
      if (page._count.children > 0) {
        throw new ConflictError('Cannot delete page with child pages. Delete or move child pages first.');
      }

      await prisma.page.delete({ where: { id: pageId } });

      return reply.send({
        success: true,
        data: { message: 'Page deleted successfully' },
      });
    }
  );

  // Bulk actions for pages
  app.post(
    '/bulk',
    { preHandler: [requirePermission('content:update')] },
    async (request, reply) => {
      const bulkSchema = z.object({
        action: z.enum(['publish', 'unpublish', 'delete', 'showInNav', 'hideFromNav']),
        pageIds: z.array(z.string().uuid()).min(1).max(100),
      });

      const body = bulkSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      const pages = await prisma.page.findMany({
        where: {
          id: { in: body.pageIds },
          storeId,
        },
        select: { id: true },
      });

      const validIds = pages.map((p) => p.id);

      let result;
      switch (body.action) {
        case 'publish':
          result = await prisma.page.updateMany({
            where: { id: { in: validIds } },
            data: { status: 'published', publishedAt: new Date() },
          });
          break;
        case 'unpublish':
          result = await prisma.page.updateMany({
            where: { id: { in: validIds } },
            data: { status: 'draft' },
          });
          break;
        case 'showInNav':
          result = await prisma.page.updateMany({
            where: { id: { in: validIds } },
            data: { showInNav: true },
          });
          break;
        case 'hideFromNav':
          result = await prisma.page.updateMany({
            where: { id: { in: validIds } },
            data: { showInNav: false },
          });
          break;
        case 'delete':
          // Only delete pages without children
          const pagesWithChildren = await prisma.page.findMany({
            where: { id: { in: validIds } },
            include: { _count: { select: { children: true } } },
          });
          const deletableIds = pagesWithChildren
            .filter((p) => p._count.children === 0)
            .map((p) => p.id);

          result = await prisma.page.deleteMany({
            where: { id: { in: deletableIds } },
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

  // Reorder pages (for navigation)
  app.post(
    '/reorder',
    { preHandler: [requirePermission('content:update')] },
    async (request, reply) => {
      const reorderSchema = z.object({
        pages: z.array(z.object({
          id: z.string().uuid(),
          navOrder: z.number().int(),
          parentId: z.string().uuid().optional().nullable(),
        })),
      });

      const body = reorderSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Verify all pages belong to the store
      const pageIds = body.pages.map((p) => p.id);
      const existingPages = await prisma.page.findMany({
        where: { id: { in: pageIds }, storeId },
        select: { id: true },
      });

      const validIds = new Set(existingPages.map((p) => p.id));

      // Update each page's order and parent
      await prisma.$transaction(
        body.pages
          .filter((p) => validIds.has(p.id))
          .map((page) =>
            prisma.page.update({
              where: { id: page.id },
              data: {
                navOrder: page.navOrder,
                parentId: page.parentId,
              },
            })
          )
      );

      return reply.send({
        success: true,
        data: { message: 'Pages reordered successfully' },
      });
    }
  );

  // Duplicate page
  app.post(
    '/:pageId/duplicate',
    { preHandler: [requirePermission('content:create')] },
    async (request, reply) => {
      const { pageId } = request.params as { pageId: string };
      const storeId = request.currentStore!.id;

      const original = await prisma.page.findFirst({
        where: { id: pageId, storeId },
      });

      if (!original) {
        throw new NotFoundError('Page');
      }

      const newSlug = await generateUniqueSlug(`${original.slug}-copy`, async (s) => {
        const exists = await prisma.page.findUnique({
          where: { storeId_slug: { storeId, slug: s } },
        });
        return !!exists;
      });

      const duplicate = await prisma.page.create({
        data: {
          storeId,
          title: `${original.title} (Copy)`,
          slug: newSlug,
          content: original.content,
          template: original.template,
          status: 'draft',
          visibility: original.visibility,
          showInNav: false,
          navOrder: 0,
          parentId: original.parentId,
          seoTitle: original.seoTitle,
          seoDescription: original.seoDescription,
          featuredImage: original.featuredImage,
        },
      });

      return reply.status(201).send({
        success: true,
        data: duplicate,
      });
    }
  );
}
