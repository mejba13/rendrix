'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  Check,
  ShoppingBag,
  Percent,
  Star,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useStore, useUpdateStoreSettings } from '@/hooks/use-stores';
import { cn } from '@/lib/utils';

const commerceSchema = z.object({
  taxesIncluded: z.boolean(),
  enableReviews: z.boolean(),
  enableWishlist: z.boolean(),
});

type CommerceFormData = z.infer<typeof commerceSchema>;

// Settings card component
function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            {description && (
              <p className="text-sm text-white/50 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Toggle setting component
function ToggleSetting({
  label,
  description,
  checked,
  onCheckedChange,
  icon: Icon,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            checked ? "bg-primary/20" : "bg-white/[0.04]"
          )}>
            <Icon className={cn(
              "w-5 h-5 transition-colors",
              checked ? "text-primary" : "text-white/40"
            )} />
          </div>
        )}
        <div>
          <p className="font-medium text-white">{label}</p>
          {description && (
            <p className="text-sm text-white/50">{description}</p>
          )}
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
}


export default function CommerceSettingsPage() {
  const params = useParams();
  const { toast } = useToast();
  const storeId = params.storeId as string;

  const { data: store, isLoading } = useStore(storeId);
  const updateSettings = useUpdateStoreSettings();

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<CommerceFormData>({
    resolver: zodResolver(commerceSchema),
    defaultValues: {
      taxesIncluded: false,
      enableReviews: true,
      enableWishlist: true,
    },
  });

  React.useEffect(() => {
    if (store?.settings) {
      reset({
        taxesIncluded: store.settings.taxesIncluded ?? false,
        enableReviews: store.settings.enableReviews ?? true,
        enableWishlist: store.settings.enableWishlist ?? true,
      });
    }
  }, [store, reset]);

  const onSubmit = async (data: CommerceFormData) => {
    try {
      await updateSettings.mutateAsync({
        storeId,
        data: {
          taxesIncluded: data.taxesIncluded,
          enableReviews: data.enableReviews,
          enableWishlist: data.enableWishlist,
        },
      });
      toast({
        title: 'Commerce settings saved',
        description: 'Your commerce preferences have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save settings',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-48 rounded-2xl bg-white/[0.02]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tax Settings */}
      <SettingsCard
        title="Tax Settings"
        description="Configure how taxes are displayed on your products."
        icon={Percent}
      >
        <ToggleSetting
          label="Tax Inclusive Pricing"
          description="Product prices already include tax."
          checked={watch('taxesIncluded')}
          onCheckedChange={(checked) => setValue('taxesIncluded', checked, { shouldDirty: true })}
          icon={Percent}
        />
      </SettingsCard>

      {/* Store Features */}
      <SettingsCard
        title="Store Features"
        description="Enable or disable features for your customers."
        icon={ShoppingBag}
      >
        <div className="space-y-4">
          <ToggleSetting
            label="Product Reviews"
            description="Allow customers to leave reviews on products."
            checked={watch('enableReviews')}
            onCheckedChange={(checked) => setValue('enableReviews', checked, { shouldDirty: true })}
            icon={Star}
          />

          <ToggleSetting
            label="Wishlist"
            description="Let customers save products to a wishlist."
            checked={watch('enableWishlist')}
            onCheckedChange={(checked) => setValue('enableWishlist', checked, { shouldDirty: true })}
            icon={Heart}
          />
        </div>
      </SettingsCard>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <p className="text-sm text-white/40">
          {isDirty ? 'You have unsaved changes' : 'All changes saved'}
        </p>
        <Button
          type="submit"
          disabled={!isDirty || updateSettings.isPending}
          className="bg-primary hover:bg-primary/90 text-black font-medium min-w-[140px]"
        >
          {updateSettings.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
