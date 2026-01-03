'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Copy,
  Package,
  DollarSign,
  Boxes,
  Eye,
  EyeOff,
  Tag,
  Calendar,
  Check,
  X,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  ChevronRight,
  ImageIcon,
  Scale,
  RotateCcw,
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useProduct, useDeleteProduct } from '@/hooks/use-products';
import { formatCurrency } from '@rendrix/utils';
import { cn } from '@/lib/utils';

// Bento Card Component
function BentoCard({
  children,
  className,
  delay = 0,
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm',
        'opacity-0 animate-slide-up transition-all duration-500',
        'hover:border-white/[0.15] hover:bg-white/[0.04]',
        glow && 'hover:shadow-[0_0_40px_rgba(255,145,0,0.12)]',
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {children}
    </div>
  );
}

// Status Badge Component with enhanced styling
function ProductStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    active: {
      label: 'Active',
      className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: Check,
    },
    draft: {
      label: 'Draft',
      className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: Clock,
    },
    archived: {
      label: 'Archived',
      className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
      icon: X,
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium', config.className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </div>
  );
}

// Stock Badge Component
function StockBadge({ quantity, trackInventory }: { quantity?: number; trackInventory?: boolean }) {
  if (!trackInventory) {
    return (
      <span className="text-sm text-zinc-400">Not tracked</span>
    );
  }

  const isLowStock = (quantity || 0) <= 5;
  const isOutOfStock = (quantity || 0) === 0;

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
      isOutOfStock ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
      isLowStock ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    )}>
      <span className={cn(
        'h-1.5 w-1.5 rounded-full',
        isOutOfStock ? 'bg-red-400' : isLowStock ? 'bg-amber-400' : 'bg-emerald-400'
      )} />
      {isOutOfStock ? 'Out of stock' : isLowStock ? `Low: ${quantity}` : `${quantity} in stock`}
    </div>
  );
}

