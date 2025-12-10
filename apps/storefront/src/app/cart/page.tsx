'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
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
      <div className="container-wide py-16">
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild className="mt-8">
            <Link href="/products">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide py-8">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>
      <p className="mt-1 text-muted-foreground">
        {items.length} item{items.length !== 1 ? 's' : ''} in your cart
      </p>

      <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Cart items */}
        <div className="lg:col-span-8">
          <div className="divide-y border-y">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId || 'default'}`}
                className="flex gap-4 py-6"
              >
                {/* Image */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted sm:h-32 sm:w-32">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 96px, 128px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-md border p-1.5 hover:bg-accent disabled:opacity-50"
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
                      <span className="w-10 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="rounded-md border p-1.5 hover:bg-accent disabled:opacity-50"
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
                      className="text-sm text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.productId, item.variantId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clear cart */}
          <div className="mt-4 flex justify-between">
            <Button variant="ghost" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button variant="ghost" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order summary */}
        <div className="mt-8 lg:col-span-4 lg:mt-0">
          <div className="rounded-lg border bg-muted/50 p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders over $100
                </p>
              )}

              {/* Coupon code */}
              <div className="pt-4">
                <label className="text-sm font-medium">Coupon Code</label>
                <div className="mt-2 flex gap-2">
                  <Input placeholder="Enter code" className="flex-1" />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Taxes calculated at checkout
                </p>
              </div>
            </div>

            <Button asChild size="lg" className="mt-6 w-full">
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            {/* Trust badges */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>Secure Checkout</span>
              <span>|</span>
              <span>SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
