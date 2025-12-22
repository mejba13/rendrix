'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Loader2,
  Check,
  AlertCircle,
  Info,
  Store,
  Upload,
  X,
  ImageIcon,
} from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useStore, useUpdateStore } from '@/hooks/use-stores';
import { cn } from '@/lib/utils';

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
  name: z.string().min(2, 'Store name must be at least 2 characters').max(255),
  description: z.string().max(1000).optional().nullable(),
  industry: z.string(),
  status: z.enum(['active', 'inactive']),
});

type GeneralFormData = z.infer<typeof generalSchema>;

// Settings card component
function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="p-6 border-b border-white/[0.06]">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description && (
          <p className="text-sm text-white/50 mt-1">{description}</p>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Form field component
function FormField({
  label,
  description,
  error,
  children,
  required,
}: {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-white/80">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </Label>
      {children}
      {description && !error && (
        <p className="text-xs text-white/40 flex items-center gap-1.5">
          <Info className="w-3 h-3" />
          {description}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// Image upload component
function ImageUpload({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  description?: string;
}) {
  const [isDragging, setIsDragging] = React.useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-white/80">{label}</Label>
      <div
        className={cn(
          "relative w-32 aspect-square border-2 border-dashed rounded-xl transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-white/[0.08] hover:border-white/[0.15]"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
      >
        {value ? (
          <div className="relative w-full h-full group">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white"
              >
                <Upload className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-red-500/20 hover:bg-red-500/30 text-red-400"
                onClick={() => onChange(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40">
            <ImageIcon className="w-6 h-6" />
            <span className="text-xs">Upload</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                onChange(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
      {description && (
        <p className="text-xs text-white/40">{description}</p>
      )}
    </div>
  );
}

export default function GeneralSettingsPage() {
  const params = useParams();
  const { toast } = useToast();
  const storeId = params.storeId as string;

  const { data: store, isLoading } = useStore(storeId);
  const updateStore = useUpdateStore();

  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<GeneralFormData>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      name: '',
      description: '',
      industry: 'general',
      status: 'active',
    },
  });

  React.useEffect(() => {
    if (store) {
      reset({
        name: store.name,
        description: store.description || '',
        industry: store.industry,
        status: store.status as 'active' | 'inactive',
      });
      setLogoUrl(store.logoUrl || null);
      setFaviconUrl(store.faviconUrl || null);
    }
  }, [store, reset]);

  const onSubmit = async (data: GeneralFormData) => {
    try {
      await updateStore.mutateAsync({
        storeId,
        data: {
          name: data.name,
          description: data.description || undefined,
          status: data.status,
          logoUrl: logoUrl || undefined,
          faviconUrl: faviconUrl || undefined,
        },
      });
      toast({
        title: 'Settings saved',
        description: 'Your store settings have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save settings',
        variant: 'destructive',
      });
    }
  };

  const watchedStatus = watch('status');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-48 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-32 rounded-2xl bg-white/[0.02]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Store Identity */}
      <SettingsCard
        title="Store Identity"
        description="Basic information about your store that appears across your storefront."
      >
        <div className="space-y-6">
          <FormField
            label="Store Name"
            required
            error={errors.name?.message}
            description="This is your store's display name."
          >
            <Input
              {...register('name')}
              placeholder="My Awesome Store"
              className="h-11 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50"
            />
          </FormField>

          <FormField
            label="Description"
            description="A brief description of your store (max 1000 characters)."
          >
            <Textarea
              {...register('description')}
              placeholder="Tell customers what makes your store special..."
              className="min-h-[100px] bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 resize-none"
            />
          </FormField>

          <FormField
            label="Industry"
            required
            description="Select the primary category for your store."
          >
            <Select
              value={watch('industry')}
              onValueChange={(value) => setValue('industry', value, { shouldDirty: true })}
            >
              <SelectTrigger className="h-11 bg-white/[0.03] border-white/[0.08] text-white">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent className="bg-[#151515] border-white/[0.08]">
                {INDUSTRIES.map((industry) => (
                  <SelectItem
                    key={industry.value}
                    value={industry.value}
                    className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08]"
                  >
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </SettingsCard>

      {/* Branding */}
      <SettingsCard
        title="Branding"
        description="Upload your store logo and favicon to build brand recognition."
      >
        <div className="flex gap-8">
          <ImageUpload
            label="Store Logo"
            value={logoUrl}
            onChange={setLogoUrl}
            description="512x512px, PNG or SVG"
          />
          <ImageUpload
            label="Favicon"
            value={faviconUrl}
            onChange={setFaviconUrl}
            description="32x32px, PNG or ICO"
          />
        </div>
      </SettingsCard>

      {/* Store Status */}
      <SettingsCard
        title="Store Status"
        description="Control whether your store is visible to customers."
      >
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              watchedStatus === 'active' ? "bg-emerald-500/20" : "bg-amber-500/20"
            )}>
              <Store className={cn(
                "w-6 h-6",
                watchedStatus === 'active' ? "text-emerald-400" : "text-amber-400"
              )} />
            </div>
            <div>
              <p className="font-medium text-white">
                Store is {watchedStatus === 'active' ? 'Active' : 'Inactive'}
              </p>
              <p className="text-sm text-white/50">
                {watchedStatus === 'active'
                  ? 'Your store is visible and accepting orders.'
                  : 'Your store is hidden from customers.'}
              </p>
            </div>
          </div>
          <Switch
            checked={watchedStatus === 'active'}
            onCheckedChange={(checked) => setValue('status', checked ? 'active' : 'inactive', { shouldDirty: true })}
            className="data-[state=checked]:bg-primary"
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
          disabled={!isDirty || updateStore.isPending}
          className="bg-primary hover:bg-primary/90 text-black font-medium min-w-[140px]"
        >
          {updateStore.isPending ? (
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
