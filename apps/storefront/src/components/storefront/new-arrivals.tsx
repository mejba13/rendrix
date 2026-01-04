'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/products/product-card';
import { SectionHeader } from './section-header';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/api';

interface NewArrivalsProps {
  products: Product[];
  title?: string;
  viewAllHref?: string;
  columns?: 4 | 5 | 6;
  className?: string;
}

export function NewArrivals({
  products,
  title = 'New arrivals',
  viewAllHref = '/products?sort=newest',
  columns = 5,
  className,
}: NewArrivalsProps) {
  const displayProducts = products.slice(0, columns * 2); // 2 rows

  if (products.length === 0) {
    return null;
  }

  const gridCols = {
    4: 'sm:grid-cols-2 lg:grid-cols-4',
    5: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <section className={cn('py-12 lg:py-16 bg-[var(--theme-background)] theme-transition', className)}>
      <div className="container-theme">
        <SectionHeader
          title={title}
          viewAllHref={viewAllHref}
          viewAllText="See All Products"
        />

        {/* Products Grid */}
        <div className={cn('grid gap-4 lg:gap-6', gridCols[columns])}>
          {displayProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              priority={index < 5}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <Link
          href={viewAllHref}
          className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--theme-foreground)] transition-colors hover:text-[var(--theme-accent)] sm:hidden"
        >
          See All Products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
