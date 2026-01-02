import type { ID, Json } from './common';

// Timestamp type for date fields from API
export type Timestamp = Date | string;

// ==================== THEME MANIFEST ====================

export interface ThemeAuthor {
  name: string;
  email?: string;
  url?: string;
}

export interface ThemeManifest {
  name: string;
  version: string;
  author: ThemeAuthor;
  description: string;
  industries: string[];
  features: string[];
  minRendrixVersion?: string;
  settings: {
    schema: ThemeSettingsSchema;
    defaults: Record<string, unknown>;
  };
  sections: ThemeSectionDefinition[];
  preview: {
    desktop: string;
    tablet?: string;
    mobile?: string;
  };
}

// ==================== THEME SETTINGS SCHEMA ====================

export type ThemeSettingType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'range'
  | 'color'
  | 'select'
  | 'checkbox'
  | 'image'
  | 'url'
  | 'font_picker';

export interface ThemeSettingOption {
  value: string;
  label: string;
}

export interface ThemeSettingField {
  type: ThemeSettingType;
  id: string;
  label: string;
  default?: unknown;
  info?: string;
  options?: ThemeSettingOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
  required?: boolean;
}

export interface ThemeSettingsSection {
  name: string;
  settings: ThemeSettingField[];
}

export interface ThemeSettingsSchema {
  sections: ThemeSettingsSection[];
}

// ==================== THEME SECTIONS ====================

export type ThemeSectionType =
  | 'header'
  | 'footer'
  | 'hero'
  | 'banner'
  | 'products'
  | 'collection'
  | 'testimonials'
  | 'newsletter'
  | 'contact'
  | 'gallery'
  | 'text'
  | 'image'
  | 'video'
  | 'custom';

export interface ThemeSectionSchema {
  settings: ThemeSettingField[];
  blocks?: ThemeBlockSchema[];
  maxBlocks?: number;
}

export interface ThemeBlockSchema {
  type: string;
  name: string;
  settings: ThemeSettingField[];
  limit?: number;
}

export interface ThemeSectionDefinition {
  name: string;
  slug: string;
  type: ThemeSectionType;
  component: string;
  schema: ThemeSectionSchema;
  defaults: Record<string, unknown>;
  limit?: number;
  presets?: string[];
}

// ==================== THEME VERSION ====================

export interface ThemeVersion {
  id: ID;
  themeId: ID;
  version: string;
  changelog: string | null;
  packageUrl: string | null;
  settingsSchema: Json;
  sections: Json;
  isLatest: boolean;
  publishedAt: Timestamp;
  createdAt: Timestamp;
}

// ==================== THEME SECTION ====================

export interface ThemeSection {
  id: ID;
  themeId: ID;
  name: string;
  slug: string;
  type: ThemeSectionType;
  component: string;
  schema: Json;
  defaults: Json;
  previewUrl: string | null;
  sortOrder: number;
  createdAt: Timestamp;
}

// ==================== THEME ASSET ====================

export type ThemeAssetType = 'css' | 'js' | 'image' | 'font' | 'json';

export interface ThemeAsset {
  id: ID;
  themeId: ID;
  path: string;
  type: ThemeAssetType;
  url: string;
  size: number;
  checksum: string;
  createdAt: Timestamp;
}

// ==================== THEME PACKAGE ====================

export interface ThemePackage {
  id: ID;
  organizationId: ID | null;
  themeId: ID;
  filename: string;
  fileUrl: string;
  fileSize: number;
  checksum: string;
  uploadedBy: ID;
  createdAt: Timestamp;
}

// ==================== STORE THEME BACKUP ====================

export type ThemeBackupReason = 'manual' | 'auto_upgrade' | 'rollback' | 'theme_change';

export interface StoreThemeBackup {
  id: ID;
  storeId: ID;
  themeId: ID;
  themeVersion: string;
  themeSettings: Json;
  customCss: string | null;
  sections: Json;
  reason: ThemeBackupReason | null;
  createdAt: Timestamp;
}

// ==================== THEME UPLOAD ====================

export type ThemeUploadStatus = 'success' | 'validation_error' | 'processing' | 'failed';

export interface ThemeUploadResult {
  themeId: string;
  version: string;
  status: ThemeUploadStatus;
  errors?: string[];
  warnings?: string[];
}

export interface ThemeValidationResult {
  valid: boolean;
  errors: ThemeValidationError[];
  warnings: ThemeValidationWarning[];
  manifest?: ThemeManifest;
}

export interface ThemeValidationError {
  code: string;
  message: string;
  path?: string;
}

export interface ThemeValidationWarning {
  code: string;
  message: string;
  path?: string;
}

// ==================== STORE SECTION CONFIG ====================

export interface StoreSectionConfig {
  id: string;
  sectionSlug: string;
  enabled: boolean;
  settings: Record<string, unknown>;
  blocks?: StoreSectionBlock[];
  sortOrder: number;
}

export interface StoreSectionBlock {
  id: string;
  type: string;
  settings: Record<string, unknown>;
  sortOrder: number;
}

// ==================== API INPUT/OUTPUT TYPES ====================

export interface ThemeUploadInput {
  file: File | Blob;
  name?: string;
  description?: string;
}

export interface ThemeApplyInput {
  themeId: ID;
  version?: string;
  settings?: Record<string, unknown>;
}

export interface ThemeSettingsUpdateInput {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    muted?: string;
  };
  typography?: {
    headingFont?: string;
    bodyFont?: string;
    baseFontSize?: number;
    headingWeight?: string;
    bodyWeight?: string;
  };
  layout?: {
    containerWidth?: 'narrow' | 'medium' | 'wide' | 'full';
    headerStyle?: 'minimal' | 'centered' | 'expanded';
    footerStyle?: 'minimal' | 'standard' | 'expanded';
    productGridColumns?: number;
  };
  components?: {
    buttonStyle?: 'rounded' | 'pill' | 'sharp';
    cardStyle?: 'flat' | 'raised' | 'bordered';
    imageStyle?: 'square' | 'rounded' | 'circle';
  };
  effects?: {
    enableAnimations?: boolean;
    enableHoverEffects?: boolean;
    enableParallax?: boolean;
  };
  customCss?: string;
}

export interface ThemeCustomCssUpdateInput {
  customCss: string;
}

export interface StoreSectionsUpdateInput {
  sections: StoreSectionConfig[];
}

export interface StoreSectionReorderInput {
  sectionIds: string[];
}

export interface ThemeBackupCreateInput {
  reason?: ThemeBackupReason;
}

export interface ThemeExportOutput {
  themeId: ID;
  themeName: string;
  themeVersion: string;
  themeSettings: Json;
  customCss: string | null;
  sections: StoreSectionConfig[];
  exportedAt: Timestamp;
}

export interface ThemeImportInput {
  themeSettings?: Json;
  customCss?: string;
  sections?: StoreSectionConfig[];
}

// ==================== THEME LIST FILTERS ====================

export interface ThemeListParams {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  isPremium?: boolean;
  type?: 'platform' | 'custom' | 'all';
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ThemeVersionListParams {
  page?: number;
  limit?: number;
}

export interface ThemeAssetListParams {
  type?: ThemeAssetType;
}

export interface ThemeBackupListParams {
  page?: number;
  limit?: number;
}
