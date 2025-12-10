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
  LayoutGrid,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useProducts, useBulkProductAction, useDeleteProduct, type ProductsParams } from '@/hooks/use-products';
import { useStoreStore } from '@/store/store';
import { createProductColumns } from '@/components/products/product-columns';
import { ProductFilters } from '@/components/products/product-filters';

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
  const [deleteProductId, setDeleteProductId] = React.useState<string | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<Record<string, boolean>>({});

  const { data, isLoading, error } = useProducts(filters);
  const deleteProduct = useDeleteProduct();
  const bulkAction = useBulkProductAction();

  const selectedCount = Object.keys(selectedRows).filter((k) => selectedRows[k]).length;

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      await deleteProduct.mutateAsync(deleteProductId);
      toast({
        title: 'Product deleted',
        description: 'The product has been successfully deleted.',
      });
    } catch (error) {
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
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform bulk action. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicate = (productId: string) => {
    toast({
      title: 'Coming soon',
      description: 'Product duplication feature will be available soon.',
    });
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

  // Empty state when no store selected
  if (!currentStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">No store selected</h3>
          <p className="text-muted-foreground max-w-sm">
            Please select a store from the sidebar to view and manage products.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/stores/new">Create a store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog, inventory, and pricing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Import from CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                Import from Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild className="shadow-sm">
            <Link href="/dashboard/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {data && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardDescription>Total Products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.meta.total}</div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">
                  {data.data.filter((p) => p.status === 'active').length}
                </div>
                <Badge variant="success" className="font-normal">Live</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardDescription>Draft</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.data.filter((p) => p.status === 'draft').length}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardDescription>Out of Stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-destructive">
                  {data.data.filter((p) => p.trackInventory && p.quantity === 0).length}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <ProductFilters filters={filters} onFiltersChange={setFilters} />

      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border animate-in slide-in-from-top-2">
          <span className="text-sm font-medium">
            {selectedCount} product{selectedCount > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('publish')}>
              <Eye className="mr-2 h-4 w-4" />
              Publish
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('unpublish')}>
              <EyeOff className="mr-2 h-4 w-4" />
              Unpublish
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('archive')}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
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
        <Card className="shadow-soft">
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </Card>
      ) : error ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Error loading products</h3>
            <p className="text-muted-foreground mt-1">
              Something went wrong. Please try again.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : data?.data.length === 0 && !filters.search && !filters.status && !filters.type ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No products yet</h3>
            <p className="text-muted-foreground mt-2 text-center max-w-sm">
              Start building your catalog by adding your first product.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import products
              </Button>
              <Button asChild>
                <Link href="/dashboard/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add product
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={data?.data || []}
          searchKey="name"
          searchPlaceholder="Search in results..."
          pageSize={filters.limit}
          onRowClick={(row) => router.push(`/dashboard/products/${row.id}`)}
        />
      )}

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} products)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={data.meta.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.meta.hasMore}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product and remove all
              associated data including variants, images, and inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
