'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Minus, Plus, ChevronLeft, Truck, RotateCcw, Shield, Loader2, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [addedToCart, setAddedToCart] = useState(false);

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--theme-secondary)]" />
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="container-theme py-16">
        <nav className="mb-8">
          <Link
            href="/products"
            className="group inline-flex items-center text-sm text-[var(--theme-secondary)] transition-colors hover:text-[var(--theme-foreground)]"
          >
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to products
          </Link>
        </nav>
        <div className="mx-auto max-w-md rounded-sm border border-dashed border-[var(--theme-muted)] p-16 text-center">
          <h2 className="text-2xl font-semibold text-[var(--theme-foreground)]">Product Not Found</h2>
          <p className="mt-3 text-[var(--theme-secondary)]">
            {error || 'The product you are looking for does not exist.'}
          </p>
          <Button
            asChild
            className="theme-button mt-6 bg-[var(--theme-primary)] text-white hover:opacity-90"
          >
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

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    setQuantity(1);
  };

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $100',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day return policy',
    },
    {
      icon: Shield,
      title: 'Secure Checkout',
      description: 'Protected payments',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--theme-background)]">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--theme-muted)]">
        <div className="container-theme py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-[var(--theme-secondary)] transition-colors hover:text-[var(--theme-foreground)]"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-[var(--theme-secondary)]" />
            <Link
              href="/products"
              className="text-[var(--theme-secondary)] transition-colors hover:text-[var(--theme-foreground)]"
            >
              Products
            </Link>
            {product.categories?.[0] && (
              <>
                <ChevronRight className="h-3 w-3 text-[var(--theme-secondary)]" />
                <Link
                  href={`/products?category=${product.categories[0].name.toLowerCase()}`}
                  className="text-[var(--theme-secondary)] transition-colors hover:text-[var(--theme-foreground)]"
                >
                  {product.categories[0].name}
                </Link>
              </>
            )}
            <ChevronRight className="h-3 w-3 text-[var(--theme-secondary)]" />
            <span className="text-[var(--theme-foreground)]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-theme py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="theme-card relative aspect-[4/5] overflow-hidden bg-[var(--theme-muted)]">
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
                  <span className="text-8xl font-light text-[var(--theme-secondary)]/20">
                    {product.name.charAt(0)}
                  </span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {hasDiscount && (
                  <span className="rounded-sm bg-[var(--theme-primary)] px-3 py-1.5 text-sm font-medium text-white">
                    -{discountPercent}% OFF
                  </span>
                )}
                {isOutOfStock && (
                  <span className="rounded-sm bg-[var(--theme-secondary)] px-3 py-1.5 text-sm font-medium text-white">
                    Sold Out
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, i) => (
                  <button
                    key={i}
                    className={cn(
                      'theme-image relative h-24 w-24 flex-shrink-0 overflow-hidden transition-all duration-300',
                      i === selectedImageIndex
                        ? 'ring-2 ring-[var(--theme-primary)] ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                    )}
                    onClick={() => setSelectedImageIndex(i)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="mt-10 lg:mt-0">
            {/* Category */}
            {product.categories?.[0] && (
              <Link
                href={`/products?category=${product.categories[0].name.toLowerCase()}`}
                className="text-sm uppercase tracking-wider text-[var(--theme-secondary)] transition-colors hover:text-[var(--theme-primary)]"
              >
                {product.categories[0].name}
              </Link>
            )}

            {/* Title */}
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--theme-foreground)] sm:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <p className="text-3xl font-semibold text-[var(--theme-foreground)]">
                {formatPrice(currentPrice)}
              </p>
              {hasDiscount && (
                <p className="text-lg text-[var(--theme-secondary)] line-through">
                  {formatPrice(product.compareAtPrice!)}
                </p>
              )}
            </div>

            {/* Short description */}
            {product.description && (
              <p className="mt-6 text-lg leading-relaxed text-[var(--theme-secondary)]">
                {product.description}
              </p>
            )}

            <div className="mt-8 space-y-6 border-t border-[var(--theme-muted)] pt-8">
              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-[var(--theme-foreground)]">
                    Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        className={cn(
                          'theme-button min-w-[3.5rem] border px-4 py-2.5 text-sm font-medium transition-all duration-300',
                          variant.quantity <= 0
                            ? 'cursor-not-allowed border-[var(--theme-muted)] text-[var(--theme-secondary)] line-through opacity-50'
                            : selectedVariant?.id === variant.id
                            ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)] text-white'
                            : 'border-[var(--theme-muted)] text-[var(--theme-foreground)] hover:border-[var(--theme-primary)]'
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
              <div>
                <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-[var(--theme-foreground)]">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center border border-[var(--theme-muted)]">
                    <button
                      className="p-3 text-[var(--theme-secondary)] transition-colors hover:bg-[var(--theme-muted)] hover:text-[var(--theme-foreground)] disabled:opacity-50"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-[var(--theme-foreground)]">{quantity}</span>
                    <button
                      className="p-3 text-[var(--theme-secondary)] transition-colors hover:bg-[var(--theme-muted)] hover:text-[var(--theme-foreground)] disabled:opacity-50"
                      onClick={() =>
                        setQuantity(Math.min(currentQuantity, quantity + 1))
                      }
                      disabled={quantity >= currentQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-[var(--theme-secondary)]">
                    {currentQuantity} available
                  </span>
                </div>
              </div>

              {/* Add to cart */}
              <Button
                size="lg"
                className={cn(
                  'theme-button w-full py-6 text-base font-medium transition-all duration-300',
                  addedToCart
                    ? 'bg-green-600 text-white hover:bg-green-600'
                    : 'bg-[var(--theme-primary)] text-white hover:opacity-90'
                )}
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                {isOutOfStock ? (
                  'Sold Out'
                ) : addedToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="h-5 w-5" />
                    Added to Cart
                  </span>
                ) : (
                  'Add to Cart'
                )}
              </Button>
            </div>

            {/* Features */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-[var(--theme-muted)] pt-10">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-muted)]">
                    <feature.icon className="h-5 w-5 text-[var(--theme-primary)]" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-medium text-[var(--theme-foreground)]">
                    {feature.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--theme-secondary)]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Long description */}
            {product.longDescription && (
              <div className="mt-10 border-t border-[var(--theme-muted)] pt-10">
                <h3 className="text-lg font-semibold text-[var(--theme-foreground)]">
                  Product Details
                </h3>
                <div
                  className="mt-4 text-[var(--theme-secondary)] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.longDescription }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-[var(--theme-muted)] pt-16">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.15em] text-[var(--theme-secondary)]">
                  You May Also Like
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--theme-foreground)] sm:text-3xl">
                  Related Products
                </h2>
              </div>
              <Link
                href="/products"
                className="group hidden items-center gap-2 text-sm font-medium text-[var(--theme-foreground)] transition-colors hover:text-[var(--theme-primary)] sm:flex"
              >
                View All
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="product-grid">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
