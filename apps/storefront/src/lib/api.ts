const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options;

  let url = `${API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'An error occurred');
  }

  return data;
}

// Get store slug from hostname (subdomain)
export function getStoreSlug(): string {
  if (typeof window === 'undefined') return '';

  const hostname = window.location.hostname;

  // Check for subdomain pattern: store-slug.domain.com
  const parts = hostname.split('.');
  if (parts.length >= 3 && parts[0] !== 'www') {
    return parts[0];
  }

  // For local development, check URL parameter or default
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('store') || 'demo';
}

// Products
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  status: string;
  quantity: number;
  sku: string | null;
  categories: { id: string; name: string }[];
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  quantity: number;
  options: Record<string, string>;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function getProducts(
  storeId: string,
  params?: ProductListParams
): Promise<ApiResponse<Product[]>> {
  const queryParams: Record<string, string | number | undefined> | undefined = params ? {
    page: params.page,
    limit: params.limit,
    category: params.category,
    search: params.search,
    sort: params.sort,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
  } : undefined;
  return fetcher<Product[]>(`/api/v1/storefront/${storeId}/products`, { params: queryParams });
}

export async function getProduct(
  storeId: string,
  slug: string
): Promise<ApiResponse<Product>> {
  return fetcher<Product>(`/api/v1/storefront/${storeId}/products/${slug}`);
}

export async function getProductById(
  storeId: string,
  id: string
): Promise<ApiResponse<Product>> {
  return fetcher<Product>(`/api/v1/storefront/${storeId}/products/id/${id}`);
}

// Categories
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount: number;
}

export async function getCategories(
  storeId: string
): Promise<ApiResponse<Category[]>> {
  return fetcher<Category[]>(`/api/v1/storefront/${storeId}/categories`);
}

// Store info
export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  currency: string;
  theme: Record<string, unknown>;
}

export async function getStoreInfo(slug: string): Promise<ApiResponse<StoreInfo>> {
  return fetcher<StoreInfo>(`/api/v1/storefront/stores/${slug}`);
}

export async function getStoreById(storeId: string): Promise<ApiResponse<StoreInfo>> {
  return fetcher<StoreInfo>(`/api/v1/storefront/${storeId}/info`);
}

// Cart
export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  total: number;
}

export async function getCart(storeId: string, cartId: string): Promise<ApiResponse<Cart>> {
  return fetcher<Cart>(`/api/v1/storefront/${storeId}/cart/${cartId}`);
}

export async function addToCart(
  storeId: string,
  cartId: string | null,
  item: { productId: string; variantId?: string; quantity: number }
): Promise<ApiResponse<Cart>> {
  return fetcher<Cart>(`/api/v1/storefront/${storeId}/cart/add`, {
    method: 'POST',
    body: JSON.stringify({ cartId, ...item }),
  });
}

export async function updateCartItem(
  storeId: string,
  cartId: string,
  productId: string,
  quantity: number,
  variantId?: string
): Promise<ApiResponse<Cart>> {
  return fetcher<Cart>(`/api/v1/storefront/${storeId}/cart/update`, {
    method: 'POST',
    body: JSON.stringify({ cartId, productId, variantId, quantity }),
  });
}

export async function removeFromCart(
  storeId: string,
  cartId: string,
  productId: string,
  variantId?: string
): Promise<ApiResponse<Cart>> {
  return fetcher<Cart>(`/api/v1/storefront/${storeId}/cart/remove`, {
    method: 'POST',
    body: JSON.stringify({ cartId, productId, variantId }),
  });
}

// Checkout
export interface CheckoutData {
  email: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  sameAsShipping?: boolean;
  couponCode?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  email: string;
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

export async function createCheckout(
  storeId: string,
  cartId: string,
  data: CheckoutData
): Promise<ApiResponse<Order>> {
  return fetcher<Order>(`/api/v1/storefront/${storeId}/checkout`, {
    method: 'POST',
    body: JSON.stringify({ cartId, ...data }),
  });
}

export async function createPayment(
  storeId: string,
  orderId: string,
  paymentMethod: 'stripe' | 'paypal',
  returnUrl?: string,
  cancelUrl?: string
): Promise<
  ApiResponse<{
    paymentMethod: string;
    clientSecret?: string;
    paymentIntentId?: string;
    paypalOrderId?: string;
    approvalUrl?: string;
  }>
> {
  return fetcher(`/api/v1/storefront/${storeId}/checkout/payment`, {
    method: 'POST',
    body: JSON.stringify({ orderId, paymentMethod, returnUrl, cancelUrl }),
  });
}

export async function capturePayPalPayment(
  storeId: string,
  orderId: string,
  paypalOrderId: string
): Promise<ApiResponse<{ orderId: string; paymentStatus: string }>> {
  return fetcher(`/api/v1/storefront/${storeId}/checkout/paypal/capture`, {
    method: 'POST',
    body: JSON.stringify({ orderId, paypalOrderId }),
  });
}

// Coupon validation
export async function validateCoupon(
  storeId: string,
  code: string,
  cartTotal: number
): Promise<ApiResponse<{ valid: boolean; discount: number; coupon?: { type: string; value: number } }>> {
  return fetcher(`/api/v1/storefront/${storeId}/coupons/validate`, {
    method: 'POST',
    body: JSON.stringify({ code, cartTotal }),
  });
}

// Customer auth
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export async function customerLogin(
  storeId: string,
  email: string,
  password: string
): Promise<ApiResponse<{ customer: Customer; accessToken: string }>> {
  return fetcher(`/api/v1/storefront/${storeId}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function customerRegister(
  storeId: string,
  data: { email: string; password: string; firstName: string; lastName: string }
): Promise<ApiResponse<{ customer: Customer; accessToken: string }>> {
  return fetcher(`/api/v1/storefront/${storeId}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getCustomerOrders(
  storeId: string,
  accessToken: string
): Promise<ApiResponse<Order[]>> {
  return fetcher(`/api/v1/storefront/${storeId}/account/orders`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
