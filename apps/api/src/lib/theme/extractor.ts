import { createHash } from 'crypto';
import { mkdir, rm, writeFile, readFile } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import AdmZip from 'adm-zip';
import type { ThemeFileInfo, ThemePackageInfo } from './validator';

// Maximum number of files allowed in a theme package
const MAX_FILES = 500;

// File types that should have their content loaded
const TEXT_EXTENSIONS = new Set(['.json', '.css', '.md', '.txt']);

export interface ExtractedTheme {
  packageInfo: ThemePackageInfo;
  tempDir: string;
  rootDir: string; // The theme's root directory inside the zip
}

/**
 * Theme package extractor
 * Handles ZIP file extraction with security measures
 */
export class ThemeExtractor {
  /**
   * Extract a theme package from a buffer
   */
  async extract(zipBuffer: Buffer): Promise<ExtractedTheme> {
    const tempDir = join(tmpdir(), 'rendrix-theme-' + randomUUID());
    let zip: AdmZip;

    try {
      // Create temp directory
      await mkdir(tempDir, { recursive: true });

      // Parse ZIP file
      try {
        zip = new AdmZip(zipBuffer);
      } catch {
        throw new Error('Invalid ZIP file format');
      }

      const entries = zip.getEntries();

      // Check file count limit
      if (entries.length > MAX_FILES) {
        throw new Error(`Theme package contains too many files (${entries.length}). Maximum is ${MAX_FILES}`);
      }

      // Find root directory (handle both flat and nested structures)
      const rootDir = this.findRootDirectory(entries);

      // Extract and process files
      const files = new Map<string, ThemeFileInfo>();
      let totalSize = 0;

      for (const entry of entries) {
        if (entry.isDirectory) continue;

        // Get relative path from root
        let relativePath = entry.entryName;
        if (rootDir && relativePath.startsWith(rootDir)) {
          relativePath = relativePath.substring(rootDir.length);
        }

        // Remove leading slash if present
        if (relativePath.startsWith('/')) {
          relativePath = relativePath.substring(1);
        }

        // Skip hidden files and directories
        if (this.isHiddenPath(relativePath)) continue;

        // Skip empty paths
        if (!relativePath) continue;

        // Security: Check for path traversal
        if (relativePath.includes('..') || relativePath.startsWith('/')) {
          throw new Error(`Invalid file path: ${entry.entryName}`);
        }

        const data = entry.getData();
        const size = data.length;
        totalSize += size;

        // Extract to temp directory
        const fullPath = join(tempDir, relativePath);
        await mkdir(dirname(fullPath), { recursive: true });
        await writeFile(fullPath, data);

        // Store file info
        const ext = extname(relativePath).toLowerCase();
        const fileInfo: ThemeFileInfo = {
          path: relativePath,
          size,
        };

        // Load content for text files (needed for validation)
        if (TEXT_EXTENSIONS.has(ext)) {
          fileInfo.content = data;
        }

        files.set(relativePath, fileInfo);
      }

      return {
        packageInfo: { files, totalSize },
        tempDir,
        rootDir: rootDir || '',
      };
    } catch (error) {
      // Clean up on error
      await this.cleanup(tempDir);
      throw error;
    }
  }

  /**
   * Find the root directory of the theme in the ZIP
   * Handles cases where the theme is wrapped in a folder
   */
  private findRootDirectory(entries: AdmZip.IZipEntry[]): string {
    // Look for manifest.json to determine root
    for (const entry of entries) {
      if (entry.entryName.endsWith('manifest.json')) {
        // Get the directory containing manifest.json
        const dir = dirname(entry.entryName);
        return dir === '.' ? '' : dir + '/';
      }
    }

    // If no manifest found, try to find common root
    const paths = entries.map((e) => e.entryName);
    if (paths.length === 0) return '';

    // Check if all paths start with the same directory
    const firstPath = paths[0];
    const firstDir = firstPath.split('/')[0];

    if (firstDir && paths.every((p) => p.startsWith(firstDir + '/'))) {
      return firstDir + '/';
    }

    return '';
  }

  /**
   * Check if a path is hidden (starts with . or contains /./)
   */
  private isHiddenPath(path: string): boolean {
    const parts = path.split('/');
    return parts.some((part) => part.startsWith('.'));
  }

  /**
   * Clean up extracted files
   */
  async cleanup(tempDir: string): Promise<void> {
    try {
      await rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }

  /**
   * Read a file from the extracted theme
   */
  async readFile(tempDir: string, relativePath: string): Promise<Buffer> {
    const fullPath = join(tempDir, relativePath);
    return readFile(fullPath);
  }

  /**
   * Get file checksum (SHA-256)
   */
  getChecksum(data: Buffer): string {
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Create a ZIP package from theme files
   */
  async createPackage(files: Map<string, Buffer>): Promise<Buffer> {
    const zip = new AdmZip();

    for (const [path, content] of files) {
      zip.addFile(path, content);
    }

    return zip.toBuffer();
  }
}

export const themeExtractor = new ThemeExtractor();
