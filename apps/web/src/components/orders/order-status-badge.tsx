'use client';

import type { OrderStatus, PaymentStatus, FulfillmentStatus } from '@rendrix/types';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export function OrderStatusBadge({ status, size = 'sm' }: OrderStatusBadgeProps) {
  const config: Record<OrderStatus, { bg: string; text: string; dot: string; label: string }> = {
    pending: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
      label: 'Pending'
    },
    confirmed: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      dot: 'bg-blue-400',
      label: 'Confirmed'
    },
    processing: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      dot: 'bg-purple-400 animate-pulse',
      label: 'Processing'
    },
    shipped: {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      dot: 'bg-cyan-400',
      label: 'Shipped'
    },
    delivered: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      label: 'Delivered'
    },
    cancelled: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      dot: 'bg-red-400',
      label: 'Cancelled'
    },
    refunded: {
      bg: 'bg-white/[0.06]',
      text: 'text-white/50',
      dot: 'bg-white/40',
      label: 'Refunded'
    },
  };

  const statusConfig = config[status] || {
    bg: 'bg-white/[0.06]',
    text: 'text-white/50',
    dot: 'bg-white/40',
    label: status || 'Unknown'
  };
  const { bg, text, dot, label } = statusConfig;

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      bg,
      text,
      size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
      {label}
    </span>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'sm' | 'md';
}

export function PaymentStatusBadge({ status, size = 'sm' }: PaymentStatusBadgeProps) {
  const config: Record<PaymentStatus, { bg: string; text: string; dot: string; label: string }> = {
    pending: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
      label: 'Pending'
    },
    authorized: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      dot: 'bg-blue-400',
      label: 'Authorized'
    },
    paid: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      label: 'Paid'
    },
    partially_refunded: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      dot: 'bg-orange-400',
      label: 'Partial Refund'
    },
    refunded: {
      bg: 'bg-white/[0.06]',
      text: 'text-white/50',
      dot: 'bg-white/40',
      label: 'Refunded'
    },
    failed: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      dot: 'bg-red-400',
      label: 'Failed'
    },
  };

  const statusConfig = config[status] || {
    bg: 'bg-white/[0.06]',
    text: 'text-white/50',
    dot: 'bg-white/40',
    label: status || 'Unknown'
  };
  const { bg, text, dot, label } = statusConfig;

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      bg,
      text,
      size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
      {label}
    </span>
  );
}

interface FulfillmentStatusBadgeProps {
  status: FulfillmentStatus;
  size?: 'sm' | 'md';
}

export function FulfillmentStatusBadge({ status, size = 'sm' }: FulfillmentStatusBadgeProps) {
  const config: Record<FulfillmentStatus, { bg: string; text: string; dot: string; label: string }> = {
    unfulfilled: {
      bg: 'bg-white/[0.06]',
      text: 'text-white/50',
      dot: 'bg-white/40',
      label: 'Unfulfilled'
    },
    partially_fulfilled: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      dot: 'bg-amber-400 animate-pulse',
      label: 'Partial'
    },
    fulfilled: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      label: 'Fulfilled'
    },
    returned: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      dot: 'bg-purple-400',
      label: 'Returned'
    },
  };

  const statusConfig = config[status] || {
    bg: 'bg-white/[0.06]',
    text: 'text-white/50',
    dot: 'bg-white/40',
    label: status || 'Unknown'
  };
  const { bg, text, dot, label } = statusConfig;

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium',
      bg,
      text,
      size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
      {label}
    </span>
  );
}
