import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';

export async function storefrontStoreRoutes(app: FastifyInstance) {
  // Get store by slug or subdomain
  // This endpoint supports both slug and subdomain lookup for flexibility
  app.get(
    '/stores/:identifier',
    async (
      request: FastifyRequest<{
        Params: { identifier: string };
      }>,
      reply
    ) => {
      const { identifier } = request.params;

      // Try to find by subdomain first, then by slug
      const store = await prisma.store.findFirst({
        where: {
          OR: [
            { subdomain: identifier },
            { slug: identifier },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          subdomain: true,
          description: true,
          logoUrl: true,
          faviconUrl: true,
          settings: true,
          themeSettings: true,
          customCss: true,
          theme: {
            select: {
              id: true,
              name: true,
              slug: true,
              settingsSchema: true,
            },
          },
        },
      });

      if (!store) {
        return reply.status(404).send({
          success: false,
          error: { code: 'STORE_NOT_FOUND', message: 'Store not found' },
        });
      }

      const settings = (store.settings as Record<string, unknown>) || {};
      const themeDefaults = (store.theme?.settingsSchema as Record<string, unknown>) || {};
      const themeSettings = (store.themeSettings as Record<string, unknown>) || {};

      // Merge theme defaults with store's custom settings
      const mergedThemeSettings = {
        ...themeDefaults,
        ...themeSettings,
      };

      return {
        success: true,
        data: {
          id: store.id,
          name: store.name,
          slug: store.slug,
          subdomain: store.subdomain,
          description: store.description,
          logo: store.logoUrl,
          favicon: store.faviconUrl,
          currency: (settings.currency as string) || 'USD',
          theme: {
            id: store.theme?.id || null,
            name: store.theme?.name || 'Minimal',
            slug: store.theme?.slug || 'minimal-store',
          },
          themeSettings: mergedThemeSettings,
          customCss: store.customCss || null,
        },
      };
    }
  );

  // Get store info by ID
  app.get(
    '/:storeId/info',
    async (
      request: FastifyRequest<{
        Params: { storeId: string };
      }>,
      reply
    ) => {
      const { storeId } = request.params;

      const store = await prisma.store.findUnique({
        where: { id: storeId },
        select: {
          id: true,
          name: true,
          slug: true,
          subdomain: true,
          description: true,
          logoUrl: true,
          settings: true,
        },
      });

      if (!store) {
        return reply.status(404).send({
          success: false,
          error: { code: 'STORE_NOT_FOUND', message: 'Store not found' },
        });
      }

      const settings = (store.settings as any) || {};

      return {
        success: true,
        data: {
          id: store.id,
          name: store.name,
          slug: store.slug,
          subdomain: store.subdomain,
          description: store.description,
          logo: store.logoUrl,
          currency: settings.currency || 'USD',
          theme: settings.theme || {},
        },
      };
    }
  );
}
