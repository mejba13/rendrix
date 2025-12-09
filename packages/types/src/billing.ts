import type { AuditableEntity, ID } from './common';

// Subscription Plans
export type PlanSlug = 'free' | 'pro' | 'premium' | 'enterprise';
export type BillingInterval = 'monthly' | 'yearly';
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

export interface Plan extends AuditableEntity {
  name: string;
  slug: PlanSlug;
  description: string | null;
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
  priceMonthly: number | null;
  priceYearly: number | null;
  features: PlanFeatures;
  limits: PlanLimits;
  isActive: boolean;
  sortOrder: number;
}

export interface PlanFeatures {
  basicThemes: boolean;
  premiumThemes: boolean;
  allThemes: boolean;
  seoTools: boolean;
  advancedSeo: boolean;
  marketingSuite: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
  prioritySupport: boolean;
  dedicatedSupport: boolean;
  customIntegrations: boolean;
  sla: boolean;
}

export interface PlanLimits {
  maxStores: number | null; // null = unlimited
  maxProducts: number | null;
  maxBandwidthGb: number | null;
  maxTeamMembers: number | null;
  maxCustomDomains: number | null;
}

// Subscription
export interface Subscription extends AuditableEntity {
  organizationId: ID;
  planId: ID;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAt: Date | null;
  canceledAt: Date | null;
  trialEndsAt: Date | null;
  metadata: Record<string, unknown>;
  plan?: Plan;
}

// Usage tracking
export interface UsageMetrics {
  organizationId: ID;
  periodStart: Date;
  periodEnd: Date;
  storesCount: number;
  productsCount: number;
  ordersCount: number;
  bandwidthBytes: number;
  apiCalls: number;
}

// Billing portal
export interface BillingPortalSession {
  url: string;
}

// Checkout
export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface CreateCheckoutParams {
  planSlug: PlanSlug;
  billingInterval: BillingInterval;
  successUrl: string;
  cancelUrl: string;
}

// Invoices
export interface Invoice {
  id: string;
  number: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  amountDue: number;
  amountPaid: number;
  currency: string;
  createdAt: Date;
  dueDate: Date | null;
  paidAt: Date | null;
  invoicePdf: string | null;
  hostedInvoiceUrl: string | null;
}

// Payment Methods
export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  isDefault: boolean;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}
