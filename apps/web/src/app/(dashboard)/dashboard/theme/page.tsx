'use client';

import { useState, useEffect } from 'react';
import { useStoreStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import {
  Search,
  LayoutGrid,
  List,
  Filter,
  Crown,
  Check,
  X,
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Type,
  Layout,
  Sparkles,
  ChevronDown,
  ExternalLink,
  Settings2,
  Zap,
  Eye,
  ArrowRight,
  Star,
  Layers,
} from 'lucide-react';

// Types
interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string;
  previewUrl: string;
  thumbnailUrl: string;
  industries: string[];
  features: string[];
  isPremium: boolean;
  price: number | null;
  colors: string[];
  typography: string;
  layoutStyle: string;
}

// Mock theme data
const mockThemes: Theme[] = [
  {
    id: '1',
    name: 'Minimal',
    slug: 'minimal',
    description: 'Clean, white space focused design that lets your products shine. Perfect for brands that value simplicity and elegance.',
    previewUrl: '/themes/minimal-preview.png',
    thumbnailUrl: '/themes/minimal-thumb.png',
    industries: ['Fashion', 'Lifestyle', 'Art'],
    features: ['Responsive', 'Fast Loading', 'SEO Optimized'],
    isPremium: false,
    price: null,
    colors: ['#FFFFFF', '#000000', '#F5F5F5'],
    typography: 'Sans Serif',
    layoutStyle: 'Grid',
  },
  {
    id: '2',
    name: 'Bold',
    slug: 'bold',
    description: 'High contrast design with statement typography. Make a lasting impression with dramatic visual impact.',
    previewUrl: '/themes/bold-preview.png',
    thumbnailUrl: '/themes/bold-thumb.png',
    industries: ['Sports', 'Tech', 'Gaming'],
    features: ['Dark Mode', 'Animations', 'High Contrast'],
    isPremium: true,
    price: 49,
    colors: ['#000000', '#FF4444', '#FFFFFF'],
    typography: 'Display',
    layoutStyle: 'Dynamic',
  },
  {
    id: '3',
    name: 'Luxe',
    slug: 'luxe',
    description: 'Premium aesthetics with gold accents and elegant details. For brands that demand sophistication.',
    previewUrl: '/themes/luxe-preview.png',
    thumbnailUrl: '/themes/luxe-thumb.png',
    industries: ['Jewelry', 'Beauty', 'Fashion'],
    features: ['Parallax Effects', 'Video Backgrounds', 'Premium Fonts'],
    isPremium: true,
    price: 79,
    colors: ['#1A1A1A', '#D4AF37', '#F8F4E9'],
    typography: 'Serif',
    layoutStyle: 'Editorial',
  },
  {
    id: '4',
    name: 'Fresh',
    slug: 'fresh',
    description: 'Vibrant colors and modern layouts. Perfect for brands with energy and personality.',
    previewUrl: '/themes/fresh-preview.png',
    thumbnailUrl: '/themes/fresh-thumb.png',
    industries: ['Food', 'Fitness', 'Kids'],
    features: ['Colorful', 'Playful Animations', 'Social Integration'],
    isPremium: false,
    price: null,
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
    typography: 'Rounded',
    layoutStyle: 'Modular',
  },
  {
    id: '5',
    name: 'Classic',
    slug: 'classic',
    description: 'Timeless professional design that builds trust. Ideal for established brands.',
    previewUrl: '/themes/classic-preview.png',
    thumbnailUrl: '/themes/classic-thumb.png',
    industries: ['Business', 'Legal', 'Finance'],
    features: ['Professional', 'Trust Badges', 'Clean Forms'],
    isPremium: false,
    price: null,
    colors: ['#2C3E50', '#ECF0F1', '#3498DB'],
    typography: 'Traditional',
    layoutStyle: 'Structured',
  },
  {
    id: '6',
    name: 'Artisan',
    slug: 'artisan',
    description: 'Handcrafted aesthetic with warm, organic tones. Perfect for makers and craftspeople.',
    previewUrl: '/themes/artisan-preview.png',
    thumbnailUrl: '/themes/artisan-thumb.png',
    industries: ['Handmade', 'Food', 'Home Decor'],
    features: ['Texture Overlays', 'Warm Palette', 'Story-focused'],
    isPremium: true,
    price: 59,
    colors: ['#8B4513', '#F5DEB3', '#2F4F4F'],
    typography: 'Handwritten',
    layoutStyle: 'Organic',
  },
  {
    id: '7',
    name: 'Tech',
    slug: 'tech',
    description: 'Sleek, modern design with dark mode aesthetics. Built for digital-first brands.',
    previewUrl: '/themes/tech-preview.png',
    thumbnailUrl: '/themes/tech-thumb.png',
    industries: ['Electronics', 'Software', 'Gadgets'],
    features: ['Dark Mode Native', '3D Elements', 'Micro-interactions'],
    isPremium: true,
    price: 69,
    colors: ['#0D0D0D', '#00D4FF', '#1A1A2E'],
    typography: 'Monospace',
    layoutStyle: 'Futuristic',
  },
  {
    id: '8',
    name: 'Boutique',
    slug: 'boutique',
    description: 'Fashion-forward editorial design. For brands with a strong visual identity.',
    previewUrl: '/themes/boutique-preview.png',
    thumbnailUrl: '/themes/boutique-thumb.png',
    industries: ['Fashion', 'Beauty', 'Lifestyle'],
    features: ['Lookbook Layout', 'Magazine Style', 'Instagram Feed'],
    isPremium: true,
    price: 89,
    colors: ['#1C1C1C', '#E8D5C4', '#8B7355'],
    typography: 'Fashion',
    layoutStyle: 'Editorial',
  },
  {
    id: '9',
    name: 'Nature',
    slug: 'nature',
    description: 'Organic, earthy design for sustainable brands. Connect with eco-conscious customers.',
    previewUrl: '/themes/nature-preview.png',
    thumbnailUrl: '/themes/nature-thumb.png',
    industries: ['Organic', 'Wellness', 'Outdoor'],
    features: ['Eco Badges', 'Natural Textures', 'Sustainability Focus'],
    isPremium: false,
    price: null,
    colors: ['#228B22', '#F0E68C', '#8FBC8F'],
    typography: 'Natural',
    layoutStyle: 'Flowing',
  },
  {
    id: '10',
    name: 'Urban',
    slug: 'urban',
    description: 'Street style with bold graphics. For brands with attitude and edge.',
    previewUrl: '/themes/urban-preview.png',
    thumbnailUrl: '/themes/urban-thumb.png',
    industries: ['Streetwear', 'Music', 'Art'],
    features: ['Bold Typography', 'Graffiti Elements', 'Video Integration'],
    isPremium: true,
    price: 59,
    colors: ['#000000', '#FF1744', '#FFEB3B'],
    typography: 'Street',
    layoutStyle: 'Bold',
  },
];

