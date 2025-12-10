'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Ticket,
  MoreHorizontal,
  Copy,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Users,
  TrendingUp,
  Loader2,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useToast } from '@/hooks/use-toast';
import {
  useCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
  useToggleCoupon,
} from '@/hooks/use-coupons';
import { CouponForm } from '@/components/coupons/coupon-form';
import {
  CouponTypeBadge,
  CouponStatusBadge,
  formatCouponValue,
} from '@/components/coupons/coupon-columns';
import { formatCurrency, formatDate } from '@rendrix/utils';
import type { CreateCouponInput, UpdateCouponInput } from '@rendrix/types';

export default function CouponDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const couponId = params.couponId as string;

  const { data: coupon, isLoading } = useCoupon(couponId);
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();
  const toggleCoupon = useToggleCoupon();

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleUpdate = async (data: CreateCouponInput) => {
    try {
      await updateCoupon.mutateAsync({
        couponId,
        data: data as UpdateCouponInput,
      });
      toast({
        title: 'Coupon updated',
        description: 'Your changes have been saved.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update coupon. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggle = async () => {
    if (!coupon) return;
    try {
      await toggleCoupon.mutateAsync({
        couponId,
        isActive: !coupon.isActive,
      });
      toast({
        title: coupon.isActive ? 'Coupon deactivated' : 'Coupon activated',
        description: `The coupon has been ${coupon.isActive ? 'deactivated' : 'activated'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update coupon. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCoupon.mutateAsync(couponId);
      toast({
        title: 'Coupon deleted',
        description: 'The coupon has been deleted.',
      });
      router.push('/dashboard/coupons');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete coupon. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCopy = async () => {
    if (!coupon) return;
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: `Coupon code "${coupon.code}" copied to clipboard.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy code. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-[500px]" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px]" />
            <Skeleton className="h-[150px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Coupon not found.</p>
        <Button asChild>
          <Link href="/dashboard/coupons">Back to coupons</Link>
        </Button>
      </div>
    );
  }

  const usagePercentage = coupon.usageLimit
    ? Math.min((coupon.usageCount / coupon.usageLimit) * 100, 100)
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/coupons">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Ticket className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight font-mono">
                  {coupon.code}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <CouponTypeBadge type={coupon.type} />
                <CouponStatusBadge
                  isActive={coupon.isActive}
                  expiresAt={coupon.expiresAt?.toString() || null}
                />
              </div>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggle}>
              {coupon.isActive ? (
                <>
                  <ToggleLeft className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <ToggleRight className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete coupon
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Discount Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Discount Type</p>
                      <p className="font-medium mt-1">
                        <CouponTypeBadge type={coupon.type} />
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Discount Value</p>
                      <p className="text-2xl font-bold mt-1">
                        {formatCouponValue(coupon.type, coupon.value, 'USD')}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Minimum Order</p>
                      <p className="font-medium mt-1">
                        {coupon.minimumOrder
                          ? formatCurrency(coupon.minimumOrder, 'USD')
                          : 'No minimum'}
                      </p>
                    </div>
                    {coupon.type === 'percentage' && (
                      <div>
                        <p className="text-sm text-muted-foreground">Maximum Discount</p>
                        <p className="font-medium mt-1">
                          {coupon.maximumDiscount
                            ? formatCurrency(coupon.maximumDiscount, 'USD')
                            : 'No limit'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Validity Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-medium">
                          {coupon.startsAt
                            ? formatDate(coupon.startsAt)
                            : 'Immediately'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expiry Date</p>
                        <p className="font-medium">
                          {coupon.expiresAt
                            ? formatDate(coupon.expiresAt)
                            : 'No expiry'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Usage Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Usage Limit</p>
                      <p className="font-medium mt-1">
                        {coupon.usageLimit || 'Unlimited'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Per Customer Limit</p>
                      <p className="font-medium mt-1">
                        {coupon.perCustomerLimit || 'Unlimited'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit">
              <CouponForm
                coupon={coupon}
                onSubmit={handleUpdate}
                isLoading={updateCoupon.isPending}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Usage Stats */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Times Used</p>
                  <p className="text-2xl font-bold">{coupon.usageCount}</p>
                </div>
              </div>

              {usagePercentage !== null && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Usage</span>
                    <span className="font-medium">
                      {coupon.usageCount} / {coupon.usageLimit}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {usagePercentage.toFixed(0)}% of limit used
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                Copy code
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleToggle}
                disabled={toggleCoupon.isPending}
              >
                {toggleCoupon.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : coupon.isActive ? (
                  <ToggleLeft className="mr-2 h-4 w-4" />
                ) : (
                  <ToggleRight className="mr-2 h-4 w-4" />
                )}
                {coupon.isActive ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete coupon
              </Button>
            </CardContent>
          </Card>

          {/* Meta Info */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDate(coupon.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <CouponStatusBadge
                  isActive={coupon.isActive}
                  expiresAt={coupon.expiresAt?.toString() || null}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete coupon?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the coupon "{coupon.code}". Customers will
              no longer be able to use this code. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCoupon.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete coupon
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
