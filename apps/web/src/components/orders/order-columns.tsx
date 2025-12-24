'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Package, Truck, XCircle, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import { OrderStatusBadge, PaymentStatusBadge, FulfillmentStatusBadge } from './order-status-badge';
import type { OrderListItem } from '@/hooks/use-orders';
import { formatCurrency, formatRelativeTime, formatFullName } from '@rendrix/utils';

interface OrderColumnsProps {
  onFulfill: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  currency?: string;
}

export function createOrderColumns({
  onFulfill,
  onCancel,
  currency = 'USD',
}: OrderColumnsProps): ColumnDef<OrderListItem>[] {
  return [
    {
      id: 'order',
      accessorKey: 'orderNumber',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex flex-col gap-0.5">
            <Link
              href={`/dashboard/orders/${order.id}`}
              className="font-semibold text-white hover:text-amber-400 transition-colors"
            >
              #{order.orderNumber}
            </Link>
            <span className="flex items-center gap-1 text-xs text-white/40">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(order.placedAt)}
            </span>
          </div>
        );
      },
    },
    {
      id: 'customer',
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
      cell: ({ row }) => {
        const order = row.original;
        const customerName = order.customer
          ? formatFullName(order.customer.firstName, order.customer.lastName)
          : null;

        return (
          <div className="flex items-center gap-3 min-w-[180px]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white/40" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-white truncate">{customerName || 'Guest'}</span>
              <span className="text-xs text-white/40 truncate">{order.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} />,
    },
    {
      accessorKey: 'fulfillmentStatus',
      header: 'Fulfillment',
      cell: ({ row }) => <FulfillmentStatusBadge status={row.original.fulfillmentStatus} />,
    },
    {
      id: 'items',
      header: 'Items',
      cell: ({ row }) => {
        const count = row.original.itemsCount;
        return (
          <div className="flex items-center gap-2 text-white/60">
            <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center">
              <Package className="h-3.5 w-3.5 text-white/50" />
            </div>
            <span className="text-sm">
              {count} item{count !== 1 ? 's' : ''}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'total',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
      cell: ({ row }) => (
        <span className="font-semibold text-white tabular-nums">
          {formatCurrency(row.original.total, row.original.currency || currency)}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-[#1a1a1a] border-white/10">
              <DropdownMenuLabel className="text-white/60 text-xs font-medium">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem asChild className="text-white/80 hover:text-white focus:text-white focus:bg-white/[0.06]">
                <Link href={`/dashboard/orders/${order.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </Link>
              </DropdownMenuItem>
              {order.fulfillmentStatus !== 'fulfilled' && order.status !== 'cancelled' && (
                <DropdownMenuItem
                  onClick={() => onFulfill(order.id)}
                  className="text-white/80 hover:text-white focus:text-white focus:bg-white/[0.06]"
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Fulfill order
                </DropdownMenuItem>
              )}
              {!['cancelled', 'refunded', 'delivered'].includes(order.status) && (
                <>
                  <DropdownMenuSeparator className="bg-white/[0.06]" />
                  <DropdownMenuItem
                    onClick={() => onCancel(order.id)}
                    className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel order
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
