import type { AuditableEntity, ID, PaginationParams, Address, Money } from './common';
import type { Product, ProductVariant } from './product';

// Order Status
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'authorized' | 'paid' | 'partially_refunded' | 'refunded' | 'failed';
export type FulfillmentStatus = 'unfulfilled' | 'partially_fulfilled' | 'fulfilled' | 'returned';

// Order Entity
export interface Order extends AuditableEntity {
  storeId: ID;
  orderNumber: string;
  customerId: ID | null;
  email: string;
  phone: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  currency: string;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  billingAddress: Address | null;
  shippingAddress: Address | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  placedAt: Date;
  items?: OrderItem[];
  customer?: Customer;
  transactions?: OrderTransaction[];
  fulfillments?: Fulfillment[];
}

// Order Item
export interface OrderItem {
  id: ID;
  orderId: ID;
  productId: ID | null;
  variantId: ID | null;
  name: string;
  sku: string | null;
  quantity: number;
  price: number;
  total: number;
  metadata: Record<string, unknown>;
  product?: Product;
  variant?: ProductVariant;
}

// Order Transaction
export interface OrderTransaction {
  id: ID;
  orderId: ID;
  type: 'capture' | 'refund' | 'void';
  status: 'pending' | 'success' | 'failed';
  amount: number;
  currency: string;
  gatewayTransactionId: string | null;
  gateway: string;
  errorMessage: string | null;
  createdAt: Date;
}

// Fulfillment
export interface Fulfillment {
  id: ID;
  orderId: ID;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber: string | null;
  trackingUrl: string | null;
  carrier: string | null;
  items: FulfillmentItem[];
  shippedAt: Date | null;
  deliveredAt: Date | null;
  createdAt: Date;
}

export interface FulfillmentItem {
  orderItemId: ID;
  quantity: number;
}

// Customer
export interface Customer extends AuditableEntity {
  storeId: ID;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  acceptsMarketing: boolean;
  totalOrders: number;
  totalSpent: number;
  tags: string[];
  notes: string | null;
  metadata: Record<string, unknown>;
  addresses?: CustomerAddress[];
}

export interface CustomerAddress extends Address {
  id: ID;
  customerId: ID;
  isDefault: boolean;
}

// Order CRUD
export interface CreateOrderInput {
  customerId?: ID;
  email: string;
  phone?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  items: CreateOrderItemInput[];
  discountCode?: string;
  notes?: string;
}

export interface CreateOrderItemInput {
  productId?: ID;
  variantId?: ID;
  name: string;
  sku?: string;
  quantity: number;
  price: number;
}

export interface UpdateOrderInput {
  status?: OrderStatus;
  notes?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
}

// Order Queries
export interface ListOrdersParams extends PaginationParams {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  customerId?: ID;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minTotal?: number;
  maxTotal?: number;
}

// Fulfillment
export interface CreateFulfillmentInput {
  items: { orderItemId: ID; quantity: number }[];
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  notifyCustomer?: boolean;
}

// Refund
export interface CreateRefundInput {
  amount: number;
  reason?: string;
  restockItems?: boolean;
  items?: { orderItemId: ID; quantity: number }[];
  notifyCustomer?: boolean;
}

// Customer CRUD
export interface CreateCustomerInput {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
  tags?: string[];
  notes?: string;
}

export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {}

export interface ListCustomersParams extends PaginationParams {
  search?: string;
  acceptsMarketing?: boolean;
  tags?: string[];
  minOrders?: number;
  minSpent?: number;
}

// Coupon
export type CouponType = 'percentage' | 'fixed' | 'free_shipping' | 'bogo';

export interface Coupon extends AuditableEntity {
  storeId: ID;
  code: string;
  type: CouponType;
  value: number | null;
  minimumOrder: number | null;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  perCustomerLimit: number | null;
  applicableProducts: ID[];
  applicableCategories: ID[];
  startsAt: Date | null;
  expiresAt: Date | null;
  isActive: boolean;
}

export interface CreateCouponInput {
  code: string;
  type: CouponType;
  value?: number;
  minimumOrder?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  perCustomerLimit?: number;
  applicableProducts?: ID[];
  applicableCategories?: ID[];
  startsAt?: Date;
  expiresAt?: Date;
}

export interface UpdateCouponInput extends Partial<CreateCouponInput> {
  isActive?: boolean;
}
