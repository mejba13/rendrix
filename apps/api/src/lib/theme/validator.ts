import { z } from 'zod';
import type {
  ThemeManifest,
  ThemeValidationResult,
  ThemeValidationError,
  ThemeValidationWarning,
  ThemeSectionDefinition,
} from '@rendrix/types';

// Allowed file extensions in theme packages
const ALLOWED_EXTENSIONS = new Set([
  '.json',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.md',
  '.txt',
]);

// Maximum file sizes
const MAX_PACKAGE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_SINGLE_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_CSS_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Required files in theme package
const REQUIRED_FILES = ['manifest.json', 'assets/preview-desktop.png'];

// Zod schemas for validation
const themeAuthorSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().optional(),
  url: z.string().url().optional(),
});

const themeSettingFieldSchema = z.object({
  type: z.enum([
    'text',
    'textarea',
    'number',
    'range',
    'color',
    'select',
    'checkbox',
    'image',
    'url',
    'font_picker',
  ]),
  id: z.string().min(1).max(100).regex(/^[a-z][a-z0-9_]*$/),
  label: z.string().min(1).max(255),
  default: z.unknown().optional(),
  info: z.string().max(500).optional(),
  options: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  unit: z.string().max(10).optional(),
  placeholder: z.string().max(255).optional(),
  required: z.boolean().optional(),
});

const themeSectionSchemaSchema = z.object({
  settings: z.array(themeSettingFieldSchema),
  blocks: z
    .array(
      z.object({
        type: z.string().min(1).max(50),
        name: z.string().min(1).max(255),
        settings: z.array(themeSettingFieldSchema),
        limit: z.number().int().positive().optional(),
      })
    )
    .optional(),
  maxBlocks: z.number().int().positive().optional(),
});

const themeSectionDefinitionSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100).regex(/^[a-z][a-z0-9-]*$/),
  type: z.enum([
    'header',
    'footer',
    'hero',
    'banner',
    'products',
    'collection',
    'testimonials',
    'newsletter',
    'contact',
    'gallery',
    'text',
    'image',
    'video',
    'custom',
  ]),
  component: z.string().min(1).max(100).regex(/^[A-Z][a-zA-Z0-9]*$/),
  schema: themeSectionSchemaSchema,
  defaults: z.record(z.unknown()),
  limit: z.number().int().positive().optional(),
  presets: z.array(z.string()).optional(),
});

const themeManifestSchema = z.object({
  name: z.string().min(1).max(255),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  author: themeAuthorSchema,
  description: z.string().min(1).max(2000),
  industries: z.array(z.string()).min(1),
  features: z.array(z.string()),
  minRendrixVersion: z.string().optional(),
  settings: z.object({
    schema: z.object({
      sections: z.array(
        z.object({
          name: z.string(),
          settings: z.array(themeSettingFieldSchema),
        })
      ),
    }),
    defaults: z.record(z.unknown()),
  }),
  sections: z.array(themeSectionDefinitionSchema),
  preview: z.object({
    desktop: z.string(),
    tablet: z.string().optional(),
    mobile: z.string().optional(),
  }),
});

