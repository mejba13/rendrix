import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@rendrix/database';
import { paginate, createPaginationMeta } from '@rendrix/utils';
import { authenticate, requireOrganization } from '../lib/auth';
import { NotFoundError, ForbiddenError, BadRequestError } from '../lib/error-handler';
import { themeValidator, themeExtractor, themeProcessor } from '../lib/theme';

// Validation schemas
const listCustomThemesSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(50).default(10),
  search: z.string().optional(),
});

const updateCustomThemeSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  isActive: z.boolean().optional(),
});

const listVersionsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(50).default(10),
});

const updateCustomCssSchema = z.object({
  customCss: z.string().max(50000),
});

const updateStoreSectionsSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string(),
      sectionSlug: z.string(),
      enabled: z.boolean(),
      settings: z.record(z.unknown()),
      blocks: z
        .array(
          z.object({
            id: z.string(),
            type: z.string(),
            settings: z.record(z.unknown()),
            sortOrder: z.number(),
          })
        )
        .optional(),
      sortOrder: z.number(),
    })
  ),
});

const reorderSectionsSchema = z.object({
  sectionIds: z.array(z.string()),
});

const createBackupSchema = z.object({
  reason: z.enum(['manual', 'auto_upgrade', 'rollback', 'theme_change']).optional(),
});

// Plans that allow custom theme uploads
const CUSTOM_THEME_PLANS = ['pro', 'business', 'enterprise'];

