'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShoppingBag, CreditCard, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/store/cart';
import { formatPrice, cn } from '@/lib/utils';

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional(),
  sameAsShipping: z.boolean().default(true),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

type PaymentMethod = 'stripe' | 'paypal';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'US',
      sameAsShipping: true,
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    try {
      // In production, this would:
      // 1. Create an order via API
      // 2. Create a payment intent/order
      // 3. Process payment
      // 4. Redirect to success page

      console.log('Checkout data:', data);
      console.log('Payment method:', paymentMethod);
      console.log('Cart items:', items);

      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart and redirect
      clearCart();
      router.push('/checkout/success');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-wide py-16">
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Add some items to your cart before checking out.
          </p>
          <Button asChild className="mt-8">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container-wide py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to cart
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Form section */}
            <div className="lg:col-span-7">
              {/* Contact */}
              <section className="rounded-lg border bg-background p-6">
                <h2 className="text-lg font-semibold">Contact Information</h2>
                <div className="mt-4">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    {...register('email')}
                    className="mt-1"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </section>

              {/* Shipping address */}
              <section className="mt-6 rounded-lg border bg-background p-6">
                <h2 className="text-lg font-semibold">Shipping Address</h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input {...register('firstName')} className="mt-1" />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input {...register('lastName')} className="mt-1" />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    {...register('address1')}
                    className="mt-1"
                    placeholder="Street address"
                  />
                  {errors.address1 && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.address1.message}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium">
                    Apartment, suite, etc. (optional)
                  </label>
                  <Input {...register('address2')} className="mt-1" />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">City</label>
                    <Input {...register('city')} className="mt-1" />
                    {errors.city && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">State</label>
                    <Input {...register('state')} className="mt-1" />
                    {errors.state && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Postal Code</label>
                    <Input {...register('postalCode')} className="mt-1" />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-destructive">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium">Phone (optional)</label>
                  <Input
                    type="tel"
                    {...register('phone')}
                    className="mt-1"
                    placeholder="For delivery updates"
                  />
                </div>
              </section>

              {/* Payment method */}
              <section className="mt-6 rounded-lg border bg-background p-6">
                <h2 className="text-lg font-semibold">Payment Method</h2>

                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors',
                      paymentMethod === 'stripe'
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    )}
                    onClick={() => setPaymentMethod('stripe')}
                  >
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full border-2',
                        paymentMethod === 'stripe'
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      )}
                    >
                      {paymentMethod === 'stripe' && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Credit / Debit Card</p>
                      <p className="text-sm text-muted-foreground">
                        Visa, Mastercard, American Express
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors',
                      paymentMethod === 'paypal'
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    )}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full border-2',
                        paymentMethod === 'paypal'
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      )}
                    >
                      {paymentMethod === 'paypal' && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" />
                    </svg>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">
                        Pay with your PayPal account
                      </p>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'stripe' && (
                  <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      Card details will be collected securely on the next step.
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* Order summary */}
            <div className="mt-8 lg:col-span-5 lg:mt-0">
              <div className="sticky top-24 rounded-lg border bg-background p-6">
                <h2 className="text-lg font-semibold">Order Summary</h2>

                {/* Items */}
                <ul className="mt-4 divide-y">
                  {items.map((item) => (
                    <li
                      key={`${item.productId}-${item.variantId || 'default'}`}
                      className="flex gap-3 py-3"
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-muted-foreground/50" />
                          </div>
                        )}
                        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Totals */}
                <div className="mt-4 space-y-2 border-t pt-4">
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
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  size="lg"
                  className="mt-6 w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : paymentMethod === 'stripe' ? (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Pay {formatPrice(total)}
                    </>
                  ) : (
                    'Continue with PayPal'
                  )}
                </Button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Your payment information is encrypted and secure.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
