'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCreateCoupon } from '@/hooks/use-coupons';
import { CouponForm } from '@/components/coupons/coupon-form';
import type { CreateCouponInput } from '@rendrix/types';

export default function NewCouponPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createCoupon = useCreateCoupon();

  const handleSubmit = async (data: CreateCouponInput) => {
    try {
      const coupon = await createCoupon.mutateAsync(data);
      toast({
        title: 'Coupon created',
        description: `Coupon "${data.code}" has been created successfully.`,
      });
      router.push(`/dashboard/coupons/${coupon.id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create coupon. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/coupons">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Create Coupon</h1>
          <p className="text-muted-foreground mt-1">
            Create a new discount code for your customers.
          </p>
        </div>
      </div>

      <CouponForm onSubmit={handleSubmit} isLoading={createCoupon.isPending} />
    </div>
  );
}
