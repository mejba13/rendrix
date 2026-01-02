import { ProductCard } from './product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/api';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  className?: string;
}

export function ProductGrid({ products, loading, className }: ProductGridProps) {
  if (loading) {
    return (
      <div className={cn('product-grid', className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-sm border border-dashed border-[var(--theme-muted)] py-16 text-center">
        <p className="text-lg font-medium text-[var(--theme-foreground)]">
          No products found
        </p>
        <p className="mt-2 text-sm text-[var(--theme-secondary)]">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className={cn('product-grid', className)}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 4} index={i} />
      ))}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="theme-image aspect-[3/4] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}
