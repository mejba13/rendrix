import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma, generateUniqueSlug, paginate, createPaginationMeta } from '@rendrix/database';
import {
  authenticate,
  requireOrganization,
  requireStore,
  requirePermission,
} from '../lib/auth';
import { NotFoundError, ConflictError } from '../lib/error-handler';

const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().optional(),
  parentId: z.string().uuid().nullable().optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().default(0),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
});

const updateCategorySchema = createCategorySchema.partial();

const listCategoriesSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(50),
  parentId: z.string().uuid().nullable().optional(),
  search: z.string().optional(),
  includeChildren: z.coerce.boolean().default(false),
  flat: z.coerce.boolean().default(false),
});

export async function categoryRoutes(app: FastifyInstance) {
  // All routes require auth and context
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireOrganization);
  app.addHook('preHandler', requireStore);

  // List categories
  app.get('/', async (request, reply) => {
    const query = listCategoriesSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });
    const storeId = request.currentStore!.id;

    // Build where clause
    const where: Record<string, unknown> = { storeId };

    if (query.parentId !== undefined) {
      where.parentId = query.parentId;
    } else if (!query.flat) {
      // Default: only top-level categories
      where.parentId = null;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        include: query.includeChildren
          ? {
              children: {
                orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
                include: {
                  _count: { select: { products: true } },
                },
              },
              _count: { select: { products: true } },
            }
          : {
              _count: { select: { products: true } },
            },
      }),
      prisma.category.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: categories.map((cat) => ({
        ...cat,
        productsCount: cat._count.products,
        _count: undefined,
        children: (cat as any).children?.map((child: any) => ({
          ...child,
          productsCount: child._count.products,
          _count: undefined,
        })),
      })),
      meta: createPaginationMeta(total, page, limit),
    });
  });

  // Create category
  app.post(
    '/',
    { preHandler: [requirePermission('products:create')] },
    async (request, reply) => {
      const body = createCategorySchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // If parentId is provided, verify it exists and belongs to the store
      if (body.parentId) {
        const parent = await prisma.category.findFirst({
          where: { id: body.parentId, storeId },
        });
        if (!parent) {
          throw new NotFoundError('Parent category');
        }
      }

      // Generate unique slug
      const slug =
        body.slug ||
        (await generateUniqueSlug(body.name, async (s) => {
          const exists = await prisma.category.findUnique({
            where: { storeId_slug: { storeId, slug: s } },
          });
          return !!exists;
        }));

      const category = await prisma.category.create({
        data: {
          storeId,
          name: body.name,
          slug,
          description: body.description,
          parentId: body.parentId,
          imageUrl: body.imageUrl,
          sortOrder: body.sortOrder,
          seoTitle: body.seoTitle,
          seoDescription: body.seoDescription,
        },
        include: {
          parent: { select: { id: true, name: true } },
          _count: { select: { products: true, children: true } },
        },
      });

      return reply.status(201).send({
        success: true,
        data: {
          ...category,
          productsCount: category._count.products,
          childrenCount: category._count.children,
          _count: undefined,
        },
      });
    }
  );

  // Get category by ID
  app.get('/:categoryId', async (request, reply) => {
    const { categoryId } = request.params as { categoryId: string };

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        storeId: request.currentStore!.id,
      },
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: {
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
          select: { id: true, name: true, slug: true, imageUrl: true },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new NotFoundError('Category');
    }

    return reply.send({
      success: true,
      data: {
        ...category,
        productsCount: category._count.products,
        _count: undefined,
      },
    });
  });

  // Update category
  app.patch(
    '/:categoryId',
    { preHandler: [requirePermission('products:update')] },
    async (request, reply) => {
      const { categoryId } = request.params as { categoryId: string };
      const body = updateCategorySchema.parse(request.body);
      const storeId = request.currentStore!.id;

      const existing = await prisma.category.findFirst({
        where: { id: categoryId, storeId },
      });

      if (!existing) {
        throw new NotFoundError('Category');
      }

      // Check slug uniqueness if changing
      if (body.slug && body.slug !== existing.slug) {
        const slugExists = await prisma.category.findFirst({
          where: { storeId, slug: body.slug, id: { not: categoryId } },
        });
        if (slugExists) {
          throw new ConflictError('Category with this slug already exists');
        }
      }

      // Prevent circular parent reference
      if (body.parentId) {
        if (body.parentId === categoryId) {
          throw new ConflictError('Category cannot be its own parent');
        }
        // Check if new parent is a descendant of this category
        const descendants = await getDescendantIds(categoryId, storeId);
        if (descendants.includes(body.parentId)) {
          throw new ConflictError('Cannot set a descendant as parent');
        }
      }

      const category = await prisma.category.update({
        where: { id: categoryId },
        data: body,
        include: {
          parent: { select: { id: true, name: true } },
          _count: { select: { products: true, children: true } },
        },
      });

      return reply.send({
        success: true,
        data: {
          ...category,
          productsCount: category._count.products,
          childrenCount: category._count.children,
          _count: undefined,
        },
      });
    }
  );

  // Delete category
  app.delete(
    '/:categoryId',
    { preHandler: [requirePermission('products:delete')] },
    async (request, reply) => {
      const { categoryId } = request.params as { categoryId: string };

      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          storeId: request.currentStore!.id,
        },
        include: {
          _count: { select: { children: true, products: true } },
        },
      });

      if (!category) {
        throw new NotFoundError('Category');
      }

      // Check if category has children
      if (category._count.children > 0) {
        throw new ConflictError(
          'Cannot delete category with subcategories. Delete subcategories first.'
        );
      }

      // Delete category (product associations will be removed by cascade)
      await prisma.category.delete({ where: { id: categoryId } });

      return reply.send({
        success: true,
        data: { message: 'Category deleted successfully' },
      });
    }
  );

  // Reorder categories
  app.post(
    '/reorder',
    { preHandler: [requirePermission('products:update')] },
    async (request, reply) => {
      const reorderSchema = z.object({
        categories: z.array(
          z.object({
            id: z.string().uuid(),
            sortOrder: z.number().int(),
            parentId: z.string().uuid().nullable().optional(),
          })
        ),
      });

      const body = reorderSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Verify all categories belong to the store
      const categoryIds = body.categories.map((c) => c.id);
      const existing = await prisma.category.findMany({
        where: { id: { in: categoryIds }, storeId },
        select: { id: true },
      });

      const existingIds = new Set(existing.map((c) => c.id));
      const invalidIds = categoryIds.filter((id) => !existingIds.has(id));

      if (invalidIds.length > 0) {
        throw new NotFoundError('Category');
      }

      // Update all categories
      await prisma.$transaction(
        body.categories.map((cat) =>
          prisma.category.update({
            where: { id: cat.id },
            data: {
              sortOrder: cat.sortOrder,
              ...(cat.parentId !== undefined && { parentId: cat.parentId }),
            },
          })
        )
      );

      return reply.send({
        success: true,
        data: { message: 'Categories reordered successfully' },
      });
    }
  );
}

// Helper to get all descendant IDs of a category
async function getDescendantIds(
  categoryId: string,
  storeId: string
): Promise<string[]> {
  const descendants: string[] = [];
  const queue = [categoryId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const children = await prisma.category.findMany({
      where: { parentId: currentId, storeId },
      select: { id: true },
    });

    for (const child of children) {
      descendants.push(child.id);
      queue.push(child.id);
    }
  }

  return descendants;
}
