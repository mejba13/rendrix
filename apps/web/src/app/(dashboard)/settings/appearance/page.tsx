'use client';

import * as React from 'react';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
  Loader2,
  Minimize2,
  Maximize2,
  Sparkles,
  LayoutGrid,
  SidebarClose,
  SidebarOpen,
  Zap,
  Eye,
  Home,
  Package,
  ShoppingCart,
  BarChart3,
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
interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  display: {
    compactMode: boolean;
    sidebarPosition: 'left' | 'right';
    reduceAnimations: boolean;
    highContrast: boolean;
  };
  dashboard: {
    defaultPage: string;
    showRevenueWidget: boolean;
    showOrdersWidget: boolean;
    showProductsWidget: boolean;
    gridDensity: 'comfortable' | 'compact' | 'spacious';
  };
}

// Accent color presets
const accentColors = [
  { name: 'Orange', value: '#FF9100', class: 'bg-[#FF9100]' },
  { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500' },
  { name: 'Green', value: '#22C55E', class: 'bg-green-500' },
  { name: 'Purple', value: '#8B5CF6', class: 'bg-purple-500' },
  { name: 'Red', value: '#EF4444', class: 'bg-red-500' },
  { name: 'Pink', value: '#EC4899', class: 'bg-pink-500' },
  { name: 'Cyan', value: '#06B6D4', class: 'bg-cyan-500' },
  { name: 'Amber', value: '#F59E0B', class: 'bg-amber-500' },
];

const defaultPages = [
  { value: 'dashboard', label: 'Dashboard Home', icon: Home },
  { value: 'products', label: 'Products', icon: Package },
  { value: 'orders', label: 'Orders', icon: ShoppingCart },
  { value: 'analytics', label: 'Analytics', icon: BarChart3 },
];

// Initial settings
const initialSettings: AppearanceSettings = {
  theme: 'dark',
  accentColor: '#FF9100',
  display: {
    compactMode: false,
    sidebarPosition: 'left',
    reduceAnimations: false,
    highContrast: false,
  },
  dashboard: {
    defaultPage: 'dashboard',
    showRevenueWidget: true,
    showOrdersWidget: true,
    showProductsWidget: true,
    gridDensity: 'comfortable',
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

// Theme Preview Card
function ThemePreviewCard({
  theme,
  label,
  icon: Icon,
  isSelected,
  onSelect,
}: {
  theme: 'light' | 'dark' | 'system';
  label: string;
  icon: React.ElementType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const previewStyles = {
    light: {
      bg: 'bg-white',
      header: 'bg-gray-100',
      sidebar: 'bg-gray-50',
      text: 'bg-gray-800',
      textMuted: 'bg-gray-400',
      card: 'bg-white border-gray-200',
      accent: 'bg-primary',
    },
    dark: {
      bg: 'bg-[#0a0a0a]',
      header: 'bg-black',
      sidebar: 'bg-black',
      text: 'bg-white',
      textMuted: 'bg-white/40',
      card: 'bg-white/[0.04] border-white/[0.08]',
      accent: 'bg-primary',
    },
    system: {
      bg: 'bg-gradient-to-br from-[#0a0a0a] to-white',
      header: 'bg-gradient-to-r from-black to-gray-100',
      sidebar: 'bg-gradient-to-b from-black to-gray-50',
      text: 'bg-white',
      textMuted: 'bg-white/40',
      card: 'bg-white/[0.04] border-white/[0.08]',
      accent: 'bg-primary',
    },
  };

  const styles = previewStyles[theme];

  return (
    <button
      onClick={onSelect}
      className={`relative p-1 rounded-2xl transition-all ${
        isSelected
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-black'
          : 'hover:ring-1 hover:ring-white/20'
      }`}
    >
      {/* Mini Preview */}
      <div className={`w-full aspect-[4/3] rounded-xl overflow-hidden ${styles.bg} border border-white/[0.08]`}>
        {/* Header */}
        <div className={`h-3 ${styles.header} flex items-center px-1.5 gap-0.5`}>
          <div className="w-1 h-1 rounded-full bg-red-400/60" />
          <div className="w-1 h-1 rounded-full bg-yellow-400/60" />
          <div className="w-1 h-1 rounded-full bg-green-400/60" />
        </div>

        <div className="flex h-[calc(100%-12px)]">
          {/* Sidebar */}
          <div className={`w-8 ${styles.sidebar} border-r border-white/[0.04] p-1 space-y-1`}>
            <div className={`w-full aspect-square rounded ${styles.accent}`} />
            <div className={`h-1.5 rounded ${styles.textMuted}`} />
            <div className={`h-1.5 rounded ${styles.textMuted}`} />
          </div>

          {/* Content */}
          <div className="flex-1 p-2 space-y-1.5">
            <div className={`h-2 w-16 rounded ${styles.text}`} />
            <div className={`h-1.5 w-24 rounded ${styles.textMuted}`} />
            <div className="grid grid-cols-3 gap-1 mt-2">
              <div className={`aspect-square rounded ${styles.card} border`} />
              <div className={`aspect-square rounded ${styles.card} border`} />
              <div className={`aspect-square rounded ${styles.card} border`} />
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className={`flex items-center justify-center gap-2 mt-3 mb-1 ${
        isSelected ? 'text-primary' : 'text-white/70'
      }`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
        {isSelected && <Check className="w-4 h-4" />}
      </div>
    </button>
  );
}

// Main Appearance Page
export default function AppearancePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [settings, setSettings] = React.useState<AppearanceSettings>(initialSettings);
  const [hasChanges, setHasChanges] = React.useState(false);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const updateSettings = <K extends keyof AppearanceSettings>(
    key: K,
    value: AppearanceSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateDisplaySetting = (key: keyof AppearanceSettings['display'], value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      display: { ...prev.display, [key]: value },
    }));
    setHasChanges(true);
  };

  const updateDashboardSetting = (key: keyof AppearanceSettings['dashboard'], value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      dashboard: { ...prev.dashboard, [key]: value },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasChanges(false);
    toast({
      title: 'Appearance saved',
      description: 'Your appearance preferences have been updated.',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px] rounded-2xl" />
        <Skeleton className="h-[200px] rounded-2xl" />
        <Skeleton className="h-[250px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <SettingsCard
        title="Theme"
        description="Choose your preferred color scheme"
        icon={Palette}
      >
        <div className="grid grid-cols-3 gap-4">
          <ThemePreviewCard
            theme="light"
            label="Light"
            icon={Sun}
            isSelected={settings.theme === 'light'}
            onSelect={() => updateSettings('theme', 'light')}
          />
          <ThemePreviewCard
            theme="dark"
            label="Dark"
            icon={Moon}
            isSelected={settings.theme === 'dark'}
            onSelect={() => updateSettings('theme', 'dark')}
          />
          <ThemePreviewCard
            theme="system"
            label="System"
            icon={Monitor}
            isSelected={settings.theme === 'system'}
            onSelect={() => updateSettings('theme', 'system')}
          />
        </div>
      </SettingsCard>

      {/* Accent Color */}
      <SettingsCard
        title="Accent Color"
        description="Customize the primary accent color"
        icon={Sparkles}
      >
        <div className="space-y-4">
          {/* Color Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => updateSettings('accentColor', color.value)}
                className={`relative w-12 h-12 rounded-xl ${color.class} transition-all ${
                  settings.accentColor === color.value
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                    : 'hover:scale-105'
                }`}
                title={color.name}
              >
                {settings.accentColor === color.value && (
                  <Check className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-sm text-white/50 mb-3">Preview</p>
            <div className="flex items-center gap-3">
              <Button
                style={{ backgroundColor: settings.accentColor }}
                className="text-black font-semibold"
              >
                Primary Button
              </Button>
              <Button
                variant="outline"
                style={{ borderColor: settings.accentColor, color: settings.accentColor }}
                className="hover:bg-white/[0.04]"
              >
                Outline Button
              </Button>
              <div
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: `${settings.accentColor}20`, color: settings.accentColor }}
              >
                Badge
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Display Settings */}
      <SettingsCard
        title="Display Settings"
        description="Customize how the dashboard looks"
        icon={Eye}
      >
        <div className="space-y-1">
          {/* Compact Mode */}
          <div className="flex items-center justify-between py-4 border-b border-white/[0.04]">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                settings.display.compactMode ? 'bg-primary/20' : 'bg-white/[0.04]'
              }`}>
                {settings.display.compactMode ? (
                  <Minimize2 className="w-5 h-5 text-primary" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-white/40" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">Compact Mode</p>
                <p className="text-xs text-white/40 mt-0.5">
                  Reduce spacing for a denser interface
                </p>
              </div>
            </div>
            <Switch
              checked={settings.display.compactMode}
              onCheckedChange={(v) => updateDisplaySetting('compactMode', v)}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Sidebar Position */}
          <div className="flex items-center justify-between py-4 border-b border-white/[0.04]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                {settings.display.sidebarPosition === 'left' ? (
                  <SidebarOpen className="w-5 h-5 text-white/40" />
                ) : (
                  <SidebarClose className="w-5 h-5 text-white/40" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">Sidebar Position</p>
                <p className="text-xs text-white/40 mt-0.5">
                  Choose which side the navigation appears
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {(['left', 'right'] as const).map((position) => (
                <button
                  key={position}
                  onClick={() => updateDisplaySetting('sidebarPosition', position)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    settings.display.sidebarPosition === position
                      ? 'bg-primary text-black'
                      : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08]'
                  }`}
                >
                  {position.charAt(0).toUpperCase() + position.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Reduce Animations */}
          <div className="flex items-center justify-between py-4 border-b border-white/[0.04]">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                settings.display.reduceAnimations ? 'bg-white/[0.08]' : 'bg-white/[0.04]'
              }`}>
                <Zap className={`w-5 h-5 ${settings.display.reduceAnimations ? 'text-white/60' : 'text-white/40'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Reduce Animations</p>
                <p className="text-xs text-white/40 mt-0.5">
                  Minimize motion for better accessibility
                </p>
              </div>
            </div>
            <Switch
              checked={settings.display.reduceAnimations}
              onCheckedChange={(v) => updateDisplaySetting('reduceAnimations', v)}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                settings.display.highContrast ? 'bg-white text-black' : 'bg-white/[0.04]'
              }`}>
                <Eye className={`w-5 h-5 ${settings.display.highContrast ? 'text-black' : 'text-white/40'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">High Contrast</p>
                <p className="text-xs text-white/40 mt-0.5">
                  Increase contrast for better visibility
                </p>
              </div>
            </div>
            <Switch
              checked={settings.display.highContrast}
              onCheckedChange={(v) => updateDisplaySetting('highContrast', v)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      </SettingsCard>

      {/* Dashboard Layout */}
      <SettingsCard
        title="Dashboard Layout"
        description="Customize your dashboard experience"
        icon={LayoutGrid}
      >
        <div className="space-y-6">
          {/* Default Landing Page */}
          <div className="space-y-3">
            <Label className="text-white/70">Default Landing Page</Label>
            <Select
              value={settings.dashboard.defaultPage}
              onValueChange={(v) => updateDashboardSetting('defaultPage', v)}
            >
              <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#151515] border-white/[0.08]">
                {defaultPages.map((page) => (
                  <SelectItem
                    key={page.value}
                    value={page.value}
                    className="text-white hover:bg-white/[0.08]"
                  >
                    <div className="flex items-center gap-2">
                      <page.icon className="w-4 h-4 text-white/50" />
                      {page.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Widget Visibility */}
          <div className="space-y-3">
            <Label className="text-white/70">Dashboard Widgets</Label>
            <div className="space-y-2">
              {[
                { key: 'showRevenueWidget' as const, label: 'Revenue Overview' },
                { key: 'showOrdersWidget' as const, label: 'Recent Orders' },
                { key: 'showProductsWidget' as const, label: 'Top Products' },
              ].map((widget) => (
                <div
                  key={widget.key}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]"
                >
                  <span className="text-sm text-white/70">{widget.label}</span>
                  <Switch
                    checked={settings.dashboard[widget.key]}
                    onCheckedChange={(v) => updateDashboardSetting(widget.key, v)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Grid Density */}
          <div className="space-y-3">
            <Label className="text-white/70">Grid Density</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'comfortable', label: 'Comfortable', desc: 'More spacing' },
                { value: 'compact', label: 'Compact', desc: 'Less spacing' },
                { value: 'spacious', label: 'Spacious', desc: 'Maximum spacing' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateDashboardSetting('gridDensity', option.value)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    settings.dashboard.gridDensity === option.value
                      ? 'bg-primary/10 border-primary'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                  }`}
                >
                  <p className={`text-sm font-medium ${
                    settings.dashboard.gridDensity === option.value ? 'text-primary' : 'text-white'
                  }`}>
                    {option.label}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">{option.desc}</p>
                </button>
              ))}
            </div>
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
