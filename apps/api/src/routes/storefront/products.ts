import { FastifyInstance, FastifyRequest } from 'fastify';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';

const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(24),
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'price-asc', 'price-desc', 'name-asc', 'name-desc', 'popular']).default('newest'),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

export async function storefrontProductRoutes(app: FastifyInstance) {
  // List products (public)
  app.get(
    '/',
    async (
      request: FastifyRequest<{
        Params: { storeId: string };
        Querystring: z.infer<typeof listQuerySchema>;
      }>
    ) => {
      const { storeId } = request.params;
      const query = listQuerySchema.parse(request.query);
      const { page, limit, category, search, sort, minPrice, maxPrice } = query;

      // Verify store exists
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        return { success: false, error: { code: 'STORE_NOT_FOUND', message: 'Store not found' } };
      }

      // Build where clause
      const where: any = {
        storeId,
        status: 'active',
      };

      if (category) {
        where.categories = {
          some: {
            slug: category,
          },
        };
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
      }

      // Build order by
      let orderBy: any = { createdAt: 'desc' };
      switch (sort) {
        case 'price-asc':
          orderBy = { price: 'asc' };
          break;
        case 'price-desc':
          orderBy = { price: 'desc' };
          break;
        case 'name-asc':
          orderBy = { name: 'asc' };
          break;
        case 'name-desc':
          orderBy = { name: 'desc' };
          break;
        case 'popular':
          // In production, this would use order count or view count
          orderBy = { createdAt: 'desc' };
          break;
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            price: true,
            compareAtPrice: true,
            images: true,
            status: true,
            quantity: true,
            sku: true,
            categories: {
              select: {
                id: true,
                name: true,
              },
            },
            variants: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                quantity: true,
                options: true,
              },
            },
          },
        }),
        prisma.product.count({ where }),
      ]);

      return {
        success: true,
        data: products,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
  );

  // Get product by slug (public)
  app.get(
    '/:slug',
    async (
      request: FastifyRequest<{
        Params: { storeId: string; slug: string };
      }>
    ) => {
      const { storeId, slug } = request.params;

      const product = await prisma.product.findFirst({
        where: {
          storeId,
          slug,
          status: 'active',
        },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variants: {
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              quantity: true,
              options: true,
            },
          },
        },
      });

      if (!product) {
        return {
          success: false,
          error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' },
        };
      }

      return { success: true, data: product };
    }
  );

  // Get product by ID (public)
  app.get(
    '/id/:productId',
    async (
      request: FastifyRequest<{
        Params: { storeId: string; productId: string };
      }>
    ) => {
      const { storeId, productId } = request.params;

      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          storeId,
          status: 'active',
        },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variants: {
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              quantity: true,
              options: true,
            },
          },
        },
      });

      if (!product) {
        return {
          success: false,
          error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' },
        };
      }

      return { success: true, data: product };
    }
  );
}
