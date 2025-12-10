'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  Eye,
  Mail,
  Trash2,
  UserCheck,
  UserX,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { CustomerListItem } from '@/hooks/use-customers';
import { formatCurrency, formatRelativeTime, formatFullName } from '@rendrix/utils';

interface CustomerColumnsProps {
  onDelete: (customerId: string) => void;
  currency?: string;
}

export function createCustomerColumns({
  onDelete,
  currency = 'USD',
}: CustomerColumnsProps): ColumnDef<CustomerListItem>[] {
  return [
    {
      id: 'customer',
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
      cell: ({ row }) => {
        const customer = row.original;
        const name = formatFullName(customer.firstName, customer.lastName);
        const initials = name
          ? name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
          : customer.email[0].toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-[180px]">
              <Link
                href={`/dashboard/customers/${customer.id}`}
                className="font-medium text-primary hover:underline"
              >
                {name || 'Anonymous'}
              </Link>
              <span className="text-sm text-muted-foreground truncate">
                {customer.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'marketing',
      accessorKey: 'acceptsMarketing',
      header: 'Marketing',
      cell: ({ row }) => {
        const accepts = row.original.acceptsMarketing;
        return accepts ? (
          <Badge variant="success" className="gap-1">
            <UserCheck className="h-3 w-3" />
            Subscribed
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <UserX className="h-3 w-3" />
            Not subscribed
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        if (value === 'all') return true;
        return row.original.acceptsMarketing === (value === 'true');
      },
    },
    {
      accessorKey: 'totalOrders',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Orders" />,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.totalOrders}</span>
      ),
    },
    {
      accessorKey: 'totalSpent',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total Spent" />,
      cell: ({ row }) => (
        <span className="font-semibold">
          {formatCurrency(row.original.totalSpent, currency)}
        </span>
      ),
    },
    {
      id: 'tags',
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => {
        const tags = row.original.tags;
        if (!tags || tags.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="ghost" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="ghost" className="text-xs">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatRelativeTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const customer = row.original;

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
                <Link href={`/dashboard/customers/${customer.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.location.href = `mailto:${customer.email}`}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(customer.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
