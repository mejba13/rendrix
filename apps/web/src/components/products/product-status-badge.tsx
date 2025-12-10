'use client';

import { Badge } from '@/components/ui/badge';
import type { ProductStatus, ProductVisibility } from '@rendrix/types';

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const variants: Record<ProductStatus, { variant: 'success' | 'secondary' | 'ghost'; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    draft: { variant: 'secondary', label: 'Draft' },
    archived: { variant: 'ghost', label: 'Archived' },
  };

  const { variant, label } = variants[status];

  return <Badge variant={variant}>{label}</Badge>;
}

interface ProductVisibilityBadgeProps {
  visibility: ProductVisibility;
}

export function ProductVisibilityBadge({ visibility }: ProductVisibilityBadgeProps) {
  const variants: Record<ProductVisibility, { variant: 'info' | 'secondary' | 'warning'; label: string }> = {
    visible: { variant: 'info', label: 'Visible' },
    hidden: { variant: 'secondary', label: 'Hidden' },
    featured: { variant: 'warning', label: 'Featured' },
  };

  const { variant, label } = variants[visibility];

  return <Badge variant={variant}>{label}</Badge>;
}

interface StockBadgeProps {
  quantity: number;
  trackInventory: boolean;
}

export function StockBadge({ quantity, trackInventory }: StockBadgeProps) {
  if (!trackInventory) {
    return <span className="text-sm text-muted-foreground">Not tracked</span>;
  }

  if (quantity === 0) {
    return <Badge variant="destructive">Out of stock</Badge>;
  }

  if (quantity <= 5) {
    return <Badge variant="warning">Low stock ({quantity})</Badge>;
  }

  return <span className="text-sm font-medium">{quantity} in stock</span>;
}
