import { FastifyInstance } from 'fastify';
import { prisma } from '@rendrix/database';

// Helper to build tree structure
function buildMenuTree(items: any[], parentId: string | null = null): any[] {
  return items
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      url: item.url,
      target: item.target,
      icon: item.icon,
      highlight: item.highlight,
      badge: item.badge,
      cssClass: item.cssClass,
      page: item.page
        ? { slug: item.page.slug, title: item.page.title }
        : null,
      category: item.category
        ? { slug: item.category.slug, name: item.category.name }
        : null,
      product: item.product
        ? { slug: item.product.slug, name: item.product.name }
        : null,
      children: buildMenuTree(items, item.id),
    }));
}

export async function storefrontMenuRoutes(app: FastifyInstance) {
  // Get menu by location for a store (public)
  app.get('/:storeId/menus/:location', async (request, reply) => {
    const { storeId, location } = request.params as { storeId: string; location: string };

    // Validate location
    const validLocations = ['header', 'footer', 'mobile', 'utility'];
    if (!validLocations.includes(location)) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid menu location',
      });
    }

    // Find the store
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, status: true },
    });

    if (!store || store.status !== 'active') {
      return reply.status(404).send({
        success: false,
        error: 'Store not found',
      });
    }

    // Find the menu
    const menu = await prisma.menu.findFirst({
      where: {
        storeId,
        location,
        isActive: true,
      },
      include: {
        items: {
          where: { isVisible: true },
          include: {
            page: {
              select: { id: true, title: true, slug: true, status: true },
            },
            category: {
              select: { id: true, name: true, slug: true },
            },
            product: {
              select: { id: true, name: true, slug: true, status: true },
            },
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

    // Filter out items with unpublished pages/products
    const validItems = menu.items.filter((item) => {
      if (item.type === 'page' && item.page) {
        return item.page.status === 'published';
      }
      if (item.type === 'product' && item.product) {
        return item.product.status === 'active';
      }
      return true;
    });

    // Build hierarchical tree
    const itemTree = buildMenuTree(validItems);

    return reply.send({
      success: true,
      data: {
        id: menu.id,
        name: menu.name,
        location: menu.location,
        items: itemTree,
      },
    });
  });

  // Get all active menus for a store (public)
  app.get('/:storeId/menus', async (request, reply) => {
    const { storeId } = request.params as { storeId: string };

    // Find the store
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true, status: true },
    });

    if (!store || store.status !== 'active') {
      return reply.status(404).send({
        success: false,
        error: 'Store not found',
      });
    }

    // Find all active menus
    const menus = await prisma.menu.findMany({
      where: {
        storeId,
        isActive: true,
      },
      include: {
        items: {
          where: { isVisible: true },
          include: {
            page: {
              select: { id: true, title: true, slug: true, status: true },
            },
            category: {
              select: { id: true, name: true, slug: true },
            },
            product: {
              select: { id: true, name: true, slug: true, status: true },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    // Process each menu
    const processedMenus = menus.map((menu) => {
      // Filter out items with unpublished pages/products
      const validItems = menu.items.filter((item) => {
        if (item.type === 'page' && item.page) {
          return item.page.status === 'published';
        }
        if (item.type === 'product' && item.product) {
          return item.product.status === 'active';
        }
        return true;
      });

      return {
        id: menu.id,
        name: menu.name,
        location: menu.location,
        items: buildMenuTree(validItems),
      };
    });

    // Transform to object keyed by location for easy access
    const menusByLocation = processedMenus.reduce((acc, menu) => {
      acc[menu.location] = menu;
      return acc;
    }, {} as Record<string, any>);

    return reply.send({
      success: true,
      data: menusByLocation,
    });
  });
}
