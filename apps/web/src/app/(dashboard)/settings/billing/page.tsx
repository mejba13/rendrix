'use client';

import * as React from 'react';
import {
  CreditCard,
  Check,
  Loader2,
  ExternalLink,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  usePlans,
  useSubscription,
  useCreateCheckout,
  useCreatePortalSession,
  useCancelSubscription,
  useResumeSubscription,
} from '@/hooks/use-billing';
import { formatCurrency, formatDate } from '@rendrix/utils';

export default function BillingPage() {
  const { toast } = useToast();
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: subscription, isLoading: subLoading } = useSubscription();
  const createCheckout = useCreateCheckout();
  const createPortal = useCreatePortalSession();
  const cancelSubscription = useCancelSubscription();
  const resumeSubscription = useResumeSubscription();

  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [billingInterval, setBillingInterval] = React.useState<'monthly' | 'yearly'>('monthly');

  const handleUpgrade = async (planSlug: string) => {
    try {
      const result = await createCheckout.mutateAsync({
        planSlug,
        billingInterval,
      });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create checkout session. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleManageBilling = async () => {
    try {
      const result = await createPortal.mutateAsync();
      if (result.portalUrl) {
        window.location.href = result.portalUrl;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to open billing portal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSubscription.mutateAsync();
      toast({
        title: 'Subscription cancelled',
        description: 'Your subscription will end at the current billing period.',
      });
      setShowCancelDialog(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleResume = async () => {
    try {
      await resumeSubscription.mutateAsync();
      toast({
        title: 'Subscription resumed',
        description: 'Your subscription has been resumed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resume subscription. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isLoading = plansLoading || subLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  const currentPlanSlug = subscription?.plan?.slug || 'free';
  const isCancelling = subscription?.cancelAt != null;

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Your current subscription and usage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold">{subscription?.plan?.name || 'Free'}</h3>
                {subscription?.status === 'active' && !isCancelling && (
                  <Badge variant="success">Active</Badge>
                )}
                {isCancelling && (
                  <Badge variant="warning">Cancelling</Badge>
                )}
              </div>
              {subscription?.currentPeriodEnd && (
                <p className="text-sm text-muted-foreground mt-1">
                  {isCancelling
                    ? `Ends on ${formatDate(subscription.currentPeriodEnd)}`
                    : `Renews on ${formatDate(subscription.currentPeriodEnd)}`}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {subscription?.status === 'active' && (
                <Button variant="outline" onClick={handleManageBilling}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Manage billing
                </Button>
              )}
              {isCancelling ? (
                <Button onClick={handleResume} disabled={resumeSubscription.isPending}>
                  {resumeSubscription.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Resume subscription
                </Button>
              ) : (
                subscription?.status === 'active' && currentPlanSlug !== 'free' && (
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelDialog(true)}
                    className="text-destructive hover:text-destructive"
                  >
                    Cancel subscription
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Usage */}
          {subscription?.usage && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Usage</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stores</span>
                      <span className="font-medium">
                        {subscription.usage.stores.used}
                        {subscription.usage.stores.limit && (
                          <span className="text-muted-foreground">
                            {' '}/ {subscription.usage.stores.limit}
                          </span>
                        )}
                      </span>
                    </div>
                    {subscription.usage.stores.limit && (
                      <div className="h-2 bg-muted rounded-full">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              (subscription.usage.stores.used / subscription.usage.stores.limit) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Products</span>
                      <span className="font-medium">
                        {subscription.usage.products.used}
                        {subscription.usage.products.limit && (
                          <span className="text-muted-foreground">
                            {' '}/ {subscription.usage.products.limit}
                          </span>
                        )}
                      </span>
                    </div>
                    {subscription.usage.products.limit && (
                      <div className="h-2 bg-muted rounded-full">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              (subscription.usage.products.used / subscription.usage.products.limit) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Plans */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upgrade Plan</CardTitle>
              <CardDescription>
                Choose the plan that best fits your needs.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-1">
              <Button
                variant={billingInterval === 'monthly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setBillingInterval('monthly')}
              >
                Monthly
              </Button>
              <Button
                variant={billingInterval === 'yearly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setBillingInterval('yearly')}
              >
                Yearly
                <Badge variant="success" className="ml-2">
                  -20%
                </Badge>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {plans?.map((plan) => {
              const isCurrent = plan.slug === currentPlanSlug;
              const price =
                billingInterval === 'monthly' ? plan.priceMonthly : plan.priceYearly;
              const features = plan.features as Record<string, boolean>;

              return (
                <div
                  key={plan.id}
                  className={`rounded-lg border p-6 ${
                    isCurrent ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {plan.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        {price ? formatCurrency(price, 'USD') : 'Free'}
                      </span>
                      {price && (
                        <span className="text-muted-foreground">
                          /{billingInterval === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-2">
                      {Object.entries(features).map(([feature, enabled]) =>
                        enabled ? (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-emerald-500" />
                            {feature.replace(/_/g, ' ')}
                          </li>
                        ) : null
                      )}
                    </ul>

                    {isCurrent ? (
                      <Button disabled className="w-full">
                        Current plan
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleUpgrade(plan.slug)}
                        disabled={createCheckout.isPending}
                      >
                        {createCheckout.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        {price ? 'Upgrade' : 'Downgrade'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Cancel subscription?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription will remain active until the end of the current billing
              period. After that, you'll be downgraded to the free plan and may lose
              access to premium features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelSubscription.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cancel subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
