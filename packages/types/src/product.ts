import type { AuditableEntity, ID, PaginationParams, Json } from './common';

// Product Types
export type ProductType = 'simple' | 'variable' | 'grouped' | 'digital' | 'subscription';
export type ProductStatus = 'draft' | 'active' | 'archived';
export type ProductVisibility = 'visible' | 'hidden' | 'featured';

// Product Entity
export interface Product extends AuditableEntity {
  storeId: ID;
  sku: string | null;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  type: ProductType;
  status: ProductStatus;
  visibility: ProductVisibility;
  price: number | null;
  compareAtPrice: number | null;
  costPrice: number | null;
  taxable: boolean;
  taxClass: string | null;
  trackInventory: boolean;
  quantity: number;
  allowBackorders: boolean;
  weight: number | null;
  dimensions: ProductDimensions | null;
  attributes: ProductAttribute[];
  metadata: Json;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: Date | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  categories?: Category[];
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface ProductAttribute {
  name: string;
  values: string[];
  visible: boolean;
  variation: boolean;
}

// Product Variant
export interface ProductVariant {
  id: ID;
  productId: ID;
  sku: string | null;
  name: string | null;
  price: number | null;
  compareAtPrice: number | null;
  quantity: number;
  attributes: Record<string, string>;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: Date;
}

// Product Image
export interface ProductImage {
  id: ID;
  productId: ID;
  url: string;
  altText: string | null;
  position: number;
  createdAt: Date;
}

// Category
export interface Category extends AuditableEntity {
  storeId: ID;
  parentId: ID | null;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  productCount?: number;
  children?: Category[];
}

// Product CRUD
export interface CreateProductInput {
  sku?: string;
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  type?: ProductType;
  status?: ProductStatus;
  visibility?: ProductVisibility;
  price?: number;
  compareAtPrice?: number;
  costPrice?: number;
  taxable?: boolean;
  taxClass?: string;
  trackInventory?: boolean;
  quantity?: number;
  allowBackorders?: boolean;
  weight?: number;
  dimensions?: ProductDimensions;
  attributes?: ProductAttribute[];
  categoryIds?: ID[];
  images?: { url: string; altText?: string }[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

// Variant CRUD
export interface CreateVariantInput {
  sku?: string;
  name?: string;
  price?: number;
  compareAtPrice?: number;
  quantity?: number;
  attributes: Record<string, string>;
  imageUrl?: string;
}

export interface UpdateVariantInput extends Partial<CreateVariantInput> {}

// Category CRUD
export interface CreateCategoryInput {
  name: string;
  slug?: string;
  parentId?: ID;
  description?: string;
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

// Product Queries
export interface ListProductsParams extends PaginationParams {
  status?: ProductStatus;
  visibility?: ProductVisibility;
  type?: ProductType;
  categoryId?: ID;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

// Bulk Operations
export interface BulkProductAction {
  action: 'publish' | 'unpublish' | 'archive' | 'delete' | 'update_price' | 'update_inventory';
  productIds: ID[];
  data?: Record<string, unknown>;
}

// Import/Export
export interface ProductImportResult {
  total: number;
  created: number;
  updated: number;
  failed: number;
  errors: { row: number; message: string }[];
}

export type ExportFormat = 'csv' | 'xlsx' | 'json';
