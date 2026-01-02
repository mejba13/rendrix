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

// Menu Location Types
const menuLocations = ['header', 'footer', 'mobile', 'utility'] as const;

// Menu Item Types
const menuItemTypes = ['link', 'page', 'category', 'product', 'divider'] as const;

// Schemas
const createMenuSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  location: z.enum(menuLocations).default('header'),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
});

const updateMenuSchema = createMenuSchema.partial();

const listMenusSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(50),
  location: z.enum(menuLocations).optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().optional(),
});

const createMenuItemSchema = z.object({
  type: z.enum(menuItemTypes),
  title: z.string().min(1).max(255),
  url: z.string().max(500).optional().nullable(),
  target: z.enum(['_self', '_blank']).default('_self'),
  icon: z.string().max(100).optional().nullable(),
  pageId: z.string().uuid().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  productId: z.string().uuid().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isVisible: z.boolean().default(true),
  cssClass: z.string().max(255).optional().nullable(),
  highlight: z.boolean().default(false),
  badge: z.string().max(50).optional().nullable(),
});

const updateMenuItemSchema = createMenuItemSchema.partial();

// Helper to build tree structure
function buildMenuTree(items: any[], parentId: string | null = null): any[] {
  return items
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      ...item,
      children: buildMenuTree(items, item.id),
    }));
}

