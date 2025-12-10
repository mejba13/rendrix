import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';

export async function storefrontCategoryRoutes(app: FastifyInstance) {
  // List categories (public)
  app.get(
    '/',
    async (
      request: FastifyRequest<{
        Params: { storeId: string };
      }>
    ) => {
      const { storeId } = request.params;

      // Verify store exists
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        return { success: false, error: { code: 'STORE_NOT_FOUND', message: 'Store not found' } };
      }

      const categories = await prisma.category.findMany({
        where: { storeId },
        orderBy: { position: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          _count: {
            select: {
              products: {
                where: { status: 'active' },
              },
            },
          },
        },
      });

      return {
        success: true,
        data: categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          productCount: cat._count.products,
        })),
      };
    }
  );
}
