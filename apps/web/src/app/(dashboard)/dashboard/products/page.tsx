'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Package,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Archive,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Box,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useProducts, useBulkProductAction, useDeleteProduct, type ProductsParams } from '@/hooks/use-products';
import { useStoreStore } from '@/store/store';
import { createProductColumns } from '@/components/products/product-columns';

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
  iconBg,
  valueColor,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  iconColor: string;
  iconBg: string;
  valueColor?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="group relative rounded-xl bg-white/[0.03] border border-white/[0.08] p-5 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        {badge}
      </div>
      <div className="space-y-1">
        <h3 className={`text-2xl font-bold ${valueColor || 'text-white'}`}>{value}</h3>
        <p className="text-sm text-white/50">{label}</p>
      </div>
    </div>
  );
}

// Loading Skeleton for Stats
function StatsLoadingSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="flex items-start justify-between mb-4">
            <Skeleton className="w-11 h-11 rounded-xl bg-white/[0.06]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-16 bg-white/[0.06]" />
            <Skeleton className="h-4 w-24 bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Products Table Loading Skeleton
function TableLoadingSkeleton() {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] overflow-hidden">
      <div className="p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
            <Skeleton className="h-12 w-12 rounded-lg bg-white/[0.06]" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px] bg-white/[0.06]" />
              <Skeleton className="h-3 w-[100px] bg-white/[0.04]" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full bg-white/[0.06]" />
            <Skeleton className="h-4 w-20 bg-white/[0.04]" />
            <Skeleton className="h-8 w-8 rounded-lg bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] overflow-hidden">
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20">
            <ShoppingBag className="h-10 w-10 text-amber-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
            <Plus className="h-4 w-4 text-black" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No products yet</h3>
        <p className="text-white/50 text-center max-w-md mb-8 leading-relaxed">
          Start building your catalog by adding your first product. You can add products manually or import them from a file.
        </p>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/20 bg-white/[0.05] text-white hover:bg-white/[0.1]">
            <Upload className="mr-2 h-4 w-4" />
            Import products
          </Button>
          <Button asChild className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">
            <Link href="/dashboard/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add product
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Error State Component
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-red-500/20 overflow-hidden">
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Error loading products</h3>
        <p className="text-white/50 text-center max-w-sm mb-6">
          Something went wrong while loading your products. Please try again.
        </p>
        <Button variant="outline" onClick={onRetry} className="border-white/20 bg-white/[0.05] text-white hover:bg-white/[0.1]">
          Try again
        </Button>
      </div>
    </div>
  );
}

