'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye, Package, Truck, XCircle } from 'lucide-react';
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
          <div className="flex flex-col">
            <Link
              href={`/dashboard/orders/${order.id}`}
              className="font-medium text-primary hover:underline"
            >
              #{order.orderNumber}
            </Link>
            <span className="text-xs text-muted-foreground">
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
          <div className="flex flex-col min-w-[150px]">
            <span className="font-medium">{customerName || 'Guest'}</span>
            <span className="text-sm text-muted-foreground truncate">{order.email}</span>
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
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>
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
        <span className="font-medium">
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
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/orders/${order.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </Link>
              </DropdownMenuItem>
              {order.fulfillmentStatus !== 'fulfilled' && order.status !== 'cancelled' && (
                <DropdownMenuItem onClick={() => onFulfill(order.id)}>
                  <Truck className="mr-2 h-4 w-4" />
                  Fulfill order
                </DropdownMenuItem>
              )}
              {!['cancelled', 'refunded', 'delivered'].includes(order.status) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onCancel(order.id)}
                    className="text-destructive focus:text-destructive"
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
