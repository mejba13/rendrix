'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import {
  Bell,
  ShoppingCart,
  Package,
  Users,
  Star,
  AlertTriangle,
  Mail,
  Smartphone,
  Info,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useStore } from '@/hooks/use-stores';
import { cn } from '@/lib/utils';

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

// Notification toggle component
function NotificationToggle({
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

export default function NotificationsSettingsPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const { isLoading } = useStore(storeId);

  // Local state for notification preferences (would be persisted via API in production)
  const [notifications, setNotifications] = React.useState({
    orderNotifications: true,
    lowStockNotifications: true,
    customerSignupNotifications: false,
    reviewNotifications: true,
    emailNotifications: true,
    pushNotifications: false,
    dailyDigest: false,
    weeklyReport: true,
  });

  const updateNotification = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-48 rounded-2xl bg-white/[0.02]" />
        <Skeleton className="h-48 rounded-2xl bg-white/[0.02]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-white">Notification Preferences</p>
          <p className="text-sm text-white/60 mt-1">
            Configure how and when you receive notifications about your store activity.
            Changes are saved automatically.
          </p>
        </div>
      </div>

      {/* Store Events */}
      <SettingsCard
        title="Store Events"
        description="Get notified about important events in your store."
        icon={Bell}
      >
        <div className="space-y-4">
          <NotificationToggle
            label="New Orders"
            description="Get notified when customers place new orders."
            checked={notifications.orderNotifications}
            onCheckedChange={(checked) => updateNotification('orderNotifications', checked)}
            icon={ShoppingCart}
          />

          <NotificationToggle
            label="Low Stock Alerts"
            description="Get notified when products are running low."
            checked={notifications.lowStockNotifications}
            onCheckedChange={(checked) => updateNotification('lowStockNotifications', checked)}
            icon={AlertTriangle}
          />

          <NotificationToggle
            label="New Customers"
            description="Get notified when new customers sign up."
            checked={notifications.customerSignupNotifications}
            onCheckedChange={(checked) => updateNotification('customerSignupNotifications', checked)}
            icon={Users}
          />

          <NotificationToggle
            label="Product Reviews"
            description="Get notified when customers leave reviews."
            checked={notifications.reviewNotifications}
            onCheckedChange={(checked) => updateNotification('reviewNotifications', checked)}
            icon={Star}
          />
        </div>
      </SettingsCard>

      {/* Delivery Methods */}
      <SettingsCard
        title="Delivery Methods"
        description="Choose how you want to receive notifications."
        icon={Mail}
      >
        <div className="space-y-4">
          <NotificationToggle
            label="Email Notifications"
            description="Receive notifications via email."
            checked={notifications.emailNotifications}
            onCheckedChange={(checked) => updateNotification('emailNotifications', checked)}
            icon={Mail}
          />

          <NotificationToggle
            label="Push Notifications"
            description="Receive push notifications in your browser."
            checked={notifications.pushNotifications}
            onCheckedChange={(checked) => updateNotification('pushNotifications', checked)}
            icon={Smartphone}
          />
        </div>
      </SettingsCard>

      {/* Reports & Digests */}
      <SettingsCard
        title="Reports & Digests"
        description="Scheduled summary reports for your store."
        icon={Package}
      >
        <div className="space-y-4">
          <NotificationToggle
            label="Daily Digest"
            description="Receive a daily summary of store activity."
            checked={notifications.dailyDigest}
            onCheckedChange={(checked) => updateNotification('dailyDigest', checked)}
            icon={Package}
          />

          <NotificationToggle
            label="Weekly Report"
            description="Receive a weekly performance report."
            checked={notifications.weeklyReport}
            onCheckedChange={(checked) => updateNotification('weeklyReport', checked)}
            icon={Package}
          />
        </div>
      </SettingsCard>
    </div>
  );
}
