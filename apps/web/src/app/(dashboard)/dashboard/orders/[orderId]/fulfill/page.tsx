'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Truck, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useOrder, useFulfillOrder } from '@/hooks/use-orders';

const fulfillmentSchema = z.object({
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().url().optional().or(z.literal('')),
  carrier: z.string().optional(),
  notifyCustomer: z.boolean().default(true),
});

type FulfillmentFormData = z.infer<typeof fulfillmentSchema>;

export default function FulfillOrderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params.orderId as string;

  const { data: order, isLoading } = useOrder(orderId);
  const fulfillOrder = useFulfillOrder();
  const [selectedItems, setSelectedItems] = React.useState<Record<string, number>>({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FulfillmentFormData>({
    resolver: zodResolver(fulfillmentSchema),
    defaultValues: {
      trackingNumber: '',
      trackingUrl: '',
      carrier: '',
      notifyCustomer: true,
    },
  });

  // Initialize selected items when order loads
  React.useEffect(() => {
    if (order?.items) {
      const initialSelection: Record<string, number> = {};
      order.items.forEach((item) => {
        initialSelection[item.id] = item.quantity;
      });
      setSelectedItems(initialSelection);
    }
  }, [order]);

  const onSubmit = async (data: FulfillmentFormData) => {
    const items = Object.entries(selectedItems)
      .filter(([_, qty]) => qty > 0)
      .map(([orderItemId, quantity]) => ({ orderItemId, quantity }));

    if (items.length === 0) {
      toast({
        title: 'No items selected',
        description: 'Please select at least one item to fulfill.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await fulfillOrder.mutateAsync({
        orderId,
        data: {
          items,
          trackingNumber: data.trackingNumber || undefined,
          trackingUrl: data.trackingUrl || undefined,
          carrier: data.carrier || undefined,
          notifyCustomer: data.notifyCustomer,
        },
      });
      toast({
        title: 'Order fulfilled',
        description: 'The order has been marked as fulfilled.',
      });
      router.push(`/dashboard/orders/${orderId}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fulfill order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleItem = (itemId: string, maxQty: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === maxQty ? 0 : maxQty,
    }));
  };

  const updateItemQuantity = (itemId: string, quantity: number, maxQty: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: Math.min(Math.max(0, quantity), maxQty),
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Order not found.</p>
        <Button asChild>
          <Link href="/dashboard/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  if (order.fulfillmentStatus === 'fulfilled') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <Truck className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold">Order already fulfilled</h2>
        <p className="text-muted-foreground">This order has already been fulfilled.</p>
        <Button asChild>
          <Link href={`/dashboard/orders/${orderId}`}>View order</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/orders/${orderId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Fulfill Order</h1>
          <p className="text-muted-foreground mt-1">
            Order #{order.orderNumber}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Items to Fulfill */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Items to Fulfill
            </CardTitle>
            <CardDescription>
              Select the items and quantities to include in this shipment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg border"
                >
                  <Checkbox
                    checked={(selectedItems[item.id] || 0) > 0}
                    onCheckedChange={() => toggleItem(item.id, item.quantity)}
                  />
                  <div className="h-12 w-12 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    {item.sku && (
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={item.quantity}
                      value={selectedItems[item.id] || 0}
                      onChange={(e) =>
                        updateItemQuantity(item.id, parseInt(e.target.value) || 0, item.quantity)
                      }
                      className="w-20 text-center"
                    />
                    <span className="text-sm text-muted-foreground">/ {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Information
            </CardTitle>
            <CardDescription>
              Optional tracking information for this shipment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="carrier">Carrier</Label>
                <Input
                  id="carrier"
                  placeholder="e.g., UPS, FedEx, USPS"
                  {...register('carrier')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trackingNumber">Tracking Number</Label>
                <Input
                  id="trackingNumber"
                  placeholder="Enter tracking number"
                  {...register('trackingNumber')}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackingUrl">Tracking URL</Label>
              <Input
                id="trackingUrl"
                type="url"
                placeholder="https://..."
                {...register('trackingUrl')}
              />
              {errors.trackingUrl && (
                <p className="text-sm text-destructive">{errors.trackingUrl.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification */}
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifyCustomer">Notify customer</Label>
                <p className="text-sm text-muted-foreground">
                  Send a shipment confirmation email to {order.email}
                </p>
              </div>
              <Switch
                id="notifyCustomer"
                checked={watch('notifyCustomer')}
                onCheckedChange={(checked) => setValue('notifyCustomer', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href={`/dashboard/orders/${orderId}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fulfilling...
              </>
            ) : (
              <>
                <Truck className="mr-2 h-4 w-4" />
                Fulfill items
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
