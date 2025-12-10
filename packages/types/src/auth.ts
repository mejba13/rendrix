import type { User, Organization, MemberRole } from './entities';

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthSession {
  user: User;
  organizations: OrganizationContext[];
  currentOrganization: OrganizationContext | null;
  tokens: AuthTokens;
}

export interface OrganizationContext {
  id: string;
  name: string;
  slug: string;
  role: MemberRole;
  permissions: string[];
}

// JWT Payload
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  orgId?: string; // Current organization ID
  role?: MemberRole;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
  iat: number;
  exp: number;
}

// Password Reset
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  password: string;
}

// Email Verification
export interface EmailVerification {
  token: string;
}

// Two-Factor Authentication
export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface TwoFactorVerify {
  code: string;
}

// OAuth
export type OAuthProvider = 'google' | 'github' | 'facebook' | 'apple';

export interface OAuthProfile {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

// Permissions
export const PERMISSIONS = {
  // Organization
  ORGANIZATION_READ: 'organization:read',
  ORGANIZATION_UPDATE: 'organization:update',
  ORGANIZATION_DELETE: 'organization:delete',
  ORGANIZATION_MEMBERS_MANAGE: 'organization:members:manage',
  ORGANIZATION_BILLING_MANAGE: 'organization:billing:manage',

  // Stores
  STORES_CREATE: 'stores:create',
  STORES_READ: 'stores:read',
  STORES_UPDATE: 'stores:update',
  STORES_DELETE: 'stores:delete',
  STORES_SETTINGS_MANAGE: 'stores:settings:manage',

  // Products (also applies to categories)
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_READ: 'products:read',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',

  // Orders
  ORDERS_READ: 'orders:read',
  ORDERS_UPDATE: 'orders:update',
  ORDERS_FULFILL: 'orders:fulfill',
  ORDERS_REFUND: 'orders:refund',

  // Customers
  CUSTOMERS_CREATE: 'customers:create',
  CUSTOMERS_READ: 'customers:read',
  CUSTOMERS_UPDATE: 'customers:update',
  CUSTOMERS_DELETE: 'customers:delete',

  // Coupons
  COUPONS_CREATE: 'coupons:create',
  COUPONS_READ: 'coupons:read',
  COUPONS_UPDATE: 'coupons:update',
  COUPONS_DELETE: 'coupons:delete',

  // Media
  MEDIA_CREATE: 'media:create',
  MEDIA_READ: 'media:read',
  MEDIA_UPDATE: 'media:update',
  MEDIA_DELETE: 'media:delete',

  // Analytics
  ANALYTICS_READ: 'analytics:read',

  // Settings
  SETTINGS_MANAGE: 'settings:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<MemberRole, Permission[]> = {
  owner: Object.values(PERMISSIONS),
  admin: Object.values(PERMISSIONS),
  manager: [
    PERMISSIONS.ORGANIZATION_READ,
    PERMISSIONS.STORES_READ,
    PERMISSIONS.STORES_UPDATE,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.PRODUCTS_DELETE,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.ORDERS_UPDATE,
    PERMISSIONS.ORDERS_FULFILL,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.CUSTOMERS_UPDATE,
    PERMISSIONS.COUPONS_CREATE,
    PERMISSIONS.COUPONS_READ,
    PERMISSIONS.COUPONS_UPDATE,
    PERMISSIONS.COUPONS_DELETE,
    PERMISSIONS.MEDIA_CREATE,
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.MEDIA_UPDATE,
    PERMISSIONS.MEDIA_DELETE,
    PERMISSIONS.ANALYTICS_READ,
  ],
  staff: [
    PERMISSIONS.STORES_READ,
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.PRODUCTS_UPDATE,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.ORDERS_UPDATE,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.COUPONS_READ,
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.MEDIA_CREATE,
  ],
  viewer: [
    PERMISSIONS.STORES_READ,
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.COUPONS_READ,
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.ANALYTICS_READ,
  ],
};
