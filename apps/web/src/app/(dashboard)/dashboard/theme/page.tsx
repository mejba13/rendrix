'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStoreStore } from '@/store/store';
import {
  useThemes,
  useStoreTheme,
  useApplyTheme,
  type Theme,
  type ThemesParams,
} from '@/hooks/use-themes';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Search,
  Crown,
  Check,
  X,
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Type,
  Layout,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Sparkles,
  Eye,
  Zap,
  Store,
  Grid3X3,
  SlidersHorizontal,
  Upload,
  Layers,
  Code2,
  Archive,
  FolderOpen,
} from 'lucide-react';
import Link from 'next/link';

// Industry categories for filtering
const INDUSTRIES = [
  { id: 'all', label: 'All Themes' },
  { id: 'general', label: 'General' },
  { id: 'garments', label: 'Fashion' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'gadgets', label: 'Tech' },
  { id: 'home_decor', label: 'Home' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'sports', label: 'Sports' },
  { id: 'toys', label: 'Kids' },
];

const THEMES_PER_PAGE = 6;

// Store Switch Banner Component
function StoreSwitchBanner({
  storeName,
  industry,
  onDismiss,
}: {
  storeName: string;
  industry: string;
  onDismiss: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 p-4 mb-6 animate-in slide-in-from-top-2 duration-300">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDBMMCA0MHoiIGZpbGw9InJnYmEoMjUxLDE5MSw1NCwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Store className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-white/70">Switched to</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{storeName}</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/60 capitalize">
                {industry.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Theme Card Skeleton
function ThemeCardSkeleton() {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.06]">
      <Skeleton className="aspect-[4/3] bg-white/[0.04]" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 bg-white/[0.06]" />
            <Skeleton className="h-3 w-32 bg-white/[0.04]" />
          </div>
          <Skeleton className="h-6 w-14 bg-white/[0.06]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full bg-white/[0.04]" />
          <Skeleton className="h-6 w-16 rounded-full bg-white/[0.04]" />
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
          <Skeleton className="h-4 w-12 bg-white/[0.04]" />
          <div className="flex gap-1">
            <Skeleton className="w-5 h-5 rounded-full bg-white/[0.06]" />
            <Skeleton className="w-5 h-5 rounded-full bg-white/[0.06]" />
            <Skeleton className="w-5 h-5 rounded-full bg-white/[0.06]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Theme Card Component
function ThemeCard({
  theme,
  isActive,
  onPreview,
  onApply,
  isApplying,
}: {
  theme: Theme;
  isActive: boolean;
  onPreview: () => void;
  onApply: () => void;
  isApplying: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = theme.settingsSchema?.colors || {};
  const typography = theme.settingsSchema?.typography;

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer
        ${isActive
          ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-[#0a0a0a]'
          : 'hover:ring-1 hover:ring-white/20 hover:translate-y-[-2px]'
        }
        bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06]
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onPreview}
    >
      {/* Preview Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Gradient background based on theme colors */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            background: `linear-gradient(135deg, ${colors.primary || '#333'}20, ${colors.secondary || '#666'}30, ${colors.accent || '#999'}20)`,
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />

        {/* Mock browser preview */}
        <div className="absolute inset-3 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 overflow-hidden shadow-2xl">
          {/* Browser chrome */}
          <div className="h-6 bg-white/5 flex items-center px-2 gap-1.5 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-red-400/70" />
            <div className="w-2 h-2 rounded-full bg-yellow-400/70" />
            <div className="w-2 h-2 rounded-full bg-green-400/70" />
            <div className="flex-1 mx-4">
              <div className="h-3 rounded-full bg-white/10 max-w-[100px] mx-auto" />
            </div>
          </div>

          {/* Page content mock */}
          <div className="p-3 space-y-2" style={{ backgroundColor: colors.background || '#fff' }}>
            <div className="h-4 w-20 rounded" style={{ backgroundColor: (colors.text || '#000') + '40' }} />
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-md transition-transform duration-300"
                  style={{
                    backgroundColor: i === 1 ? colors.primary : i === 2 ? colors.secondary : colors.accent,
                    opacity: 0.6,
                    transform: isHovered ? `scale(${1 + i * 0.02})` : 'scale(1)',
                    transitionDelay: `${i * 50}ms`,
                  }}
                />
              ))}
            </div>
            <div className="space-y-1 pt-1">
              <div className="h-2 w-3/4 rounded" style={{ backgroundColor: (colors.text || '#000') + '30' }} />
              <div className="h-2 w-1/2 rounded" style={{ backgroundColor: (colors.text || '#000') + '20' }} />
            </div>
          </div>
        </div>

        {/* Badges */}
        {theme.isPremium && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-semibold shadow-lg shadow-amber-500/20">
              <Crown className="w-3 h-3" />
              <span>Premium</span>
            </div>
          </div>
        )}

        {isActive && (
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500 text-white text-xs font-semibold shadow-lg">
              <Check className="w-3 h-3" />
              <span>Active</span>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center gap-3 transition-all duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <Button
            size="sm"
            variant="outline"
            className="border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          {!isActive && (
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
              disabled={isApplying}
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              {isApplying ? 'Applying...' : 'Apply'}
            </Button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">
              {theme.name}
            </h3>
            <p className="text-sm text-white/40 mt-0.5">
              {typography?.headingFont || 'Sans Serif'} Typography
            </p>
          </div>
          <div className="text-right">
            {theme.isPremium ? (
              <span className="text-lg font-bold text-white">${theme.price}</span>
            ) : (
              <span className="text-sm font-semibold text-green-400">Free</span>
            )}
          </div>
        </div>

        {/* Industry tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(theme.industries as string[]).slice(0, 3).map((industry) => (
            <span
              key={industry}
              className="px-2 py-0.5 text-xs rounded-full bg-white/[0.06] text-white/50 border border-white/[0.06] capitalize"
            >
              {industry.replace('_', ' ')}
            </span>
          ))}
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
          <span className="text-xs text-white/30">Colors:</span>
          <div className="flex gap-1">
            {Object.values(colors).slice(0, 4).map((color, idx) => (
              <div
                key={idx}
                className="w-5 h-5 rounded-full border border-white/20 shadow-sm transition-transform hover:scale-110"
                style={{ backgroundColor: color as string }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Featured Theme Banner
function FeaturedThemeBanner({
  theme,
  themeSettings,
  onCustomize,
  onChange,
}: {
  theme: Theme | null;
  themeSettings: Record<string, unknown>;
  onCustomize: () => void;
  onChange: () => void;
}) {
  if (!theme) return null;

  const colors = (themeSettings?.colors || theme.settingsSchema?.colors || {}) as Record<string, string>;
  const typography = (themeSettings?.typography || theme.settingsSchema?.typography || {}) as Record<string, string>;
  const layout = (themeSettings?.layout || theme.settingsSchema?.layout || {}) as Record<string, unknown>;

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8">
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/50 via-orange-500/50 to-amber-500/50 bg-[length:200%_100%] animate-[shimmer_4s_ease-in-out_infinite] rounded-2xl blur-sm" />

      <div className="relative m-[1px] rounded-2xl bg-[#0c0c0c] p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mini Preview */}
          <div className="relative w-full lg:w-96 aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08] shadow-2xl">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${colors.primary || '#333'}25, ${colors.secondary || '#666'}35, ${colors.accent || '#999'}25)`,
              }}
            />

            {/* Mock preview */}
            <div className="absolute inset-3 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 overflow-hidden">
              <div className="h-4 bg-white/5 flex items-center px-2 gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
              </div>
              <div className="p-3 space-y-2" style={{ backgroundColor: (colors.background || '#fff') + '20' }}>
                <div className="h-4 rounded bg-gradient-to-r from-white/20 to-transparent w-24" />
                <div className="grid grid-cols-3 gap-1.5">
                  {[colors.primary, colors.secondary, colors.accent].map((color, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-md"
                      style={{ backgroundColor: (color || '#666') + '60' }}
                    />
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-3/4 rounded bg-white/15" />
                  <div className="h-2 w-1/2 rounded bg-white/10" />
                </div>
              </div>
            </div>

            {/* Live badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/90 text-white text-xs font-semibold shadow-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Live</span>
            </div>
          </div>

          {/* Theme Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">{theme.name}</h2>
                {theme.isPremium && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                )}
              </div>
              <p className="text-white/50 text-sm mb-6 max-w-xl leading-relaxed">
                {theme.description || 'Your current storefront theme. Customize colors, typography, and layout to match your brand.'}
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 max-w-md">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-white/40 mb-2">
                    <Palette className="w-4 h-4" />
                    <span className="text-xs">Colors</span>
                  </div>
                  <div className="flex gap-1">
                    {Object.values(colors).slice(0, 3).map((color, i) => (
                      <div key={i} className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: color as string }} />
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-white/40 mb-2">
                    <Type className="w-4 h-4" />
                    <span className="text-xs">Typography</span>
                  </div>
                  <p className="text-sm text-white font-medium truncate">{typography.headingFont || 'Sans Serif'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-white/40 mb-2">
                    <Layout className="w-4 h-4" />
                    <span className="text-xs">Layout</span>
                  </div>
                  <p className="text-sm text-white font-medium capitalize">{String(layout.containerWidth || 'Medium')}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                onClick={onCustomize}
              >
                <Settings2 className="w-4 h-4 mr-2" />
                Customize Theme
              </Button>
              <Button
                variant="outline"
                className="border-white/20 bg-white/[0.05] text-white hover:text-white hover:bg-white/[0.1]"
                onClick={onChange}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Browse Themes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Theme Preview Modal
function ThemePreviewModal({
  theme,
  isOpen,
  onClose,
  onApply,
  isActive,
  isApplying,
}: {
  theme: Theme | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  isActive: boolean;
  isApplying: boolean;
}) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!theme) return null;

  const colors = theme.settingsSchema?.colors || {};
  const typography = theme.settingsSchema?.typography || {};
  const features = theme.features || [];

  const deviceConfig = {
    desktop: { width: '100%', maxWidth: '100%' },
    tablet: { width: '768px', maxWidth: '768px' },
    mobile: { width: '375px', maxWidth: '375px' },
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 bg-[#0a0a0a] border-white/[0.08] overflow-hidden">
        <div className="flex h-full">
          {/* Preview Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-white">{theme.name}</h2>
                {theme.isPremium && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                )}
              </div>

              {/* Device selector */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                {[
                  { id: 'desktop', icon: Monitor, label: 'Desktop' },
                  { id: 'tablet', icon: Tablet, label: 'Tablet' },
                  { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDevice(d.id as typeof device)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      device === d.id
                        ? 'bg-white/[0.1] text-white'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    <d.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{d.label}</span>
                  </button>
                ))}
              </div>

              <DialogClose className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </DialogClose>
            </div>

            {/* Preview frame */}
            <div className="flex-1 flex items-center justify-center p-6 bg-[#050505] overflow-hidden">
              <div
                className="h-full rounded-xl overflow-hidden bg-white shadow-2xl transition-all duration-500 ease-out"
                style={{
                  width: deviceConfig[device].width,
                  maxWidth: deviceConfig[device].maxWidth,
                }}
              >
                {/* Mock page content */}
                <div className="h-full flex flex-col" style={{ backgroundColor: colors.background || '#ffffff' }}>
                  {/* Browser chrome */}
                  <div className="h-8 bg-gray-100 flex items-center px-3 gap-2 flex-shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 mx-8">
                      <div className="h-5 rounded-full bg-gray-200 max-w-xs mx-auto" />
                    </div>
                  </div>

                  {/* Header */}
                  <div className="px-6 py-4 border-b" style={{ borderColor: (colors.text || '#000') + '10' }}>
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-32 rounded" style={{ backgroundColor: colors.primary || '#333' }} />
                      <div className="flex gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-4 w-16 rounded" style={{ backgroundColor: (colors.text || '#000') + '30' }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hero */}
                  <div className="px-6 py-8" style={{ backgroundColor: (colors.primary || '#333') + '10' }}>
                    <div className="max-w-md">
                      <div className="h-8 w-48 rounded mb-2" style={{ backgroundColor: (colors.text || '#000') + '80' }} />
                      <div className="h-4 w-64 rounded mb-4" style={{ backgroundColor: (colors.text || '#000') + '40' }} />
                      <div className="h-10 w-32 rounded-lg" style={{ backgroundColor: colors.primary || '#333' }} />
                    </div>
                  </div>

                  {/* Product grid */}
                  <div className="flex-1 px-6 py-8 overflow-hidden">
                    <div className="h-6 w-32 rounded mb-4" style={{ backgroundColor: (colors.text || '#000') + '60' }} />
                    <div className={`grid gap-4 ${device === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'}`}>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                          <div
                            className="aspect-square rounded-lg"
                            style={{ backgroundColor: (colors.secondary || '#666') + '40' }}
                          />
                          <div className="h-3 w-3/4 rounded" style={{ backgroundColor: (colors.text || '#000') + '40' }} />
                          <div className="h-4 w-1/2 rounded" style={{ backgroundColor: colors.accent || '#999' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-80 border-l border-white/[0.08] flex flex-col bg-white/[0.02] flex-shrink-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">About</h3>
                <p className="text-sm text-white/50 leading-relaxed">{theme.description}</p>
              </div>

              {/* Quick info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <div className="flex items-center gap-2 text-white/40 mb-1">
                    <Palette className="w-4 h-4" />
                    <span className="text-xs">Colors</span>
                  </div>
                  <div className="flex gap-1">
                    {Object.values(colors).slice(0, 4).map((color, i) => (
                      <div key={i} className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: color as string }} />
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <div className="flex items-center gap-2 text-white/40 mb-1">
                    <Type className="w-4 h-4" />
                    <span className="text-xs">Typography</span>
                  </div>
                  <p className="text-sm text-white font-medium truncate">{typography.headingFont || 'Sans Serif'}</p>
                </div>
              </div>

              {/* Industries */}
              <div>
                <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">Best for</h3>
                <div className="flex flex-wrap gap-2">
                  {(theme.industries as string[]).map((industry) => (
                    <span key={industry} className="px-3 py-1 rounded-full bg-white/[0.05] text-white/60 text-sm border border-white/[0.05] capitalize">
                      {industry.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">Features</h3>
                <div className="space-y-2">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-white/50">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="capitalize">{feature.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-white/50">Price</span>
                  {theme.isPremium ? (
                    <span className="text-2xl font-bold text-white">${theme.price}</span>
                  ) : (
                    <span className="text-lg font-semibold text-green-400">Free</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-white/[0.08] space-y-3 bg-white/[0.01]">
              {isActive ? (
                <>
                  <Button
                    className="w-full bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.1]"
                    onClick={onClose}
                  >
                    <Settings2 className="w-4 h-4 mr-2" />
                    Customize Theme
                  </Button>
                  <p className="text-xs text-center text-white/40">This theme is currently active</p>
                </>
              ) : (
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                  onClick={onApply}
                  disabled={isApplying}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isApplying ? 'Applying Theme...' : 'Apply Theme'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">Prev</span>
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, idx) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-white/30">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <span className="text-sm">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// Main Page Component
export default function ThemeStudioPage() {
  const router = useRouter();
  const { currentStore } = useStoreStore();
  const { toast } = useToast();
  const galleryRef = useRef<HTMLDivElement>(null);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [filterType, setFilterType] = useState<'all' | 'free' | 'premium'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showStoreSwitchBanner, setShowStoreSwitchBanner] = useState(false);
  const prevStoreRef = useRef<string | null>(null);

  // Build query params
  const queryParams: ThemesParams = {
    page: currentPage,
    limit: THEMES_PER_PAGE,
    ...(searchQuery && { search: searchQuery }),
    ...(selectedIndustry !== 'all' && { industry: selectedIndustry }),
    ...(filterType === 'free' && { isPremium: false }),
    ...(filterType === 'premium' && { isPremium: true }),
  };

  // Fetch themes
  const { data: themesData, isLoading: isLoadingThemes } = useThemes(queryParams);

  // Fetch current store's theme
  const { data: storeThemeData, isLoading: isLoadingStoreTheme } = useStoreTheme(
    currentStore?.id || ''
  );

  // Apply theme mutation
  const applyThemeMutation = useApplyTheme();

  // Detect store switching
  useEffect(() => {
    if (currentStore?.id && prevStoreRef.current && prevStoreRef.current !== currentStore.id) {
      setShowStoreSwitchBanner(true);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => setShowStoreSwitchBanner(false), 5000);
      return () => clearTimeout(timer);
    }
    prevStoreRef.current = currentStore?.id || null;
  }, [currentStore?.id]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedIndustry, filterType]);

  // Handlers
  const handlePreview = useCallback((theme: Theme) => {
    setSelectedTheme(theme);
    setIsPreviewOpen(true);
  }, []);

  const handleApplyTheme = useCallback(async (theme: Theme) => {
    if (!currentStore?.id) {
      toast({ title: 'No store selected', description: 'Please select a store first.', variant: 'destructive' });
      return;
    }

    try {
      await applyThemeMutation.mutateAsync({
        storeId: currentStore.id,
        themeId: theme.id,
      });
      toast({ title: 'Theme applied!', description: `"${theme.name}" is now active on your store.` });
      setIsPreviewOpen(false);
    } catch {
      toast({ title: 'Failed to apply theme', description: 'Please try again.', variant: 'destructive' });
    }
  }, [currentStore?.id, applyThemeMutation, toast]);

  const handleCustomize = useCallback(() => {
    router.push('/dashboard/theme/customize');
  }, [router]);

  const scrollToGallery = useCallback(() => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const themes = themesData?.data || [];
  const totalPages = themesData?.meta?.totalPages || 1;
  const activeTheme = storeThemeData?.theme;
  const themeSettings = storeThemeData?.themeSettings || {};

  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/[0.02] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative space-y-6">
        {/* Store Switch Banner */}
        {showStoreSwitchBanner && currentStore && (
          <StoreSwitchBanner
            storeName={currentStore.name}
            industry={currentStore.industry}
            onDismiss={() => setShowStoreSwitchBanner(false)}
          />
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Theme Studio
                </h1>
                <p className="text-white/50 text-sm">
                  Create stunning storefronts that convert
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex items-center gap-3">
            {/* Upload Theme Button */}
            <Link href="/dashboard/theme/upload">
              <Button
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Theme
              </Button>
            </Link>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-10 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Type */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {[
                { id: 'all', label: 'All' },
                { id: 'free', label: 'Free' },
                { id: 'premium', label: 'Premium' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id as typeof filterType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterType === f.id
                      ? 'bg-white/[0.1] text-white'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Theme Banner */}
        {isLoadingStoreTheme ? (
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 lg:p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <Skeleton className="w-full lg:w-96 aspect-video bg-white/[0.04]" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-48 bg-white/[0.06]" />
                <Skeleton className="h-4 w-full max-w-md bg-white/[0.04]" />
                <Skeleton className="h-4 w-3/4 max-w-md bg-white/[0.04]" />
                <div className="flex gap-3 pt-4">
                  <Skeleton className="h-10 w-36 bg-white/[0.06]" />
                  <Skeleton className="h-10 w-36 bg-white/[0.04]" />
                </div>
              </div>
            </div>
          </div>
        ) : activeTheme ? (
          <FeaturedThemeBanner
            theme={activeTheme as unknown as Theme}
            themeSettings={themeSettings as Record<string, unknown>}
            onCustomize={handleCustomize}
            onChange={scrollToGallery}
          />
        ) : null}

        {/* Quick Action Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/dashboard/theme/my-themes"
            className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/30 hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 flex items-center justify-center transition-colors">
                <FolderOpen className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-medium text-white group-hover:text-amber-400 transition-colors">My Themes</h3>
            </div>
            <p className="text-sm text-white/40">Manage your custom uploaded themes</p>
          </Link>

          <Link
            href="/dashboard/theme/sections"
            className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/30 hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                <Layers className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">Sections</h3>
            </div>
            <p className="text-sm text-white/40">Drag and drop page sections</p>
          </Link>

          <Link
            href="/dashboard/theme/css"
            className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center transition-colors">
                <Code2 className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-medium text-white group-hover:text-purple-400 transition-colors">Custom CSS</h3>
            </div>
            <p className="text-sm text-white/40">Write custom styles with Monaco</p>
          </Link>

          <Link
            href="/dashboard/theme/backups"
            className="group p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-green-500/30 hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 flex items-center justify-center transition-colors">
                <Archive className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-medium text-white group-hover:text-green-400 transition-colors">Backups</h3>
            </div>
            <p className="text-sm text-white/40">Backup and restore configurations</p>
          </Link>
        </div>

        {/* Industry Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide" ref={galleryRef}>
          {INDUSTRIES.map((industry) => (
            <button
              key={industry.id}
              onClick={() => setSelectedIndustry(industry.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedIndustry === industry.id
                  ? 'bg-amber-500 text-black'
                  : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white border border-white/[0.08]'
              }`}
            >
              {industry.label}
            </button>
          ))}
        </div>

        {/* Theme Gallery */}
        <div>
          {isLoadingThemes ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: THEMES_PER_PAGE }).map((_, i) => (
                <ThemeCardSkeleton key={i} />
              ))}
            </div>
          ) : themes.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6">
                <SlidersHorizontal className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No themes found</h3>
              <p className="text-white/50 max-w-md mb-6">
                We couldn&apos;t find any themes matching your criteria. Try adjusting your filters.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedIndustry('all');
                  setFilterType('all');
                }}
                className="bg-white/[0.08] hover:bg-white/[0.12] text-white"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {themes.map((theme, index) => (
                  <div
                    key={theme.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'both' }}
                  >
                    <ThemeCard
                      theme={theme}
                      isActive={activeTheme?.id === theme.id}
                      onPreview={() => handlePreview(theme)}
                      onApply={() => handleApplyTheme(theme)}
                      isApplying={applyThemeMutation.isPending && applyThemeMutation.variables?.themeId === theme.id}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />

              {/* Results count */}
              <div className="text-center py-4">
                <p className="text-sm text-white/30">
                  Showing {themes.length} of {themesData?.meta?.total || 0} themes
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <ThemePreviewModal
        theme={selectedTheme}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onApply={() => selectedTheme && handleApplyTheme(selectedTheme)}
        isActive={activeTheme?.id === selectedTheme?.id}
        isApplying={applyThemeMutation.isPending}
      />

      {/* CSS for shimmer animation */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
