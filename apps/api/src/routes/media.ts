import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma, paginate, createPaginationMeta } from '@rendrix/database';
import {
  authenticate,
  requireOrganization,
  requireStore,
  requirePermission,
} from '../lib/auth';
import { NotFoundError, ValidationError, ForbiddenError } from '../lib/error-handler';
import {
  uploadFile,
  deleteFile,
  isAllowedFileType,
  getMaxFileSize,
  extractKeyFromUrl,
} from '../lib/storage';

const listMediaSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(50),
  folder: z.string().optional(),
  search: z.string().optional(),
  mimeType: z.string().optional(),
  sortBy: z.enum(['filename', 'size', 'mimeType', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const updateMediaSchema = z.object({
  altText: z.string().max(500).optional(),
  folder: z.string().max(255).nullable().optional(),
});

export async function mediaRoutes(app: FastifyInstance) {
  // All routes require auth and context
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireOrganization);
  app.addHook('preHandler', requireStore);

  // List media files
  app.get('/', async (request, reply) => {
    const query = listMediaSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });
    const storeId = request.currentStore!.id;

    const where: Record<string, unknown> = { storeId };

    if (query.folder !== undefined) {
      where.folder = query.folder || null;
    }

    if (query.search) {
      where.OR = [
        { filename: { contains: query.search, mode: 'insensitive' } },
        { altText: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.mimeType) {
      if (query.mimeType.endsWith('/*')) {
        // Match type prefix (e.g., "image/*")
        const prefix = query.mimeType.replace('/*', '/');
        where.mimeType = { startsWith: prefix };
      } else {
        where.mimeType = query.mimeType;
      }
    }

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take,
        orderBy: { [query.sortBy]: query.sortOrder },
      }),
      prisma.media.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: media,
      meta: createPaginationMeta(total, page, limit),
    });
  });

  // Get folders list
  app.get('/folders', async (request, reply) => {
    const storeId = request.currentStore!.id;

    const result = await prisma.media.groupBy({
      by: ['folder'],
      where: {
        storeId,
        folder: { not: null },
      },
      _count: { _all: true },
    });

    const folders = result
      .filter((r) => r.folder)
      .map((r) => ({
        name: r.folder,
        count: r._count._all,
      }))
      .sort((a, b) => a.name!.localeCompare(b.name!));

    return reply.send({
      success: true,
      data: folders,
    });
  });

  // Upload media file
  app.post(
    '/upload',
    { preHandler: [requirePermission('media:create')] },
    async (request, reply) => {
      const storeId = request.currentStore!.id;

      // Check plan limits
      const subscription = await prisma.subscription.findFirst({
        where: { organizationId: request.currentOrganization!.id },
        include: { plan: true },
      });

      if (subscription) {
        const limits = subscription.plan.limits as { maxStorage?: number | null };
        if (limits.maxStorage !== null) {
          const currentStorage = await prisma.media.aggregate({
            where: { storeId },
            _sum: { size: true },
          });

          const usedBytes = currentStorage._sum.size || 0;
          const maxBytes = (limits.maxStorage || 0) * 1024 * 1024; // Convert MB to bytes

          if (usedBytes >= maxBytes) {
            throw new ForbiddenError(
              `Storage limit of ${limits.maxStorage}MB reached. Upgrade to add more storage.`
            );
          }
        }
      }

      // Handle multipart file upload
      const data = await request.file();

      if (!data) {
        throw new ValidationError({ file: ['No file uploaded'] });
      }

      const { filename, mimetype: mimeType, file: fileStream } = data;

      // Validate file type
      if (!isAllowedFileType(mimeType)) {
        throw new ValidationError({ file: ['File type not allowed'] });
      }

      // Read file buffer
      const chunks: Buffer[] = [];
      for await (const chunk of fileStream) {
        chunks.push(chunk);
      }
      const fileBuffer = Buffer.concat(chunks);

      // Validate file size
      const maxSize = getMaxFileSize(mimeType);
      if (fileBuffer.length > maxSize) {
        const maxMB = Math.round(maxSize / 1024 / 1024);
        throw new ValidationError({
          file: [`File size exceeds maximum of ${maxMB}MB`],
        });
      }

      // Get folder and altText from fields
      const fields = data.fields as Record<string, { value?: string }>;
      const folder = fields.folder?.value || null;
      const altText = fields.altText?.value || null;

      // Upload to storage
      const uploadResult = await uploadFile({
        storeId,
        file: fileBuffer,
        filename,
        mimeType,
        folder: folder || undefined,
      });

      // Save to database
      const media = await prisma.media.create({
        data: {
          storeId,
          filename,
          mimeType,
          size: uploadResult.size,
          url: uploadResult.url,
          altText,
          folder,
          metadata: {
            key: uploadResult.key,
          },
        },
      });

      return reply.status(201).send({
        success: true,
        data: media,
      });
    }
  );

  // Get media by ID
  app.get('/:mediaId', async (request, reply) => {
    const { mediaId } = request.params as { mediaId: string };

    const media = await prisma.media.findFirst({
      where: {
        id: mediaId,
        storeId: request.currentStore!.id,
      },
    });

    if (!media) {
      throw new NotFoundError('Media');
    }

    return reply.send({
      success: true,
      data: media,
    });
  });

  // Update media
  app.patch(
    '/:mediaId',
    { preHandler: [requirePermission('media:update')] },
    async (request, reply) => {
      const { mediaId } = request.params as { mediaId: string };
      const body = updateMediaSchema.parse(request.body);

      const existing = await prisma.media.findFirst({
        where: {
          id: mediaId,
          storeId: request.currentStore!.id,
        },
      });

      if (!existing) {
        throw new NotFoundError('Media');
      }

      const media = await prisma.media.update({
        where: { id: mediaId },
        data: body,
      });

      return reply.send({
        success: true,
        data: media,
      });
    }
  );

  // Delete media
  app.delete(
    '/:mediaId',
    { preHandler: [requirePermission('media:delete')] },
    async (request, reply) => {
      const { mediaId } = request.params as { mediaId: string };

      const media = await prisma.media.findFirst({
        where: {
          id: mediaId,
          storeId: request.currentStore!.id,
        },
      });

      if (!media) {
        throw new NotFoundError('Media');
      }

      // Delete from storage
      const metadata = media.metadata as { key?: string };
      if (metadata.key) {
        await deleteFile(metadata.key);
      } else {
        // Try to extract key from URL
        const key = extractKeyFromUrl(media.url);
        if (key) {
          await deleteFile(key);
        }
      }

      // Delete from database
      await prisma.media.delete({ where: { id: mediaId } });

      return reply.send({
        success: true,
        data: { message: 'Media deleted successfully' },
      });
    }
  );

  // Bulk delete media
  app.post(
    '/bulk-delete',
    { preHandler: [requirePermission('media:delete')] },
    async (request, reply) => {
      const bulkSchema = z.object({
        ids: z.array(z.string().uuid()).min(1).max(100),
      });

      const body = bulkSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      // Get all media items
      const mediaItems = await prisma.media.findMany({
        where: {
          id: { in: body.ids },
          storeId,
        },
      });

      // Delete from storage
      for (const media of mediaItems) {
        const metadata = media.metadata as { key?: string };
        if (metadata.key) {
          await deleteFile(metadata.key);
        } else {
          const key = extractKeyFromUrl(media.url);
          if (key) {
            await deleteFile(key);
          }
        }
      }

      // Delete from database
      const result = await prisma.media.deleteMany({
        where: {
          id: { in: body.ids },
          storeId,
        },
      });

      return reply.send({
        success: true,
        data: {
          deleted: result.count,
        },
      });
    }
  );

  // Move media to folder
  app.post(
    '/move',
    { preHandler: [requirePermission('media:update')] },
    async (request, reply) => {
      const moveSchema = z.object({
        ids: z.array(z.string().uuid()).min(1).max(100),
        folder: z.string().max(255).nullable(),
      });

      const body = moveSchema.parse(request.body);
      const storeId = request.currentStore!.id;

      const result = await prisma.media.updateMany({
        where: {
          id: { in: body.ids },
          storeId,
        },
        data: {
          folder: body.folder,
        },
      });

      return reply.send({
        success: true,
        data: {
          updated: result.count,
        },
      });
    }
  );

  // Get storage usage
  app.get('/usage', async (request, reply) => {
    const storeId = request.currentStore!.id;

    const [totalFiles, totalSize, byType] = await Promise.all([
      prisma.media.count({ where: { storeId } }),
      prisma.media.aggregate({
        where: { storeId },
        _sum: { size: true },
      }),
      prisma.media.groupBy({
        by: ['mimeType'],
        where: { storeId },
        _count: { _all: true },
        _sum: { size: true },
      }),
    ]);

    // Get plan storage limit
    const subscription = await prisma.subscription.findFirst({
      where: { organizationId: request.currentOrganization!.id },
      include: { plan: true },
    });

    const limits = subscription?.plan.limits as { maxStorage?: number | null } | undefined;
    const maxStorageMB = limits?.maxStorage || null;

    return reply.send({
      success: true,
      data: {
        totalFiles,
        totalSize: totalSize._sum.size || 0,
        maxStorage: maxStorageMB ? maxStorageMB * 1024 * 1024 : null,
        byType: byType.map((t) => ({
          mimeType: t.mimeType,
          count: t._count._all,
          size: t._sum.size || 0,
        })),
      },
    });
  });
}
