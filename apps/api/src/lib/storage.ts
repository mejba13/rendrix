import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env';
import { generateRandomString } from '@rendrix/utils';

// Initialize S3 client (works with AWS S3 and MinIO)
const s3Client = env.AWS_ACCESS_KEY_ID
  ? new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
      },
      ...(env.AWS_S3_ENDPOINT && { endpoint: env.AWS_S3_ENDPOINT }),
      forcePathStyle: env.AWS_S3_FORCE_PATH_STYLE,
    })
  : null;

const bucket = env.AWS_S3_BUCKET || 'rendrix-media';

export interface UploadOptions {
  storeId: string;
  file: Buffer;
  filename: string;
  mimeType: string;
  folder?: string;
}

export interface UploadResult {
  key: string;
  url: string;
  size: number;
}

/**
 * Generate a unique file key
 */
function generateFileKey(storeId: string, filename: string, folder?: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const randomId = generateRandomString(12);
  const timestamp = Date.now();
  const safeName = filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9]/g, '-') // Replace special chars
    .substring(0, 50);

  const parts = ['stores', storeId];
  if (folder) {
    parts.push(folder);
  }
  parts.push(`${timestamp}-${randomId}-${safeName}.${ext}`);

  return parts.join('/');
}

/**
 * Upload a file to storage
 */
export async function uploadFile(options: UploadOptions): Promise<UploadResult> {
  const { storeId, file, filename, mimeType, folder } = options;
  const key = generateFileKey(storeId, filename, folder);

  if (!s3Client) {
    // Fallback for development without S3
    const localUrl = `${env.API_URL}/media/${key}`;
    return {
      key,
      url: localUrl,
      size: file.length,
    };
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: mimeType,
      // Public read access for media files
      ACL: 'public-read',
    })
  );

  const url = env.AWS_S3_ENDPOINT
    ? `${env.AWS_S3_ENDPOINT}/${bucket}/${key}` // MinIO
    : `https://${bucket}.s3.${env.AWS_REGION}.amazonaws.com/${key}`; // AWS S3

  return {
    key,
    url,
    size: file.length,
  };
}

/**
 * Delete a file from storage
 */
export async function deleteFile(key: string): Promise<void> {
  if (!s3Client) {
    return; // No-op in development
  }

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

/**
 * Check if a file exists
 */
export async function fileExists(key: string): Promise<boolean> {
  if (!s3Client) {
    return false;
  }

  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Get a signed URL for private file access
 */
export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string | null> {
  if (!s3Client) {
    return null;
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Get file info
 */
export async function getFileInfo(
  key: string
): Promise<{ size: number; mimeType: string } | null> {
  if (!s3Client) {
    return null;
  }

  try {
    const response = await s3Client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    return {
      size: response.ContentLength || 0,
      mimeType: response.ContentType || 'application/octet-stream',
    };
  } catch {
    return null;
  }
}

/**
 * Extract key from URL
 */
export function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Handle different URL formats
    const path = urlObj.pathname;

    // Remove leading slash and bucket name if present
    const parts = path.split('/').filter(Boolean);
    if (parts[0] === bucket) {
      parts.shift();
    }

    return parts.join('/') || null;
  } catch {
    return null;
  }
}

/**
 * Validate file type
 */
export function isAllowedFileType(mimeType: string): boolean {
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/avif',
    // Documents
    'application/pdf',
    // Videos
    'video/mp4',
    'video/webm',
    'video/quicktime',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/webm',
  ];

  return allowedTypes.includes(mimeType);
}

/**
 * Upload a theme asset to storage with custom key
 */
export interface ThemeUploadOptions {
  key: string;
  body: Buffer;
  contentType: string;
}

export async function uploadThemeAsset(options: ThemeUploadOptions): Promise<UploadResult> {
  const { key, body, contentType } = options;

  if (!s3Client) {
    // Fallback for development without S3
    const localUrl = `${env.API_URL}/media/${key}`;
    return {
      key,
      url: localUrl,
      size: body.length,
    };
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: 'public-read',
    })
  );

  const url = env.AWS_S3_ENDPOINT
    ? `${env.AWS_S3_ENDPOINT}/${bucket}/${key}` // MinIO
    : `https://${bucket}.s3.${env.AWS_REGION}.amazonaws.com/${key}`; // AWS S3

  return {
    key,
    url,
    size: body.length,
  };
}

/**
 * Get max file size by type (in bytes)
 */
export function getMaxFileSize(mimeType: string): number {
  if (mimeType.startsWith('video/')) {
    return 100 * 1024 * 1024; // 100MB for videos
  }
  if (mimeType.startsWith('audio/')) {
    return 50 * 1024 * 1024; // 50MB for audio
  }
  if (mimeType === 'application/pdf') {
    return 20 * 1024 * 1024; // 20MB for PDFs
  }
  // Images and other files
  return 10 * 1024 * 1024; // 10MB
}
