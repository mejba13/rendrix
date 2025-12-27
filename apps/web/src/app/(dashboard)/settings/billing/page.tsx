'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  CreditCard,
  Check,
  Loader2,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Zap,
  Building2,
  Crown,
  Gift,
  TrendingUp,
  Shield,
  Clock,
  Star,
  ArrowRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

// Plan icons and colors mapping
const planConfig: Record<string, { icon: React.ElementType; color: string; gradient: string }> = {
  free: {
    icon: Gift,
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
  },
  pro: {
    icon: Zap,
    color: 'primary',
    gradient: 'from-primary/20 to-primary/5',
  },
  business: {
    icon: Building2,
    color: 'blue',
    gradient: 'from-blue-500/20 to-blue-500/5',
  },
  enterprise: {
    icon: Crown,
    color: 'purple',
    gradient: 'from-purple-500/20 to-purple-500/5',
  },
};

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Usage Progress Bar Component
function UsageBar({
  used,
  limit,
  label,
  color = 'primary',
}: {
  used: number;
  limit: number | null;
  label: string;
  color?: string;
}) {
  const percentage = limit ? Math.min((used / limit) * 100, 100) : 0;
  const isNearLimit = percentage > 80;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">
          {used}
          {limit && (
            <span className="text-muted-foreground"> / {limit}</span>
          )}
        </span>
      </div>
      {limit && (
        <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className={`h-full rounded-full ${
              isNearLimit
                ? 'bg-gradient-to-r from-amber-500 to-red-500'
                : color === 'primary'
                ? 'bg-gradient-to-r from-primary to-orange-500'
                : `bg-${color}-500`
            }`}
          />
        </div>
      )}
    </div>
  );
}

