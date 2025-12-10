'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, Package, Eye, Pencil, Trash2, Copy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import { ProductStatusBadge, StockBadge } from './product-status-badge';
import type { ProductListItem } from '@/hooks/use-products';
import { formatCurrency } from '@rendrix/utils';

interface ProductColumnsProps {
  onDelete: (productId: string) => void;
  onDuplicate: (productId: string) => void;
  currency?: string;
}

export function createProductColumns({
  onDelete,
  onDuplicate,
  currency = 'USD',
}: ProductColumnsProps): ColumnDef<ProductListItem>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'product',
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Product" />,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="h-12 w-12 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image.url}
                  alt={product.image.altText || product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium line-clamp-1">{product.name}</span>
              {product.sku && (
                <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => <ProductStatusBadge status={row.original.status} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
      cell: ({ row }) => {
        const price = row.original.price;
        const compareAtPrice = row.original.compareAtPrice;

        if (price === null) {
          return <span className="text-muted-foreground">-</span>;
        }

        return (
          <div className="flex flex-col">
            <span className="font-medium">{formatCurrency(price, currency)}</span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(compareAtPrice, currency)}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Inventory" />,
      cell: ({ row }) => (
        <StockBadge
          quantity={row.original.quantity}
          trackInventory={row.original.trackInventory}
        />
      ),
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => {
        const typeLabels: Record<string, string> = {
          simple: 'Simple',
          variable: 'Variable',
          grouped: 'Grouped',
          digital: 'Digital',
          subscription: 'Subscription',
        };
        return (
          <span className="text-sm capitalize">
            {typeLabels[row.original.type] || row.original.type}
          </span>
        );
      },
    },
    {
      accessorKey: 'categories',
      header: 'Categories',
      cell: ({ row }) => {
        const categories = row.original.categories;
        if (!categories || categories.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs"
              >
                {cat.name}
              </span>
            ))}
            {categories.length > 2 && (
              <span className="text-xs text-muted-foreground">+{categories.length - 2}</span>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original;

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
                <Link href={`/dashboard/products/${product.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/products/${product.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(product.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(product.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
