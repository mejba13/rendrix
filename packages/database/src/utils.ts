import { prisma } from './client';

/**
 * Set tenant context for Row-Level Security
 * Call this at the beginning of each request to scope queries to the current tenant
 */
export async function setTenantContext(organizationId: string): Promise<void> {
  await prisma.$executeRawUnsafe(
    `SET app.current_tenant = '${organizationId}'`
  );
}

/**
 * Clear tenant context
 */
export async function clearTenantContext(): Promise<void> {
  await prisma.$executeRawUnsafe(`RESET app.current_tenant`);
}

/**
 * Execute a function within a tenant context
 */
export async function withTenantContext<T>(
  organizationId: string,
  fn: () => Promise<T>
): Promise<T> {
  try {
    await setTenantContext(organizationId);
    return await fn();
  } finally {
    await clearTenantContext();
  }
}

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

/**
 * Generate a unique slug from a name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique slug with suffix if needed
 */
export async function generateUniqueSlug(
  name: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = generateSlug(name);
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${generateSlug(name)}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Pagination helper
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  maxLimit?: number;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

export function paginate(options: PaginationOptions = {}): PaginationResult {
  const { page = 1, limit = 20, maxLimit = 100 } = options;

  const actualPage = Math.max(1, page);
  const actualLimit = Math.min(Math.max(1, limit), maxLimit);

  return {
    skip: (actualPage - 1) * actualLimit,
    take: actualLimit,
    page: actualPage,
    limit: actualLimit,
  };
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