// Security patterns to check for
const SUSPICIOUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i, // onclick, onload, etc.
  /eval\s*\(/i,
  /expression\s*\(/i,
  /@import\s+url/i,
  /behavior\s*:/i,
  /-moz-binding/i,
];

export interface ThemeFileInfo {
  path: string;
  size: number;
  content?: string | Buffer;
}

export interface ThemePackageInfo {
  files: Map<string, ThemeFileInfo>;
  totalSize: number;
}

/**
 * Validates a theme package structure and contents
 */
export class ThemeValidator {
  private errors: ThemeValidationError[] = [];
  private warnings: ThemeValidationWarning[] = [];

  /**
   * Validate the complete theme package
   */
  async validate(packageInfo: ThemePackageInfo): Promise<ThemeValidationResult> {
    this.errors = [];
    this.warnings = [];

    // Check total package size
    if (packageInfo.totalSize > MAX_PACKAGE_SIZE) {
      this.addError(
        'PACKAGE_TOO_LARGE',
        `Package size (${this.formatSize(packageInfo.totalSize)}) exceeds maximum allowed (${this.formatSize(MAX_PACKAGE_SIZE)})`
      );
      return this.buildResult();
    }

    // Check required files
    this.validateRequiredFiles(packageInfo);

    // Validate file extensions and sizes
    this.validateFiles(packageInfo);

    // Parse and validate manifest
    const manifest = await this.validateManifest(packageInfo);

    // If manifest is valid, do additional validation
    if (manifest) {
      this.validateSections(manifest, packageInfo);
      this.validateAssets(manifest, packageInfo);
    }

    return this.buildResult(manifest);
  }

  /**
   * Validate that all required files are present
   */
  private validateRequiredFiles(packageInfo: ThemePackageInfo): void {
    for (const requiredFile of REQUIRED_FILES) {
      if (!packageInfo.files.has(requiredFile)) {
        this.addError(
          'MISSING_REQUIRED_FILE',
          `Required file '${requiredFile}' is missing`,
          requiredFile
        );
      }
    }
  }

  /**
   * Validate individual files
   */
  private validateFiles(packageInfo: ThemePackageInfo): void {
    for (const [path, file] of packageInfo.files) {
      // Check file extension
      const ext = this.getExtension(path);
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        this.addError(
          'INVALID_FILE_TYPE',
          `File type '${ext}' is not allowed`,
          path
        );
        continue;
      }

      // Check file size limits
      if (file.size > MAX_SINGLE_FILE_SIZE) {
        this.addError(
          'FILE_TOO_LARGE',
          `File size (${this.formatSize(file.size)}) exceeds maximum allowed`,
          path
        );
      }

      // Additional size checks for specific types
      if (ext === '.css' && file.size > MAX_CSS_SIZE) {
        this.addWarning(
          'LARGE_CSS_FILE',
          `CSS file is larger than recommended (${this.formatSize(file.size)})`,
          path
        );
      }

      if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext) && file.size > MAX_IMAGE_SIZE) {
        this.addWarning(
          'LARGE_IMAGE_FILE',
          `Image file is larger than recommended (${this.formatSize(file.size)})`,
          path
        );
      }

      // Check for path traversal
      if (path.includes('..') || path.startsWith('/')) {
        this.addError(
          'INVALID_PATH',
          'File path contains invalid characters',
          path
        );
      }

      // Security check for CSS files
      if (ext === '.css' && file.content) {
        this.validateCssContent(path, file.content.toString());
      }
    }
  }

  /**
   * Validate CSS content for security issues
   */
  private validateCssContent(path: string, content: string): void {
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(content)) {
        this.addError(
          'SUSPICIOUS_CONTENT',
          'CSS contains potentially malicious content',
          path
        );
        break;
      }
    }
  }

  /**
   * Parse and validate manifest.json
   */
  private async validateManifest(
    packageInfo: ThemePackageInfo
  ): Promise<ThemeManifest | null> {
    const manifestFile = packageInfo.files.get('manifest.json');
    if (!manifestFile || !manifestFile.content) {
      return null;
    }

    try {
      const content = manifestFile.content.toString();
      const parsed = JSON.parse(content);
      const validated = themeManifestSchema.parse(parsed);

      return validated as ThemeManifest;
    } catch (error) {
      if (error instanceof z.ZodError) {
        for (const issue of error.issues) {
          this.addError(
            'MANIFEST_VALIDATION_ERROR',
            `${issue.path.join('.')}: ${issue.message}`,
            'manifest.json'
          );
        }
      } else if (error instanceof SyntaxError) {
        this.addError(
          'MANIFEST_PARSE_ERROR',
          'manifest.json contains invalid JSON',
          'manifest.json'
        );
      } else {
        this.addError(
          'MANIFEST_ERROR',
          'Failed to parse manifest.json',
          'manifest.json'
        );
      }
      return null;
    }
  }

  /**
   * Validate section definitions
   */
  private validateSections(
    manifest: ThemeManifest,
    packageInfo: ThemePackageInfo
  ): void {
    const sectionSlugs = new Set<string>();

    for (const section of manifest.sections) {
      // Check for duplicate slugs
      if (sectionSlugs.has(section.slug)) {
        this.addError(
          'DUPLICATE_SECTION_SLUG',
          `Section slug '${section.slug}' is duplicated`,
          'manifest.json'
        );
      }
      sectionSlugs.add(section.slug);

      // Check section file exists if referenced
      const sectionFile = `sections/${section.slug}.json`;
      if (packageInfo.files.has(sectionFile)) {
        // Validate section file content matches definition
        this.validateSectionFile(section, packageInfo.files.get(sectionFile)!);
      }
    }
  }

  /**
   * Validate section file content
   */
  private validateSectionFile(
    definition: ThemeSectionDefinition,
    file: ThemeFileInfo
  ): void {
    if (!file.content) return;

    try {
      const content = JSON.parse(file.content.toString());
      // Basic validation that section file matches definition
      if (content.name && content.name !== definition.name) {
        this.addWarning(
          'SECTION_NAME_MISMATCH',
          `Section file name doesn't match manifest definition`,
          file.path
        );
      }
    } catch {
      this.addError(
        'INVALID_SECTION_FILE',
        'Section file contains invalid JSON',
        file.path
      );
    }
  }

  /**
   * Validate that referenced assets exist
   */
  private validateAssets(
    manifest: ThemeManifest,
    packageInfo: ThemePackageInfo
  ): void {
    // Check preview images exist
    const previewImages = [
      manifest.preview.desktop,
      manifest.preview.tablet,
      manifest.preview.mobile,
    ].filter(Boolean);

    for (const image of previewImages) {
      const imagePath = image!.startsWith('assets/') ? image! : `assets/${image}`;
      if (!packageInfo.files.has(imagePath)) {
        this.addWarning(
          'MISSING_PREVIEW_IMAGE',
          `Preview image '${image}' not found in package`,
          imagePath
        );
      }
    }
  }

  private addError(code: string, message: string, path?: string): void {
    this.errors.push({ code, message, path });
  }

  private addWarning(code: string, message: string, path?: string): void {
    this.warnings.push({ code, message, path });
  }

  private buildResult(manifest?: ThemeManifest | null): ThemeValidationResult {
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      manifest: manifest || undefined,
    };
  }

  private getExtension(path: string): string {
    const lastDot = path.lastIndexOf('.');
    return lastDot >= 0 ? path.substring(lastDot).toLowerCase() : '';
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

/**
 * Validate a manifest object directly (without package)
 */
export function validateManifest(
  manifest: unknown
): { valid: boolean; errors: string[] } {
  try {
    themeManifestSchema.parse(manifest);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
      };
    }
    return { valid: false, errors: ['Invalid manifest format'] };
  }
}

export const themeValidator = new ThemeValidator();