// No Store Selected State
function NoStoreState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center border border-white/[0.08]">
        <Package className="h-10 w-10 text-white/30" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">No store selected</h3>
        <p className="text-white/50 max-w-sm">
          Please select a store from the sidebar to view and manage products.
        </p>
      </div>
      <Button asChild className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">
        <Link href="/dashboard/stores/new">Create a store</Link>
      </Button>
    </div>
  );
}

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  total,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-white/40">
        Page {currentPage} of {totalPages} ({total} products)
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="border-white/[0.1] bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="border-white/[0.1] bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentStore } = useStoreStore();
  const [filters, setFilters] = React.useState<ProductsParams>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [search, setSearch] = React.useState('');
  const [deleteProductId, setDeleteProductId] = React.useState<string | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<Record<string, boolean>>({});

  const { data, isLoading, error, refetch } = useProducts(filters);
  const deleteProduct = useDeleteProduct();
  const bulkAction = useBulkProductAction();

  const selectedCount = Object.keys(selectedRows).filter((k) => selectedRows[k]).length;

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== filters.search) {
        setFilters((f) => ({ ...f, search: search || undefined, page: 1 }));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filters.search]);

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      await deleteProduct.mutateAsync(deleteProductId);
      toast({
        title: 'Product deleted',
        description: 'The product has been successfully deleted.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    }
    setDeleteProductId(null);
  };

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'archive' | 'delete') => {
    const productIds = Object.keys(selectedRows).filter((k) => selectedRows[k]);
    if (productIds.length === 0) return;

    try {
      const result = await bulkAction.mutateAsync({ action, productIds });
      toast({
        title: 'Bulk action completed',
        description: `${result.affected} product(s) ${action === 'publish' ? 'published' : action === 'unpublish' ? 'unpublished' : action === 'archive' ? 'archived' : 'deleted'}.`,
      });
      setSelectedRows({});
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to perform bulk action. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicate = (_productId: string) => {
    toast({
      title: 'Coming soon',
      description: 'Product duplication feature will be available soon.',
    });
  };

  const handleFilterChange = (key: keyof ProductsParams, value: string) => {
    setFilters((f) => ({
      ...f,
      [key]: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const columns = React.useMemo(
    () =>
      createProductColumns({
        onDelete: setDeleteProductId,
        onDuplicate: handleDuplicate,
        currency: 'USD',
      }),
    []
  );

  // Calculate stats from data
  const stats = React.useMemo(() => {
    if (!data) return { total: 0, active: 0, draft: 0, outOfStock: 0 };
    return {
      total: data.meta.total,
      active: data.data.filter((p) => p.status === 'active').length,
      draft: data.data.filter((p) => p.status === 'draft').length,
      outOfStock: data.data.filter((p) => p.trackInventory && p.quantity === 0).length,
    };
  }, [data]);

  // Check if filters are active (for empty state)
  const hasActiveFilters = filters.search || filters.status || filters.type || filters.inStock !== undefined;

  if (!currentStore) {
    return <NoStoreState />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/[0.02] blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-purple-500/[0.02] blur-[80px]" />
      </div>

      <div className="relative space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20">
              <Package className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Products</h1>
              <p className="text-white/50 text-sm mt-0.5">
                Manage your product catalog, inventory, and pricing.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/[0.1] bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#151515] border-white/[0.1]">
                <DropdownMenuItem className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.08]">
                  Import from CSV
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.08]">
                  Import from Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="border-white/[0.1] bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button asChild className="bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-lg shadow-amber-500/20">
              <Link href="/dashboard/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add product
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <StatsLoadingSkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              icon={Box}
              label="Total Products"
              value={stats.total}
              iconColor="text-purple-400"
              iconBg="bg-gradient-to-br from-purple-500/20 to-violet-500/10"
            />
            <StatCard
              icon={TrendingUp}
              label="Active"
              value={stats.active}
              iconColor="text-emerald-400"
              iconBg="bg-gradient-to-br from-emerald-500/20 to-green-500/10"
              badge={
                stats.active > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live
                  </span>
                ) : null
              }
            />
            <StatCard
              icon={Archive}
              label="Draft"
              value={stats.draft}
              iconColor="text-amber-400"
              iconBg="bg-gradient-to-br from-amber-500/20 to-yellow-500/10"
            />
            <StatCard
              icon={Package}
              label="Out of Stock"
              value={stats.outOfStock}
              iconColor="text-red-400"
              iconBg="bg-gradient-to-br from-red-500/20 to-rose-500/10"
              valueColor={stats.outOfStock > 0 ? 'text-red-400' : 'text-white'}
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all"
            />
          </div>

          <Select value={filters.status || 'all'} onValueChange={(v) => handleFilterChange('status', v)}>
            <SelectTrigger className="w-[130px] bg-white/[0.04] border-white/[0.08] text-white/70 focus:ring-amber-500/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#151515] border-white/[0.1]">
              <SelectItem value="all" className="text-white/70 focus:bg-white/[0.08] focus:text-white">All status</SelectItem>
              <SelectItem value="active" className="text-white/70 focus:bg-white/[0.08] focus:text-white">Active</SelectItem>
              <SelectItem value="draft" className="text-white/70 focus:bg-white/[0.08] focus:text-white">Draft</SelectItem>
              <SelectItem value="archived" className="text-white/70 focus:bg-white/[0.08] focus:text-white">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.type || 'all'} onValueChange={(v) => handleFilterChange('type', v)}>
            <SelectTrigger className="w-[130px] bg-white/[0.04] border-white/[0.08] text-white/70 focus:ring-amber-500/50">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#151515] border-white/[0.1]">
              <SelectItem value="all" className="text-white/70 focus:bg-white/[0.08] focus:text-white">All types</SelectItem>
              <SelectItem value="simple" className="text-white/70 focus:bg-white/[0.08] focus:text-white">Simple</SelectItem>
              <SelectItem value="variable" className="text-white/70 focus:bg-white/[0.08] focus:text-white">Variable</SelectItem>
              <SelectItem value="grouped" className="text-white/70 focus:bg-white/[0.08] focus:text-white">Grouped</SelectItem>
              <SelectItem value="digital" className="text-white/70 focus:bg-white/[0.08] focus:text-white">Digital</SelectItem>
              <SelectItem value="subscription" className="text-white/70 focus:bg-white/[0.08] focus:text-white">Subscription</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.inStock === undefined ? 'all' : filters.inStock ? 'in_stock' : 'out_of_stock'}
            onValueChange={(v) => setFilters((f) => ({ ...f, inStock: v === 'all' ? undefined : v === 'in_stock', page: 1 }))}
          >
            <SelectTrigger className="w-[130px] bg-white/[0.04] border-white/[0.08] text-white/70 focus:ring-amber-500/50">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent className="bg-[#151515] border-white/[0.1]">
              <SelectItem value="all" className="text-white/70 focus:bg-white/[0.08] focus:text-white">All stock</SelectItem>
              <SelectItem value="in_stock" className="text-white/70 focus:bg-white/[0.08] focus:text-white">In stock</SelectItem>
              <SelectItem value="out_of_stock" className="text-white/70 focus:bg-white/[0.08] focus:text-white">Out of stock</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setFilters({ page: 1, limit: filters.limit, sortBy: 'createdAt', sortOrder: 'desc' });
              }}
              className="text-white/50 hover:text-white hover:bg-white/[0.06]"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-in slide-in-from-top-2 duration-300">
            <span className="text-sm font-medium text-amber-400">
              {selectedCount} product{selectedCount > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('publish')}
                className="border-white/[0.1] bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white"
              >
                <Eye className="mr-2 h-4 w-4" />
                Publish
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('unpublish')}
                className="border-white/[0.1] bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white"
              >
                <EyeOff className="mr-2 h-4 w-4" />
                Unpublish
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('archive')}
                className="border-white/[0.1] bg-white/[0.05] text-white/70 hover:bg-white/[0.1] hover:text-white"
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                onClick={() => handleBulkAction('delete')}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Products Table */}
        {isLoading ? (
          <TableLoadingSkeleton />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data?.data.length === 0 && !hasActiveFilters ? (
          <EmptyState />
        ) : data?.data.length === 0 && hasActiveFilters ? (
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] overflow-hidden">
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-white/20" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No products found</h3>
              <p className="text-white/50 text-center max-w-sm mb-6">
                No products match your current filters. Try adjusting your search criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setFilters({ page: 1, limit: filters.limit, sortBy: 'createdAt', sortOrder: 'desc' });
                }}
                className="border-white/20 bg-white/[0.05] text-white hover:bg-white/[0.1]"
              >
                Clear filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] overflow-hidden">
            <DataTable
              columns={columns}
              data={data?.data || []}
              searchKey="name"
              searchPlaceholder="Search in results..."
              pageSize={filters.limit}
              onRowClick={(row) => router.push(`/dashboard/products/${row.id}`)}
            />
          </div>
        )}

        {/* Pagination */}
        {data && data.meta.totalPages > 1 && (
          <Pagination
            currentPage={data.meta.page}
            totalPages={data.meta.totalPages}
            total={data.meta.total}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent className="bg-[#151515] border-white/[0.1]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete product?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This action cannot be undone. This will permanently delete the product and remove all
              associated data including variants, images, and inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.1]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
