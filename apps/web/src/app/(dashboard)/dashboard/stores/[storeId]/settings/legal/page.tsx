'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  FileText,
  Shield,
  RefreshCcw,
  Truck,
  Info,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useStore } from '@/hooks/use-stores';

// Settings card component
function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
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
          {action}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Policy editor component
function PolicyEditor({
  label,
  description,
  value,
  onChange,
  placeholder,
  icon: Icon,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon: React.ElementType;
}) {
  const [charCount, setCharCount] = React.useState(value?.length || 0);

  return (
    <SettingsCard
      title={label}
      description={description}
      icon={Icon}
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-white/50 hover:text-white hover:bg-white/[0.08]"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Preview
        </Button>
      }
    >
      <div className="space-y-3">
        <Textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setCharCount(e.target.value.length);
          }}
          placeholder={placeholder}
          className="min-h-[200px] bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/30 focus:border-primary/50 resize-none font-mono text-sm"
        />
        <div className="flex items-center justify-between text-xs text-white/40">
          <div className="flex items-center gap-1.5">
            <Info className="w-3 h-3" />
            <span>Supports basic markdown formatting.</span>
          </div>
          <span>{charCount.toLocaleString()} characters</span>
        </div>
      </div>
    </SettingsCard>
  );
}

export default function LegalSettingsPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const { isLoading } = useStore(storeId);

  // Local state for policy content (would be persisted via API in production)
  const [policies, setPolicies] = React.useState({
    privacyPolicy: '',
    termsOfService: '',
    refundPolicy: '',
    shippingPolicy: '',
  });

  const updatePolicy = (key: keyof typeof policies, value: string) => {
    setPolicies(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-80 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-80 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-80 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-80 rounded-2xl bg-white/[0.02]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-white">Legal Disclaimer</p>
          <p className="text-sm text-white/60 mt-1">
            These policies will be displayed on your storefront. We recommend consulting
            with a legal professional to ensure compliance with applicable laws.
          </p>
        </div>
      </div>

      {/* Privacy Policy */}
      <PolicyEditor
        label="Privacy Policy"
        description="How you collect, use, and protect customer data."
        value={policies.privacyPolicy}
        onChange={(value) => updatePolicy('privacyPolicy', value)}
        placeholder="Enter your privacy policy here..."
        icon={Shield}
      />

      {/* Terms of Service */}
      <PolicyEditor
        label="Terms of Service"
        description="Rules and guidelines for using your store."
        value={policies.termsOfService}
        onChange={(value) => updatePolicy('termsOfService', value)}
        placeholder="Enter your terms of service here..."
        icon={FileText}
      />

      {/* Refund Policy */}
      <PolicyEditor
        label="Refund Policy"
        description="Your return, refund, and exchange policies."
        value={policies.refundPolicy}
        onChange={(value) => updatePolicy('refundPolicy', value)}
        placeholder="Enter your refund policy here..."
        icon={RefreshCcw}
      />

      {/* Shipping Policy */}
      <PolicyEditor
        label="Shipping Policy"
        description="Shipping methods, times, and costs."
        value={policies.shippingPolicy}
        onChange={(value) => updatePolicy('shippingPolicy', value)}
        placeholder="Enter your shipping policy here..."
        icon={Truck}
      />
    </div>
  );
}
