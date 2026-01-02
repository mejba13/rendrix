import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';
import { prisma } from '../prisma';
import { uploadThemeAsset } from '../storage';
import type { ExtractedTheme } from './extractor';
import type { ThemeManifest } from '@rendrix/types';

// Transaction client type for Prisma
type TransactionClient = Omit<
  typeof prisma,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

// Asset type mapping based on extension
const ASSET_TYPE_MAP: Record<string, string> = {
  '.css': 'css',
  '.js': 'js',
  '.png': 'image',
  '.jpg': 'image',
  '.jpeg': 'image',
  '.gif': 'image',
  '.svg': 'image',
  '.webp': 'image',
  '.woff': 'font',
  '.woff2': 'font',
  '.ttf': 'font',
  '.eot': 'font',
  '.json': 'json',
};

export interface ProcessThemeOptions {
  organizationId: string;
  userId: string;
  manifest: ThemeManifest;
  extractedTheme: ExtractedTheme;
  zipBuffer: Buffer;
}

export interface ProcessThemeResult {
  theme: {
    id: string;
    slug: string;
    version: string;
  };
  version: {
    id: string;
    version: string;
  };
  assetsUploaded: number;
}

/**
 * Theme processor
 * Handles theme registration and asset upload
 */
export class ThemeProcessor {
  /**
   * Process and register a new theme
   */
  async processNewTheme(options: ProcessThemeOptions): Promise<ProcessThemeResult> {
    const { organizationId, userId, manifest, extractedTheme, zipBuffer } = options;

    // Generate unique slug
    const slug = await this.generateUniqueSlug(manifest.name, organizationId);

    // Start transaction
    return prisma.$transaction(async (tx) => {
      // Create theme
      const theme = await tx.theme.create({
        data: {
          name: manifest.name,
          slug,
          description: manifest.description,
          version: manifest.version,
          author: manifest.author.name,
          industries: manifest.industries,
          features: manifest.features,
          isPremium: false,
          settingsSchema: manifest.settings.schema as unknown as object,
          isActive: true,
          organizationId,
          type: 'custom',
          sourceType: 'upload',
          manifest: manifest as unknown as object,
          sections: manifest.sections as unknown as object[],
          supportUrl: null,
          documentationUrl: null,
        },
      });

      // Upload theme assets
      const assetsUploaded = await this.uploadThemeAssets(
        tx,
        theme.id,
        organizationId,
        extractedTheme
      );

      // Upload preview images and update URLs
      const { previewUrl, thumbnailUrl } = await this.uploadPreviewImages(
        tx,
        theme.id,
        organizationId,
        manifest,
        extractedTheme
      );

      // Update theme with preview URLs
      await tx.theme.update({
        where: { id: theme.id },
        data: { previewUrl, thumbnailUrl },
      });

      // Create theme version
      const version = await tx.themeVersion.create({
        data: {
          themeId: theme.id,
          version: manifest.version,
          changelog: 'Initial version',
          settingsSchema: manifest.settings.schema as unknown as object,
          sections: manifest.sections as unknown as object[],
          isLatest: true,
          publishedAt: new Date(),
        },
      });

      // Create theme sections
      await this.createThemeSections(tx, theme.id, manifest.sections);

      // Upload and save the ZIP package
      await this.saveThemePackage(
        tx,
        theme.id,
        organizationId,
        userId,
        zipBuffer,
        manifest.name
      );

      return {
        theme: {
          id: theme.id,
          slug: theme.slug,
          version: theme.version,
        },
        version: {
          id: version.id,
          version: version.version,
        },
        assetsUploaded,
      };
    });
  }

  /**
   * Process a new version of an existing theme
   */
  async processNewVersion(
    themeId: string,
    options: Omit<ProcessThemeOptions, 'organizationId'> & { organizationId?: string }
  ): Promise<ProcessThemeResult> {
    const { userId, manifest, extractedTheme, zipBuffer, organizationId } = options;

    return prisma.$transaction(async (tx) => {
      // Get existing theme
      const theme = await tx.theme.findUnique({
        where: { id: themeId },
        include: { versions: { where: { isLatest: true } } },
      });

      if (!theme) {
        throw new Error('Theme not found');
      }

      // Mark previous version as not latest
      if (theme.versions.length > 0) {
        await tx.themeVersion.updateMany({
          where: { themeId, isLatest: true },
          data: { isLatest: false },
        });
      }

      // Update theme
      await tx.theme.update({
        where: { id: themeId },
        data: {
          name: manifest.name,
          description: manifest.description,
          version: manifest.version,
          author: manifest.author.name,
          industries: manifest.industries,
          features: manifest.features,
          settingsSchema: manifest.settings.schema as unknown as object,
          manifest: manifest as unknown as object,
          sections: manifest.sections as unknown as object[],
        },
      });

      // Upload new assets
      const assetsUploaded = await this.uploadThemeAssets(
        tx,
        themeId,
        organizationId || theme.organizationId || '',
        extractedTheme
      );

      // Update preview images
      const { previewUrl, thumbnailUrl } = await this.uploadPreviewImages(
        tx,
        themeId,
        organizationId || theme.organizationId || '',
        manifest,
        extractedTheme
      );

      await tx.theme.update({
        where: { id: themeId },
        data: { previewUrl, thumbnailUrl },
      });

      // Create new version
      const version = await tx.themeVersion.create({
        data: {
          themeId,
          version: manifest.version,
          changelog: `Updated to version ${manifest.version}`,
          settingsSchema: manifest.settings.schema as unknown as object,
          sections: manifest.sections as unknown as object[],
          isLatest: true,
          publishedAt: new Date(),
        },
      });

      // Update sections
      await tx.themeSection.deleteMany({ where: { themeId } });
      await this.createThemeSections(tx, themeId, manifest.sections);

      // Save new package
      await this.saveThemePackage(
        tx,
        themeId,
        organizationId || theme.organizationId || '',
        userId,
        zipBuffer,
        manifest.name
      );

      return {
        theme: {
          id: themeId,
          slug: theme.slug,
          version: manifest.version,
        },
        version: {
          id: version.id,
          version: version.version,
        },
        assetsUploaded,
      };
    });
  }

