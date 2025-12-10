import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';

export async function storefrontStoreRoutes(app: FastifyInstance) {
  // Get store by slug
  app.get(
    '/stores/:slug',
    async (
      request: FastifyRequest<{
        Params: { slug: string };
      }>,
      reply
    ) => {
      const { slug } = request.params;

      const store = await prisma.store.findFirst({
        where: { slug },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          logo: true,
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
          description: store.description,
          logo: store.logo,
          currency: settings.currency || 'USD',
          theme: settings.theme || {},
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
          description: true,
          logo: true,
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
          description: store.description,
          logo: store.logo,
          currency: settings.currency || 'USD',
          theme: settings.theme || {},
        },
      };
    }
  );
}
