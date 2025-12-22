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
  Search,
  Eye,
  ImageIcon,
  Share2,
  BarChart3,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useStore, useUpdateStoreSeo } from '@/hooks/use-stores';
import { cn } from '@/lib/utils';

const seoSchema = z.object({
  metaTitle: z.string().max(60, 'Title should be under 60 characters').optional(),
  metaDescription: z.string().max(160, 'Description should be under 160 characters').optional(),
  ogImage: z.string().url().optional().or(z.literal('')),
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
});

type SeoFormData = z.infer<typeof seoSchema>;

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

// Form field component
function FormField({
  label,
  description,
  error,
  children,
  charCount,
  maxChars,
}: {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  charCount?: number;
  maxChars?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-white/80">{label}</Label>
        {maxChars !== undefined && charCount !== undefined && (
          <span className={cn(
            "text-xs",
            charCount > maxChars ? "text-red-400" : "text-white/40"
          )}>
            {charCount}/{maxChars}
          </span>
        )}
      </div>
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
          "relative w-full aspect-[1200/630] max-w-md border-2 border-dashed rounded-xl transition-all duration-200",
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
            <ImageIcon className="w-8 h-8" />
            <span className="text-sm">Drop image or click to upload</span>
            <span className="text-xs">Recommended: 1200x630px</span>
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

export default function SeoSettingsPage() {
  const params = useParams();
  const { toast } = useToast();
  const storeId = params.storeId as string;

  const { data: store, isLoading } = useStore(storeId);
  const updateSeo = useUpdateStoreSeo();

  const [ogImageUrl, setOgImageUrl] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<SeoFormData>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      metaTitle: '',
      metaDescription: '',
      ogImage: '',
      googleAnalyticsId: '',
      facebookPixelId: '',
    },
  });

  React.useEffect(() => {
    if (store?.seoSettings) {
      reset({
        metaTitle: store.seoSettings.metaTitle || '',
        metaDescription: store.seoSettings.metaDescription || '',
        ogImage: store.seoSettings.ogImage || '',
        googleAnalyticsId: store.seoSettings.googleAnalyticsId || '',
        facebookPixelId: store.seoSettings.facebookPixelId || '',
      });
      setOgImageUrl(store.seoSettings.ogImage || null);
    }
  }, [store, reset]);

  const onSubmit = async (data: SeoFormData) => {
    try {
      await updateSeo.mutateAsync({
        storeId,
        data: {
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          ogImage: ogImageUrl || data.ogImage || null,
          googleAnalyticsId: data.googleAnalyticsId || null,
          facebookPixelId: data.facebookPixelId || null,
        },
      });
      toast({
        title: 'SEO settings saved',
        description: 'Your SEO settings have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save settings',
        variant: 'destructive',
      });
    }
  };

  const metaTitle = watch('metaTitle');
  const metaDescription = watch('metaDescription');

  const previewTitle = metaTitle || store?.name || 'Your Store';
  const previewDescription =
    metaDescription || 'Welcome to our store. Browse our collection of products.';
  const previewUrl = store?.subdomain
    ? `https://${store.subdomain}.rendrix.store`
    : 'https://yourstore.com';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-80 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-64 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-48 rounded-2xl bg-white/[0.02]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Search Engine Listing */}
      <SettingsCard
        title="Search Engine Listing"
        description="Control how your store appears in search engine results."
        icon={Search}
      >
        <div className="space-y-6">
          <FormField
            label="Page Title"
            description="The title that appears in search results and browser tabs."
            error={errors.metaTitle?.message}
            charCount={metaTitle?.length || 0}
            maxChars={60}
          >
            <Input
              {...register('metaTitle')}
              placeholder={store?.name || 'Your Store Name'}
              className="h-11 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50"
            />
          </FormField>

          <FormField
            label="Meta Description"
            description="The description that appears below your title in search results."
            error={errors.metaDescription?.message}
            charCount={metaDescription?.length || 0}
            maxChars={160}
          >
            <Textarea
              {...register('metaDescription')}
              placeholder="A brief description of your store..."
              className="min-h-[100px] bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 resize-none"
            />
          </FormField>

          {/* Google Search Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Eye className="w-4 h-4" />
              <span>Search Preview</span>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="space-y-1">
                <p className="text-primary text-lg hover:underline cursor-pointer font-medium">
                  {previewTitle}
                </p>
                <p className="text-sm text-emerald-400">{previewUrl}</p>
                <p className="text-sm text-white/60 line-clamp-2">
                  {previewDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Social Sharing */}
      <SettingsCard
        title="Social Sharing"
        description="Control how your store appears when shared on social media."
        icon={Share2}
      >
        <div className="space-y-6">
          <ImageUpload
            label="Social Share Image (OG Image)"
            value={ogImageUrl}
            onChange={(url) => {
              setOgImageUrl(url);
              setValue('ogImage', url || '', { shouldDirty: true });
            }}
            description="Used when your store is shared on Facebook, Twitter, and other platforms."
          />

          {/* Social Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Eye className="w-4 h-4" />
              <span>Social Card Preview</span>
            </div>
            <div className="rounded-xl border border-white/[0.06] overflow-hidden max-w-md bg-white/[0.02]">
              <div className="h-40 bg-white/[0.04] flex items-center justify-center">
                {ogImageUrl ? (
                  <img
                    src={ogImageUrl}
                    alt="Social preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-10 w-10 text-white/30" />
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-white/40 uppercase mb-1">
                  {previewUrl.replace('https://', '')}
                </p>
                <p className="font-semibold text-white line-clamp-1">{previewTitle}</p>
                <p className="text-sm text-white/60 line-clamp-2">
                  {previewDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Analytics & Tracking */}
      <SettingsCard
        title="Analytics & Tracking"
        description="Connect analytics services to track your store's performance."
        icon={BarChart3}
      >
        <div className="space-y-6">
          <FormField
            label="Google Analytics ID"
            description="Your Google Analytics measurement ID (GA4 or Universal Analytics)."
          >
            <Input
              {...register('googleAnalyticsId')}
              placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
              className="h-11 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 font-mono"
            />
          </FormField>

          <FormField
            label="Facebook Pixel ID"
            description="Your Facebook Pixel ID for tracking conversions and remarketing."
          >
            <Input
              {...register('facebookPixelId')}
              placeholder="123456789012345"
              className="h-11 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 font-mono"
            />
          </FormField>
        </div>
      </SettingsCard>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <p className="text-sm text-white/40">
          {isDirty ? 'You have unsaved changes' : 'All changes saved'}
        </p>
        <Button
          type="submit"
          disabled={!isDirty || updateSeo.isPending}
          className="bg-primary hover:bg-primary/90 text-black font-medium min-w-[140px]"
        >
          {updateSeo.isPending ? (
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
