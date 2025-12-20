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

const createBlogPostSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  featuredImage: z.string().url().optional().nullable(),
  authorName: z.string().max(255).optional(),
  status: z.enum(['draft', 'published', 'scheduled']).default('draft'),
  visibility: z.enum(['public', 'private', 'password']).default('public'),
  password: z.string().max(255).optional(),
  allowComments: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
  tags: z.array(z.string()).default([]),
  categoryIds: z.array(z.string().uuid()).optional(),
  publishedAt: z.string().datetime().optional(),
  scheduledAt: z.string().datetime().optional(),
});

const updateBlogPostSchema = createBlogPostSchema.partial();

const listBlogPostsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20),
  status: z.enum(['draft', 'published', 'scheduled']).optional(),
  categoryId: z.string().uuid().optional(),
  search: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  tag: z.string().optional(),
  sortBy: z.enum(['title', 'createdAt', 'updatedAt', 'publishedAt', 'viewCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const createBlogCategorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

const updateBlogCategorySchema = createBlogCategorySchema.partial();

export async function blogRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireOrganization);
  app.addHook('preHandler', requireStore);

  // ==================== BLOG POSTS ====================

  // List blog posts
  app.get('/posts', async (request, reply) => {
    const query = listBlogPostsSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });
    const storeId = request.currentStore!.id;

    const where = {
      storeId,
      ...(query.status && { status: query.status }),
      ...(query.categoryId && {
        categories: { some: { id: query.categoryId } },
      }),
      ...(query.isFeatured !== undefined && { isFeatured: query.isFeatured }),
      ...(query.tag && {
        tags: { array_contains: [query.tag] },
      }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' as const } },
          { excerpt: { contains: query.search, mode: 'insensitive' as const } },
          { content: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take,
        orderBy: { [query.sortBy]: query.sortOrder },
        include: {
          categories: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: posts,
      meta: createPaginationMeta(total, page, limit),
    });
  });

  // Create blog post
  app.post(
    '/posts',
    { preHandler: [requirePermission('content:create')] },
    async (request, reply) => {
      const body = createBlogPostSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      const slug =
        body.slug ||
        (await generateUniqueSlug(body.title, async (s) => {
          const exists = await prisma.blogPost.findUnique({
            where: { storeId_slug: { storeId, slug: s } },
          });
          return !!exists;
        }));

      const { categoryIds, publishedAt, scheduledAt, ...postData } = body;

      const post = await prisma.blogPost.create({
        data: {
          storeId,
          ...postData,
          slug,
          publishedAt: body.status === 'published' ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
          scheduledAt: body.status === 'scheduled' && scheduledAt ? new Date(scheduledAt) : null,
          categories: categoryIds
            ? { connect: categoryIds.map((id) => ({ id })) }
            : undefined,
        },
        include: {
          categories: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      return reply.status(201).send({
        success: true,
        data: post,
      });
    }
  );

  // Get blog post by ID
  app.get('/posts/:postId', async (request, reply) => {
    const { postId } = request.params as { postId: string };

    const post = await prisma.blogPost.findFirst({
      where: {
        id: postId,
        storeId: request.currentStore!.id,
      },
      include: {
        categories: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundError('Blog post');
    }

    return reply.send({
      success: true,
      data: post,
    });
  });

  // Update blog post
  app.patch(
    '/posts/:postId',
    { preHandler: [requirePermission('content:update')] },
    async (request, reply) => {
      const { postId } = request.params as { postId: string };
      const body = updateBlogPostSchema.parse(request.body);

      const existing = await prisma.blogPost.findFirst({
        where: {
          id: postId,
          storeId: request.currentStore!.id,
        },
      });

      if (!existing) {
        throw new NotFoundError('Blog post');
      }

      if (body.slug && body.slug !== existing.slug) {
        const slugExists = await prisma.blogPost.findFirst({
          where: {
            storeId: request.currentStore!.id,
            slug: body.slug,
            id: { not: postId },
          },
        });

        if (slugExists) {
          throw new ConflictError('Blog post with this slug already exists');
        }
      }

      const { categoryIds, publishedAt, scheduledAt, ...updateData } = body;

      const post = await prisma.blogPost.update({
        where: { id: postId },
        data: {
          ...updateData,
          publishedAt:
            updateData.status === 'published' && !existing.publishedAt
              ? publishedAt ? new Date(publishedAt) : new Date()
              : existing.publishedAt,
          scheduledAt:
            updateData.status === 'scheduled' && scheduledAt
              ? new Date(scheduledAt)
              : existing.scheduledAt,
          categories: categoryIds !== undefined
            ? { set: categoryIds.map((id) => ({ id })) }
            : undefined,
        },
        include: {
          categories: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      return reply.send({
        success: true,
        data: post,
      });
    }
  );

  // Delete blog post
  app.delete(
    '/posts/:postId',
    { preHandler: [requirePermission('content:delete')] },
    async (request, reply) => {
      const { postId } = request.params as { postId: string };

      const post = await prisma.blogPost.findFirst({
        where: {
          id: postId,
          storeId: request.currentStore!.id,
        },
      });

      if (!post) {
        throw new NotFoundError('Blog post');
      }

      await prisma.blogPost.delete({ where: { id: postId } });

      return reply.send({
        success: true,
        data: { message: 'Blog post deleted successfully' },
      });
    }
  );

  // Bulk actions for blog posts
  app.post(
    '/posts/bulk',
    { preHandler: [requirePermission('content:update')] },
    async (request, reply) => {
      const bulkSchema = z.object({
        action: z.enum(['publish', 'unpublish', 'delete', 'feature', 'unfeature']),
        postIds: z.array(z.string().uuid()).min(1).max(100),
      });

      const body = bulkSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      const posts = await prisma.blogPost.findMany({
        where: {
          id: { in: body.postIds },
          storeId,
        },
        select: { id: true },
      });

      const validIds = posts.map((p) => p.id);

      let result;
      switch (body.action) {
        case 'publish':
          result = await prisma.blogPost.updateMany({
            where: { id: { in: validIds } },
            data: { status: 'published', publishedAt: new Date() },
          });
          break;
        case 'unpublish':
          result = await prisma.blogPost.updateMany({
            where: { id: { in: validIds } },
            data: { status: 'draft' },
          });
          break;
        case 'feature':
          result = await prisma.blogPost.updateMany({
            where: { id: { in: validIds } },
            data: { isFeatured: true },
          });
          break;
        case 'unfeature':
          result = await prisma.blogPost.updateMany({
            where: { id: { in: validIds } },
            data: { isFeatured: false },
          });
          break;
        case 'delete':
          result = await prisma.blogPost.deleteMany({
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

  // ==================== BLOG CATEGORIES ====================

  // List blog categories
  app.get('/categories', async (request, reply) => {
    const storeId = request.currentStore!.id;

    const categories = await prisma.blogCategory.findMany({
      where: { storeId },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { posts: true } },
      },
    });

    return reply.send({
      success: true,
      data: categories.map((c) => ({
        ...c,
        postsCount: c._count.posts,
      })),
    });
  });

  // Create blog category
  app.post(
    '/categories',
    { preHandler: [requirePermission('content:create')] },
    async (request, reply) => {
      const body = createBlogCategorySchema.parse(request.body);
      const storeId = request.currentStore!.id;

      const slug =
        body.slug ||
        (await generateUniqueSlug(body.name, async (s) => {
          const exists = await prisma.blogCategory.findUnique({
            where: { storeId_slug: { storeId, slug: s } },
          });
          return !!exists;
        }));

      const category = await prisma.blogCategory.create({
        data: {
          storeId,
          ...body,
          slug,
        },
      });

      return reply.status(201).send({
        success: true,
        data: category,
      });
    }
  );

  // Update blog category
  app.patch(
    '/categories/:categoryId',
    { preHandler: [requirePermission('content:update')] },
    async (request, reply) => {
      const { categoryId } = request.params as { categoryId: string };
      const body = updateBlogCategorySchema.parse(request.body);

      const existing = await prisma.blogCategory.findFirst({
        where: {
          id: categoryId,
          storeId: request.currentStore!.id,
        },
      });

      if (!existing) {
        throw new NotFoundError('Blog category');
      }

      if (body.slug && body.slug !== existing.slug) {
        const slugExists = await prisma.blogCategory.findFirst({
          where: {
            storeId: request.currentStore!.id,
            slug: body.slug,
            id: { not: categoryId },
          },
        });

        if (slugExists) {
          throw new ConflictError('Blog category with this slug already exists');
        }
      }

      const category = await prisma.blogCategory.update({
        where: { id: categoryId },
        data: body,
      });

      return reply.send({
        success: true,
        data: category,
      });
    }
  );

  // Delete blog category
  app.delete(
    '/categories/:categoryId',
    { preHandler: [requirePermission('content:delete')] },
    async (request, reply) => {
      const { categoryId } = request.params as { categoryId: string };

      const category = await prisma.blogCategory.findFirst({
        where: {
          id: categoryId,
          storeId: request.currentStore!.id,
        },
      });

      if (!category) {
        throw new NotFoundError('Blog category');
      }

      await prisma.blogCategory.delete({ where: { id: categoryId } });

      return reply.send({
        success: true,
        data: { message: 'Blog category deleted successfully' },
      });
    }
  );
}