  /**
   * Generate a unique slug for the theme
   */
  private async generateUniqueSlug(name: string, _organizationId: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.theme.findUnique({ where: { slug } });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * Upload theme assets to storage
   */
  private async uploadThemeAssets(
    tx: TransactionClient,
    themeId: string,
    _organizationId: string,
    extractedTheme: ExtractedTheme
  ): Promise<number> {
    let uploaded = 0;

    for (const [path] of extractedTheme.packageInfo.files) {
      // Skip non-asset files
      if (!path.startsWith('assets/') && path !== 'settings.json') continue;

      const ext = extname(path).toLowerCase();
      const assetType = ASSET_TYPE_MAP[ext];
      if (!assetType) continue;

      // Read file content
      const content = await readFile(join(extractedTheme.tempDir, path));
      const checksum = createHash('sha256').update(content).digest('hex');

      // Upload to storage
      const key = `themes/${themeId}/${path}`;
      const uploadResult = await uploadThemeAsset({
        key,
        body: content,
        contentType: this.getContentType(ext),
      });

      // Save asset record
      await tx.themeAsset.upsert({
        where: {
          themeId_path: { themeId, path },
        },
        create: {
          themeId,
          path,
          type: assetType,
          url: uploadResult.url,
          size: content.length,
          checksum,
        },
        update: {
          url: uploadResult.url,
          size: content.length,
          checksum,
        },
      });

      uploaded++;
    }

    return uploaded;
  }

  /**
   * Upload preview images
   */
  private async uploadPreviewImages(
    _tx: TransactionClient,
    themeId: string,
    _organizationId: string,
    manifest: ThemeManifest,
    extractedTheme: ExtractedTheme
  ): Promise<{ previewUrl: string | null; thumbnailUrl: string | null }> {
    let previewUrl: string | null = null;
    let thumbnailUrl: string | null = null;

    // Upload desktop preview
    const desktopPath = manifest.preview.desktop.startsWith('assets/')
      ? manifest.preview.desktop
      : `assets/${manifest.preview.desktop}`;

    if (extractedTheme.packageInfo.files.has(desktopPath)) {
      const content = await readFile(join(extractedTheme.tempDir, desktopPath));
      const ext = extname(desktopPath);
      const key = `themes/${themeId}/preview-desktop${ext}`;

      const result = await uploadThemeAsset({
        key,
        body: content,
        contentType: this.getContentType(ext),
      });

      previewUrl = result.url;
      thumbnailUrl = result.url; // Use same for thumbnail for now
    }

    return { previewUrl, thumbnailUrl };
  }

  /**
   * Create theme sections in database
   */
  private async createThemeSections(
    tx: TransactionClient,
    themeId: string,
    sections: ThemeManifest['sections']
  ): Promise<void> {
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      await tx.themeSection.create({
        data: {
          themeId,
          name: section.name,
          slug: section.slug,
          type: section.type,
          component: section.component,
          schema: section.schema as unknown as object,
          defaults: section.defaults as unknown as object,
          sortOrder: i,
        },
      });
    }
  }

  /**
   * Save theme package ZIP file
   */
  private async saveThemePackage(
    tx: TransactionClient,
    themeId: string,
    organizationId: string,
    userId: string,
    zipBuffer: Buffer,
    themeName: string
  ): Promise<void> {
    const checksum = createHash('sha256').update(zipBuffer).digest('hex');
    const filename = `${themeName.toLowerCase().replace(/\s+/g, '-')}.zip`;
    const key = `themes/${themeId}/packages/${filename}`;

    const result = await uploadThemeAsset({
      key,
      body: zipBuffer,
      contentType: 'application/zip',
    });

    await tx.themePackage.create({
      data: {
        themeId,
        organizationId: organizationId || null,
        filename,
        fileUrl: result.url,
        fileSize: zipBuffer.length,
        checksum,
        uploadedBy: userId,
      },
    });
  }

  /**
   * Get content type from file extension
   */
  private getContentType(ext: string): string {
    const types: Record<string, string> = {
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject',
    };
    return types[ext.toLowerCase()] || 'application/octet-stream';
  }
}

export const themeProcessor = new ThemeProcessor();
