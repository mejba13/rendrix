import Link from 'next/link';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  // In production, order details would come from URL params or API
  const orderNumber = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  return (
    <div className="container-wide py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="mt-6 text-2xl font-bold">Thank you for your order!</h1>
        <p className="mt-2 text-muted-foreground">
          Your order has been confirmed and will be shipped soon.
        </p>

        <div className="mt-8 rounded-lg border bg-muted/50 p-6">
          <p className="text-sm text-muted-foreground">Order number</p>
          <p className="mt-1 text-xl font-semibold">{orderNumber}</p>
        </div>

        <div className="mt-8 space-y-4 text-left">
          <div className="flex items-start gap-4 rounded-lg border p-4">
            <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Confirmation email sent</p>
              <p className="text-sm text-muted-foreground">
                We've sent you an email with your order details and tracking
                information.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-lg border p-4">
            <Package className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Shipping updates</p>
              <p className="text-sm text-muted-foreground">
                You'll receive shipping updates via email as your order makes
                its way to you.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/account/orders">
              View Order
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
