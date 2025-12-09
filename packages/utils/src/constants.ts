// Store industries
export const STORE_INDUSTRIES = [
  { value: 'toys', label: 'Toys & Games' },
  { value: 'kitchen', label: 'Kitchen & Dining' },
  { value: 'nail_care', label: 'Nail Care & Beauty' },
  { value: 'home_decor', label: 'Home Decor' },
  { value: 'garments', label: 'Fashion & Apparel' },
  { value: 'beauty', label: 'Beauty & Cosmetics' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'gadgets', label: 'Electronics & Gadgets' },
  { value: 'home_appliances', label: 'Home Appliances' },
  { value: 'general', label: 'General Store' },
] as const;

// Order statuses
export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'confirmed', label: 'Confirmed', color: 'blue' },
  { value: 'processing', label: 'Processing', color: 'indigo' },
  { value: 'shipped', label: 'Shipped', color: 'purple' },
  { value: 'delivered', label: 'Delivered', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
  { value: 'refunded', label: 'Refunded', color: 'gray' },
] as const;

// Payment statuses
export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'authorized', label: 'Authorized', color: 'blue' },
  { value: 'paid', label: 'Paid', color: 'green' },
  { value: 'partially_refunded', label: 'Partially Refunded', color: 'orange' },
  { value: 'refunded', label: 'Refunded', color: 'gray' },
  { value: 'failed', label: 'Failed', color: 'red' },
] as const;

// Fulfillment statuses
export const FULFILLMENT_STATUSES = [
  { value: 'unfulfilled', label: 'Unfulfilled', color: 'red' },
  { value: 'partially_fulfilled', label: 'Partially Fulfilled', color: 'yellow' },
  { value: 'fulfilled', label: 'Fulfilled', color: 'green' },
  { value: 'returned', label: 'Returned', color: 'gray' },
] as const;

// Product statuses
export const PRODUCT_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'archived', label: 'Archived', color: 'red' },
] as const;

// Product types
export const PRODUCT_TYPES = [
  { value: 'simple', label: 'Simple Product' },
  { value: 'variable', label: 'Variable Product' },
  { value: 'grouped', label: 'Grouped Product' },
  { value: 'digital', label: 'Digital Product' },
  { value: 'subscription', label: 'Subscription Product' },
] as const;

// Member roles
export const MEMBER_ROLES = [
  { value: 'owner', label: 'Owner', description: 'Full access to all features' },
  { value: 'admin', label: 'Admin', description: 'Manage organization settings and members' },
  { value: 'manager', label: 'Manager', description: 'Manage stores, products, and orders' },
  { value: 'staff', label: 'Staff', description: 'Process orders and manage inventory' },
  { value: 'viewer', label: 'Viewer', description: 'View-only access to data' },
] as const;

// Currencies
export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
  { value: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { value: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { value: 'BDT', label: 'Bangladeshi Taka', symbol: '৳' },
] as const;

// Timezones (common ones)
export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'America/Toronto', label: 'Eastern Time (Canada)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Asia/Shanghai', label: 'Shanghai' },
  { value: 'Asia/Kolkata', label: 'Mumbai, Kolkata' },
  { value: 'Asia/Dhaka', label: 'Dhaka' },
  { value: 'Australia/Sydney', label: 'Sydney' },
] as const;

// Weight units
export const WEIGHT_UNITS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'oz', label: 'Ounces (oz)' },
] as const;

// Dimension units
export const DIMENSION_UNITS = [
  { value: 'cm', label: 'Centimeters (cm)' },
  { value: 'in', label: 'Inches (in)' },
  { value: 'm', label: 'Meters (m)' },
  { value: 'ft', label: 'Feet (ft)' },
] as const;

// Coupon types
export const COUPON_TYPES = [
  { value: 'percentage', label: 'Percentage Discount' },
  { value: 'fixed', label: 'Fixed Amount' },
  { value: 'free_shipping', label: 'Free Shipping' },
  { value: 'bogo', label: 'Buy One Get One' },
] as const;

// Date formats
export const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
] as const;

// Subscription plan limits
export const PLAN_LIMITS = {
  free: {
    maxStores: 1,
    maxProducts: 50,
    maxBandwidthGb: 1,
    maxTeamMembers: 1,
    maxCustomDomains: 0,
  },
  pro: {
    maxStores: 3,
    maxProducts: 500,
    maxBandwidthGb: 10,
    maxTeamMembers: 5,
    maxCustomDomains: 3,
  },
  premium: {
    maxStores: 10,
    maxProducts: 5000,
    maxBandwidthGb: 100,
    maxTeamMembers: 15,
    maxCustomDomains: 10,
  },
  enterprise: {
    maxStores: null,
    maxProducts: null,
    maxBandwidthGb: null,
    maxTeamMembers: null,
    maxCustomDomains: null,
  },
} as const;
