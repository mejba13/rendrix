'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ExternalLink,
  Copy,
  Package,
  DollarSign,
  Truck,
  BarChart3,
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
import { useProduct, useDeleteProduct } from '@/hooks/use-products';
import { ProductStatusBadge, StockBadge } from '@/components/products/product-status-badge';
import { formatCurrency } from '@rendrix/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const productId = params.productId as string;

  const { data: product, isLoading, error } = useProduct(productId);
  const deleteProduct = useDeleteProduct();

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(productId);
      toast({
        title: 'Product deleted',
        description: 'The product has been successfully deleted.',
      });
      router.push('/dashboard/products');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(productId);
    toast({
      title: 'Copied',
      description: 'Product ID copied to clipboard.',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="h-4 w-[200px]" />
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

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <Package className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Product not found</h2>
        <p className="text-muted-foreground">
          The product you're looking for doesn't exist or has been deleted.
        </p>
        <Button asChild>
          <Link href="/dashboard/products">Back to products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link href="/dashboard/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
              <ProductStatusBadge status={product.status} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              {product.sku && (
                <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
              )}
              <button
                onClick={handleCopyId}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                Copy ID
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/products/${productId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete product?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete "{product.name}" and
                  remove all associated data.
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
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative aspect-square rounded-lg border overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt={image.altText || `Product image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      {index === 0 && (
                        <Badge className="absolute bottom-2 left-2" variant="secondary">
                          Main
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-video rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No images uploaded</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              {product.shortDescription && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Short Description
                  </h4>
                  <p className="text-sm">{product.shortDescription}</p>
                </div>
              )}
              {product.description ? (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Full Description
                  </h4>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap">{product.description}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No description provided.</p>
              )}
            </CardContent>
          </Card>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Variants ({product.variants.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{variant.name || 'Untitled Variant'}</p>
                        {variant.sku && (
                          <p className="text-sm text-muted-foreground">SKU: {variant.sku}</p>
                        )}
                      </div>
                      <div className="text-right">
                        {variant.price && (
                          <p className="font-medium">{formatCurrency(variant.price, 'USD')}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {variant.quantity} in stock
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="text-2xl font-bold">
                  {product.price ? formatCurrency(product.price, 'USD') : '-'}
                </span>
              </div>
              {product.compareAtPrice && product.compareAtPrice > (product.price || 0) && (
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Compare at</span>
                  <span className="text-lg line-through text-muted-foreground">
                    {formatCurrency(product.compareAtPrice, 'USD')}
                  </span>
                </div>
              )}
              {product.costPrice && (
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Cost</span>
                  <span className="text-lg">{formatCurrency(product.costPrice, 'USD')}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Taxable</span>
                <Badge variant={product.taxable ? 'secondary' : 'ghost'}>
                  {product.taxable ? 'Yes' : 'No'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <StockBadge
                  quantity={product.quantity}
                  trackInventory={product.trackInventory}
                />
              </div>
              {product.trackInventory && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{product.quantity}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">{product.weight} kg</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Backorders</span>
                <Badge variant={product.allowBackorders ? 'success' : 'secondary'}>
                  {product.allowBackorders ? 'Allowed' : 'Not allowed'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Product Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline" className="capitalize">
                  {product.type}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Visibility</span>
                <Badge variant="outline" className="capitalize">
                  {product.visibility}
                </Badge>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground">
                <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(product.updatedAt).toLocaleDateString()}</p>
                {product.publishedAt && (
                  <p>Published: {new Date(product.publishedAt).toLocaleDateString()}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