// Plan Card Component
function PlanCard({
  plan,
  isCurrent,
  isPopular,
  billingInterval,
  onUpgrade,
  isLoading,
}: {
  plan: {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    priceMonthly: number | null;
    priceYearly: number | null;
    features: Record<string, boolean>;
  };
  isCurrent: boolean;
  isPopular: boolean;
  billingInterval: 'monthly' | 'yearly';
  onUpgrade: () => void;
  isLoading: boolean;
}) {
  const config = planConfig[plan.slug] || planConfig.free;
  const Icon = config.icon;
  const price = billingInterval === 'monthly' ? plan.priceMonthly : plan.priceYearly;
  const monthlyEquivalent = billingInterval === 'yearly' && plan.priceYearly
    ? Math.round(plan.priceYearly / 12)
    : null;
  const features = Object.entries(plan.features).filter(([, enabled]) => enabled);

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative rounded-2xl p-6 transition-all duration-300 ${
        isCurrent
          ? `bg-gradient-to-b ${config.gradient} border-2 border-${config.color === 'primary' ? 'primary' : config.color + '-500'}/50 shadow-lg`
          : 'bg-card border border-border hover:border-muted-foreground/30 hover:shadow-lg'
      } ${isPopular && !isCurrent ? 'ring-2 ring-primary/50' : ''}`}
    >
      {/* Popular Badge */}
      {isPopular && !isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground shadow-lg">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Recommended
          </Badge>
        </div>
      )}

      {/* Current Badge */}
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="success" className="shadow-lg">
            <Check className="w-3 h-3 mr-1" />
            Current Plan
          </Badge>
        </div>
      )}

      <div className="space-y-5 pt-2">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            isCurrent
              ? config.color === 'primary'
                ? 'bg-primary/20'
                : `bg-${config.color}-500/20`
              : 'bg-muted'
          }`}>
            <Icon className={`w-5 h-5 ${
              isCurrent
                ? config.color === 'primary'
                  ? 'text-primary'
                  : `text-${config.color}-500`
                : 'text-muted-foreground'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{plan.name}</h3>
            {plan.description && (
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            )}
          </div>
        </div>

        {/* Price */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">
              {price ? formatCurrency(price, 'USD') : '$0'}
            </span>
            <span className="text-muted-foreground text-sm">
              /{billingInterval === 'monthly' ? 'mo' : 'year'}
            </span>
          </div>
          {monthlyEquivalent && (
            <p className="text-sm text-emerald-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              ${monthlyEquivalent}/mo when billed yearly
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2.5">
          {features.slice(0, 5).map(([feature]) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                isCurrent
                  ? config.color === 'primary'
                    ? 'bg-primary/20'
                    : `bg-${config.color}-500/20`
                  : 'bg-emerald-500/10'
              }`}>
                <Check className={`w-3 h-3 ${
                  isCurrent
                    ? config.color === 'primary'
                      ? 'text-primary'
                      : `text-${config.color}-500`
                    : 'text-emerald-500'
                }`} />
              </div>
              <span className="text-muted-foreground">
                {feature.replace(/_/g, ' ')}
              </span>
            </li>
          ))}
          {features.length > 5 && (
            <li className="text-xs text-muted-foreground pl-7">
              + {features.length - 5} more features
            </li>
          )}
        </ul>

        {/* Action Button */}
        {isCurrent ? (
          <Button disabled className="w-full" variant="outline">
            <Check className="mr-2 h-4 w-4" />
            Current plan
          </Button>
        ) : (
          <Button
            className={`w-full group ${
              isPopular
                ? 'bg-primary hover:bg-primary/90'
                : ''
            }`}
            variant={isPopular ? 'default' : 'outline'}
            onClick={onUpgrade}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {price && plan.priceMonthly ? 'Upgrade' : 'Downgrade'}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
        <Skeleton className="h-[200px] rounded-2xl" />
        <Skeleton className="h-[500px] rounded-2xl" />
      </div>
    );
  }

  const currentPlanSlug = subscription?.plan?.slug || 'free';
  const isCancelling = subscription?.cancelAt != null;
  const currentConfig = planConfig[currentPlanSlug] || planConfig.free;
  const CurrentPlanIcon = currentConfig.icon;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-8"
    >
      {/* Current Plan Card - Premium Design */}
      <motion.div
        variants={fadeInUp}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${currentConfig.gradient} border border-border/50 p-6 md:p-8`}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                currentConfig.color === 'primary'
                  ? 'bg-primary/20'
                  : `bg-${currentConfig.color}-500/20`
              }`}>
                <CurrentPlanIcon className={`w-7 h-7 ${
                  currentConfig.color === 'primary'
                    ? 'text-primary'
                    : `text-${currentConfig.color}-500`
                }`} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold">{subscription?.plan?.name || 'Free'}</h2>
                  {subscription?.status === 'active' && !isCancelling && (
                    <Badge variant="success" className="shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                      Active
                    </Badge>
                  )}
                  {isCancelling && (
                    <Badge variant="warning" className="shadow-sm">
                      <Clock className="w-3 h-3 mr-1" />
                      Cancelling
                    </Badge>
                  )}
                </div>
                {subscription?.currentPeriodEnd && (
                  <p className="text-sm text-muted-foreground">
                    {isCancelling
                      ? `Access ends on ${formatDate(subscription.currentPeriodEnd)}`
                      : `Renews on ${formatDate(subscription.currentPeriodEnd)}`}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {subscription?.status === 'active' && (
                <Button
                  variant="outline"
                  onClick={handleManageBilling}
                  className="bg-background/50 backdrop-blur-sm"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Manage billing
                </Button>
              )}
              {isCancelling ? (
                <Button
                  onClick={handleResume}
                  disabled={resumeSubscription.isPending}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
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
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    Cancel subscription
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Usage Stats */}
          {subscription?.usage && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Resource Usage</span>
                </div>
                <div className="space-y-4">
                  <UsageBar
                    used={subscription.usage.stores.used}
                    limit={subscription.usage.stores.limit}
                    label="Stores"
                    color={currentConfig.color}
                  />
                  <UsageBar
                    used={subscription.usage.products.used}
                    limit={subscription.usage.products.limit}
                    label="Products"
                    color={currentConfig.color}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Plan Benefits</span>
                </div>
                <ul className="space-y-2">
                  {currentPlanSlug === 'free' ? (
                    <>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-emerald-500" />
                        Basic analytics
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-emerald-500" />
                        Community support
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <X className="w-4 h-4 text-muted-foreground/50" />
                        <span className="line-through">Priority support</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-emerald-500" />
                        Advanced analytics
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-emerald-500" />
                        Priority support
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-emerald-500" />
                        AI features enabled
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Upgrade Plans Section */}
      <motion.div variants={fadeInUp} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Upgrade Plan</h2>
            <p className="text-sm text-muted-foreground">
              Choose the plan that best fits your needs
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                billingInterval === 'monthly'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                billingInterval === 'yearly'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="px-1.5 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <motion.div
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {plans?.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={plan.slug === currentPlanSlug}
              isPopular={plan.slug === 'pro'}
              billingInterval={billingInterval}
              onUpgrade={() => handleUpgrade(plan.slug)}
              isLoading={createCheckout.isPending}
            />
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-border/50"
        >
          {[
            { icon: Shield, text: 'Secure payments' },
            { icon: Clock, text: 'Cancel anytime' },
            { icon: CreditCard, text: '30-day money back' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
              <item.icon className="w-4 h-4" />
              {item.text}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              Cancel subscription?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Your subscription will remain active until the end of the current billing
              period. After that, you&apos;ll be downgraded to the free plan and may lose
              access to premium features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:space-x-3">
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
    </motion.div>
  );
}
