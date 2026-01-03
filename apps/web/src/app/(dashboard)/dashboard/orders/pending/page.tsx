'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Clock,
  Download,
  RefreshCw,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Layers,
  CheckCircle2,
  RotateCcw,
  XCircle,
  CreditCard,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useOrders, useCancelOrder, type OrdersParams } from '@/hooks/use-orders';
import { useStoreStore } from '@/store/store';
import { OrdersTable } from '@/components/orders/orders-table';
import { formatCurrency } from '@rendrix/utils';
import { cn } from '@/lib/utils';

// Order state navigation tabs
const orderTabs = [
  { name: 'All Orders', href: '/dashboard/orders', icon: Layers, color: 'from-blue-500 to-cyan-500' },
  { name: 'Completed', href: '/dashboard/orders/completed', icon: CheckCircle2, color: 'from-emerald-500 to-green-500' },
  { name: 'Pending', href: '/dashboard/orders/pending', icon: Clock, color: 'from-amber-500 to-yellow-500' },
  { name: 'Refunded', href: '/dashboard/orders/refunded', icon: RotateCcw, color: 'from-purple-500 to-violet-500' },
  { name: 'Cancelled', href: '/dashboard/orders/cancelled', icon: XCircle, color: 'from-red-500 to-rose-500' },
];

// Bento Stat Card
function BentoCard({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  trendUp,
  gradient,
  valueColor,
  urgent,
  className,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  trendUp?: boolean;
  gradient: string;
  valueColor?: string;
  urgent?: boolean;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6',
        'hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500',
        'animate-in fade-in slide-in-from-bottom-4',
        urgent && 'border-amber-500/30 bg-amber-500/5',
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      {urgent && (
        <div className="absolute top-3 right-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        </div>
      )}

      <div className={cn('absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br', gradient)} />

      <div className="relative flex items-start justify-between">
        <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg', gradient)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full',
              trendUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
            )}
          >
            <TrendingUp className={cn('w-3 h-3', !trendUp && 'rotate-180')} />
            {trend}
          </div>
        )}
      </div>
      <div className="relative mt-4">
        <h3 className={cn('text-3xl font-bold tracking-tight', valueColor || 'text-white')}>{value}</h3>
        <p className="text-sm text-white/50 mt-1">{label}</p>
        {subValue && <p className="text-xs text-white/40 mt-0.5">{subValue}</p>}
      </div>
    </div>
  );
}

// Stat Card Skeleton
function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
      <div className="flex items-start justify-between">
        <Skeleton className="w-12 h-12 rounded-xl bg-white/[0.06]" />
        <Skeleton className="w-14 h-6 rounded-full bg-white/[0.06]" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-9 w-24 bg-white/[0.06]" />
        <Skeleton className="h-4 w-28 bg-white/[0.06]" />
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
      <div className="relative flex flex-col items-center justify-center py-20 px-6">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">No pending orders</h3>
        <p className="text-white/50 text-center max-w-md mb-6">
          Great news! There are no orders requiring your attention right now. All orders have been processed.
        </p>

        <Button asChild variant="outline" className="gap-2 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]">
          <Link href="/dashboard/orders">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to all orders
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Action Card
function ActionCard({
  icon: Icon,
  title,
  description,
  count,
  gradient,
  urgent,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  count: number;
  gradient: string;
  urgent?: boolean;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.06] p-4',
        'hover:bg-white/[0.04] transition-all duration-300',
        'animate-in fade-in slide-in-from-bottom-2',
        urgent && 'border-amber-500/30'
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0', gradient)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-white">{title}</h4>
            {urgent && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Action needed</span>
            )}
          </div>
          <p className="text-xs text-white/50 mt-0.5">{description}</p>
        </div>
        <div className="text-right">
          <span className={cn('text-xl font-bold', urgent ? 'text-amber-400' : 'text-white')}>{count}</span>
          <p className="text-xs text-white/40">orders</p>
        </div>
      </div>
    </div>
  );
}

