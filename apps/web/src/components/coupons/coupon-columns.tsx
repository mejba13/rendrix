'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  Eye,
  Copy,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import type { CouponListItem } from '@/hooks/use-coupons';
import type { CouponType } from '@rendrix/types';
import { formatCurrency, formatDate } from '@rendrix/utils';

interface CouponColumnsProps {
  onDelete: (couponId: string) => void;
  onToggle: (couponId: string, isActive: boolean) => void;
  onCopy: (code: string) => void;
  currency?: string;
}

// Type badge configuration
const couponTypeConfig: Record<
  CouponType,
  { label: string; variant: 'success' | 'info' | 'warning' | 'secondary' }
> = {
  percentage: { label: 'Percentage', variant: 'info' },
  fixed: { label: 'Fixed Amount', variant: 'success' },
  free_shipping: { label: 'Free Shipping', variant: 'warning' },
  bogo: { label: 'Buy One Get One', variant: 'secondary' },
};

export function CouponTypeBadge({ type }: { type: CouponType }) {
  const config = couponTypeConfig[type] || { label: type || 'Unknown', variant: 'secondary' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function CouponStatusBadge({ isActive, expiresAt }: { isActive: boolean; expiresAt: string | null }) {
  if (!isActive) {
    return <Badge variant="secondary">Inactive</Badge>;
  }

  if (expiresAt && new Date(expiresAt) < new Date()) {
    return <Badge variant="destructive">Expired</Badge>;
  }

  return <Badge variant="success">Active</Badge>;
}

export function formatCouponValue(type: CouponType, value: number | null, currency: string = 'USD'): string {
  if (value === null) return '-';

  switch (type) {
    case 'percentage':
      return `${value}%`;
    case 'fixed':
      return formatCurrency(value, currency);
    case 'free_shipping':
      return 'Free';
    case 'bogo':
      return 'BOGO';
    default:
      return String(value);
  }
}

export function createCouponColumns({
  onDelete,
  onToggle,
  onCopy,
  currency = 'USD',
}: CouponColumnsProps): ColumnDef<CouponListItem>[] {
  return [
    {
      id: 'code',
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
      cell: ({ row }) => {
        const coupon = row.original;
        return (
          <div className="flex flex-col">
            <Link
              href={`/dashboard/coupons/${coupon.id}`}
              className="font-mono font-semibold text-primary hover:underline"
            >
              {coupon.code}
            </Link>
            <span className="text-xs text-muted-foreground">
              Created {formatDate(coupon.createdAt)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => <CouponTypeBadge type={row.original.type} />,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      id: 'discount',
      header: 'Discount',
      cell: ({ row }) => {
        const coupon = row.original;
        return (
          <span className="font-semibold">
            {formatCouponValue(coupon.type, coupon.value, currency)}
          </span>
        );
      },
    },
    {
      id: 'usage',
      header: 'Usage',
      cell: ({ row }) => {
        const coupon = row.original;
        const limit = coupon.usageLimit;
        const count = coupon.usageCount;

        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {count} {limit ? `/ ${limit}` : ''}
            </span>
            {limit && (
              <div className="w-20 h-1.5 bg-muted rounded-full mt-1">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min((count / limit) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'minimum',
      header: 'Min. Order',
      cell: ({ row }) => {
        const min = row.original.minimumOrder;
        return min ? (
          <span>{formatCurrency(min, currency)}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      id: 'validity',
      header: 'Validity',
      cell: ({ row }) => {
        const coupon = row.original;
        const startsAt = coupon.startsAt ? new Date(coupon.startsAt) : null;
        const expiresAt = coupon.expiresAt ? new Date(coupon.expiresAt) : null;
        const now = new Date();

        if (!startsAt && !expiresAt) {
          return <span className="text-muted-foreground">No limits</span>;
        }

        if (startsAt && startsAt > now) {
          return (
            <span className="text-sm text-amber-600">
              Starts {formatDate(coupon.startsAt!)}
            </span>
          );
        }

        if (expiresAt) {
          const isExpired = expiresAt < now;
          return (
            <span className={`text-sm ${isExpired ? 'text-destructive' : ''}`}>
              {isExpired ? 'Expired' : 'Expires'} {formatDate(coupon.expiresAt!)}
            </span>
          );
        }

        return <span className="text-muted-foreground">No expiry</span>;
      },
    },
    {
      id: 'status',
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <CouponStatusBadge
          isActive={row.original.isActive}
          expiresAt={row.original.expiresAt}
        />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const coupon = row.original;

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
                <Link href={`/dashboard/coupons/${coupon.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCopy(coupon.code)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggle(coupon.id, !coupon.isActive)}>
                {coupon.isActive ? (
                  <>
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <ToggleRight className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(coupon.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete coupon
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