export async function menuRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireOrganization);
  app.addHook('preHandler', requireStore);

  // ==================== MENU CRUD ====================

  // List menus
  app.get('/', async (request, reply) => {
    const query = listMenusSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });
    const storeId = request.currentStore!.id;

    const where = {
      storeId,
      ...(query.location && { location: query.location }),
      ...(query.isActive !== undefined && { isActive: query.isActive }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' as const } },
          { description: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [menus, total] = await Promise.all([
      prisma.menu.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { items: true } },
        },
      }),
      prisma.menu.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: menus.map((m) => ({
        ...m,
        itemCount: m._count.items,
      })),
      meta: createPaginationMeta(total, page, limit),
    });
  });

  // Get menu by ID with full tree structure
  app.get('/:menuId', async (request, reply) => {
    const { menuId } = request.params as { menuId: string };
    const storeId = request.currentStore!.id;

    const menu = await prisma.menu.findFirst({
      where: { id: menuId, storeId },
      include: {
        items: {
          include: {
            page: { select: { id: true, title: true, slug: true, status: true } },
            category: { select: { id: true, name: true, slug: true } },
            product: { select: { id: true, name: true, slug: true, status: true } },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!menu) {
      throw new NotFoundError('Menu');
    }

    // Build hierarchical tree
    const itemTree = buildMenuTree(menu.items);

    return reply.send({
      success: true,
      data: {
        ...menu,
        items: itemTree,
      },
    });
  });

  // Get menu by location
  app.get('/location/:location', async (request, reply) => {
    const { location } = request.params as { location: string };
    const storeId = request.currentStore!.id;

    if (!menuLocations.includes(location as any)) {
      throw new NotFoundError('Menu location');
    }

    const menu = await prisma.menu.findFirst({
      where: { storeId, location, isActive: true },
      include: {
        items: {
          where: { isVisible: true },
          include: {
            page: { select: { id: true, title: true, slug: true, status: true } },
            category: { select: { id: true, name: true, slug: true } },
            product: { select: { id: true, name: true, slug: true, status: true } },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!menu) {
      return reply.send({
        success: true,
        data: null,
      });
    }

    // Build hierarchical tree
    const itemTree = buildMenuTree(menu.items);

    return reply.send({
      success: true,
      data: {
        ...menu,
        items: itemTree,
      },
    });
  });

  // Create menu
  app.post(
    '/',
    { preHandler: [requirePermission('content:create')] },
    async (request, reply) => {
      const body = createMenuSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Check if a menu with this location already exists
      const existingLocation = await prisma.menu.findFirst({
        where: { storeId, location: body.location },
      });

      if (existingLocation) {
        throw new ConflictError(`A menu for location "${body.location}" already exists`);
      }

      const slug =
        body.slug ||
        (await generateUniqueSlug(body.name, async (s) => {
          const exists = await prisma.menu.findUnique({
            where: { storeId_slug: { storeId, slug: s } },
          });
          return !!exists;
        }));

      const menu = await prisma.menu.create({
        data: {
          storeId,
          ...body,
          slug,
        },
        include: {
          _count: { select: { items: true } },
        },
      });

      return reply.status(201).send({
        success: true,
        data: {
          ...menu,
          itemCount: menu._count.items,
        },
      });
    }
  );

  // Update menu
  app.patch(
    '/:menuId',
    { preHandler: [requirePermission('content:update')] },
    async (request, reply) => {
      const { menuId } = request.params as { menuId: string };
      const body = updateMenuSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      const existing = await prisma.menu.findFirst({
        where: { id: menuId, storeId },
      });

      if (!existing) {
        throw new NotFoundError('Menu');
      }

      // Check location uniqueness if changing
      if (body.location && body.location !== existing.location) {
        const existingLocation = await prisma.menu.findFirst({
          where: { storeId, location: body.location, id: { not: menuId } },
        });
        if (existingLocation) {
          throw new ConflictError(`A menu for location "${body.location}" already exists`);
        }
      }

      // Check slug uniqueness if changing
      if (body.slug && body.slug !== existing.slug) {
        const existingSlug = await prisma.menu.findFirst({
          where: { storeId, slug: body.slug, id: { not: menuId } },
        });
        if (existingSlug) {
          throw new ConflictError('Menu with this slug already exists');
        }
      }

      const menu = await prisma.menu.update({
        where: { id: menuId },
        data: body,
        include: {
          _count: { select: { items: true } },
        },
      });

      return reply.send({
        success: true,
        data: {
          ...menu,
          itemCount: menu._count.items,
        },
      });
    }
  );

  // Delete menu
  app.delete(
    '/:menuId',
    { preHandler: [requirePermission('content:delete')] },
    async (request, reply) => {
      const { menuId } = request.params as { menuId: string };
      const storeId = request.currentStore!.id;

      const menu = await prisma.menu.findFirst({
        where: { id: menuId, storeId },
      });

      if (!menu) {
        throw new NotFoundError('Menu');
      }

      // Delete menu and all its items (cascade)
      await prisma.menu.delete({ where: { id: menuId } });

      return reply.send({
        success: true,
        data: { message: 'Menu deleted successfully' },
      });
    }
  );

  // ==================== MENU ITEM CRUD ====================

  // Add menu item
  app.post(
    '/:menuId/items',
    { preHandler: [requirePermission('content:create')] },
    async (request, reply) => {
      const { menuId } = request.params as { menuId: string };
      const body = createMenuItemSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Verify menu exists
      const menu = await prisma.menu.findFirst({
        where: { id: menuId, storeId },
      });

      if (!menu) {
        throw new NotFoundError('Menu');
      }

      // Verify parent item exists if provided
      if (body.parentId) {
        const parent = await prisma.menuItem.findFirst({
          where: { id: body.parentId, menuId },
        });
        if (!parent) {
          throw new NotFoundError('Parent menu item');
        }
      }

      // Validate referenced entities
      if (body.type === 'page' && body.pageId) {
        const page = await prisma.page.findFirst({
          where: { id: body.pageId, storeId },
        });
        if (!page) {
          throw new NotFoundError('Page');
        }
      }

      if (body.type === 'category' && body.categoryId) {
        const category = await prisma.category.findFirst({
          where: { id: body.categoryId, storeId },
        });
        if (!category) {
          throw new NotFoundError('Category');
        }
      }

      if (body.type === 'product' && body.productId) {
        const product = await prisma.product.findFirst({
          where: { id: body.productId, storeId },
        });
        if (!product) {
          throw new NotFoundError('Product');
        }
      }

      // Get max sort order for the parent level
      const maxSortOrder = await prisma.menuItem.findFirst({
        where: { menuId, parentId: body.parentId || null },
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      });

      const menuItem = await prisma.menuItem.create({
        data: {
          menuId,
          ...body,
          sortOrder: body.sortOrder || (maxSortOrder?.sortOrder ?? 0) + 1,
        },
        include: {
          page: { select: { id: true, title: true, slug: true, status: true } },
          category: { select: { id: true, name: true, slug: true } },
          product: { select: { id: true, name: true, slug: true, status: true } },
        },
      });

      return reply.status(201).send({
        success: true,
        data: menuItem,
      });
    }
  );

  // Update menu item
  app.patch(
    '/:menuId/items/:itemId',
    { preHandler: [requirePermission('content:update')] },
    async (request, reply) => {
      const { menuId, itemId } = request.params as { menuId: string; itemId: string };
      const body = updateMenuItemSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Verify menu and item exist
      const menu = await prisma.menu.findFirst({
        where: { id: menuId, storeId },
      });

      if (!menu) {
        throw new NotFoundError('Menu');
      }

      const existing = await prisma.menuItem.findFirst({
        where: { id: itemId, menuId },
      });

      if (!existing) {
        throw new NotFoundError('Menu item');
      }

      // Prevent circular parent reference
      if (body.parentId === itemId) {
        throw new ConflictError('A menu item cannot be its own parent');
      }

      // Check for circular reference in hierarchy
      if (body.parentId) {
        const parent = await prisma.menuItem.findFirst({
          where: { id: body.parentId, menuId },
        });
        if (!parent) {
          throw new NotFoundError('Parent menu item');
        }

        let currentParent = parent;
        while (currentParent.parentId) {
          if (currentParent.parentId === itemId) {
            throw new ConflictError('Circular parent reference detected');
          }
          const nextParent = await prisma.menuItem.findFirst({
            where: { id: currentParent.parentId },
          });
          if (!nextParent) break;
          currentParent = nextParent;
        }
      }

      const menuItem = await prisma.menuItem.update({
        where: { id: itemId },
        data: body,
        include: {
          page: { select: { id: true, title: true, slug: true, status: true } },
          category: { select: { id: true, name: true, slug: true } },
          product: { select: { id: true, name: true, slug: true, status: true } },
        },
      });

      return reply.send({
        success: true,
        data: menuItem,
      });
    }
  );

  // Delete menu item
  app.delete(
    '/:menuId/items/:itemId',
    { preHandler: [requirePermission('content:delete')] },
    async (request, reply) => {
      const { menuId, itemId } = request.params as { menuId: string; itemId: string };
      const storeId = request.currentStore!.id;

      // Verify menu exists
      const menu = await prisma.menu.findFirst({
        where: { id: menuId, storeId },
      });

      if (!menu) {
        throw new NotFoundError('Menu');
      }

      const item = await prisma.menuItem.findFirst({
        where: { id: itemId, menuId },
      });

      if (!item) {
        throw new NotFoundError('Menu item');
      }

      // Delete item and all children (cascade)
      await prisma.menuItem.delete({ where: { id: itemId } });

      return reply.send({
        success: true,
        data: { message: 'Menu item deleted successfully' },
      });
    }
  );

  // Reorder menu items
  app.post(
    '/:menuId/reorder',
    { preHandler: [requirePermission('content:update')] },
    async (request, reply) => {
      const { menuId } = request.params as { menuId: string };
      const storeId = request.currentStore!.id;

      const reorderSchema = z.object({
        items: z.array(z.object({
          id: z.string().uuid(),
          sortOrder: z.number().int(),
          parentId: z.string().uuid().optional().nullable(),
        })),
      });

      const body = reorderSchema.parse(request.body);

      // Verify menu exists
      const menu = await prisma.menu.findFirst({
        where: { id: menuId, storeId },
      });

      if (!menu) {
        throw new NotFoundError('Menu');
      }

      // Verify all items belong to this menu
      const itemIds = body.items.map((i) => i.id);
      const existingItems = await prisma.menuItem.findMany({
        where: { id: { in: itemIds }, menuId },
        select: { id: true },
      });

      const validIds = new Set(existingItems.map((i) => i.id));

      // Update each item's order and parent
      await prisma.$transaction(
        body.items
          .filter((i) => validIds.has(i.id))
          .map((item) =>
            prisma.menuItem.update({
              where: { id: item.id },
              data: {
                sortOrder: item.sortOrder,
                parentId: item.parentId,
              },
            })
          )
      );

      return reply.send({
        success: true,
        data: { message: 'Menu items reordered successfully' },
      });
    }
  );

  // Bulk actions for menu items
  app.post(
    '/:menuId/items/bulk',
    { preHandler: [requirePermission('content:update')] },
    async (request, reply) => {
      const { menuId } = request.params as { menuId: string };
      const storeId = request.currentStore!.id;

      const bulkSchema = z.object({
        action: z.enum(['show', 'hide', 'delete', 'highlight', 'unhighlight']),
        itemIds: z.array(z.string().uuid()).min(1).max(100),
      });

      const body = bulkSchema.parse(request.body);

      // Verify menu exists
      const menu = await prisma.menu.findFirst({
        where: { id: menuId, storeId },
      });

      if (!menu) {
        throw new NotFoundError('Menu');
      }

      const items = await prisma.menuItem.findMany({
        where: { id: { in: body.itemIds }, menuId },
        select: { id: true },
      });

      const validIds = items.map((i) => i.id);

      let result;
      switch (body.action) {
        case 'show':
          result = await prisma.menuItem.updateMany({
            where: { id: { in: validIds } },
            data: { isVisible: true },
          });
          break;
        case 'hide':
          result = await prisma.menuItem.updateMany({
            where: { id: { in: validIds } },
            data: { isVisible: false },
          });
          break;
        case 'highlight':
          result = await prisma.menuItem.updateMany({
            where: { id: { in: validIds } },
            data: { highlight: true },
          });
          break;
        case 'unhighlight':
          result = await prisma.menuItem.updateMany({
            where: { id: { in: validIds } },
            data: { highlight: false },
          });
          break;
        case 'delete':
          result = await prisma.menuItem.deleteMany({
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
