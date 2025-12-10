'use client';

import { Badge } from '@/components/ui/badge';
import type { OrderStatus, PaymentStatus, FulfillmentStatus } from '@rendrix/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config: Record<OrderStatus, { variant: 'success' | 'secondary' | 'warning' | 'destructive' | 'info' | 'ghost'; label: string }> = {
    pending: { variant: 'warning', label: 'Pending' },
    confirmed: { variant: 'info', label: 'Confirmed' },
    processing: { variant: 'info', label: 'Processing' },
    shipped: { variant: 'success', label: 'Shipped' },
    delivered: { variant: 'success', label: 'Delivered' },
    cancelled: { variant: 'destructive', label: 'Cancelled' },
    refunded: { variant: 'ghost', label: 'Refunded' },
  };

  const { variant, label } = config[status];

  return <Badge variant={variant}>{label}</Badge>;
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config: Record<PaymentStatus, { variant: 'success' | 'secondary' | 'warning' | 'destructive' | 'info' | 'ghost'; label: string }> = {
    pending: { variant: 'warning', label: 'Pending' },
    authorized: { variant: 'info', label: 'Authorized' },
    paid: { variant: 'success', label: 'Paid' },
    partially_refunded: { variant: 'warning', label: 'Partial Refund' },
    refunded: { variant: 'ghost', label: 'Refunded' },
    failed: { variant: 'destructive', label: 'Failed' },
  };

  const { variant, label } = config[status];

  return <Badge variant={variant}>{label}</Badge>;
}

interface FulfillmentStatusBadgeProps {
  status: FulfillmentStatus;
}

export function FulfillmentStatusBadge({ status }: FulfillmentStatusBadgeProps) {
  const config: Record<FulfillmentStatus, { variant: 'success' | 'secondary' | 'warning' | 'destructive' | 'info' | 'ghost'; label: string }> = {
    unfulfilled: { variant: 'secondary', label: 'Unfulfilled' },
    partially_fulfilled: { variant: 'warning', label: 'Partial' },
    fulfilled: { variant: 'success', label: 'Fulfilled' },
    returned: { variant: 'ghost', label: 'Returned' },
  };

  const { variant, label } = config[status];

  return <Badge variant={variant}>{label}</Badge>;
}
