'use client';

import * as React from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  Clock,
  Volume2,
  VolumeX,
  AlertCircle,
  Package,
  Truck,
  Users,
  BarChart3,
  Megaphone,
  Check,
  Loader2,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Types
interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ElementType;
}

interface NotificationPreferences {
  emailNotifications: NotificationSetting[];
  pushNotifications: {
    enabled: boolean;
    sound: boolean;
    criticalOnly: boolean;
  };
  preferences: {
    frequency: 'instant' | 'daily' | 'weekly';
    quietHoursStart: string;
    quietHoursEnd: string;
    doNotDisturb: boolean;
  };
}

// Initial notification settings
const initialSettings: NotificationPreferences = {
  emailNotifications: [
    {
      id: 'orders',
      title: 'Order Confirmations',
      description: 'Receive notifications when new orders are placed',
      enabled: true,
      icon: Package,
    },
    {
      id: 'shipping',
      title: 'Shipping Updates',
      description: 'Get notified about order shipments and deliveries',
      enabled: true,
      icon: Truck,
    },
    {
      id: 'lowStock',
      title: 'Low Stock Alerts',
      description: 'Alert when products are running low on inventory',
      enabled: true,
      icon: AlertCircle,
    },
    {
      id: 'customers',
      title: 'New Customer Signups',
      description: 'Notification when new customers register',
      enabled: false,
      icon: Users,
    },
    {
      id: 'reports',
      title: 'Weekly Reports',
      description: 'Receive weekly analytics and performance reports',
      enabled: true,
      icon: BarChart3,
    },
    {
      id: 'marketing',
      title: 'Marketing Updates',
      description: 'Tips, best practices, and product updates from Rendrix',
      enabled: false,
      icon: Megaphone,
    },
  ],
  pushNotifications: {
    enabled: true,
    sound: true,
    criticalOnly: false,
  },
  preferences: {
    frequency: 'instant',
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    doNotDisturb: false,
  },
};