export default function PendingOrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { currentStore } = useStoreStore();
  const [filters, setFilters] = React.useState<OrdersParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [cancelOrderId, setCancelOrderId] = React.useState<string | null>(null);

  // Fetch pending and confirmed orders
  const { data, isLoading, refetch } = useOrders({
    ...filters,
    status: undefined, // We'll filter client-side for pending + confirmed
  });

  const cancelOrder = useCancelOrder();

  // Filter for pending orders only
  const pendingOrders = React.useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'processing');
  }, [data]);

  const handleCancel = async () => {
    if (!cancelOrderId) return;

    try {
      await cancelOrder.mutateAsync(cancelOrderId);
      toast({
        title: 'Order cancelled',
        description: 'The order has been cancelled and inventory restored.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to cancel order. Please try again.',
        variant: 'destructive',
      });
    }
    setCancelOrderId(null);
  };

  const handleFulfill = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}/fulfill`);
  };

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!pendingOrders.length) return { total: 0, revenue: 0, awaitingPayment: 0, awaitingFulfillment: 0 };
    return {
      total: pendingOrders.length,
      revenue: pendingOrders.reduce((sum, o) => sum + o.total, 0),
      awaitingPayment: pendingOrders.filter((o) => o.paymentStatus === 'pending').length,
      awaitingFulfillment: pendingOrders.filter((o) => o.fulfillmentStatus === 'unfulfilled' && o.paymentStatus === 'paid').length,
    };
  }, [pendingOrders]);

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center">
          <Clock className="w-8 h-8 text-white/40" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">No store selected</h3>
          <p className="text-white/50 max-w-sm">Please select a store from the sidebar to view orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center ring-1 ring-amber-500/20">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            {stats.total > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 items-center justify-center text-[10px] font-bold text-black">
                  {stats.total > 9 ? '9+' : stats.total}
                </span>
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Pending Orders</h1>
            <p className="text-white/50 text-sm mt-0.5">
              Orders requiring your attention for payment or fulfillment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Order State Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {orderTabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300',
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <BentoCard
              icon={Clock}
              label="Pending Orders"
              value={stats.total.toLocaleString()}
              subValue="Require attention"
              gradient="from-amber-500 to-yellow-500"
              valueColor="text-amber-400"
              urgent={stats.total > 0}
              delay={0}
            />
            <BentoCard
              icon={DollarSign}
              label="Pending Revenue"
              value={formatCurrency(stats.revenue, 'USD')}
              subValue="Awaiting completion"
              gradient="from-emerald-500 to-green-500"
              delay={50}
            />
            <BentoCard
              icon={CreditCard}
              label="Awaiting Payment"
              value={stats.awaitingPayment}
              subValue="Payment pending"
              gradient="from-red-500 to-rose-500"
              valueColor={stats.awaitingPayment > 0 ? 'text-red-400' : 'text-white'}
              urgent={stats.awaitingPayment > 0}
              delay={100}
            />
            <BentoCard
              icon={Package}
              label="Ready to Fulfill"
              value={stats.awaitingFulfillment}
              subValue="Paid, unfulfilled"
              gradient="from-blue-500 to-cyan-500"
              valueColor={stats.awaitingFulfillment > 0 ? 'text-blue-400' : 'text-white'}
              delay={150}
            />
          </>
        )}
      </div>

      {/* Action Required Cards */}
      {!isLoading && stats.total > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ActionCard
            icon={CreditCard}
            title="Payment Blockers"
            description="Orders waiting for payment confirmation"
            count={stats.awaitingPayment}
            gradient="from-red-500 to-rose-500"
            urgent={stats.awaitingPayment > 0}
            delay={200}
          />
          <ActionCard
            icon={Package}
            title="Fulfillment Queue"
            description="Paid orders ready for shipping"
            count={stats.awaitingFulfillment}
            gradient="from-blue-500 to-cyan-500"
            urgent={stats.awaitingFulfillment > 0}
            delay={250}
          />
        </div>
      )}

      {/* Orders Table */}
      <OrdersTable
        data={pendingOrders}
        meta={{
          total: pendingOrders.length,
          page: filters.page || 1,
          limit: filters.limit || 20,
          totalPages: Math.ceil(pendingOrders.length / (filters.limit || 20)),
          hasMore: false,
        }}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={() => refetch()}
        onCancel={setCancelOrderId}
        onFulfill={handleFulfill}
        hideStatusFilter
        showDateFilter
        emptyState={<EmptyState />}
      />

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!cancelOrderId} onOpenChange={() => setCancelOrderId(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border-white/[0.06]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This will cancel the order and restore all inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]">
              Keep order
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} className="bg-red-500 hover:bg-red-600 text-white">
              Cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
