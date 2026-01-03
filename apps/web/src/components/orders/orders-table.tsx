'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { createOrderColumns } from '@/components/orders/order-columns';
import type { OrderListItem, OrdersParams } from '@/hooks/use-orders';
import type { OrderStatus, PaymentStatus, FulfillmentStatus } from '@rendrix/types';

interface OrdersTableProps {
  data: OrderListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
  isLoading: boolean;
  filters: OrdersParams;
  onFiltersChange: (filters: OrdersParams) => void;
  onRefresh: () => void;
  onCancel: (orderId: string) => void;
  onFulfill: (orderId: string) => void;
  hideStatusFilter?: boolean;
  hidePaymentFilter?: boolean;
  hideFulfillmentFilter?: boolean;
  showDateFilter?: boolean;
  emptyState?: React.ReactNode;
}

// Table Loading Skeleton
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

export function OrdersTable({
  data,
  meta,
  isLoading,
  filters,
  onFiltersChange,
  onRefresh,
  onCancel,
  onFulfill,
  hideStatusFilter = false,
  hidePaymentFilter = false,
  hideFulfillmentFilter = false,
  showDateFilter = false,
  emptyState,
}: OrdersTableProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState(filters.search || '');
  const [dateFrom, setDateFrom] = React.useState<Date | undefined>(
    filters.dateFrom ? new Date(filters.dateFrom) : undefined
  );
  const [dateTo, setDateTo] = React.useState<Date | undefined>(
    filters.dateTo ? new Date(filters.dateTo) : undefined
  );

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: search || undefined, page: 1 });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Date filter effect
  React.useEffect(() => {
    onFiltersChange({
      ...filters,
      dateFrom: dateFrom ? dateFrom.toISOString().split('T')[0] : undefined,
      dateTo: dateTo ? dateTo.toISOString().split('T')[0] : undefined,
      page: 1,
    });
  }, [dateFrom, dateTo]);

  const clearFilters = () => {
    setSearch('');
    setDateFrom(undefined);
    setDateTo(undefined);
    onFiltersChange({
      page: 1,
      limit: filters.limit,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters =
    search ||
    filters.status ||
    filters.paymentStatus ||
    filters.fulfillmentStatus ||
    dateFrom ||
    dateTo;

  const columns = React.useMemo(
    () =>
      createOrderColumns({
        onFulfill,
        onCancel,
        currency: 'USD',
      }),
    [onFulfill, onCancel]
  );

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (data.length === 0 && !hasActiveFilters && emptyState) {
    return <>{emptyState}</>;
  }

  if (data.length === 0 && hasActiveFilters) {
    return (
      <div className="space-y-4">
        <FilterBar
          search={search}
          setSearch={setSearch}
          filters={filters}
          onFiltersChange={onFiltersChange}
          hideStatusFilter={hideStatusFilter}
          hidePaymentFilter={hidePaymentFilter}
          hideFulfillmentFilter={hideFulfillmentFilter}
          showDateFilter={showDateFilter}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          hasActiveFilters={!!hasActiveFilters}
          clearFilters={clearFilters}
          onRefresh={onRefresh}
        />
        <NoResults onClear={clearFilters} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        setSearch={setSearch}
        filters={filters}
        onFiltersChange={onFiltersChange}
        hideStatusFilter={hideStatusFilter}
        hidePaymentFilter={hidePaymentFilter}
        hideFulfillmentFilter={hideFulfillmentFilter}
        showDateFilter={showDateFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        hasActiveFilters={!!hasActiveFilters}
        clearFilters={clearFilters}
        onRefresh={onRefresh}
      />

      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          searchKey="orderNumber"
          searchPlaceholder="Search in results..."
          pageSize={filters.limit}
          onRowClick={(row) => router.push(`/dashboard/orders/${row.id}`)}
        />
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-white/50">
            Showing{' '}
            <span className="text-white/70 font-medium">
              {(meta.page - 1) * (filters.limit || 20) + 1}
            </span>{' '}
            to{' '}
            <span className="text-white/70 font-medium">
              {Math.min(meta.page * (filters.limit || 20), meta.total)}
            </span>{' '}
            of <span className="text-white/70 font-medium">{meta.total}</span> orders
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => onFiltersChange({ ...filters, page: (filters.page || 1) - 1 })}
              className="gap-1 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === meta.page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => onFiltersChange({ ...filters, page: pageNum })}
                    className={cn(
                      'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {meta.totalPages > 5 && (
                <>
                  <span className="text-white/40 px-1">...</span>
                  <button
                    onClick={() => onFiltersChange({ ...filters, page: meta.totalPages })}
                    className="w-8 h-8 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    {meta.totalPages}
                  </button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasMore}
              onClick={() => onFiltersChange({ ...filters, page: (filters.page || 1) + 1 })}
              className="gap-1 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Filter Bar Component
function FilterBar({
  search,
  setSearch,
  filters,
  onFiltersChange,
  hideStatusFilter,
  hidePaymentFilter,
  hideFulfillmentFilter,
  showDateFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  hasActiveFilters,
  clearFilters,
  onRefresh,
}: {
  search: string;
  setSearch: (value: string) => void;
  filters: OrdersParams;
  onFiltersChange: (filters: OrdersParams) => void;
  hideStatusFilter: boolean;
  hidePaymentFilter: boolean;
  hideFulfillmentFilter: boolean;
  showDateFilter: boolean;
  dateFrom: Date | undefined;
  setDateFrom: (date: Date | undefined) => void;
  dateTo: Date | undefined;
  setDateTo: (date: Date | undefined) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  onRefresh: () => void;
}) {
  return (
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
        {!hideStatusFilter && (
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                status: value === 'all' ? undefined : (value as OrderStatus),
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[130px] h-10 bg-white/[0.02] border-white/[0.06] text-white/70">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
              <SelectItem
                value="all"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                All status
              </SelectItem>
              <SelectItem
                value="pending"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                Pending
              </SelectItem>
              <SelectItem
                value="confirmed"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                Confirmed
              </SelectItem>
              <SelectItem
                value="processing"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                Processing
              </SelectItem>
              <SelectItem
                value="shipped"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                Shipped
              </SelectItem>
              <SelectItem
                value="delivered"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                Delivered
              </SelectItem>
              <SelectItem
                value="cancelled"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                Cancelled
              </SelectItem>
            </SelectContent>
          </Select>
        )}

        {!hidePaymentFilter && (
          <Select
            value={filters.paymentStatus || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                paymentStatus: value === 'all' ? undefined : (value as PaymentStatus),
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[130px] h-10 bg-white/[0.02] border-white/[0.06] text-white/70">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
              <SelectItem
                value="all"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                All payments
              </SelectItem>
              <SelectItem
                value="pending"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                Pending
              </SelectItem>
              <SelectItem
                value="paid"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                Paid
              </SelectItem>
              <SelectItem
                value="failed"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                Failed
              </SelectItem>
              <SelectItem
                value="refunded"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                Refunded
              </SelectItem>
            </SelectContent>
          </Select>
        )}

        {!hideFulfillmentFilter && (
          <Select
            value={filters.fulfillmentStatus || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                fulfillmentStatus: value === 'all' ? undefined : (value as FulfillmentStatus),
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[140px] h-10 bg-white/[0.02] border-white/[0.06] text-white/70">
              <SelectValue placeholder="Fulfillment" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.06]">
              <SelectItem
                value="all"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                All fulfillment
              </SelectItem>
              <SelectItem
                value="unfulfilled"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                Unfulfilled
              </SelectItem>
              <SelectItem
                value="partially_fulfilled"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                Partial
              </SelectItem>
              <SelectItem
                value="fulfilled"
                className="text-white/70 focus:bg-white/[0.06] focus:text-white"
              >
                Fulfilled
              </SelectItem>
            </SelectContent>
          </Select>
        )}

        {showDateFilter && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-10 gap-2 bg-white/[0.02] border-white/[0.06] text-white/70 hover:text-white hover:bg-white/[0.06]',
                  (dateFrom || dateTo) && 'border-amber-500/50 text-amber-400'
                )}
              >
                <Calendar className="w-4 h-4" />
                {dateFrom || dateTo ? 'Date filtered' : 'Date range'}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 p-4 bg-[#1a1a1a] border-white/[0.06]"
              align="end"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-white/50 mb-2">From</p>
                  <Input
                    type="date"
                    value={dateFrom ? dateFrom.toISOString().split('T')[0] : ''}
                    onChange={(e) => setDateFrom(e.target.value ? new Date(e.target.value) : undefined)}
                    className="h-9 bg-white/[0.02] border-white/[0.06] text-white"
                  />
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-2">To</p>
                  <Input
                    type="date"
                    value={dateTo ? dateTo.toISOString().split('T')[0] : ''}
                    onChange={(e) => setDateTo(e.target.value ? new Date(e.target.value) : undefined)}
                    className="h-9 bg-white/[0.02] border-white/[0.06] text-white"
                  />
                </div>
                {(dateFrom || dateTo) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDateFrom(undefined);
                      setDateTo(undefined);
                    }}
                    className="w-full text-white/50 hover:text-white"
                  >
                    Clear dates
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          className="h-10 w-10 bg-white/[0.02] border-white/[0.06] text-white/70 hover:text-white hover:bg-white/[0.06]"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>

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
  );
}
