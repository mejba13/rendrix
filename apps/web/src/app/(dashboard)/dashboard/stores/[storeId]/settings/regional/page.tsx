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
  Globe,
  Scale,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useStore, useUpdateStoreSettings } from '@/hooks/use-stores';

const CURRENCIES = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  { value: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { value: 'CNY', label: 'Chinese Yuan', symbol: '¥' },
  { value: 'BRL', label: 'Brazilian Real', symbol: 'R$' },
  { value: 'MXN', label: 'Mexican Peso', symbol: 'MX$' },
];

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)', offset: '-05:00' },
  { value: 'America/Chicago', label: 'Central Time (CT)', offset: '-06:00' },
  { value: 'America/Denver', label: 'Mountain Time (MT)', offset: '-07:00' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: '-08:00' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)', offset: '-09:00' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)', offset: '-10:00' },
  { value: 'Europe/London', label: 'London (GMT)', offset: '+00:00' },
  { value: 'Europe/Paris', label: 'Paris (CET)', offset: '+01:00' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)', offset: '+01:00' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: '+09:00' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: '+08:00' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)', offset: '+05:30' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)', offset: '+11:00' },
];

const WEIGHT_UNITS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'lb', label: 'Pounds (lb)' },
] as const;

const DIMENSION_UNITS = [
  { value: 'cm', label: 'Centimeters (cm)' },
  { value: 'in', label: 'Inches (in)' },
] as const;

const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '12/22/2025' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '22/12/2025' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2025-12-22' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY', example: '22 Dec 2025' },
  { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY', example: 'Dec 22, 2025' },
];

const regionalSchema = z.object({
  currency: z.string(),
  timezone: z.string(),
  weightUnit: z.enum(['kg', 'lb']),
  dimensionUnit: z.enum(['cm', 'in']),
  dateFormat: z.string(),
});

type RegionalFormData = z.infer<typeof regionalSchema>;

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
  preview,
}: {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  preview?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-white/80">{label}</Label>
      <div className="flex items-center gap-4">
        <div className="flex-1">{children}</div>
        {preview && (
          <div className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white/60 font-mono">
            {preview}
          </div>
        )}
      </div>
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

// Live clock component
function LiveClock({ timezone }: { timezone: string }) {
  const [time, setTime] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        setTime(formatter.format(now));
      } catch {
        setTime('--:--:-- --');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-sm font-mono text-emerald-400">{time}</span>
    </div>
  );
}