// Settings Card Component
function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <Icon className="w-5 h-5 text-white/50" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            {description && (
              <p className="text-sm text-white/40 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Notification Toggle Item
function NotificationToggle({
  setting,
  onToggle,
}: {
  setting: NotificationSetting;
  onToggle: (enabled: boolean) => void;
}) {
  const Icon = setting.icon;

  return (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.04] last:border-0 last:pb-0 first:pt-0">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          setting.enabled ? 'bg-primary/20' : 'bg-white/[0.04]'
        }`}>
          <Icon className={`w-5 h-5 ${setting.enabled ? 'text-primary' : 'text-white/40'}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{setting.title}</p>
          <p className="text-xs text-white/40 mt-0.5">{setting.description}</p>
        </div>
      </div>
      <Switch
        checked={setting.enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
}

// Time Picker Component
function TimePicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-white/50 text-xs">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#151515] border-white/[0.08]">
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i.toString().padStart(2, '0');
            return (
              <SelectItem key={hour} value={`${hour}:00`} className="text-white hover:bg-white/[0.08]">
                {hour}:00
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

// Main Notifications Page
export default function NotificationsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [settings, setSettings] = React.useState<NotificationPreferences>(initialSettings);
  const [hasChanges, setHasChanges] = React.useState(false);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleEmailToggle = (id: string, enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      emailNotifications: prev.emailNotifications.map((n) =>
        n.id === id ? { ...n, enabled } : n
      ),
    }));
    setHasChanges(true);
  };

  const handlePushToggle = (key: keyof typeof settings.pushNotifications, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      pushNotifications: {
        ...prev.pushNotifications,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handlePreferenceChange = (key: keyof typeof settings.preferences, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasChanges(false);
    toast({
      title: 'Preferences saved',
      description: 'Your notification preferences have been updated.',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] rounded-2xl" />
        <Skeleton className="h-[200px] rounded-2xl" />
        <Skeleton className="h-[250px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <SettingsCard
        title="Email Notifications"
        description="Choose what emails you want to receive"
        icon={Mail}
      >
        <div className="space-y-1">
          {settings.emailNotifications.map((setting) => (
            <NotificationToggle
              key={setting.id}
              setting={setting}
              onToggle={(enabled) => handleEmailToggle(setting.id, enabled)}
            />
          ))}
        </div>
      </SettingsCard>

      {/* Push Notifications */}
      <SettingsCard
        title="Push Notifications"
        description="Configure browser and mobile notifications"
        icon={Smartphone}
      >
        <div className="space-y-4">
          {/* Enable Push */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                settings.pushNotifications.enabled ? 'bg-primary/20' : 'bg-white/[0.04]'
              }`}>
                <Bell className={`w-5 h-5 ${settings.pushNotifications.enabled ? 'text-primary' : 'text-white/40'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Enable Push Notifications</p>
                <p className="text-xs text-white/40 mt-0.5">
                  Receive real-time notifications in your browser
                </p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications.enabled}
              onCheckedChange={(v) => handlePushToggle('enabled', v)}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {settings.pushNotifications.enabled && (
            <>
              {/* Sound */}
              <div className="flex items-center justify-between py-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    settings.pushNotifications.sound ? 'bg-white/[0.08]' : 'bg-white/[0.04]'
                  }`}>
                    {settings.pushNotifications.sound ? (
                      <Volume2 className="w-5 h-5 text-white/60" />
                    ) : (
                      <VolumeX className="w-5 h-5 text-white/40" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Notification Sound</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      Play a sound when notifications arrive
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications.sound}
                  onCheckedChange={(v) => handlePushToggle('sound', v)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {/* Critical Only */}
              <div className="flex items-center justify-between py-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    settings.pushNotifications.criticalOnly ? 'bg-amber-500/20' : 'bg-white/[0.04]'
                  }`}>
                    <AlertCircle className={`w-5 h-5 ${settings.pushNotifications.criticalOnly ? 'text-amber-400' : 'text-white/40'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Critical Alerts Only</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      Only receive urgent notifications like low stock or failed orders
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications.criticalOnly}
                  onCheckedChange={(v) => handlePushToggle('criticalOnly', v)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </>
          )}
        </div>
      </SettingsCard>

      {/* Notification Preferences */}
      <SettingsCard
        title="Notification Preferences"
        description="Control when and how you receive notifications"
        icon={Clock}
      >
        <div className="space-y-6">
          {/* Frequency */}
          <div className="space-y-3">
            <Label className="text-white/70">Notification Frequency</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'instant', label: 'Instant', desc: 'Real-time alerts' },
                { value: 'daily', label: 'Daily Digest', desc: 'Once per day' },
                { value: 'weekly', label: 'Weekly Digest', desc: 'Once per week' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePreferenceChange('frequency', option.value as 'instant' | 'daily' | 'weekly')}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    settings.preferences.frequency === option.value
                      ? 'bg-primary/10 border-primary'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                  }`}
                >
                  <p className={`text-sm font-medium ${
                    settings.preferences.frequency === option.value ? 'text-primary' : 'text-white'
                  }`}>
                    {option.label}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white/70">Quiet Hours</Label>
                <p className="text-xs text-white/40 mt-0.5">
                  Pause non-critical notifications during specified hours
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TimePicker
                label="Start Time"
                value={settings.preferences.quietHoursStart}
                onChange={(v) => handlePreferenceChange('quietHoursStart', v)}
              />
              <TimePicker
                label="End Time"
                value={settings.preferences.quietHoursEnd}
                onChange={(v) => handlePreferenceChange('quietHoursEnd', v)}
              />
            </div>
          </div>

          {/* Do Not Disturb */}
          <div className="flex items-center justify-between py-3 border-t border-white/[0.04]">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                settings.preferences.doNotDisturb ? 'bg-purple-500/20' : 'bg-white/[0.04]'
              }`}>
                <Moon className={`w-5 h-5 ${settings.preferences.doNotDisturb ? 'text-purple-400' : 'text-white/40'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Do Not Disturb</p>
                <p className="text-xs text-white/40 mt-0.5">
                  Temporarily pause all notifications
                </p>
              </div>
            </div>
            <Switch
              checked={settings.preferences.doNotDisturb}
              onCheckedChange={(v) => handlePreferenceChange('doNotDisturb', v)}
              className="data-[state=checked]:bg-purple-500"
            />
          </div>
        </div>
      </SettingsCard>

      {/* Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-[#1a1a1a] border border-white/[0.1] shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm text-white/70">You have unsaved changes</span>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-black font-semibold rounded-full"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
