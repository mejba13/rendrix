'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  XCircle,
  Download,
  RefreshCw,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Layers,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle,
  FileText,
  Shield,
  Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrders, type OrdersParams } from '@/hooks/use-orders';
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
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6',
        'hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500',
        'animate-in fade-in slide-in-from-bottom-4',
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
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
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
      <div className="relative flex flex-col items-center justify-center py-20 px-6">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/10 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">No cancelled orders</h3>
        <p className="text-white/50 text-center max-w-md mb-6">
          Great news! No orders have been cancelled. Cancelled orders would appear here with their cancellation reasons and audit trail.
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

// Warning Card
function WarningCard({
  icon: Icon,
  title,
  description,
  gradient,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.06] p-4',
        'hover:bg-white/[0.04] transition-all duration-300',
        'animate-in fade-in slide-in-from-bottom-2'
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0', gradient)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-white">{title}</h4>
          <p className="text-xs text-white/50 mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function CancelledOrdersPage() {
  const pathname = usePathname();
  const { currentStore } = useStoreStore();
  const [filters, setFilters] = React.useState<OrdersParams>({
    page: 1,
    limit: 20,
    status: 'cancelled',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data, isLoading, refetch } = useOrders(filters);

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!data?.data) return { total: 0, lostRevenue: 0, thisMonth: 0, byCustomer: 0 };
    const lostRevenue = data.data.reduce((sum, o) => sum + o.total, 0);
    const thisMonth = data.data.filter((o) => {
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }).length;
    return {
      total: data.meta.total,
      lostRevenue,
      thisMonth,
      byCustomer: 0, // Would need cancellation reason data
    };
  }, [data]);

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center">
          <XCircle className="w-8 h-8 text-white/40" />
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/10 flex items-center justify-center ring-1 ring-red-500/20">
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Cancelled Orders</h1>
            <p className="text-white/50 text-sm mt-0.5">
              Cancellation reasons and audit trail for cancelled orders
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
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
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
              icon={XCircle}
              label="Cancelled Orders"
              value={stats.total.toLocaleString()}
              subValue="Total cancellations"
              gradient="from-red-500 to-rose-500"
              delay={0}
            />
            <BentoCard
              icon={DollarSign}
              label="Lost Revenue"
              value={formatCurrency(stats.lostRevenue, 'USD')}
              subValue="From cancelled orders"
              gradient="from-amber-500 to-orange-500"
              valueColor="text-amber-400"
              delay={50}
            />
            <BentoCard
              icon={Clock}
              label="This Month"
              value={stats.thisMonth}
              subValue="Recent cancellations"
              trend={stats.thisMonth > 0 ? '-2.1%' : undefined}
              trendUp={true}
              gradient="from-blue-500 to-cyan-500"
              delay={100}
            />
            <BentoCard
              icon={AlertTriangle}
              label="By Customer Request"
              value={stats.byCustomer}
              subValue="Customer-initiated"
              gradient="from-purple-500 to-violet-500"
              delay={150}
            />
          </>
        )}
      </div>

      {/* Warning Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <WarningCard
          icon={FileText}
          title="Cancellation Reasons"
          description="View why orders were cancelled for analysis"
          gradient="from-red-500 to-rose-500"
          delay={200}
        />
        <WarningCard
          icon={Shield}
          title="Audit Trail"
          description="Complete history of cancellation events"
          gradient="from-blue-500 to-cyan-500"
          delay={250}
        />
        <WarningCard
          icon={Ban}
          title="Reactivation Blocked"
          description="Cancelled orders cannot be reactivated"
          gradient="from-amber-500 to-orange-500"
          delay={300}
        />
      </div>

      {/* Orders Table */}
      <OrdersTable
        data={data?.data || []}
        meta={data?.meta || { total: 0, page: 1, limit: 20, totalPages: 0, hasMore: false }}
        isLoading={isLoading}
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={() => refetch()}
        onCancel={() => {}}
        onFulfill={() => {}}
        hideStatusFilter
        showDateFilter
        emptyState={<EmptyState />}
      />
    </div>
  );
}
