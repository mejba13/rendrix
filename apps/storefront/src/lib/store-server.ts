import { headers, cookies } from 'next/headers';
import { StoreInfo, Category } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Get store identifier from request headers (set by middleware)
 */
export async function getStoreIdentifier(): Promise<string | null> {
  const headersList = await headers();
  const cookieStore = await cookies();

  // Try to get from header first (set by middleware)
  const headerIdentifier = headersList.get('x-store-identifier');
  if (headerIdentifier) {
    return headerIdentifier;
  }

  // Fallback to cookie
  const cookieIdentifier = cookieStore.get('store-identifier');
  if (cookieIdentifier?.value) {
    return cookieIdentifier.value;
  }

  return null;
}

/**
 * Fetch store info by slug/subdomain (server-side)
 */
export async function fetchStoreInfo(slug: string): Promise<StoreInfo | null> {
  try {
    const response = await fetch(`${API_URL}/api/v1/storefront/stores/${slug}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error(`Failed to fetch store info for ${slug}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching store info:', error);
    return null;
  }
}

/**
 * Fetch categories for a store (server-side)
 */
export async function fetchCategories(storeId: string): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/api/v1/storefront/${storeId}/categories`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error(`Failed to fetch categories for store ${storeId}: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch products for a store (server-side)
 */
export async function fetchProducts(
  storeId: string,
  params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
    featured?: boolean;
  }
): Promise<{ products: any[]; meta?: any }> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.featured) searchParams.append('featured', 'true');

    const url = `${API_URL}/api/v1/storefront/${storeId}/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url, {
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      console.error(`Failed to fetch products for store ${storeId}: ${response.status}`);
      return { products: [] };
    }

    const data = await response.json();
    return data.success ? { products: data.data, meta: data.meta } : { products: [] };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [] };
  }
}

/**
 * Fetch a single product by slug (server-side)
 */
export async function fetchProduct(storeId: string, slug: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_URL}/api/v1/storefront/${storeId}/products/${slug}`, {
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      console.error(`Failed to fetch product ${slug} for store ${storeId}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Get complete store data for layout (server-side)
 */
export async function getStoreData(): Promise<{
  store: StoreInfo | null;
  categories: Category[];
  storeIdentifier: string | null;
}> {
  const storeIdentifier = await getStoreIdentifier();

  if (!storeIdentifier) {
    return { store: null, categories: [], storeIdentifier: null };
  }

  const store = await fetchStoreInfo(storeIdentifier);

  if (!store) {
    return { store: null, categories: [], storeIdentifier };
  }

  const categories = await fetchCategories(store.id);

  return { store, categories, storeIdentifier };
}
