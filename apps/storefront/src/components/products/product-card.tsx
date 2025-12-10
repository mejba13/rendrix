'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import type { Product } from '@/lib/api';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCartStore();

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? getDiscountPercentage(product.compareAtPrice!, product.price)
    : 0;
  const isOutOfStock = product.quantity <= 0;
  const mainImage = product.images?.[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      maxQuantity: product.quantity,
    });
  };

  return (
    <article className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercent}%
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="secondary" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Quick add button */}
          {!isOutOfStock && product.variants.length === 0 && (
            <div className="absolute inset-x-2 bottom-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                className="w-full"
                size="sm"
                onClick={handleQuickAdd}
              >
                Quick Add
              </Button>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="mt-3">
          {product.categories?.[0] && (
            <p className="text-xs text-muted-foreground">
              {product.categories[0].name}
            </p>
          )}
          <h3 className="mt-1 text-sm font-medium line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm font-semibold">
              {formatPrice(product.price)}
            </p>
            {hasDiscount && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