// Stat Item Component
function StatItem({
  label,
  value,
  icon: Icon,
  highlight = false
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
      <div className="flex items-center gap-2 text-zinc-400">
        {Icon && <Icon className="h-4 w-4" />}
        <span className="text-sm">{label}</span>
      </div>
      <div className={cn('text-sm font-medium', highlight && 'text-primary')}>
        {value}
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const productId = params.productId as string;
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

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
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(productId);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Product ID copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading State with Bento Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24 rounded-xl" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </div>

        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-12 gap-4 auto-rows-[140px]">
          <Skeleton className="col-span-12 lg:col-span-7 row-span-3 rounded-2xl" />
          <Skeleton className="col-span-6 lg:col-span-5 row-span-2 rounded-2xl" />
          <Skeleton className="col-span-6 lg:col-span-5 row-span-1 rounded-2xl" />
          <Skeleton className="col-span-12 lg:col-span-4 row-span-2 rounded-2xl" />
          <Skeleton className="col-span-12 lg:col-span-4 row-span-2 rounded-2xl" />
          <Skeleton className="col-span-12 lg:col-span-4 row-span-2 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative h-full w-full rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Package className="h-10 w-10 text-red-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Product not found</h2>
            <p className="text-zinc-400">
              The product you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/dashboard/products">
              <ArrowLeft className="h-4 w-4" />
              Back to products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > (product.price || 0);
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - (product.price || 0)) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="min-h-screen pb-8">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/3 rounded-full blur-[100px]" />
      </div>

      {/* Page Header */}
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8 animate-fade-in">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="mt-1 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.15]"
          >
            <Link href="/dashboard/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">{product.name}</h1>
              <ProductStatusBadge status={product.status} />
            </div>
            <div className="flex items-center gap-4 text-sm">
              {product.sku && (
                <span className="text-zinc-500 font-mono">SKU: {product.sku}</span>
              )}
              <button
                onClick={handleCopyId}
                className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy ID'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            asChild
            className="rounded-xl border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.06] hover:border-primary/50 gap-2"
          >
            <Link href={`/dashboard/products/${productId}/edit`}>
              <Pencil className="h-4 w-4" />
              Edit Product
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-xl border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-white/[0.1] bg-zinc-900/95 backdrop-blur-xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete product?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  This action cannot be undone. This will permanently delete &quot;{product.name}&quot; and
                  remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-500 text-white hover:bg-red-600 rounded-xl"
                >
                  Delete Product
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="relative z-10 grid grid-cols-12 gap-4 auto-rows-[140px]">

        {/* Hero Image Card - Large */}
        <BentoCard
          className="col-span-12 lg:col-span-7 row-span-3 p-0"
          delay={0}
          glow
        >
          {product.images && product.images.length > 0 ? (
            <div className="h-full flex flex-col">
              {/* Main Image */}
              <div className="relative flex-1 min-h-0 bg-gradient-to-br from-zinc-900 to-black">
                <img
                  src={product.images[selectedImage]?.url}
                  alt={product.images[selectedImage]?.altText || product.name}
                  className="h-full w-full object-contain p-6"
                />
                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                    {product.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={cn(
                          'h-2 rounded-full transition-all duration-300',
                          idx === selectedImage
                            ? 'w-6 bg-primary'
                            : 'w-2 bg-white/30 hover:bg-white/50'
                        )}
                      />
                    ))}
                  </div>
                )}
                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-red-500/90 text-white text-sm font-semibold backdrop-blur-sm">
                    -{discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="flex gap-2 p-4 border-t border-white/[0.06] overflow-x-auto scrollbar-hide">
                  {product.images.map((image, idx) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        'relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300',
                        idx === selectedImage
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      )}
                    >
                      <img
                        src={image.url}
                        alt={image.altText || `Product image ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 bg-gradient-to-br from-zinc-900/50 to-black">
              <div className="p-6 rounded-full bg-white/[0.03] border border-white/[0.06] mb-4">
                <ImageIcon className="h-12 w-12" />
              </div>
              <p className="text-lg font-medium">No images uploaded</p>
              <p className="text-sm text-zinc-600 mt-1">Add images to showcase this product</p>
            </div>
          )}
        </BentoCard>

        {/* Pricing Card - Medium */}
        <BentoCard
          className="col-span-12 sm:col-span-6 lg:col-span-5 row-span-2 p-6"
          delay={100}
          glow
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 text-zinc-400 mb-4">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Pricing</span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {/* Main Price */}
              <div className="mb-4">
                {hasDiscount && (
                  <span className="text-lg text-zinc-500 line-through mr-3">
                    {formatCurrency(product.compareAtPrice!, 'USD')}
                  </span>
                )}
                <span className={cn(
                  'text-4xl lg:text-5xl font-bold tracking-tight',
                  hasDiscount ? 'text-emerald-400' : 'text-white'
                )}>
                  {product.price ? formatCurrency(product.price, 'USD') : '$0.00'}
                </span>
              </div>

              {/* Price Details */}
              <div className="space-y-1">
                {product.costPrice && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-500">Cost:</span>
                    <span className="text-zinc-300">{formatCurrency(product.costPrice, 'USD')}</span>
                    {product.price && product.costPrice && (
                      <span className="text-emerald-400 text-xs">
                        ({Math.round(((product.price - product.costPrice) / product.price) * 100)}% margin)
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-500">Tax:</span>
                  <Badge variant={product.taxable ? 'default' : 'secondary'} className="text-xs">
                    {product.taxable ? 'Taxable' : 'Tax-free'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Quick Stats Card */}
        <BentoCard
          className="col-span-12 sm:col-span-6 lg:col-span-5 row-span-1 p-5"
          delay={150}
        >
          <div className="h-full flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Type</p>
                <p className="text-lg font-medium capitalize">{product.type}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-white/[0.08]" />
            <div className="flex items-center gap-4">
              <div className={cn(
                'p-3 rounded-xl border',
                product.visibility === 'visible'
                  ? 'bg-emerald-500/10 border-emerald-500/20'
                  : 'bg-zinc-500/10 border-zinc-500/20'
              )}>
                {product.visibility === 'visible' ? (
                  <Eye className="h-5 w-5 text-emerald-400" />
                ) : (
                  <EyeOff className="h-5 w-5 text-zinc-400" />
                )}
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Visibility</p>
                <p className="text-lg font-medium capitalize">{product.visibility}</p>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Description Card */}
        <BentoCard
          className="col-span-12 lg:col-span-7 row-span-2 p-6"
          delay={200}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 text-zinc-400 mb-4">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Description</span>
            </div>

            <div className="flex-1 overflow-auto scrollbar-custom">
              {product.shortDescription && (
                <div className="mb-4 pb-4 border-b border-white/[0.06]">
                  <p className="text-lg text-zinc-200 leading-relaxed">{product.shortDescription}</p>
                </div>
              )}
              {product.description ? (
                <div className="prose prose-sm prose-invert max-w-none">
                  <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-500">
                  <p>No description provided</p>
                </div>
              )}
            </div>
          </div>
        </BentoCard>

        {/* Inventory Card */}
        <BentoCard
          className="col-span-12 sm:col-span-6 lg:col-span-5 row-span-2 p-6"
          delay={250}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <Boxes className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Inventory</span>
              </div>
              <StockBadge quantity={product.quantity} trackInventory={product.trackInventory} />
            </div>

            <div className="flex-1 space-y-1">
              <StatItem
                label="Track inventory"
                value={product.trackInventory ? 'Enabled' : 'Disabled'}
                icon={Shield}
              />
              {product.trackInventory && (
                <StatItem
                  label="Quantity"
                  value={product.quantity || 0}
                  icon={Package}
                  highlight
                />
              )}
              {product.weight && (
                <StatItem
                  label="Weight"
                  value={`${product.weight} kg`}
                  icon={Scale}
                />
              )}
              <StatItem
                label="Backorders"
                value={
                  <Badge
                    variant={product.allowBackorders ? 'default' : 'secondary'}
                    className={cn(
                      'text-xs',
                      product.allowBackorders && 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    )}
                  >
                    {product.allowBackorders ? 'Allowed' : 'Not allowed'}
                  </Badge>
                }
                icon={RotateCcw}
              />
            </div>
          </div>
        </BentoCard>

        {/* Timeline Card */}
        <BentoCard
          className="col-span-12 sm:col-span-6 lg:col-span-5 row-span-1 p-5"
          delay={300}
        >
          <div className="h-full flex items-center">
            <div className="flex-1 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-zinc-800/50 border border-white/[0.06]">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Created</p>
                  <p className="text-sm font-medium">{new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-zinc-600" />

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-zinc-800/50 border border-white/[0.06]">
                  <Clock className="h-4 w-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Updated</p>
                  <p className="text-sm font-medium">{new Date(product.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              {product.publishedAt && (
                <>
                  <ChevronRight className="h-4 w-4 text-zinc-600" />
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Published</p>
                      <p className="text-sm font-medium text-emerald-400">{new Date(product.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </BentoCard>

        {/* Variants Card - Only if variants exist */}
        {product.variants && product.variants.length > 0 && (
          <BentoCard
            className="col-span-12 row-span-2 p-6"
            delay={350}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Boxes className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Variants</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="flex-1 overflow-auto scrollbar-custom">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {product.variants.map((variant, idx) => (
                    <div
                      key={variant.id}
                      className="group relative p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
                      style={{ animationDelay: `${400 + idx * 50}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{variant.name || 'Untitled Variant'}</p>
                          {variant.sku && (
                            <p className="text-xs text-zinc-500 font-mono mt-0.5">SKU: {variant.sku}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          {variant.price && (
                            <p className="font-semibold text-primary">{formatCurrency(variant.price, 'USD')}</p>
                          )}
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {variant.quantity} in stock
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>
        )}
      </div>
    </div>
  );
}
