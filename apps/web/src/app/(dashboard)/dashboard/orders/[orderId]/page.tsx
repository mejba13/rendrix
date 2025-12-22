'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Truck,
  XCircle,
  Package,
  CreditCard,
  User,
  MapPin,
  Clock,
  Copy,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useOrder, useCancelOrder, useUpdateOrder } from '@/hooks/use-orders';
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  FulfillmentStatusBadge,
} from '@/components/orders/order-status-badge';
import { formatCurrency, formatDate, formatFullName, formatAddress } from '@rendrix/utils';

export default function OrderDetailPage() {
  const params = useParams();
  void useRouter();
  const { toast } = useToast();
  const orderId = params.orderId as string;

  const { data: order, isLoading, error } = useOrder(orderId);
  const cancelOrder = useCancelOrder();
  void useUpdateOrder();

  const handleCancel = async () => {
    try {
      await cancelOrder.mutateAsync(orderId);
      toast({
        title: 'Order cancelled',
        description: 'The order has been cancelled and inventory restored.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber);
      toast({
        title: 'Copied',
        description: 'Order number copied to clipboard.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[200px]" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[150px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <Package className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Order not found</h2>
        <p className="text-muted-foreground">
          The order you're looking for doesn't exist or has been deleted.
        </p>
        <Button asChild>
          <Link href="/dashboard/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  const canCancel = !['cancelled', 'refunded', 'delivered'].includes(order.status);
  const canFulfill = order.fulfillmentStatus !== 'fulfilled' && order.status !== 'cancelled';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                Order #{order.orderNumber}
              </h1>
              <button
                onClick={handleCopyOrderNumber}
                className="p-1 hover:bg-muted rounded"
                title="Copy order number"
              >
                <Copy className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
              <FulfillmentStatusBadge status={order.fulfillmentStatus} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Placed on {formatDate(order.placedAt, { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canFulfill && (
            <Button asChild>
              <Link href={`/dashboard/orders/${orderId}/fulfill`}>
                <Truck className="mr-2 h-4 w-4" />
                Fulfill order
              </Link>
            </Button>
          )}
          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel order?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will cancel the order and restore all inventory. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep order</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Cancel order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
              <CardDescription>
                {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="h-16 w-16 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                      {item.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : item.variant?.imageUrl ? (
                        <img
                          src={item.variant.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      {item.sku && (
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      )}
                      {item.variant?.name && (
                        <p className="text-sm text-muted-foreground">{item.variant.name}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(item.price, order.currency)} &times; {item.quantity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.total, order.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.subtotal, order.currency)}</span>
                </div>
                {order.discountTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-emerald-600">
                      -{formatCurrency(order.discountTotal, order.currency)}
                    </span>
                  </div>
                )}
                {order.shippingTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatCurrency(order.shippingTotal, order.currency)}</span>
                  </div>
                )}
                {order.taxTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(order.taxTotal, order.currency)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.total, order.currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fulfillments */}
          {order.fulfillments && order.fulfillments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Fulfillments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.fulfillments.map((fulfillment) => (
                    <div key={fulfillment.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {fulfillment.status === 'delivered' ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          ) : fulfillment.status === 'shipped' ? (
                            <Truck className="h-5 w-5 text-blue-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                          )}
                          <span className="font-medium capitalize">{fulfillment.status}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {fulfillment.shippedAt &&
                            formatDate(fulfillment.shippedAt, { dateStyle: 'medium' })}
                        </span>
                      </div>
                      {fulfillment.trackingNumber && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Tracking:</span>
                          {fulfillment.trackingUrl ? (
                            <a
                              href={fulfillment.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              {fulfillment.trackingNumber}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span>{fulfillment.trackingNumber}</span>
                          )}
                        </div>
                      )}
                      {fulfillment.carrier && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Carrier: {fulfillment.carrier}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transactions */}
          {order.transactions && order.transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{tx.type}</span>
                          <Badge
                            variant={
                              tx.status === 'success'
                                ? 'success'
                                : tx.status === 'failed'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {tx.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tx.gateway} &bull; {formatDate(tx.createdAt, { dateStyle: 'medium' })}
                        </p>
                      </div>
                      <span className="font-medium">
                        {tx.type === 'refund' ? '-' : ''}
                        {formatCurrency(tx.amount, tx.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.customer ? (
                <div>
                  <p className="font-medium">
                    {formatFullName(order.customer.firstName, order.customer.lastName)}
                  </p>
                  <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                  {order.customer.phone && (
                    <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                  )}
                  <Button variant="link" className="px-0 h-auto mt-2" asChild>
                    <Link href={`/dashboard/customers/${order.customer.id}`}>
                      View customer profile
                    </Link>
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="font-medium">Guest</p>
                  <p className="text-sm text-muted-foreground">{order.email}</p>
                  {order.phone && (
                    <p className="text-sm text-muted-foreground">{order.phone}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Addresses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.shippingAddress && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Shipping Address
                  </h4>
                  <address className="text-sm not-italic whitespace-pre-line">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    {order.shippingAddress.company && (
                      <>
                        {'\n'}
                        {order.shippingAddress.company}
                      </>
                    )}
                    {'\n'}
                    {formatAddress(order.shippingAddress)}
                  </address>
                </div>
              )}
              {order.billingAddress && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Billing Address
                  </h4>
                  <address className="text-sm not-italic whitespace-pre-line">
                    {order.billingAddress.firstName} {order.billingAddress.lastName}
                    {order.billingAddress.company && (
                      <>
                        {'\n'}
                        {order.billingAddress.company}
                      </>
                    )}
                    {'\n'}
                    {formatAddress(order.billingAddress)}
                  </address>
                </div>
              )}
              {!order.shippingAddress && !order.billingAddress && (
                <p className="text-sm text-muted-foreground">No addresses provided.</p>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(order.createdAt, { dateStyle: 'medium' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placed</span>
                  <span>{formatDate(order.placedAt, { dateStyle: 'medium' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{formatDate(order.updatedAt, { dateStyle: 'medium' })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
