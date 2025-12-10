'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Minus, Plus, ShoppingBag, ChevronLeft, Check, Truck, RotateCcw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart';
import { formatPrice, getDiscountPercentage, cn } from '@/lib/utils';
import { ProductCard } from '@/components/products/product-card';
import type { Product, ProductVariant } from '@/lib/api';

// Demo product data - in production this would come from the API
const demoProduct: Product & { longDescription?: string } = {
  id: '1',
  name: 'Classic White T-Shirt',
  slug: 'classic-white-tshirt',
  description: 'A comfortable everyday essential made from premium organic cotton.',
  longDescription: `
    <p>Introducing our Classic White T-Shirt - the perfect foundation for any outfit. Crafted from 100% organic cotton, this tee offers unparalleled comfort and breathability.</p>
    <h3>Features</h3>
    <ul>
      <li>100% organic cotton for softness and sustainability</li>
      <li>Pre-shrunk fabric for consistent fit</li>
      <li>Reinforced stitching for durability</li>
      <li>Classic crew neck design</li>
      <li>Relaxed fit for everyday comfort</li>
    </ul>
    <h3>Care Instructions</h3>
    <p>Machine wash cold with like colors. Tumble dry low. Do not bleach.</p>
  `,
  price: 29.99,
  compareAtPrice: 39.99,
  images: [],
  status: 'active',
  quantity: 100,
  sku: 'TSHIRT-001',
  categories: [{ id: 'cat-1', name: 'Clothing' }],
  variants: [
    { id: 'v1', name: 'Small', sku: 'TSHIRT-001-S', price: 29.99, quantity: 30, options: { size: 'S' } },
    { id: 'v2', name: 'Medium', sku: 'TSHIRT-001-M', price: 29.99, quantity: 40, options: { size: 'M' } },
    { id: 'v3', name: 'Large', sku: 'TSHIRT-001-L', price: 29.99, quantity: 20, options: { size: 'L' } },
    { id: 'v4', name: 'X-Large', sku: 'TSHIRT-001-XL', price: 29.99, quantity: 10, options: { size: 'XL' } },
  ],
};

const relatedProducts: Product[] = [
  {
    id: '2',
    name: 'Premium Leather Wallet',
    slug: 'premium-leather-wallet',
    description: 'Handcrafted genuine leather',
    price: 79.99,
    compareAtPrice: 99.99,
    images: [],
    status: 'active',
    quantity: 50,
    sku: 'WALLET-001',
    categories: [{ id: 'cat-2', name: 'Accessories' }],
    variants: [],
  },
  {
    id: '5',
    name: 'Running Sneakers',
    slug: 'running-sneakers',
    description: 'Lightweight and responsive',
    price: 129.99,
    compareAtPrice: null,
    images: [],
    status: 'active',
    quantity: 40,
    sku: 'SNEAKERS-001',
    categories: [{ id: 'cat-1', name: 'Clothing' }],
    variants: [],
  },
  {
    id: '6',
    name: 'Stainless Steel Watch',
    slug: 'stainless-steel-watch',
    description: 'Timeless elegance',
    price: 199.99,
    compareAtPrice: 249.99,
    images: [],
    status: 'active',
    quantity: 20,
    sku: 'WATCH-001',
    categories: [{ id: 'cat-2', name: 'Accessories' }],
    variants: [],
  },
  {
    id: '8',
    name: 'Moisturizing Lip Balm',
    slug: 'moisturizing-lip-balm',
    description: 'All-day hydration',
    price: 12.99,
    compareAtPrice: null,
    images: [],
    status: 'active',
    quantity: 200,
    sku: 'LIPBALM-001',
    categories: [{ id: 'cat-4', name: 'Beauty' }],
    variants: [],
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCartStore();

  // In production, fetch product by slug
  const product = demoProduct;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
          {product.variants.length > 0 && (
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
                    {variant.options.size || variant.name}
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
      <section className="mt-16 border-t pt-16">
        <h2 className="text-2xl font-bold">You May Also Like</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
