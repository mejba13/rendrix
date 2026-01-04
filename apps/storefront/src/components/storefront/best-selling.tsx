'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BestSellingProps {
  products: Product[];
  categories: Category[];
  title?: string;
  className?: string;
}

export function BestSelling({
  products,
  categories,
  title = 'Best selling',
  className,
}: BestSellingProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter products by category (match by name since product categories don't have slug)
  const filteredProducts = activeCategory
    ? products.filter((p) =>
        p.categories?.some((c) => c.name.toLowerCase().replace(/\s+/g, '-') === activeCategory)
      )
    : products;

  const displayProducts = filteredProducts.slice(0, 6);
  const displayCategories = categories.slice(0, 5);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className={cn('py-12 lg:py-16 bg-[var(--theme-surface)] theme-transition', className)}>
      <div className="container-theme">
        {/* Header with Category Tabs */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--theme-foreground)] sm:text-3xl lg:text-4xl">
            {title}
          </h2>

          <div className="flex items-center gap-6">
            {/* Category Tabs - Desktop */}
            <div className="hidden items-center gap-1 rounded-full border border-[var(--theme-border)] bg-[var(--theme-background)] p-1 sm:flex">
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                  !activeCategory
                    ? 'bg-[var(--theme-foreground)] text-[var(--theme-background)]'
                    : 'text-[var(--theme-secondary)] hover:text-[var(--theme-foreground)]'
                )}
              >
                All
              </button>
              {displayCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.slug)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                    activeCategory === category.slug
                      ? 'bg-[var(--theme-foreground)] text-[var(--theme-background)]'
                      : 'text-[var(--theme-secondary)] hover:text-[var(--theme-foreground)]'
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <Link
              href="/products?sort=popular"
              className="group hidden items-center gap-2 text-sm font-semibold text-[var(--theme-foreground)] transition-colors hover:text-[var(--theme-accent)] sm:flex"
            >
              See All Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Mobile Category Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:hidden">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all',
              !activeCategory
                ? 'bg-[var(--theme-foreground)] text-[var(--theme-background)]'
                : 'bg-[var(--theme-background)] text-[var(--theme-secondary)]'
            )}
          >
            All
          </button>
          {displayCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.slug)}
              className={cn(
                'flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all',
                activeCategory === category.slug
                  ? 'bg-[var(--theme-foreground)] text-[var(--theme-background)]'
                  : 'bg-[var(--theme-background)] text-[var(--theme-secondary)]'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products - Horizontal scroll with images */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide lg:gap-6">
            {displayProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group relative flex-shrink-0"
              >
                <div className="relative aspect-[4/5] w-[200px] overflow-hidden rounded-[var(--theme-radius-lg)] bg-[var(--theme-muted)] lg:w-[240px]">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="240px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-[var(--theme-secondary)]/30" />
                    </div>
                  )}

                  {/* Overlay with Shop button */}
                  <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="mb-4 rounded-full bg-white px-6 py-2 text-sm font-semibold text-[var(--theme-foreground)]">
                      Shop Now
                    </span>
                  </div>

                  {/* Sale Badge */}
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="absolute left-3 top-3 rounded-[var(--theme-radius-sm)] bg-[var(--theme-error)] px-2 py-1 text-xs font-bold text-white">
                      {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <Link
          href="/products?sort=popular"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--theme-foreground)] transition-colors hover:text-[var(--theme-accent)] sm:hidden"
        >
          See All Products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
