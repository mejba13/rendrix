'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Customer, CreateCustomerInput } from '@rendrix/types';

const customerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  acceptsMarketing: z.boolean().default(false),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CreateCustomerInput) => Promise<void>;
  isLoading?: boolean;
}

export function CustomerForm({ customer, onSubmit, isLoading }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      email: customer?.email || '',
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      phone: customer?.phone || '',
      acceptsMarketing: customer?.acceptsMarketing || false,
      tags: customer?.tags?.join(', ') || '',
      notes: customer?.notes || '',
    },
  });

  const handleFormSubmit = async (data: CustomerFormData) => {
    const tags = data.tags
      ? data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined;

    await onSubmit({
      email: data.email,
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      phone: data.phone || undefined,
      acceptsMarketing: data.acceptsMarketing,
      tags,
      notes: data.notes || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>
            Basic contact information for the customer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="customer@example.com"
              {...register('email')}
              disabled={!!customer}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="John"
                {...register('firstName')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register('lastName')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              {...register('phone')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Marketing Preferences */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Marketing</CardTitle>
          <CardDescription>
            Customer preferences for receiving marketing communications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="acceptsMarketing">Email marketing</Label>
              <p className="text-sm text-muted-foreground">
                Customer has agreed to receive marketing emails
              </p>
            </div>
            <Switch
              id="acceptsMarketing"
              checked={watch('acceptsMarketing')}
              onCheckedChange={(checked) => setValue('acceptsMarketing', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>
            Add tags to organize and segment customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="VIP, Wholesale, Returning"
              {...register('tags')}
            />
            <p className="text-sm text-muted-foreground">
              Separate multiple tags with commas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>
            Private notes about this customer (not visible to the customer).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this customer..."
              rows={4}
              {...register('notes')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {customer ? 'Save changes' : 'Create customer'}
        </Button>
      </div>
    </form>
  );
}
