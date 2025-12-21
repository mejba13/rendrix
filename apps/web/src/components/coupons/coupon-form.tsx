'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Coupon, CouponType, CreateCouponInput } from '@rendrix/types';

const couponSchema = z.object({
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .max(20, 'Code must be at most 20 characters')
    .regex(/^[A-Z0-9_-]+$/i, 'Code can only contain letters, numbers, hyphens, and underscores'),
  type: z.enum(['percentage', 'fixed', 'free_shipping', 'bogo'] as const),
  value: z.coerce.number().min(0).optional(),
  minimumOrder: z.coerce.number().min(0).optional().nullable(),
  maximumDiscount: z.coerce.number().min(0).optional().nullable(),
  usageLimit: z.coerce.number().int().min(1).optional().nullable(),
  perCustomerLimit: z.coerce.number().int().min(1).optional().nullable(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().default(true),
});

type CouponFormData = z.infer<typeof couponSchema>;

interface CouponFormProps {
  coupon?: Coupon;
  onSubmit: (data: CreateCouponInput) => Promise<void>;
  isLoading?: boolean;
}

// Generate random coupon code
function generateCouponCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function CouponForm({ coupon, onSubmit, isLoading }: CouponFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon?.code || '',
      type: coupon?.type || 'percentage',
      value: coupon?.value || undefined,
      minimumOrder: coupon?.minimumOrder || null,
      maximumDiscount: coupon?.maximumDiscount || null,
      usageLimit: coupon?.usageLimit || null,
      perCustomerLimit: coupon?.perCustomerLimit || null,
      startsAt: coupon?.startsAt
        ? new Date(coupon.startsAt).toISOString().slice(0, 16)
        : undefined,
      expiresAt: coupon?.expiresAt
        ? new Date(coupon.expiresAt).toISOString().slice(0, 16)
        : undefined,
      isActive: coupon?.isActive ?? true,
    },
  });

  const selectedType = watch('type');

  const handleFormSubmit = async (data: CouponFormData) => {
    await onSubmit({
      code: data.code.toUpperCase(),
      type: data.type,
      value: data.value,
      minimumOrder: data.minimumOrder || undefined,
      maximumDiscount: data.maximumDiscount || undefined,
      usageLimit: data.usageLimit || undefined,
      perCustomerLimit: data.perCustomerLimit || undefined,
      startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    });
  };

  const generateCode = () => {
    setValue('code', generateCouponCode());
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Coupon Details</CardTitle>
          <CardDescription>
            Basic information about the coupon code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">
              Coupon Code <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="code"
                placeholder="SUMMER20"
                className="font-mono uppercase"
                {...register('code')}
                disabled={!!coupon}
              />
              {!coupon && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateCode}
                  className="shrink-0"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              )}
            </div>
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Customers will enter this code at checkout
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">
                Discount Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch('type')}
                onValueChange={(value: CouponType) => setValue('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage off</SelectItem>
                  <SelectItem value="fixed">Fixed amount off</SelectItem>
                  <SelectItem value="free_shipping">Free shipping</SelectItem>
                  <SelectItem value="bogo">Buy One Get One</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(selectedType === 'percentage' || selectedType === 'fixed') && (
              <div className="space-y-2">
                <Label htmlFor="value">
                  Discount Value <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  {selectedType === 'fixed' && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                  )}
                  <Input
                    id="value"
                    type="number"
                    step={selectedType === 'percentage' ? '1' : '0.01'}
                    min="0"
                    max={selectedType === 'percentage' ? '100' : undefined}
                    placeholder={selectedType === 'percentage' ? '20' : '10.00'}
                    className={selectedType === 'fixed' ? 'pl-7' : ''}
                    {...register('value')}
                  />
                  {selectedType === 'percentage' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      %
                    </span>
                  )}
                </div>
                {errors.value && (
                  <p className="text-sm text-destructive">{errors.value.message}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Restrictions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Restrictions</CardTitle>
          <CardDescription>
            Set limits on when and how this coupon can be used.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minimumOrder">Minimum order amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="minimumOrder"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="50.00"
                  className="pl-7"
                  {...register('minimumOrder')}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Leave empty for no minimum
              </p>
            </div>

            {selectedType === 'percentage' && (
              <div className="space-y-2">
                <Label htmlFor="maximumDiscount">Maximum discount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="maximumDiscount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="100.00"
                    className="pl-7"
                    {...register('maximumDiscount')}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Cap the discount amount
                </p>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Total usage limit</Label>
              <Input
                id="usageLimit"
                type="number"
                min="1"
                placeholder="100"
                {...register('usageLimit')}
              />
              <p className="text-sm text-muted-foreground">
                Maximum total uses across all customers
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="perCustomerLimit">Per customer limit</Label>
              <Input
                id="perCustomerLimit"
                type="number"
                min="1"
                placeholder="1"
                {...register('perCustomerLimit')}
              />
              <p className="text-sm text-muted-foreground">
                Maximum uses per customer
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validity Period */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Validity Period</CardTitle>
          <CardDescription>
            Set when this coupon is valid.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startsAt">Start date</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                {...register('startsAt')}
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to start immediately
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiry date</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                {...register('expiresAt')}
              />
              <p className="text-sm text-muted-foreground">
                Leave empty for no expiry
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active</Label>
              <p className="text-sm text-muted-foreground">
                Enable this coupon for use by customers
              </p>
            </div>
            <Switch
              id="isActive"
              checked={watch('isActive')}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {coupon ? 'Save changes' : 'Create coupon'}
        </Button>
      </div>
    </form>
  );
}
