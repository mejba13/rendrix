'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Truck, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, clearCart } =
    useCartStore();

  const subtotal = getSubtotal();
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + shipping;
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-[var(--theme-background)]">
        <div className="container-theme py-20">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--theme-muted)]">
              <ShoppingBag className="h-10 w-10 text-[var(--theme-secondary)]" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-semibold text-[var(--theme-foreground)]">Your cart is empty</h1>
            <p className="mt-3 text-lg text-[var(--theme-secondary)]">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button
              asChild
              size="lg"
              className="theme-button mt-8 bg-[var(--theme-primary)] px-8 text-white hover:opacity-90"
            >
              <Link href="/products">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--theme-background)]">
      {/* Header */}
      <div className="border-b border-[var(--theme-muted)]">
        <div className="container-theme py-12 sm:py-16">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.15em] text-[var(--theme-secondary)]">
            Shopping
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-foreground)] sm:text-4xl">
            Your Cart
          </h1>
          <p className="mt-2 text-[var(--theme-secondary)]">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
      </div>

      <div className="container-theme py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          {/* Cart items */}
          <div className="lg:col-span-7">
            <div className="divide-y divide-[var(--theme-muted)] border-y border-[var(--theme-muted)]">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || 'default'}`}
                  className="flex gap-6 py-8"
                >
                  {/* Image */}
                  <div className="theme-image relative h-28 w-28 flex-shrink-0 overflow-hidden bg-[var(--theme-muted)] sm:h-36 sm:w-36">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 112px, 144px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-3xl font-light text-[var(--theme-secondary)]/30">
                          {item.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-[var(--theme-foreground)]">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--theme-secondary)]">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-[var(--theme-foreground)]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <div className="inline-flex items-center border border-[var(--theme-muted)]">
                        <button
                          type="button"
                          className="p-2.5 text-[var(--theme-secondary)] transition-colors hover:bg-[var(--theme-muted)] hover:text-[var(--theme-foreground)] disabled:opacity-50"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.variantId
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center text-sm font-medium text-[var(--theme-foreground)]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="p-2.5 text-[var(--theme-secondary)] transition-colors hover:bg-[var(--theme-muted)] hover:text-[var(--theme-foreground)] disabled:opacity-50"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.variantId
                            )
                          }
                          disabled={
                            item.maxQuantity !== undefined &&
                            item.quantity >= item.maxQuantity
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-sm text-[var(--theme-secondary)] transition-colors hover:text-red-500"
                        onClick={() => removeItem(item.productId, item.variantId)}
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart actions */}
            <div className="mt-6 flex items-center justify-between">
              <Link
                href="/products"
                className="text-sm font-medium text-[var(--theme-foreground)] underline-offset-4 transition-colors hover:text-[var(--theme-primary)] hover:underline"
              >
                Continue Shopping
              </Link>
              <button
                className="text-sm text-[var(--theme-secondary)] underline-offset-4 transition-colors hover:text-[var(--theme-foreground)] hover:underline"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-12 lg:col-span-5 lg:mt-0">
            <div className="sticky top-24 rounded-sm border border-[var(--theme-muted)] bg-[var(--theme-muted)]/20 p-8">
              <h2 className="text-lg font-semibold text-[var(--theme-foreground)]">Order Summary</h2>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--theme-secondary)]">Subtotal</span>
                  <span className="font-medium text-[var(--theme-foreground)]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--theme-secondary)]">Shipping</span>
                  <span className="font-medium text-[var(--theme-foreground)]">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="flex items-center gap-2 rounded-sm bg-[var(--theme-muted)] px-3 py-2">
                    <Truck className="h-4 w-4 text-[var(--theme-secondary)]" />
                    <p className="text-xs text-[var(--theme-secondary)]">
                      Free shipping on orders over $100
                    </p>
                  </div>
                )}

                {/* Coupon code */}
                <div className="border-t border-[var(--theme-muted)] pt-6">
                  <label className="mb-2 block text-sm font-medium text-[var(--theme-foreground)]">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      className="flex-1 border-[var(--theme-muted)] bg-white text-[var(--theme-foreground)] placeholder:text-[var(--theme-secondary)]/50"
                    />
                    <Button
                      variant="outline"
                      className="theme-button border-[var(--theme-muted)] text-[var(--theme-foreground)] hover:bg-[var(--theme-muted)]"
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                <div className="border-t border-[var(--theme-muted)] pt-6">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-[var(--theme-foreground)]">Total</span>
                    <span className="text-lg font-semibold text-[var(--theme-foreground)]">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--theme-secondary)]">
                    Taxes calculated at checkout
                  </p>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="theme-button mt-8 w-full bg-[var(--theme-primary)] py-6 text-base font-medium text-white hover:opacity-90"
              >
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {/* Trust badges */}
              <div className="mt-8 flex items-center justify-center gap-6 border-t border-[var(--theme-muted)] pt-6">
                <div className="flex items-center gap-1.5 text-xs text-[var(--theme-secondary)]">
                  <Lock className="h-3.5 w-3.5" />
                  Secure Checkout
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--theme-secondary)]">
                  <Shield className="h-3.5 w-3.5" />
                  SSL Encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
