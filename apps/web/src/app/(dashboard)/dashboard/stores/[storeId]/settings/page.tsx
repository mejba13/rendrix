'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useStore, useUpdateStore, useUpdateStoreSettings } from '@/hooks/use-stores';

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Central European (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan (JST)' },
  { value: 'Asia/Shanghai', label: 'China (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
];

const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'CAD', label: 'Canadian Dollar (CA$)' },
  { value: 'AUD', label: 'Australian Dollar (A$)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
];

const INDUSTRIES = [
  { value: 'toys', label: 'Toys & Games' },
  { value: 'kitchen', label: 'Kitchen & Dining' },
  { value: 'nail_care', label: 'Nail Care & Beauty' },
  { value: 'home_decor', label: 'Home Decor' },
  { value: 'garments', label: 'Clothing & Apparel' },
  { value: 'beauty', label: 'Beauty & Cosmetics' },
  { value: 'sports', label: 'Sports & Outdoors' },
  { value: 'gadgets', label: 'Electronics & Gadgets' },
  { value: 'home_appliances', label: 'Home Appliances' },
  { value: 'general', label: 'General Store' },
];

const generalSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters'),
  description: z.string().max(1000).optional(),
  industry: z.string(),
  status: z.enum(['active', 'inactive']),
});

const settingsSchema = z.object({
  currency: z.string(),
  timezone: z.string(),
  weightUnit: z.enum(['kg', 'lb']),
  dimensionUnit: z.enum(['cm', 'in']),
  taxesIncluded: z.boolean(),
  enableReviews: z.boolean(),
  enableWishlist: z.boolean(),
  maintenanceMode: z.boolean(),
});

type GeneralFormData = z.infer<typeof generalSchema>;
type SettingsFormData = z.infer<typeof settingsSchema>;

export default function GeneralSettingsPage() {
  const params = useParams();
  const { toast } = useToast();
  const storeId = params.storeId as string;

  const { data: store, isLoading } = useStore(storeId);
  const updateStore = useUpdateStore();
  const updateSettings = useUpdateStoreSettings();

  const generalForm = useForm<GeneralFormData>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      name: '',
      description: '',
      industry: 'general',
      status: 'active',
    },
  });

  const settingsForm = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      currency: 'USD',
      timezone: 'America/New_York',
      weightUnit: 'kg',
      dimensionUnit: 'cm',
      taxesIncluded: false,
      enableReviews: true,
      enableWishlist: true,
      maintenanceMode: false,
    },
  });

  // Update forms when store loads
  React.useEffect(() => {
    if (store) {
      generalForm.reset({
        name: store.name,
        description: store.description || '',
        industry: store.industry,
        status: store.status as 'active' | 'inactive',
      });

      if (store.settings) {
        settingsForm.reset({
          currency: store.settings.currency || 'USD',
          timezone: store.settings.timezone || 'America/New_York',
          weightUnit: store.settings.weightUnit || 'kg',
          dimensionUnit: store.settings.dimensionUnit || 'cm',
          taxesIncluded: store.settings.taxesIncluded || false,
          enableReviews: store.settings.enableReviews ?? true,
          enableWishlist: store.settings.enableWishlist ?? true,
          maintenanceMode: store.settings.maintenanceMode || false,
        });
      }
    }
  }, [store, generalForm, settingsForm]);

  const handleGeneralSubmit = async (data: GeneralFormData) => {
    try {
      await updateStore.mutateAsync({
        storeId,
        data: {
          name: data.name,
          description: data.description,
          status: data.status,
        },
      });
      toast({
        title: 'Settings saved',
        description: 'Store information has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update store. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSettingsSubmit = async (data: SettingsFormData) => {
    try {
      await updateSettings.mutateAsync({
        storeId,
        data,
      });
      toast({
        title: 'Settings saved',
        description: 'Store settings have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Store Information */}
      <form onSubmit={generalForm.handleSubmit(handleGeneralSubmit)}>
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>
              Basic information about your store.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Store name</Label>
              <Input id="name" {...generalForm.register('name')} />
              {generalForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {generalForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Tell customers about your store..."
                {...generalForm.register('description')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={generalForm.watch('industry')}
                  onValueChange={(value) => generalForm.setValue('industry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={generalForm.watch('status')}
                  onValueChange={(value: 'active' | 'inactive') =>
                    generalForm.setValue('status', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={!generalForm.formState.isDirty || updateStore.isPending}
              >
                {updateStore.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Save className="mr-2 h-4 w-4" />
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Store Settings */}
      <form onSubmit={settingsForm.handleSubmit(handleSettingsSubmit)}>
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Store Settings</CardTitle>
            <CardDescription>
              Configure currency, measurements, and features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Regional Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Regional</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settingsForm.watch('currency')}
                    onValueChange={(value) => settingsForm.setValue('currency', value, { shouldDirty: true })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settingsForm.watch('timezone')}
                    onValueChange={(value) => settingsForm.setValue('timezone', value, { shouldDirty: true })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Measurements */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Measurements</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weightUnit">Weight unit</Label>
                  <Select
                    value={settingsForm.watch('weightUnit')}
                    onValueChange={(value: 'kg' | 'lb') =>
                      settingsForm.setValue('weightUnit', value, { shouldDirty: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="lb">Pounds (lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dimensionUnit">Dimension unit</Label>
                  <Select
                    value={settingsForm.watch('dimensionUnit')}
                    onValueChange={(value: 'cm' | 'in') =>
                      settingsForm.setValue('dimensionUnit', value, { shouldDirty: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">Centimeters (cm)</SelectItem>
                      <SelectItem value="in">Inches (in)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Features</h4>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="taxesIncluded">Taxes included in prices</Label>
                  <p className="text-sm text-muted-foreground">
                    Display prices with tax included
                  </p>
                </div>
                <Switch
                  id="taxesIncluded"
                  checked={settingsForm.watch('taxesIncluded')}
                  onCheckedChange={(checked) =>
                    settingsForm.setValue('taxesIncluded', checked, { shouldDirty: true })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableReviews">Product reviews</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to leave reviews on products
                  </p>
                </div>
                <Switch
                  id="enableReviews"
                  checked={settingsForm.watch('enableReviews')}
                  onCheckedChange={(checked) =>
                    settingsForm.setValue('enableReviews', checked, { shouldDirty: true })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableWishlist">Wishlist</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to save products to a wishlist
                  </p>
                </div>
                <Switch
                  id="enableWishlist"
                  checked={settingsForm.watch('enableWishlist')}
                  onCheckedChange={(checked) =>
                    settingsForm.setValue('enableWishlist', checked, { shouldDirty: true })
                  }
                />
              </div>
            </div>

            <Separator />

            {/* Maintenance */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode" className="text-amber-600">
                  Maintenance mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily hide your store from customers
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settingsForm.watch('maintenanceMode')}
                onCheckedChange={(checked) =>
                  settingsForm.setValue('maintenanceMode', checked, { shouldDirty: true })
                }
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={!settingsForm.formState.isDirty || updateSettings.isPending}
              >
                {updateSettings.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Save className="mr-2 h-4 w-4" />
                Save settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