const industries = ['All', 'Fashion', 'Tech', 'Food', 'Beauty', 'Home Decor', 'Sports', 'Art'];
const filterOptions = ['All Themes', 'Free', 'Premium'];

// Ambient Background Component
function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[120px] animate-float" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/[0.02] blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-primary/[0.02] blur-[80px] animate-pulse-glow" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay noise" />
    </div>
  );
}

// Theme Card Component
function ThemeCard({
  theme,
  isActive,
  onPreview,
  onApply
}: {
  theme: Theme;
  isActive: boolean;
  onPreview: () => void;
  onApply: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer
        ${isActive
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-black'
          : 'hover:ring-1 hover:ring-white/20'
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onPreview}
    >
      {/* Card glow effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-orange-500/10 opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`} />

      {/* Preview Image */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-white/[0.08] to-white/[0.02] overflow-hidden">
        {/* Placeholder gradient for preview */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{
            background: `linear-gradient(135deg, ${theme.colors[0]}15, ${theme.colors[1]}25, ${theme.colors[2] || theme.colors[0]}15)`,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* Theme preview mockup */}
        <div className="absolute inset-4 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 overflow-hidden">
          <div className="h-3 bg-white/5 flex items-center px-2 gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
          </div>
          <div className="p-2 space-y-2">
            <div className="h-6 rounded bg-gradient-to-r from-white/10 to-transparent" />
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded"
                  style={{ backgroundColor: theme.colors[i - 1] + '40' }}
                />
              ))}
            </div>
            <div className="space-y-1">
              <div className="h-2 w-3/4 rounded bg-white/10" />
              <div className="h-2 w-1/2 rounded bg-white/5" />
            </div>
          </div>
        </div>

        {/* Premium badge */}
        {theme.isPremium && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-black text-xs font-semibold shadow-lg">
            <Crown className="w-3 h-3" />
            <span>Premium</span>
          </div>
        )}

        {/* Active indicator */}
        {isActive && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-black text-xs font-semibold">
            <Check className="w-3 h-3" />
            <span>Active</span>
          </div>
        )}

        {/* Hover overlay with actions */}
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-3 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
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
              className="bg-primary hover:bg-primary/90 text-black font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Apply
            </Button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 bg-white/[0.02] border-t border-white/[0.05]">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
              {theme.name}
            </h3>
            <p className="text-sm text-white/40 mt-0.5">{theme.typography} Typography</p>
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
        <div className="flex flex-wrap gap-1.5 mt-3">
          {theme.industries.slice(0, 3).map((industry) => (
            <span
              key={industry}
              className="px-2 py-0.5 text-xs rounded-full bg-white/[0.06] text-white/50 border border-white/[0.06]"
            >
              {industry}
            </span>
          ))}
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.05]">
          <span className="text-xs text-white/30">Colors:</span>
          <div className="flex gap-1">
            {theme.colors.map((color, index) => (
              <div
                key={index}
                className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
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
}: {
  theme: Theme | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  isActive: boolean;
}) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen || !theme) return null;

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-7xl h-[90vh] mx-4 flex rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/[0.08] shadow-2xl animate-scale-in">
        {/* Preview Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
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

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preview frame */}
          <div className="flex-1 flex items-center justify-center p-8 bg-[#050505]">
            <div
              className="h-full rounded-xl overflow-hidden bg-white shadow-2xl transition-all duration-500 ease-out"
              style={{
                width: deviceWidths[device],
                maxWidth: '100%',
              }}
            >
              {/* Mock preview content */}
              <div className="h-full" style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }}>
                {/* Browser chrome */}
                <div className="h-8 bg-gray-100 flex items-center px-3 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-8">
                    <div className="h-5 rounded-full bg-gray-200 max-w-md mx-auto" />
                  </div>
                </div>

                {/* Mock page content */}
                <div className="p-6 space-y-4" style={{ backgroundColor: theme.colors[2] || theme.colors[0] }}>
                  <div className="h-8 w-32 rounded" style={{ backgroundColor: theme.colors[1] + '40' }} />
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square rounded-lg" style={{ backgroundColor: theme.colors[i % 3] + '30' }} />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded" style={{ backgroundColor: theme.colors[1] + '20' }} />
                    <div className="h-4 w-1/2 rounded" style={{ backgroundColor: theme.colors[1] + '15' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="w-80 border-l border-white/[0.08] flex flex-col bg-white/[0.02]">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">About</h3>
              <p className="text-sm text-white/50 leading-relaxed">{theme.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <Palette className="w-4 h-4" />
                  <span className="text-xs">Colors</span>
                </div>
                <div className="flex gap-1">
                  {theme.colors.map((color, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <Type className="w-4 h-4" />
                  <span className="text-xs">Typography</span>
                </div>
                <p className="text-sm text-white font-medium">{theme.typography}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <Layout className="w-4 h-4" />
                  <span className="text-xs">Layout</span>
                </div>
                <p className="text-sm text-white font-medium">{theme.layoutStyle}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="flex items-center gap-2 text-white/40 mb-1">
                  <Star className="w-4 h-4" />
                  <span className="text-xs">Price</span>
                </div>
                <p className="text-sm text-white font-medium">{theme.isPremium ? `$${theme.price}` : 'Free'}</p>
              </div>
            </div>

            {/* Industries */}
            <div>
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">Best for</h3>
              <div className="flex flex-wrap gap-2">
                {theme.industries.map((industry) => (
                  <span key={industry} className="px-3 py-1 rounded-full bg-white/[0.05] text-white/60 text-sm border border-white/[0.05]">
                    {industry}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">Features</h3>
              <div className="space-y-2">
                {theme.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-white/50">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-white/[0.08] space-y-3">
            {isActive ? (
              <>
                <Button className="w-full bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.1]">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Customize Theme
                </Button>
                <p className="text-xs text-center text-white/40">This theme is currently active</p>
              </>
            ) : (
              <>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-black font-semibold"
                  onClick={onApply}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Apply Theme
                </Button>
                <Button variant="outline" className="w-full border-white/[0.1] text-white/70 hover:text-white hover:bg-white/[0.05]">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Demo Store
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Current Theme Banner
function CurrentThemeBanner({
  theme,
  onCustomize,
  onChange
}: {
  theme: Theme | null;
  onCustomize: () => void;
  onChange: () => void;
}) {
  if (!theme) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 animate-fade-in">
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-orange-500 to-primary bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite] rounded-2xl" />

      <div className="relative m-[1px] rounded-2xl bg-[#0a0a0a] p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mini Preview */}
          <div className="relative w-full lg:w-80 aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.08]">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${theme.colors[0]}20, ${theme.colors[1]}30, ${theme.colors[2] || theme.colors[0]}20)`,
              }}
            />
            <div className="absolute inset-3 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 overflow-hidden">
              <div className="h-2.5 bg-white/5 flex items-center px-1.5 gap-0.5">
                <div className="w-1 h-1 rounded-full bg-red-400/60" />
                <div className="w-1 h-1 rounded-full bg-yellow-400/60" />
                <div className="w-1 h-1 rounded-full bg-green-400/60" />
              </div>
              <div className="p-2 space-y-1.5">
                <div className="h-4 rounded bg-gradient-to-r from-white/15 to-transparent" />
                <div className="grid grid-cols-3 gap-1">
                  {theme.colors.map((color, i) => (
                    <div key={i} className="aspect-square rounded" style={{ backgroundColor: color + '50' }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Active badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/90 text-white text-xs font-semibold shadow-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Live</span>
            </div>
          </div>

          {/* Theme Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{theme.name}</h2>
                {theme.isPremium && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                    <Crown className="w-3 h-3" />
                    Premium
                  </span>
                )}
              </div>
              <p className="text-white/50 text-sm mb-4 max-w-xl">{theme.description}</p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                    <Palette className="w-4 h-4 text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/30 text-xs">Colors</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {theme.colors.map((color, i) => (
                        <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                    <Type className="w-4 h-4 text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/30 text-xs">Typography</p>
                    <p className="text-white font-medium">{theme.typography}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                    <Layout className="w-4 h-4 text-white/40" />
                  </div>
                  <div>
                    <p className="text-white/30 text-xs">Layout</p>
                    <p className="text-white font-medium">{theme.layoutStyle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                className="bg-primary hover:bg-primary/90 text-black font-semibold"
                onClick={onCustomize}
              >
                <Settings2 className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button
                variant="outline"
                className="border-white/[0.1] text-white/70 hover:text-white hover:bg-white/[0.05]"
                onClick={onChange}
              >
                <Layers className="w-4 h-4 mr-2" />
                Change Theme
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loading Card
function ThemeCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.05] animate-pulse">
      <div className="aspect-[16/10] bg-white/[0.04]" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-24 bg-white/[0.06] rounded" />
          <div className="h-5 w-12 bg-white/[0.06] rounded" />
        </div>
        <div className="h-3 w-32 bg-white/[0.04] rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-white/[0.04] rounded-full" />
          <div className="h-5 w-16 bg-white/[0.04] rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Main Page Component
export default function ThemePage() {
  const { currentStore } = useStoreStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All Themes');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(mockThemes[0]);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setThemes(mockThemes);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter themes
  const filteredThemes = themes.filter((theme) => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All Themes' ||
      (filter === 'Free' && !theme.isPremium) ||
      (filter === 'Premium' && theme.isPremium);
    const matchesIndustry = selectedIndustry === 'All' ||
      theme.industries.includes(selectedIndustry);
    return matchesSearch && matchesFilter && matchesIndustry;
  });

  const handlePreview = (theme: Theme) => {
    setSelectedTheme(theme);
    setIsPreviewOpen(true);
  };

  const handleApply = (theme: Theme) => {
    setActiveTheme(theme);
    setIsPreviewOpen(false);
    // In production, this would call the API to update the store's theme
  };

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/10 flex items-center justify-center border border-primary/20">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
                Theme Studio
              </h1>
            </div>
            <p className="text-white/50 max-w-xl">
              Choose from our curated collection of premium themes to create a stunning storefront that converts visitors into customers.
            </p>
          </div>

          {/* View toggle and filter */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 h-10 pl-10 pr-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="flex items-center gap-2 h-10 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 text-sm hover:bg-white/[0.06] transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>{filter}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {filterDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 py-2 rounded-xl bg-[#151515] border border-white/[0.08] shadow-xl z-10 animate-fade-in">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFilter(option);
                        setFilterDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        filter === option
                          ? 'text-primary bg-primary/10'
                          : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white/[0.1] text-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white/[0.1] text-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Current Theme Banner */}
        {activeTheme && (
          <CurrentThemeBanner
            theme={activeTheme}
            onCustomize={() => {}}
            onChange={() => {
              const section = document.getElementById('theme-gallery');
              section?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {/* Industry Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedIndustry === industry
                  ? 'bg-primary text-black'
                  : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white border border-white/[0.08]'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>

        {/* Theme Gallery */}
        <div id="theme-gallery">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ThemeCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredThemes.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No themes found</h3>
              <p className="text-white/50 max-w-md mb-6">
                We couldn't find any themes matching your criteria. Try adjusting your filters or search query.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setFilter('All Themes');
                  setSelectedIndustry('All');
                }}
                className="bg-white/[0.08] hover:bg-white/[0.12] text-white"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
              : 'space-y-4'
            }>
              {filteredThemes.map((theme, index) => (
                <div
                  key={theme.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ThemeCard
                    theme={theme}
                    isActive={activeTheme?.id === theme.id}
                    onPreview={() => handlePreview(theme)}
                    onApply={() => handleApply(theme)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        {!isLoading && filteredThemes.length > 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-white/30">
              Showing {filteredThemes.length} of {themes.length} themes
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <ThemePreviewModal
        theme={selectedTheme}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onApply={() => selectedTheme && handleApply(selectedTheme)}
        isActive={activeTheme?.id === selectedTheme?.id}
      />

      {/* Add shimmer animation */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
