import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@rendrix/database';
import { paginate, createPaginationMeta } from '@rendrix/utils';
import { authenticate, requireOrganization } from '../lib/auth';
import { NotFoundError } from '../lib/error-handler';

const listThemesSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(50).default(6),
  search: z.string().optional(),
  industry: z.string().optional(),
  isPremium: z.enum(['true', 'false']).optional().transform((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return undefined;
  }),
  sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const applyThemeSchema = z.object({
  themeId: z.string().uuid(),
});

const updateThemeSettingsSchema = z.object({
  colors: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
    background: z.string().optional(),
    text: z.string().optional(),
    muted: z.string().optional(),
  }).optional(),
  typography: z.object({
    headingFont: z.string().optional(),
    bodyFont: z.string().optional(),
    baseFontSize: z.number().min(12).max(20).optional(),
    headingWeight: z.string().optional(),
    bodyWeight: z.string().optional(),
  }).optional(),
  layout: z.object({
    containerWidth: z.enum(['narrow', 'medium', 'wide', 'full']).optional(),
    headerStyle: z.enum(['minimal', 'centered', 'expanded']).optional(),
    footerStyle: z.enum(['minimal', 'standard', 'expanded']).optional(),
    productGridColumns: z.number().min(2).max(4).optional(),
  }).optional(),
  components: z.object({
    buttonStyle: z.enum(['rounded', 'pill', 'sharp']).optional(),
    cardStyle: z.enum(['flat', 'raised', 'bordered']).optional(),
    imageStyle: z.enum(['square', 'rounded', 'circle']).optional(),
  }).optional(),
  effects: z.object({
    enableAnimations: z.boolean().optional(),
    enableHoverEffects: z.boolean().optional(),
    enableParallax: z.boolean().optional(),
  }).optional(),
  customCss: z.string().max(10000).optional(),
});

