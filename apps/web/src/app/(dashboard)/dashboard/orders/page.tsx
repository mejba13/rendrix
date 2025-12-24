'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  ShoppingCart,
  Download,
  RefreshCw,
  DollarSign,
  Clock,
  CheckCircle2,
  Search,
  TrendingUp,
  Package,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useOrders, useCancelOrder, type OrdersParams } from '@/hooks/use-orders';
import { useStoreStore } from '@/store/store';
import { createOrderColumns } from '@/components/orders/order-columns';
import { formatCurrency } from '@rendrix/utils';

// Stat Card Component - Dark Theme
function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  trendUp,
  iconGradient,
  valueColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  trendUp?: boolean;
  iconGradient: string;
  valueColor?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${iconGradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trendUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <TrendingUp className={`w-3 h-3 ${!trendUp ? 'rotate-180' : ''}`} />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className={`text-3xl font-semibold tracking-tight ${valueColor || 'text-white'}`}>
          {value}
        </h3>
        <p className="text-sm text-white/50 mt-1">{label}</p>
        {subValue && (
          <p className="text-xs text-white/40 mt-0.5">{subValue}</p>
        )}
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
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-amber-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="absolute -bottom-1 -left-3 w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center">
            <Package className="w-2.5 h-2.5 text-blue-400" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
        <p className="text-white/50 text-center max-w-md mb-6">
          Orders will appear here once customers make purchases from your store. You can also create manual orders for phone or in-person sales.
        </p>

        <div className="flex items-center gap-3">
          <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium shadow-md gap-2">
            <Link href="/dashboard/orders/new">
              <Plus className="w-4 h-4" />
              Create manual order
            </Link>
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]">
            <FileText className="w-4 h-4" />
            Import orders
          </Button>
        </div>
      </div>
    </div>
  );
}

// No Results Component
function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-14 h-14 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4">
          <Search className="w-7 h-7 text-white/40" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">No orders found</h3>
        <p className="text-white/50 text-center max-w-sm mb-4">
          No orders match your current filters. Try adjusting your search or filters.
        </p>
        <Button
          variant="outline"
          onClick={onClear}
          className="gap-2 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06]"
        >
          Clear filters
        </Button>
      </div>
    </div>
  );
}

// Error State Component
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-red-500/20">
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
          <ShoppingCart className="w-7 h-7 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Error loading orders</h3>
        <p className="text-white/50 text-center max-w-sm mb-4">
          Something went wrong while fetching your orders. Please try again.
        </p>
        <Button onClick={onRetry} className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium">
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}

