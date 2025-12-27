'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Minus, Plus, ShoppingBag, ChevronLeft, Truck, RotateCcw, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart';
import { formatPrice, getDiscountPercentage, cn } from '@/lib/utils';
import { ProductCard } from '@/components/products/product-card';
import { useStore } from '@/lib/store-context';
import { getProduct, getProducts, type Product, type ProductVariant } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { store, isLoading: storeLoading } = useStore();
  const { addItem, setStoreId } = useCartStore();

  const [product, setProduct] = useState<(Product & { longDescription?: string }) | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product when store is available
  useEffect(() => {
    async function fetchProduct() {
      if (!store?.id || !slug) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getProduct(store.id, slug);

        if (response.success && response.data) {
          setProduct(response.data);

          // Set first variant as selected if available
          if (response.data.variants?.length > 0) {
            setSelectedVariant(response.data.variants[0]);
          }

          // Set store ID in cart for multi-tenant support
          setStoreId(store.id);

          // Fetch related products
          const relatedResponse = await getProducts(store.id, { limit: 4 });
          if (relatedResponse.success && relatedResponse.data) {
            // Filter out current product and limit to 4
            setRelatedProducts(
              relatedResponse.data
                .filter((p) => p.id !== response.data.id)
                .slice(0, 4)
            );
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [store?.id, slug, setStoreId]);

  // Show loading state
  if (storeLoading || loading) {
    return (
      <div className="container-wide py-8">
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="container-wide py-8">
        <nav className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to products
          </Link>
        </nav>
        <div className="rounded-lg border border-dashed p-12 text-center">
          <h2 className="text-xl font-semibold">Product Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            {error || 'The product you are looking for does not exist.'}
          </p>
          <Button asChild className="mt-4">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? getDiscountPercentage(product.compareAtPrice!, product.price)
    : 0;

  const currentPrice = selectedVariant?.price || product.price;
  const currentQuantity = selectedVariant?.quantity ?? product.quantity;
  const isOutOfStock = currentQuantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: selectedVariant
        ? `${product.name} - ${selectedVariant.name}`
        : product.name,
      price: currentPrice,
      image: product.images?.[0],
      maxQuantity: currentQuantity,
      quantity,
    });

    setQuantity(1);
  };

  return (
    <div className="container-wide py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to products
        </Link>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            {product.images?.[selectedImageIndex] ? (
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ShoppingBag className="h-24 w-24 text-muted-foreground/20" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {hasDiscount && (
                <Badge variant="destructive">-{discountPercent}% OFF</Badge>
              )}
              {isOutOfStock && <Badge variant="secondary">Out of Stock</Badge>}
            </div>
          </div>

          {/* Thumbnail gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, i) => (
                <button
                  key={i}
                  className={cn(
                    'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2',
                    i === selectedImageIndex
                      ? 'border-primary'
                      : 'border-transparent'
                  )}
                  onClick={() => setSelectedImageIndex(i)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product details */}
        <div className="mt-8 lg:mt-0">
          {/* Category */}
          {product.categories?.[0] && (
            <Link
              href={`/products?category=${product.categories[0].name.toLowerCase()}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {product.categories[0].name}
            </Link>
          )}

          {/* Title */}
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">
            <p className="text-2xl font-bold">{formatPrice(currentPrice)}</p>
            {hasDiscount && (
              <p className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!)}
              </p>
            )}
          </div>

          {/* Short description */}
          <p className="mt-4 text-muted-foreground">{product.description}</p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium">Size</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className={cn(
                      'min-w-[3rem] rounded-md border px-3 py-2 text-sm font-medium',
                      variant.quantity <= 0
                        ? 'cursor-not-allowed border-muted text-muted-foreground line-through'
                        : selectedVariant?.id === variant.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input hover:border-primary'
                    )}
                    onClick={() =>
                      variant.quantity > 0 && setSelectedVariant(variant)
                    }
                    disabled={variant.quantity <= 0}
                  >
                    {variant.options?.size || variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="text-sm font-medium">Quantity</h3>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center rounded-md border">
                <button
                  className="p-2 hover:bg-accent disabled:opacity-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  className="p-2 hover:bg-accent disabled:opacity-50"
                  onClick={() =>
                    setQuantity(Math.min(currentQuantity, quantity + 1))
                  }
                  disabled={quantity >= currentQuantity}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {currentQuantity} available
              </span>
            </div>
          </div>

          {/* Add to cart */}
          <div className="mt-8">
            <Button
              size="lg"
              className="w-full"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-8">
            <div className="text-center">
              <Truck className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-xs font-medium">Free Shipping</p>
              <p className="text-xs text-muted-foreground">Orders $100+</p>
            </div>
            <div className="text-center">
              <RotateCcw className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-xs font-medium">Easy Returns</p>
              <p className="text-xs text-muted-foreground">30 days</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-xs font-medium">Secure</p>
              <p className="text-xs text-muted-foreground">Checkout</p>
            </div>
          </div>

          {/* Long description */}
          {product.longDescription && (
            <div className="mt-8 border-t pt-8">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <div
                className="prose prose-sm mt-4 max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: product.longDescription }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t pt-16">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