export default function RegionalSettingsPage() {
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
  } = useForm<RegionalFormData>({
    resolver: zodResolver(regionalSchema),
    defaultValues: {
      currency: 'USD',
      timezone: 'America/New_York',
      weightUnit: 'kg',
      dimensionUnit: 'cm',
      dateFormat: 'MM/DD/YYYY',
    },
  });

  React.useEffect(() => {
    if (store?.settings) {
      reset({
        currency: store.settings.currency || 'USD',
        timezone: store.settings.timezone || 'America/New_York',
        weightUnit: store.settings.weightUnit || 'kg',
        dimensionUnit: store.settings.dimensionUnit || 'cm',
        dateFormat: 'MM/DD/YYYY', // dateFormat not stored in settings yet
      });
    }
  }, [store, reset]);

  const onSubmit = async (data: RegionalFormData) => {
    try {
      await updateSettings.mutateAsync({
        storeId,
        data: {
          currency: data.currency,
          timezone: data.timezone,
          weightUnit: data.weightUnit,
          dimensionUnit: data.dimensionUnit,
        },
      });
      toast({
        title: 'Regional settings saved',
        description: 'Your regional preferences have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save settings',
        variant: 'destructive',
      });
    }
  };

  const watchedCurrency = watch('currency');
  const watchedTimezone = watch('timezone');
  const watchedDateFormat = watch('dateFormat');

  const selectedCurrency = CURRENCIES.find(c => c.value === watchedCurrency);
  const selectedDateFormat = DATE_FORMATS.find(d => d.value === watchedDateFormat);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-48 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-48 rounded-2xl bg-white/[0.02]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Currency & Timezone */}
      <SettingsCard
        title="Localization"
        description="Set your store's primary currency and timezone."
        icon={Globe}
      >
        <div className="space-y-6">
          <FormField
            label="Currency"
            description="The primary currency for product prices and transactions."
            preview={selectedCurrency ? `${selectedCurrency.symbol}99.99` : undefined}
          >
            <Select
              value={watchedCurrency}
              onValueChange={(value) => setValue('currency', value, { shouldDirty: true })}
            >
              <SelectTrigger className="h-11 bg-white/[0.03] border-white/[0.08] text-white">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-[#151515] border-white/[0.08]">
                {CURRENCIES.map((currency) => (
                  <SelectItem
                    key={currency.value}
                    value={currency.value}
                    className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08]"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-6 text-center font-mono text-white/60">
                        {currency.symbol}
                      </span>
                      {currency.label} ({currency.value})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Timezone"
            description="Used for order timestamps and scheduled operations."
          >
            <div className="flex items-center gap-4">
              <Select
                value={watchedTimezone}
                onValueChange={(value) => setValue('timezone', value, { shouldDirty: true })}
              >
                <SelectTrigger className="h-11 bg-white/[0.03] border-white/[0.08] text-white flex-1">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="bg-[#151515] border-white/[0.08] max-h-[300px]">
                  {TIMEZONES.map((tz) => (
                    <SelectItem
                      key={tz.value}
                      value={tz.value}
                      className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08]"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-white/50 font-mono text-xs">
                          UTC{tz.offset}
                        </span>
                        {tz.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <LiveClock timezone={watchedTimezone} />
            </div>
          </FormField>
        </div>
      </SettingsCard>

      {/* Units of Measurement */}
      <SettingsCard
        title="Units of Measurement"
        description="Default units for product weight and dimensions."
        icon={Scale}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Weight Unit"
            description="Default unit for product weights."
          >
            <Select
              value={watch('weightUnit')}
              onValueChange={(value) => setValue('weightUnit', value as 'kg' | 'lb', { shouldDirty: true })}
            >
              <SelectTrigger className="h-11 bg-white/[0.03] border-white/[0.08] text-white">
                <SelectValue placeholder="Select weight unit" />
              </SelectTrigger>
              <SelectContent className="bg-[#151515] border-white/[0.08]">
                {WEIGHT_UNITS.map((unit) => (
                  <SelectItem
                    key={unit.value}
                    value={unit.value}
                    className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08]"
                  >
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Dimension Unit"
            description="Default unit for product dimensions."
          >
            <Select
              value={watch('dimensionUnit')}
              onValueChange={(value) => setValue('dimensionUnit', value as 'cm' | 'in', { shouldDirty: true })}
            >
              <SelectTrigger className="h-11 bg-white/[0.03] border-white/[0.08] text-white">
                <SelectValue placeholder="Select dimension unit" />
              </SelectTrigger>
              <SelectContent className="bg-[#151515] border-white/[0.08]">
                {DIMENSION_UNITS.map((unit) => (
                  <SelectItem
                    key={unit.value}
                    value={unit.value}
                    className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08]"
                  >
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </SettingsCard>

      {/* Date & Time Format */}
      <SettingsCard
        title="Date & Time Format"
        description="How dates are displayed throughout your store."
        icon={Calendar}
      >
        <FormField
          label="Date Format"
          description="Used for order dates, reports, and customer-facing content."
          preview={selectedDateFormat?.example}
        >
          <Select
            value={watchedDateFormat}
            onValueChange={(value) => setValue('dateFormat', value, { shouldDirty: true })}
          >
            <SelectTrigger className="h-11 bg-white/[0.03] border-white/[0.08] text-white">
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent className="bg-[#151515] border-white/[0.08]">
              {DATE_FORMATS.map((format) => (
                <SelectItem
                  key={format.value}
                  value={format.value}
                  className="text-white hover:bg-white/[0.08] focus:bg-white/[0.08]"
                >
                  <span className="flex items-center gap-3">
                    {format.label}
                    <span className="text-white/40 text-xs">({format.example})</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
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