export async function themeRoutes(app: FastifyInstance) {
  // Public route - List all active themes
  app.get('/', async (request, reply) => {
    const query = listThemesSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.industry) {
      where.industries = { array_contains: [query.industry] };
    }

    if (query.isPremium !== undefined) {
      where.isPremium = query.isPremium;
    }

    const orderBy: Record<string, string> = {};
    orderBy[query.sortBy] = query.sortOrder;

    const [themes, total] = await Promise.all([
      prisma.theme.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          previewUrl: true,
          thumbnailUrl: true,
          version: true,
          author: true,
          industries: true,
          features: true,
          isPremium: true,
          price: true,
          settingsSchema: true,
          createdAt: true,
        },
      }),
      prisma.theme.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: themes.map((theme) => ({
        ...theme,
        price: theme.price ? Number(theme.price) : null,
      })),
      meta: createPaginationMeta(total, page, limit),
    });
  });

  // Public route - Get single theme by ID or slug
  app.get('/:themeIdOrSlug', async (request, reply) => {
    const { themeIdOrSlug } = request.params as { themeIdOrSlug: string };

    // Try to find by ID first (if it's a UUID), otherwise by slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(themeIdOrSlug);

    const theme = await prisma.theme.findFirst({
      where: isUuid
        ? { id: themeIdOrSlug, isActive: true }
        : { slug: themeIdOrSlug, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        previewUrl: true,
        thumbnailUrl: true,
        version: true,
        author: true,
        industries: true,
        features: true,
        isPremium: true,
        price: true,
        settingsSchema: true,
        createdAt: true,
        _count: {
          select: { stores: true },
        },
      },
    });

    if (!theme) {
      throw new NotFoundError('Theme');
    }

    return reply.send({
      success: true,
      data: {
        ...theme,
        price: theme.price ? Number(theme.price) : null,
        usageCount: theme._count.stores,
      },
    });
  });

  // Protected routes - require authentication
  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook('preHandler', authenticate);
    protectedRoutes.addHook('preHandler', requireOrganization);

    // Apply theme to store
    protectedRoutes.post('/stores/:storeId/apply', async (request, reply) => {
      const { storeId } = request.params as { storeId: string };
      const body = applyThemeSchema.parse(request.body);

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

      // Verify theme exists and is active
      const theme = await prisma.theme.findFirst({
        where: {
          id: body.themeId,
          isActive: true,
        },
      });

      if (!theme) {
        throw new NotFoundError('Theme');
      }

      // Apply theme to store
      const updatedStore = await prisma.store.update({
        where: { id: storeId },
        data: {
          themeId: body.themeId,
          themeSettings: theme.settingsSchema || {},
        },
        include: {
          theme: {
            select: {
              id: true,
              name: true,
              slug: true,
              thumbnailUrl: true,
              isPremium: true,
              price: true,
            },
          },
        },
      });

      return reply.send({
        success: true,
        data: {
          storeId: updatedStore.id,
          theme: updatedStore.theme
            ? {
                ...updatedStore.theme,
                price: updatedStore.theme.price ? Number(updatedStore.theme.price) : null,
              }
            : null,
          themeSettings: updatedStore.themeSettings,
        },
      });
    });

    // Get store's current theme and settings
    protectedRoutes.get('/stores/:storeId/current', async (request, reply) => {
      const { storeId } = request.params as { storeId: string };

      const store = await prisma.store.findFirst({
        where: {
          id: storeId,
          organizationId: request.currentOrganization!.id,
        },
        include: {
          theme: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              thumbnailUrl: true,
              previewUrl: true,
              isPremium: true,
              price: true,
              settingsSchema: true,
              features: true,
            },
          },
        },
      });

      if (!store) {
        throw new NotFoundError('Store');
      }

      return reply.send({
        success: true,
        data: {
          theme: store.theme
            ? {
                ...store.theme,
                price: store.theme.price ? Number(store.theme.price) : null,
              }
            : null,
          themeSettings: store.themeSettings,
        },
      });
    });

    // Update store's theme settings
    protectedRoutes.patch('/stores/:storeId/settings', async (request, reply) => {
      const { storeId } = request.params as { storeId: string };
      const body = updateThemeSettingsSchema.parse(request.body);

      const store = await prisma.store.findFirst({
        where: {
          id: storeId,
          organizationId: request.currentOrganization!.id,
        },
        select: { themeSettings: true },
      });

      if (!store) {
        throw new NotFoundError('Store');
      }

      // Merge existing settings with new settings
      const currentSettings = (store.themeSettings as Record<string, unknown>) || {};
      const updatedSettings = {
        ...currentSettings,
        ...(body.colors && { colors: { ...(currentSettings.colors as object), ...body.colors } }),
        ...(body.typography && { typography: { ...(currentSettings.typography as object), ...body.typography } }),
        ...(body.layout && { layout: { ...(currentSettings.layout as object), ...body.layout } }),
        ...(body.components && { components: { ...(currentSettings.components as object), ...body.components } }),
        ...(body.effects && { effects: { ...(currentSettings.effects as object), ...body.effects } }),
        ...(body.customCss !== undefined && { customCss: body.customCss }),
      };

      const updatedStore = await prisma.store.update({
        where: { id: storeId },
        data: { themeSettings: updatedSettings },
        include: {
          theme: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return reply.send({
        success: true,
        data: {
          theme: updatedStore.theme,
          themeSettings: updatedStore.themeSettings,
        },
      });
    });

    // Reset store's theme settings to default
    protectedRoutes.post('/stores/:storeId/reset', async (request, reply) => {
      const { storeId } = request.params as { storeId: string };

      const store = await prisma.store.findFirst({
        where: {
          id: storeId,
          organizationId: request.currentOrganization!.id,
        },
        include: {
          theme: {
            select: {
              settingsSchema: true,
            },
          },
        },
      });

      if (!store) {
        throw new NotFoundError('Store');
      }

      const defaultSettings = store.theme?.settingsSchema || {};

      const updatedStore = await prisma.store.update({
        where: { id: storeId },
        data: { themeSettings: defaultSettings },
        include: {
          theme: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return reply.send({
        success: true,
        data: {
          theme: updatedStore.theme,
          themeSettings: updatedStore.themeSettings,
        },
      });
    });
  });
}
