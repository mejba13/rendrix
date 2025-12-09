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
import { NotFoundError, ConflictError, ForbiddenError } from '../lib/error-handler';

const createProductSchema = z.object({
  sku: z.string().max(100).optional(),
  name: z.string().min(1).max(255),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  type: z.enum(['simple', 'variable', 'grouped', 'digital', 'subscription']).default('simple'),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  visibility: z.enum(['visible', 'hidden', 'featured']).default('visible'),
  price: z.number().nonnegative().optional(),
  compareAtPrice: z.number().nonnegative().optional(),
  costPrice: z.number().nonnegative().optional(),
  taxable: z.boolean().default(true),
  taxClass: z.string().optional(),
  trackInventory: z.boolean().default(true),
  quantity: z.number().int().nonnegative().default(0),
  allowBackorders: z.boolean().default(false),
  weight: z.number().nonnegative().optional(),
  dimensions: z.object({
    length: z.number().nonnegative(),
    width: z.number().nonnegative(),
    height: z.number().nonnegative(),
  }).optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  images: z.array(z.object({
    url: z.string().url(),
    altText: z.string().optional(),
  })).optional(),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
});

const updateProductSchema = createProductSchema.partial();

const listProductsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  visibility: z.enum(['visible', 'hidden', 'featured']).optional(),
  type: z.enum(['simple', 'variable', 'grouped', 'digital', 'subscription']).optional(),
  categoryId: z.string().uuid().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  inStock: z.coerce.boolean().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export async function productRoutes(app: FastifyInstance) {
  // All routes require auth and context
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireOrganization);
  app.addHook('preHandler', requireStore);

  // List products
  app.get('/', async (request, reply) => {
    const query = listProductsSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });
    const storeId = request.currentStore!.id;

    const where = {
      storeId,
      ...(query.status && { status: query.status }),
      ...(query.visibility && { visibility: query.visibility }),
      ...(query.type && { type: query.type }),
      ...(query.categoryId && {
        categories: { some: { categoryId: query.categoryId } },
      }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' as const } },
          { sku: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
      ...(query.minPrice !== undefined && { price: { gte: query.minPrice } }),
      ...(query.maxPrice !== undefined && { price: { lte: query.maxPrice } }),
      ...(query.inStock !== undefined && {
        quantity: query.inStock ? { gt: 0 } : { lte: 0 },
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { [query.sortBy]: query.sortOrder },
        include: {
          images: {
            orderBy: { position: 'asc' },
            take: 1,
          },
          categories: {
            include: { category: { select: { id: true, name: true } } },
          },
          _count: { select: { variants: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: products.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        type: p.type,
        status: p.status,
        visibility: p.visibility,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        quantity: p.quantity,
        trackInventory: p.trackInventory,
        image: p.images[0] || null,
        categories: p.categories.map((c) => c.category),
        variantsCount: p._count.variants,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      meta: createPaginationMeta(total, page, limit),
    });
  });

  // Create product
  app.post(
    '/',
    { preHandler: [requirePermission('products:create')] },
    async (request, reply) => {
      const body = createProductSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Check plan limits
      const subscription = await prisma.subscription.findFirst({
        where: { organizationId: request.currentOrganization!.id },
        include: { plan: true },
      });

      if (subscription) {
        const limits = subscription.plan.limits as { maxProducts?: number | null };
        if (limits.maxProducts !== null) {
          const currentProducts = await prisma.product.count({
            where: { storeId },
          });

          if (currentProducts >= limits.maxProducts) {
            throw new ForbiddenError(
              `Your plan allows a maximum of ${limits.maxProducts} products. Upgrade to add more.`
            );
          }
        }
      }

      // Generate unique slug
      const slug =
        body.slug ||
        (await generateUniqueSlug(body.name, async (s) => {
          const exists = await prisma.product.findUnique({
            where: { storeId_slug: { storeId, slug: s } },
          });
          return !!exists;
        }));

      // Create product with images and categories
      const product = await prisma.product.create({
        data: {
          storeId,
          sku: body.sku,
          name: body.name,
          slug,
          description: body.description,
          shortDescription: body.shortDescription,
          type: body.type,
          status: body.status,
          visibility: body.visibility,
          price: body.price,
          compareAtPrice: body.compareAtPrice,
          costPrice: body.costPrice,
          taxable: body.taxable,
          taxClass: body.taxClass,
          trackInventory: body.trackInventory,
          quantity: body.quantity,
          allowBackorders: body.allowBackorders,
          weight: body.weight,
          dimensions: body.dimensions,
          seoTitle: body.seoTitle,
          seoDescription: body.seoDescription,
          publishedAt: body.status === 'active' ? new Date() : null,
          images: body.images
            ? {
                create: body.images.map((img, index) => ({
                  url: img.url,
                  altText: img.altText,
                  position: index,
                })),
              }
            : undefined,
          categories: body.categoryIds
            ? {
                create: body.categoryIds.map((categoryId) => ({
                  categoryId,
                })),
              }
            : undefined,
        },
        include: {
          images: { orderBy: { position: 'asc' } },
          categories: {
            include: { category: { select: { id: true, name: true } } },
          },
        },
      });

      return reply.status(201).send({
        success: true,
        data: {
          ...product,
          categories: product.categories.map((c) => c.category),
        },
      });
    }
  );

  // Get product by ID
  app.get('/:productId', async (request, reply) => {
    const { productId } = request.params as { productId: string };

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: request.currentStore!.id,
      },
      include: {
        images: { orderBy: { position: 'asc' } },
        variants: { orderBy: { sortOrder: 'asc' } },
        categories: {
          include: { category: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundError('Product');
    }

    return reply.send({
      success: true,
      data: {
        ...product,
        categories: product.categories.map((c) => c.category),
      },
    });
  });

  // Update product
  app.patch(
    '/:productId',
    { preHandler: [requirePermission('products:update')] },
    async (request, reply) => {
      const { productId } = request.params as { productId: string };
      const body = updateProductSchema.parse(request.body);

      const existing = await prisma.product.findFirst({
        where: {
          id: productId,
          storeId: request.currentStore!.id,
        },
      });

      if (!existing) {
        throw new NotFoundError('Product');
      }

      // Handle slug update
      if (body.slug && body.slug !== existing.slug) {
        const slugExists = await prisma.product.findFirst({
          where: {
            storeId: request.currentStore!.id,
            slug: body.slug,
            id: { not: productId },
          },
        });

        if (slugExists) {
          throw new ConflictError('Product with this slug already exists');
        }
      }

      // Update product
      const { categoryIds, images, ...updateData } = body;

      const product = await prisma.$transaction(async (tx) => {
        // Update categories if provided
        if (categoryIds !== undefined) {
          await tx.productCategory.deleteMany({
            where: { productId },
          });

          if (categoryIds.length > 0) {
            await tx.productCategory.createMany({
              data: categoryIds.map((categoryId) => ({
                productId,
                categoryId,
              })),
            });
          }
        }

        // Update images if provided
        if (images !== undefined) {
          await tx.productImage.deleteMany({
            where: { productId },
          });

          if (images.length > 0) {
            await tx.productImage.createMany({
              data: images.map((img, index) => ({
                productId,
                url: img.url,
                altText: img.altText,
                position: index,
              })),
            });
          }
        }

        // Update product
        return tx.product.update({
          where: { id: productId },
          data: {
            ...updateData,
            publishedAt:
              updateData.status === 'active' && !existing.publishedAt
                ? new Date()
                : existing.publishedAt,
          },
          include: {
            images: { orderBy: { position: 'asc' } },
            categories: {
              include: { category: { select: { id: true, name: true } } },
            },
          },
        });
      });

      return reply.send({
        success: true,
        data: {
          ...product,
          categories: product.categories.map((c) => c.category),
        },
      });
    }
  );

  // Delete product
  app.delete(
    '/:productId',
    { preHandler: [requirePermission('products:delete')] },
    async (request, reply) => {
      const { productId } = request.params as { productId: string };

      const product = await prisma.product.findFirst({
        where: {
          id: productId,
          storeId: request.currentStore!.id,
        },
      });

      if (!product) {
        throw new NotFoundError('Product');
      }

      await prisma.product.delete({ where: { id: productId } });

      return reply.send({
        success: true,
        data: { message: 'Product deleted successfully' },
      });
    }
  );

  // Bulk update products
  app.post(
    '/bulk',
    { preHandler: [requirePermission('products:update')] },
    async (request, reply) => {
      const bulkSchema = z.object({
        action: z.enum(['publish', 'unpublish', 'archive', 'delete']),
        productIds: z.array(z.string().uuid()).min(1).max(100),
      });

      const body = bulkSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Verify all products belong to the store
      const products = await prisma.product.findMany({
        where: {
          id: { in: body.productIds },
          storeId,
        },
        select: { id: true },
      });

      const validIds = products.map((p) => p.id);

      let result;
      switch (body.action) {
        case 'publish':
          result = await prisma.product.updateMany({
            where: { id: { in: validIds } },
            data: { status: 'active', publishedAt: new Date() },
          });
          break;
        case 'unpublish':
          result = await prisma.product.updateMany({
            where: { id: { in: validIds } },
            data: { status: 'draft' },
          });
          break;
        case 'archive':
          result = await prisma.product.updateMany({
            where: { id: { in: validIds } },
            data: { status: 'archived' },
          });
          break;
        case 'delete':
          result = await prisma.product.deleteMany({
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