// Loading Skeleton for Table
function TableSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
      <div className="flex items-center gap-4 p-4 border-b border-white/[0.06] bg-white/[0.02]">
        <Skeleton className="h-4 w-20 bg-white/[0.06]" />
        <Skeleton className="h-4 w-24 bg-white/[0.06]" />
        <Skeleton className="h-4 w-16 bg-white/[0.06]" />
        <Skeleton className="h-4 w-16 bg-white/[0.06]" />
        <Skeleton className="h-4 w-20 bg-white/[0.06]" />
        <Skeleton className="h-4 w-12 bg-white/[0.06]" />
        <Skeleton className="h-4 w-16 bg-white/[0.06]" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-white/[0.04] last:border-0">
          <div className="space-y-1.5 w-24">
            <Skeleton className="h-4 w-20 bg-white/[0.06]" />
            <Skeleton className="h-3 w-16 bg-white/[0.06]" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-[150px]">
            <Skeleton className="h-4 w-28 bg-white/[0.06]" />
            <Skeleton className="h-3 w-36 bg-white/[0.06]" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full bg-white/[0.06]" />
          <Skeleton className="h-6 w-16 rounded-full bg-white/[0.06]" />
          <Skeleton className="h-6 w-20 rounded-full bg-white/[0.06]" />
          <Skeleton className="h-4 w-14 bg-white/[0.06]" />
          <Skeleton className="h-4 w-16 bg-white/[0.06]" />
          <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.06]" />
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentStore } = useStoreStore();
  const [filters, setFilters] = React.useState<OrdersParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [search, setSearch] = React.useState('');
  const [cancelOrderId, setCancelOrderId] = React.useState<string | null>(null);

  const { data, isLoading, error, refetch } = useOrders(filters);
  const cancelOrder = useCancelOrder();

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({ ...f, search: search || undefined, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

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

  const clearFilters = () => {
    setSearch('');
    setFilters({
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = search || filters.status || filters.paymentStatus || filters.fulfillmentStatus;

  const columns = React.useMemo(
    () =>
      createOrderColumns({
        onFulfill: handleFulfill,
        onCancel: setCancelOrderId,
        currency: 'USD',
      }),
    []
  );

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!data?.data) return { total: 0, revenue: 0, pending: 0, fulfilled: 0 };
    return {
      total: data.meta.total,
      revenue: data.data.reduce((sum, o) => sum + o.total, 0),
      pending: data.data.filter((o) => o.status === 'pending' || o.status === 'confirmed').length,
      fulfilled: data.data.filter((o) => o.fulfillmentStatus === 'fulfilled').length,
    };
  }, [data]);

  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center">
          <ShoppingCart className="w-8 h-8 text-white/40" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">No store selected</h3>
          <p className="text-white/50 max-w-sm">
            Please select a store from the sidebar to view orders.
          </p>
        </div>
        <Button asChild className="mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium">
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Orders</h1>
            <p className="text-white/50 text-sm mt-0.5">
              Manage orders, track fulfillment, and process refunds
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
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium shadow-md gap-2"
          >
            <Link href="/dashboard/orders/new">
              <Plus className="w-4 h-4" />
              Create order
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
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
            <StatCard
              icon={ShoppingCart}
              label="Total Orders"
              value={stats.total.toLocaleString()}
              trend={stats.total > 0 ? '+12.5%' : undefined}
              trendUp={true}
              iconGradient="bg-gradient-to-br from-blue-500/20 to-cyan-500/10"
            />
            <StatCard
              icon={DollarSign}
              label="Revenue"
              value={formatCurrency(stats.revenue, 'USD')}
              subValue="From visible orders"
              trend={stats.revenue > 0 ? '+8.2%' : undefined}
              trendUp={true}
              iconGradient="bg-gradient-to-br from-emerald-500/20 to-green-500/10"
            />
            <StatCard
              icon={Clock}
              label="Pending"
              value={stats.pending}
              subValue="Awaiting action"
              iconGradient="bg-gradient-to-br from-amber-500/20 to-yellow-500/10"
              valueColor={stats.pending > 0 ? 'text-amber-400' : 'text-white'}
            />
            <StatCard
              icon={CheckCircle2}
              label="Fulfilled"
              value={stats.fulfilled}
              subValue="Successfully delivered"
              iconGradient="bg-gradient-to-br from-emerald-500/20 to-green-500/10"
              valueColor={stats.fulfilled > 0 ? 'text-emerald-400' : 'text-white'}
            />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search orders by number, email, or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-white placeholder:text-white/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              setFilters((f) => ({
                ...f,
                status: value === 'all' ? undefined : (value as OrdersParams['status']),
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-[130px] h-10 bg-white/[0.02] border-white/[0.06] text-white/70">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
              <SelectItem value="all" className="text-white/70 focus:bg-white/[0.06] focus:text-white">All status</SelectItem>
              <SelectItem value="pending" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Pending</SelectItem>
              <SelectItem value="confirmed" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Confirmed</SelectItem>
              <SelectItem value="processing" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Processing</SelectItem>
              <SelectItem value="shipped" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Shipped</SelectItem>
              <SelectItem value="delivered" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Delivered</SelectItem>
              <SelectItem value="cancelled" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.paymentStatus || 'all'}
            onValueChange={(value) =>
              setFilters((f) => ({
                ...f,
                paymentStatus: value === 'all' ? undefined : (value as OrdersParams['paymentStatus']),
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-[130px] h-10 bg-white/[0.02] border-white/[0.06] text-white/70">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
              <SelectItem value="all" className="text-white/70 focus:bg-white/[0.06] focus:text-white">All payments</SelectItem>
              <SelectItem value="pending" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Pending</SelectItem>
              <SelectItem value="paid" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Paid</SelectItem>
              <SelectItem value="failed" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Failed</SelectItem>
              <SelectItem value="refunded" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.fulfillmentStatus || 'all'}
            onValueChange={(value) =>
              setFilters((f) => ({
                ...f,
                fulfillmentStatus: value === 'all' ? undefined : (value as OrdersParams['fulfillmentStatus']),
                page: 1,
              }))
            }
          >
            <SelectTrigger className="w-[140px] h-10 bg-white/[0.02] border-white/[0.06] text-white/70">
              <SelectValue placeholder="Fulfillment" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
              <SelectItem value="all" className="text-white/70 focus:bg-white/[0.06] focus:text-white">All fulfillment</SelectItem>
              <SelectItem value="unfulfilled" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Unfulfilled</SelectItem>
              <SelectItem value="partially_fulfilled" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Partial</SelectItem>
              <SelectItem value="fulfilled" className="text-white/70 focus:bg-white/[0.06] focus:text-white">Fulfilled</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-white/50 hover:text-white hover:bg-white/[0.06]"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Orders Table / States */}
      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data?.data.length === 0 && !hasActiveFilters ? (
        <EmptyState />
      ) : data?.data.length === 0 && hasActiveFilters ? (
        <NoResults onClear={clearFilters} />
      ) : (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          <DataTable
            columns={columns}
            data={data?.data || []}
            searchKey="orderNumber"
            searchPlaceholder="Search in results..."
            pageSize={filters.limit}
            onRowClick={(row) => router.push(`/dashboard/orders/${row.id}`)}
          />
        </div>
      )}

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-white/50">
            Showing <span className="text-white/70 font-medium">{((data.meta.page - 1) * filters.limit!) + 1}</span> to{' '}
            <span className="text-white/70 font-medium">{Math.min(data.meta.page * filters.limit!, data.meta.total)}</span> of{' '}
            <span className="text-white/70 font-medium">{data.meta.total}</span> orders
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.meta.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
              className="gap-1 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Page numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, data.meta.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === data.meta.page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setFilters((f) => ({ ...f, page: pageNum }))}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {data.meta.totalPages > 5 && (
                <>
                  <span className="text-white/40 px-1">...</span>
                  <button
                    onClick={() => setFilters((f) => ({ ...f, page: data.meta.totalPages }))}
                    className="w-8 h-8 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    {data.meta.totalPages}
                  </button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={!data.meta.hasMore}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
              className="gap-1 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

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
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
