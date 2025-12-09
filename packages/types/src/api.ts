import type { ApiResponse, PaginatedResponse } from './common';
import type { User, Organization, OrganizationMember, Store, Theme } from './entities';
import type { AuthSession, AuthTokens } from './auth';
import type { Plan, Subscription, Invoice, PaymentMethod, CheckoutSession, BillingPortalSession } from './billing';
import type { Product, ProductVariant, Category } from './product';
import type { Order, Customer, Coupon, Fulfillment } from './order';
import type { StoreAnalyticsSummary } from './store';

// API Response Types

// Auth
export type LoginResponse = ApiResponse<AuthSession>;
export type RegisterResponse = ApiResponse<AuthSession>;
export type RefreshTokenResponse = ApiResponse<AuthTokens>;
export type CurrentUserResponse = ApiResponse<{ user: User; organizations: Organization[] }>;

// Organizations
export type OrganizationResponse = ApiResponse<Organization>;
export type OrganizationsResponse = ApiResponse<Organization[]>;
export type OrganizationMembersResponse = ApiResponse<OrganizationMember[]>;

// Stores
export type StoreResponse = ApiResponse<Store>;
export type StoresResponse = PaginatedResponse<Store>;

// Themes
export type ThemeResponse = ApiResponse<Theme>;
export type ThemesResponse = PaginatedResponse<Theme>;

// Products
export type ProductResponse = ApiResponse<Product>;
export type ProductsResponse = PaginatedResponse<Product>;
export type VariantResponse = ApiResponse<ProductVariant>;
export type VariantsResponse = ApiResponse<ProductVariant[]>;

// Categories
export type CategoryResponse = ApiResponse<Category>;
export type CategoriesResponse = ApiResponse<Category[]>;

// Orders
export type OrderResponse = ApiResponse<Order>;
export type OrdersResponse = PaginatedResponse<Order>;
export type FulfillmentResponse = ApiResponse<Fulfillment>;

// Customers
export type CustomerResponse = ApiResponse<Customer>;
export type CustomersResponse = PaginatedResponse<Customer>;

// Coupons
export type CouponResponse = ApiResponse<Coupon>;
export type CouponsResponse = PaginatedResponse<Coupon>;

// Billing
export type PlansResponse = ApiResponse<Plan[]>;
export type SubscriptionResponse = ApiResponse<Subscription>;
export type InvoicesResponse = ApiResponse<Invoice[]>;
export type PaymentMethodsResponse = ApiResponse<PaymentMethod[]>;
export type CheckoutResponse = ApiResponse<CheckoutSession>;
export type BillingPortalResponse = ApiResponse<BillingPortalSession>;

// Analytics
export type AnalyticsResponse = ApiResponse<StoreAnalyticsSummary>;

// Generic error codes
export const API_ERROR_CODES = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // Business Logic
  LIMIT_EXCEEDED: 'LIMIT_EXCEEDED',
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  FEATURE_NOT_AVAILABLE: 'FEATURE_NOT_AVAILABLE',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];