export async function themeManagementRoutes(app: FastifyInstance) {
  // All routes require authentication
  app.addHook('preHandler', authenticate);
  app.addHook('preHandler', requireOrganization);

  // ==================== THEME UPLOAD ====================

  /**
   * Upload a new custom theme
   * POST /api/v1/themes/upload
   */
  app.post('/upload', async (request, reply) => {
    const organization = request.currentOrganization!;
    const user = request.currentUser!;

    // Check plan allows custom themes
    const subscription = await prisma.subscription.findFirst({
      where: { organizationId: organization.id, status: 'active' },
      include: { plan: true },
    });

    if (!subscription || !CUSTOM_THEME_PLANS.includes(subscription.plan.slug)) {
      throw new ForbiddenError('Custom themes require a Pro plan or higher');
    }

    // Get uploaded file
    const data = await request.file();
    if (!data) {
      throw new BadRequestError('No file uploaded');
    }

    // Read file buffer
    const chunks: Buffer[] = [];
    for await (const chunk of data.file) {
      chunks.push(chunk);
    }
    const zipBuffer = Buffer.concat(chunks);

    // Validate file type
    if (!data.filename.endsWith('.zip')) {
      throw new BadRequestError('File must be a ZIP archive');
    }

    // Validate file size (50MB max)
    if (zipBuffer.length > 50 * 1024 * 1024) {
      throw new BadRequestError('File size exceeds 50MB limit');
    }

    // Extract and validate theme
    const extractedTheme = await themeExtractor.extract(zipBuffer);

    try {
      // Validate package
      const validationResult = await themeValidator.validate(extractedTheme.packageInfo);

      if (!validationResult.valid) {
        return reply.status(400).send({
          success: false,
          error: 'Theme validation failed',
          data: {
            errors: validationResult.errors,
            warnings: validationResult.warnings,
          },
        });
      }

      // Process and register theme
      const result = await themeProcessor.processNewTheme({
        organizationId: organization.id,
        userId: user.id,
        manifest: validationResult.manifest!,
        extractedTheme,
        zipBuffer,
      });

      return reply.status(201).send({
        success: true,
        data: {
          themeId: result.theme.id,
          slug: result.theme.slug,
          version: result.version.version,
          assetsUploaded: result.assetsUploaded,
          warnings: validationResult.warnings.length > 0 ? validationResult.warnings : undefined,
        },
      });
    } finally {
      // Clean up extracted files
      await themeExtractor.cleanup(extractedTheme.tempDir);
    }
  });

  // ==================== CUSTOM THEME CRUD ====================

  /**
   * List organization's custom themes
   * GET /api/v1/themes/custom
   */
  app.get('/custom', async (request, reply) => {
    const organization = request.currentOrganization!;
    const query = listCustomThemesSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });

    const where: Record<string, unknown> = {
      organizationId: organization.id,
      type: 'custom',
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [themes, total] = await Promise.all([
      prisma.theme.findMany({
        where,
        skip,
        take,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          version: true,
          author: true,
          previewUrl: true,
          thumbnailUrl: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { stores: true, versions: true },
          },
        },
      }),
      prisma.theme.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: themes.map((theme) => ({
        ...theme,
        storeCount: theme._count.stores,
        versionCount: theme._count.versions,
      })),
      meta: createPaginationMeta(total, page, limit),
    });
  });

  /**
   * Get custom theme details
   * GET /api/v1/themes/custom/:themeId
   */
  app.get('/custom/:themeId', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { themeId } = request.params as { themeId: string };

    const theme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        organizationId: organization.id,
        type: 'custom',
      },
      include: {
        versions: {
          orderBy: { publishedAt: 'desc' },
          take: 5,
        },
        themeSections: {
          orderBy: { sortOrder: 'asc' },
        },
        assets: true,
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
        storeCount: theme._count.stores,
      },
    });
  });

  /**
   * Update custom theme
   * PATCH /api/v1/themes/custom/:themeId
   */
  app.patch('/custom/:themeId', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { themeId } = request.params as { themeId: string };
    const body = updateCustomThemeSchema.parse(request.body);

    const theme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        organizationId: organization.id,
        type: 'custom',
      },
    });

    if (!theme) {
      throw new NotFoundError('Theme');
    }

    const updatedTheme = await prisma.theme.update({
      where: { id: themeId },
      data: body,
    });

    return reply.send({
      success: true,
      data: updatedTheme,
    });
  });

  /**
   * Delete custom theme
   * DELETE /api/v1/themes/custom/:themeId
   */
  app.delete('/custom/:themeId', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { themeId } = request.params as { themeId: string };

    const theme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        organizationId: organization.id,
        type: 'custom',
      },
      include: {
        _count: { select: { stores: true } },
      },
    });

    if (!theme) {
      throw new NotFoundError('Theme');
    }

    // Prevent deletion if theme is in use
    if (theme._count.stores > 0) {
      throw new ForbiddenError(
        `Cannot delete theme that is in use by ${theme._count.stores} store(s)`
      );
    }

    // Delete theme (cascades to versions, sections, assets, packages)
    await prisma.theme.delete({
      where: { id: themeId },
    });

    return reply.status(204).send();
  });

  // ==================== VERSION MANAGEMENT ====================

  /**
   * List theme versions
   * GET /api/v1/themes/:themeId/versions
   */
  app.get('/:themeId/versions', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { themeId } = request.params as { themeId: string };
    const query = listVersionsSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });

    // Verify theme belongs to org (for custom themes) or is a platform theme
    const theme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        OR: [{ organizationId: organization.id }, { type: 'platform' }],
      },
    });

    if (!theme) {
      throw new NotFoundError('Theme');
    }

    const [versions, total] = await Promise.all([
      prisma.themeVersion.findMany({
        where: { themeId },
        skip,
        take,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.themeVersion.count({ where: { themeId } }),
    ]);

    return reply.send({
      success: true,
      data: versions,
      meta: createPaginationMeta(total, page, limit),
    });
  });

  /**
   * Upload new theme version
   * POST /api/v1/themes/:themeId/versions
   */
  app.post('/:themeId/versions', async (request, reply) => {
    const organization = request.currentOrganization!;
    const user = request.currentUser!;
    const { themeId } = request.params as { themeId: string };

    // Verify theme belongs to org
    const theme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        organizationId: organization.id,
        type: 'custom',
      },
    });

    if (!theme) {
      throw new NotFoundError('Theme');
    }

    // Get uploaded file
    const data = await request.file();
    if (!data) {
      throw new BadRequestError('No file uploaded');
    }

    // Read file buffer
    const chunks: Buffer[] = [];
    for await (const chunk of data.file) {
      chunks.push(chunk);
    }
    const zipBuffer = Buffer.concat(chunks);

    // Extract and validate theme
    const extractedTheme = await themeExtractor.extract(zipBuffer);

    try {
      const validationResult = await themeValidator.validate(extractedTheme.packageInfo);

      if (!validationResult.valid) {
        return reply.status(400).send({
          success: false,
          error: 'Theme validation failed',
          data: {
            errors: validationResult.errors,
            warnings: validationResult.warnings,
          },
        });
      }

      // Process new version
      const result = await themeProcessor.processNewVersion(themeId, {
        organizationId: organization.id,
        userId: user.id,
        manifest: validationResult.manifest!,
        extractedTheme,
        zipBuffer,
      });

      return reply.status(201).send({
        success: true,
        data: {
          themeId: result.theme.id,
          version: result.version.version,
          assetsUploaded: result.assetsUploaded,
        },
      });
    } finally {
      await themeExtractor.cleanup(extractedTheme.tempDir);
    }
  });

  /**
   * Activate a specific theme version
   * POST /api/v1/themes/:themeId/versions/:versionId/activate
   */
  app.post('/:themeId/versions/:versionId/activate', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { themeId, versionId } = request.params as { themeId: string; versionId: string };

    // Verify theme belongs to org
    const theme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        organizationId: organization.id,
        type: 'custom',
      },
    });

    if (!theme) {
      throw new NotFoundError('Theme');
    }

    const version = await prisma.themeVersion.findFirst({
      where: { id: versionId, themeId },
    });

    if (!version) {
      throw new NotFoundError('Version');
    }

    // Update version status
    await prisma.$transaction([
      prisma.themeVersion.updateMany({
        where: { themeId, isLatest: true },
        data: { isLatest: false },
      }),
      prisma.themeVersion.update({
        where: { id: versionId },
        data: { isLatest: true },
      }),
      prisma.theme.update({
        where: { id: themeId },
        data: {
          version: version.version,
          settingsSchema: version.settingsSchema as unknown as object,
          sections: version.sections as unknown as object[],
        },
      }),
    ]);

    return reply.send({
      success: true,
      data: { version: version.version },
    });
  });

  // ==================== THEME SECTIONS ====================

  /**
   * Get theme sections
   * GET /api/v1/themes/:themeId/sections
   */
  app.get('/:themeId/sections', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { themeId } = request.params as { themeId: string };

    // Verify access
    const theme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        OR: [{ organizationId: organization.id }, { type: 'platform' }],
      },
    });

    if (!theme) {
      throw new NotFoundError('Theme');
    }

    const sections = await prisma.themeSection.findMany({
      where: { themeId },
      orderBy: { sortOrder: 'asc' },
    });

    return reply.send({
      success: true,
      data: sections,
    });
  });

  // ==================== STORE SECTIONS ====================

  /**
   * Get store's section configuration
   * GET /api/v1/themes/stores/:storeId/sections
   */
  app.get('/stores/:storeId/sections', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { storeId } = request.params as { storeId: string };

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        organizationId: organization.id,
      },
      select: {
        sections: true,
        theme: {
          include: {
            themeSections: {
              orderBy: { sortOrder: 'asc' },
            },
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
        storeSections: store.sections,
        availableSections: store.theme?.themeSections || [],
      },
    });
  });

  /**
   * Update store's section configuration
   * PATCH /api/v1/themes/stores/:storeId/sections
   */
  app.patch('/stores/:storeId/sections', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { storeId } = request.params as { storeId: string };
    const body = updateStoreSectionsSchema.parse(request.body);

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        organizationId: organization.id,
      },
    });

    if (!store) {
      throw new NotFoundError('Store');
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { sections: body.sections as unknown as object[] },
    });

    return reply.send({
      success: true,
      data: { sections: updatedStore.sections },
    });
  });

  /**
   * Reorder store sections
   * POST /api/v1/themes/stores/:storeId/sections/reorder
   */
  app.post('/stores/:storeId/sections/reorder', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { storeId } = request.params as { storeId: string };
    const body = reorderSectionsSchema.parse(request.body);

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        organizationId: organization.id,
      },
      select: { sections: true },
    });

    if (!store) {
      throw new NotFoundError('Store');
    }

    // Reorder sections based on provided order
    const sections = (store.sections as Array<{ id: string; sortOrder: number }>) || [];
    const reorderedSections = body.sectionIds
      .map((id, index) => {
        const section = sections.find((s) => s.id === id);
        if (section) {
          return { ...section, sortOrder: index };
        }
        return null;
      })
      .filter(Boolean);

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { sections: reorderedSections as unknown as object[] },
    });

    return reply.send({
      success: true,
      data: { sections: updatedStore.sections },
    });
  });

  // ==================== CUSTOM CSS ====================

  /**
   * Get store's custom CSS
   * GET /api/v1/themes/stores/:storeId/custom-css
   */
  app.get('/stores/:storeId/custom-css', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { storeId } = request.params as { storeId: string };

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        organizationId: organization.id,
      },
      select: { customCss: true },
    });

    if (!store) {
      throw new NotFoundError('Store');
    }

    return reply.send({
      success: true,
      data: { customCss: store.customCss || '' },
    });
  });

  /**
   * Update store's custom CSS
   * PUT /api/v1/themes/stores/:storeId/custom-css
   */
  app.put('/stores/:storeId/custom-css', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { storeId } = request.params as { storeId: string };
    const body = updateCustomCssSchema.parse(request.body);

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        organizationId: organization.id,
      },
    });

    if (!store) {
      throw new NotFoundError('Store');
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { customCss: body.customCss },
    });

    return reply.send({
      success: true,
      data: { customCss: updatedStore.customCss },
    });
  });

  // ==================== BACKUP & RESTORE ====================

  /**
   * List store's theme backups
   * GET /api/v1/themes/stores/:storeId/backups
   */
  app.get('/stores/:storeId/backups', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { storeId } = request.params as { storeId: string };
    const query = listVersionsSchema.parse(request.query);
    const { skip, take, page, limit } = paginate({ page: query.page, limit: query.limit });

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        organizationId: organization.id,
      },
    });

    if (!store) {
      throw new NotFoundError('Store');
    }

    const [backups, total] = await Promise.all([
      prisma.storeThemeBackup.findMany({
        where: { storeId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.storeThemeBackup.count({ where: { storeId } }),
    ]);

    return reply.send({
      success: true,
      data: backups,
      meta: createPaginationMeta(total, page, limit),
    });
  });

  /**
   * Create a theme backup
   * POST /api/v1/themes/stores/:storeId/backups
   */
  app.post('/stores/:storeId/backups', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { storeId } = request.params as { storeId: string };
    const body = createBackupSchema.parse(request.body);

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        organizationId: organization.id,
      },
      include: {
        theme: { select: { id: true, version: true } },
      },
    });

    if (!store) {
      throw new NotFoundError('Store');
    }

    if (!store.theme) {
      throw new BadRequestError('Store has no theme applied');
    }

    const backup = await prisma.storeThemeBackup.create({
      data: {
        storeId,
        themeId: store.theme.id,
        themeVersion: store.themeVersion || store.theme.version,
        themeSettings: store.themeSettings || {},
        customCss: store.customCss,
        sections: store.sections || [],
        reason: body.reason || 'manual',
      },
    });

    return reply.status(201).send({
      success: true,
      data: backup,
    });
  });

  /**
   * Restore from a backup
   * POST /api/v1/themes/stores/:storeId/backups/:backupId/restore
   */
  app.post('/stores/:storeId/backups/:backupId/restore', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { storeId, backupId } = request.params as { storeId: string; backupId: string };

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        organizationId: organization.id,
      },
    });

    if (!store) {
      throw new NotFoundError('Store');
    }

    const backup = await prisma.storeThemeBackup.findFirst({
      where: { id: backupId, storeId },
    });

    if (!backup) {
      throw new NotFoundError('Backup');
    }

    // Create a backup of current state before restoring
    await prisma.storeThemeBackup.create({
      data: {
        storeId,
        themeId: store.themeId || backup.themeId,
        themeVersion: store.themeVersion || '',
        themeSettings: store.themeSettings || {},
        customCss: store.customCss,
        sections: store.sections || [],
        reason: 'rollback',
      },
    });

    // Restore from backup
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        themeId: backup.themeId,
        themeVersion: backup.themeVersion,
        themeSettings: backup.themeSettings as unknown as object,
        customCss: backup.customCss,
        sections: backup.sections as unknown as object[],
      },
      include: {
        theme: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return reply.send({
      success: true,
      data: {
        theme: updatedStore.theme,
        themeSettings: updatedStore.themeSettings,
        customCss: updatedStore.customCss,
        sections: updatedStore.sections,
      },
    });
  });

  // ==================== EXPORT/IMPORT ====================

  /**
   * Export store's theme configuration
   * GET /api/v1/themes/stores/:storeId/export
   */
  app.get('/stores/:storeId/export', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { storeId } = request.params as { storeId: string };

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        organizationId: organization.id,
      },
      include: {
        theme: {
          select: { id: true, name: true, version: true },
        },
      },
    });

    if (!store) {
      throw new NotFoundError('Store');
    }

    const exportData = {
      themeId: store.theme?.id,
      themeName: store.theme?.name,
      themeVersion: store.themeVersion || store.theme?.version,
      themeSettings: store.themeSettings,
      customCss: store.customCss,
      sections: store.sections,
      exportedAt: new Date().toISOString(),
    };

    return reply.send({
      success: true,
      data: exportData,
    });
  });

  /**
   * Import theme configuration
   * POST /api/v1/themes/stores/:storeId/import
   */
  app.post('/stores/:storeId/import', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { storeId } = request.params as { storeId: string };

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        organizationId: organization.id,
      },
      include: {
        theme: { select: { id: true, version: true } },
      },
    });

    if (!store) {
      throw new NotFoundError('Store');
    }

    const importData = request.body as {
      themeSettings?: unknown;
      customCss?: string;
      sections?: unknown[];
    };

    // Create backup before import
    if (store.theme) {
      await prisma.storeThemeBackup.create({
        data: {
          storeId,
          themeId: store.theme.id,
          themeVersion: store.themeVersion || store.theme.version,
          themeSettings: store.themeSettings || {},
          customCss: store.customCss,
          sections: store.sections || [],
          reason: 'theme_change',
        },
      });
    }

    // Update store with imported data
    const updateData: Record<string, unknown> = {};
    if (importData.themeSettings) {
      updateData.themeSettings = importData.themeSettings;
    }
    if (importData.customCss !== undefined) {
      updateData.customCss = importData.customCss;
    }
    if (importData.sections) {
      updateData.sections = importData.sections;
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: updateData,
      include: {
        theme: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return reply.send({
      success: true,
      data: {
        theme: updatedStore.theme,
        themeSettings: updatedStore.themeSettings,
        customCss: updatedStore.customCss,
        sections: updatedStore.sections,
      },
    });
  });

  // ==================== THEME ASSETS ====================

  /**
   * List theme assets
   * GET /api/v1/themes/:themeId/assets
   */
  app.get('/:themeId/assets', async (request, reply) => {
    const organization = request.currentOrganization!;
    const { themeId } = request.params as { themeId: string };
    const { type } = request.query as { type?: string };

    // Verify access
    const theme = await prisma.theme.findFirst({
      where: {
        id: themeId,
        OR: [{ organizationId: organization.id }, { type: 'platform' }],
      },
    });

    if (!theme) {
      throw new NotFoundError('Theme');
    }

    const where: Record<string, unknown> = { themeId };
    if (type) {
      where.type = type;
    }

    const assets = await prisma.themeAsset.findMany({
      where,
      orderBy: { path: 'asc' },
    });

    return reply.send({
      success: true,
      data: assets,
    });
  });
}
