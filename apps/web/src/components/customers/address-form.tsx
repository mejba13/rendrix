'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CustomerAddress } from '@rendrix/types';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IN', name: 'India' },
  { code: 'MX', name: 'Mexico' },
];

const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().length(2, 'Please select a country'),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  address?: CustomerAddress;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<CustomerAddress, 'id' | 'customerId'>) => Promise<void>;
  isLoading?: boolean;
}

export function AddressFormDialog({
  address,
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: address?.firstName || '',
      lastName: address?.lastName || '',
      company: address?.company || '',
      address1: address?.address1 || '',
      address2: address?.address2 || '',
      city: address?.city || '',
      state: address?.state || '',
      postalCode: address?.postalCode || '',
      country: address?.country || 'US',
      phone: address?.phone || '',
      isDefault: address?.isDefault || false,
    },
  });

  // Reset form when dialog opens with new address
  React.useEffect(() => {
    if (open) {
      reset({
        firstName: address?.firstName || '',
        lastName: address?.lastName || '',
        company: address?.company || '',
        address1: address?.address1 || '',
        address2: address?.address2 || '',
        city: address?.city || '',
        state: address?.state || '',
        postalCode: address?.postalCode || '',
        country: address?.country || 'US',
        phone: address?.phone || '',
        isDefault: address?.isDefault || false,
      });
    }
  }, [open, address, reset]);

  const handleFormSubmit = async (data: AddressFormData) => {
    await onSubmit({
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company || undefined,
      address1: data.address1,
      address2: data.address2 || undefined,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
      phone: data.phone || undefined,
      isDefault: data.isDefault,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{address ? 'Edit address' : 'Add address'}</DialogTitle>
          <DialogDescription>
            {address
              ? 'Update the address details below.'
              : 'Add a new address for this customer.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First name <span className="text-destructive">*</span>
              </Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last name <span className="text-destructive">*</span>
              </Label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" {...register('company')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address1">
              Address <span className="text-destructive">*</span>
            </Label>
            <Input id="address1" placeholder="Street address" {...register('address1')} />
            {errors.address1 && (
              <p className="text-sm text-destructive">{errors.address1.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address2">Apartment, suite, etc.</Label>
            <Input id="address2" placeholder="Optional" {...register('address2')} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">
                City <span className="text-destructive">*</span>
              </Label>
              <Input id="city" {...register('city')} />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">
                State / Province <span className="text-destructive">*</span>
              </Label>
              <Input id="state" {...register('state')} />
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="postalCode">
                Postal code <span className="text-destructive">*</span>
              </Label>
              <Input id="postalCode" {...register('postalCode')} />
              {errors.postalCode && (
                <p className="text-sm text-destructive">{errors.postalCode.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch('country')}
                onValueChange={(value) => setValue('country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-sm text-destructive">{errors.country.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" {...register('phone')} />
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="isDefault">Set as default</Label>
              <p className="text-sm text-muted-foreground">
                Use this address as the default for orders
              </p>
            </div>
            <Switch
              id="isDefault"
              checked={watch('isDefault')}
              onCheckedChange={(checked) => setValue('isDefault', checked)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {address ? 'Save changes' : 'Add address'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Address display card
interface AddressCardProps {
  address: CustomerAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault?: () => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  const countryName = COUNTRIES.find((c) => c.code === address.country)?.name || address.country;

  return (
    <div className="relative rounded-lg border p-4">
      {address.isDefault && (
        <span className="absolute top-2 right-2 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
          Default
        </span>
      )}
      <div className="space-y-1 text-sm">
        <p className="font-medium">
          {address.firstName} {address.lastName}
        </p>
        {address.company && <p className="text-muted-foreground">{address.company}</p>}
        <p>{address.address1}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p>{countryName}</p>
        {address.phone && <p className="text-muted-foreground">{address.phone}</p>}
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
        {!address.isDefault && onSetDefault && (
          <Button variant="outline" size="sm" onClick={onSetDefault}>
            Set as default
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
