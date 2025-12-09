import type { AuditableEntity, ID, Status, Json } from './common';

// User entity
export interface User extends AuditableEntity {
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  emailVerifiedAt: Date | null;
  twoFactorEnabled: boolean;
}

export interface UserWithPassword extends User {
  passwordHash: string | null;
}

// Organization entity (Tenant)
export interface Organization extends AuditableEntity {
  name: string;
  slug: string;
  ownerId: ID;
  subscriptionId: ID | null;
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  timezone?: string;
  dateFormat?: string;
  currency?: string;
  logo?: string;
}

// Organization Membership
export type MemberRole = 'owner' | 'admin' | 'manager' | 'staff' | 'viewer';

export interface OrganizationMember {
  id: ID;
  organizationId: ID;
  userId: ID;
  role: MemberRole;
  permissions: string[];
  invitedAt: Date | null;
  joinedAt: Date;
  user?: User;
}

export interface OrganizationInvite extends AuditableEntity {
  organizationId: ID;
  email: string;
  role: MemberRole;
  token: string;
  expiresAt: Date;
  acceptedAt: Date | null;
}

// Store entity
export type StoreStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type StoreIndustry =
  | 'toys'
  | 'kitchen'
  | 'nail_care'
  | 'home_decor'
  | 'garments'
  | 'beauty'
  | 'sports'
  | 'gadgets'
  | 'home_appliances'
  | 'general';

export interface Store extends AuditableEntity {
  organizationId: ID;
  name: string;
  slug: string;
  subdomain: string | null;
  customDomain: string | null;
  domainVerified: boolean;
  industry: StoreIndustry;
  description: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  themeId: ID | null;
  themeSettings: Json;
  seoSettings: StoreSeoSettings;
  settings: StoreSettings;
  status: StoreStatus;
}

export interface StoreSettings {
  currency: string;
  timezone: string;
  weightUnit: 'kg' | 'lb';
  dimensionUnit: 'cm' | 'in';
  taxesIncluded: boolean;
  enableReviews: boolean;
  enableWishlist: boolean;
  maintenanceMode: boolean;
}

export interface StoreSeoSettings {
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  googleAnalyticsId: string | null;
  facebookPixelId: string | null;
}

// Theme entity
export interface Theme extends AuditableEntity {
  name: string;
  slug: string;
  description: string | null;
  previewUrl: string | null;
  thumbnailUrl: string | null;
  version: string;
  author: string | null;
  industries: StoreIndustry[];
  features: string[];
  isPremium: boolean;
  price: number | null;
  settingsSchema: Json;
  isActive: boolean;
}
