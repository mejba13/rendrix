import type { Store, StoreIndustry, StoreSettings, StoreSeoSettings } from './entities';
import type { ID, PaginationParams } from './common';

// Store Creation
export interface CreateStoreInput {
  name: string;
  slug?: string;
  industry: StoreIndustry;
  description?: string;
  templateId?: ID;
}

export interface UpdateStoreInput {
  name?: string;
  description?: string;
  logoUrl?: string;
  faviconUrl?: string;
  status?: 'active' | 'inactive';
}

// Store Settings
export interface UpdateStoreSettingsInput extends Partial<StoreSettings> {}

export interface UpdateStoreSeoInput extends Partial<StoreSeoSettings> {}

// Domain Management
export interface CustomDomainInput {
  domain: string;
}

export interface DomainVerification {
  domain: string;
  verified: boolean;
  dnsRecords: DnsRecord[];
  sslStatus: 'pending' | 'active' | 'failed';
}

export interface DnsRecord {
  type: 'CNAME' | 'A' | 'TXT';
  name: string;
  value: string;
  verified: boolean;
}

// Theme Management
export interface ApplyThemeInput {
  themeId: ID;
  settings?: Record<string, unknown>;
}

export interface ThemeSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: number;
  };
  layout: {
    headerStyle: 'default' | 'centered' | 'minimal';
    footerStyle: 'default' | 'minimal' | 'expanded';
    productGridColumns: number;
  };
  customCss?: string;
}

// Store Queries
export interface ListStoresParams extends PaginationParams {
  status?: 'active' | 'inactive' | 'suspended';
  industry?: StoreIndustry;
  search?: string;
}

// Store Context (for dashboard)
export interface StoreContext {
  id: ID;
  name: string;
  slug: string;
  industry: StoreIndustry;
  logoUrl: string | null;
  faviconUrl: string | null;
  status: string;
  domain: string; // subdomain or custom domain
}

// Store Analytics Summary
export interface StoreAnalyticsSummary {
  storeId: ID;
  period: 'today' | 'week' | 'month' | 'year';
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalProducts: number;
  totalCustomers: number;
  conversionRate: number;
}

// Store Clone
export interface CloneStoreInput {
  name: string;
  slug?: string;
  includeProducts?: boolean;
  includeCategories?: boolean;
  includePages?: boolean;
  includeSettings?: boolean;
}

// Store Template
export interface StoreTemplate {
  id: ID;
  name: string;
  description: string;
  industry: StoreIndustry;
  previewUrl: string;
  thumbnailUrl: string;
  features: string[];
}
