'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStoreStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Save,
  Undo2,
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Type,
  Layout,
  Layers,
  Settings2,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  Droplets,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Grid3X3,
  LayoutList,
  Square,
  Circle,
  Check,
  Loader2,
  Sparkles,
  RotateCcw,
  Download,
  Upload,
} from 'lucide-react';

// Types
interface ThemeSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: number;
    headingWeight: string;
    bodyWeight: string;
  };
  layout: {
    containerWidth: 'narrow' | 'medium' | 'wide' | 'full';
    headerStyle: 'minimal' | 'centered' | 'expanded';
    footerStyle: 'simple' | 'detailed' | 'mega';
    productGridColumns: 2 | 3 | 4;
  };
  components: {
    buttonStyle: 'rounded' | 'pill' | 'sharp';
    cardStyle: 'flat' | 'raised' | 'bordered';
    imageStyle: 'square' | 'rounded' | 'circle';
  };
  effects: {
    enableAnimations: boolean;
    enableHoverEffects: boolean;
    enableParallax: boolean;
  };
}

const defaultSettings: ThemeSettings = {
  colors: {
    primary: '#FF9100',
    secondary: '#1A1A1A',
    accent: '#FF6B00',
    background: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#6B7280',
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseFontSize: 16,
    headingWeight: '700',
    bodyWeight: '400',
  },
  layout: {
    containerWidth: 'medium',
    headerStyle: 'minimal',
    footerStyle: 'simple',
    productGridColumns: 3,
  },
  components: {
    buttonStyle: 'rounded',
    cardStyle: 'raised',
    imageStyle: 'rounded',
  },
  effects: {
    enableAnimations: true,
    enableHoverEffects: true,
    enableParallax: false,
  },
};

const fontOptions = [
  'Inter',
  'Poppins',
  'Playfair Display',
  'Roboto',
  'Montserrat',
  'Open Sans',
  'Lato',
  'DM Sans',
  'Plus Jakarta Sans',
  'Outfit',
];

// Color Picker Component
function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  const presetColors = [
    '#FF9100', '#FF6B00', '#FF4444', '#E91E63', '#9C27B0',
    '#673AB7', '#3F51B5', '#2196F3', '#00BCD4', '#009688',
    '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107',
    '#FF9800', '#795548', '#607D8B', '#000000', '#FFFFFF',
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/70">{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12 rounded-xl cursor-pointer border-2 border-white/10 bg-transparent"
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {presetColors.slice(0, 10).map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-6 h-6 rounded-md border-2 transition-all ${
              value.toUpperCase() === color.toUpperCase()
                ? 'border-white scale-110'
                : 'border-transparent hover:border-white/50'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

// Section Header Component
function SectionHeader({
  icon: Icon,
  title,
  isOpen,
  onToggle,
}: {
  icon: React.ElementType;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-white font-medium">{title}</span>
      </div>
      <ChevronDown
        className={`w-5 h-5 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
  );
}

// Toggle Switch Component
function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-white/[0.1]'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

// Option Selector Component
function OptionSelector<T extends string>({
  label,
  options,
  value,
  onChange,
  icons,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
  icons?: Record<T, React.ElementType>;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/70">{label}</label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const Icon = icons?.[option];
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                value === option
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-white/[0.02] border-white/[0.05] text-white/60 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span className="text-xs font-medium capitalize">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Store Preview Component
function StorePreview({
  settings,
  device,
}: {
  settings: ThemeSettings;
  device: 'desktop' | 'tablet' | 'mobile';
}) {
  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div className="flex items-center justify-center h-full p-8 bg-[#050505]">
      <div
        className="h-full rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ease-out"
        style={{
          width: deviceWidths[device],
          maxWidth: '100%',
          backgroundColor: settings.colors.background,
        }}
      >
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

        {/* Header */}
        <header
          className="px-6 py-4 border-b"
          style={{ borderColor: settings.colors.muted + '20' }}
        >
          <div
            className={`flex items-center ${
              settings.layout.headerStyle === 'centered' ? 'justify-center' : 'justify-between'
            }`}
          >
            <div
              className="text-xl font-bold"
              style={{
                color: settings.colors.text,
                fontFamily: settings.typography.headingFont,
              }}
            >
              Store Name
            </div>
            {settings.layout.headerStyle !== 'centered' && (
              <div className="flex gap-4">
                {['Shop', 'About', 'Contact'].map((item) => (
                  <span
                    key={item}
                    className="text-sm"
                    style={{
                      color: settings.colors.muted,
                      fontFamily: settings.typography.bodyFont,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div
          className="px-6 py-12 text-center"
          style={{ backgroundColor: settings.colors.secondary + '10' }}
        >
          <h1
            className="text-3xl mb-4"
            style={{
              color: settings.colors.text,
              fontFamily: settings.typography.headingFont,
              fontWeight: settings.typography.headingWeight,
            }}
          >
            Welcome to Our Store
          </h1>
          <p
            className="mb-6"
            style={{
              color: settings.colors.muted,
              fontFamily: settings.typography.bodyFont,
              fontSize: settings.typography.baseFontSize,
            }}
          >
            Discover amazing products curated just for you
          </p>
          <button
            className="px-6 py-2.5 text-white font-medium transition-transform hover:scale-105"
            style={{
              backgroundColor: settings.colors.primary,
              borderRadius:
                settings.components.buttonStyle === 'pill'
                  ? '9999px'
                  : settings.components.buttonStyle === 'sharp'
                  ? '0'
                  : '8px',
            }}
          >
            Shop Now
          </button>
        </div>

        {/* Products Grid */}
        <div className="p-6">
          <h2
            className="text-xl mb-4"
            style={{
              color: settings.colors.text,
              fontFamily: settings.typography.headingFont,
              fontWeight: settings.typography.headingWeight,
            }}
          >
            Featured Products
          </h2>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${Math.min(settings.layout.productGridColumns, device === 'mobile' ? 2 : 3)}, 1fr)`,
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden transition-all"
                style={{
                  borderRadius:
                    settings.components.cardStyle === 'flat'
                      ? '0'
                      : settings.components.imageStyle === 'rounded'
                      ? '12px'
                      : '8px',
                  backgroundColor:
                    settings.components.cardStyle === 'raised'
                      ? settings.colors.background
                      : 'transparent',
                  boxShadow:
                    settings.components.cardStyle === 'raised'
                      ? '0 4px 12px rgba(0,0,0,0.08)'
                      : 'none',
                  border:
                    settings.components.cardStyle === 'bordered'
                      ? `1px solid ${settings.colors.muted}30`
                      : 'none',
                }}
              >
                <div
                  className="aspect-square"
                  style={{
                    backgroundColor: settings.colors.primary + '15',
                    borderRadius:
                      settings.components.imageStyle === 'circle'
                        ? '50%'
                        : settings.components.imageStyle === 'rounded'
                        ? '8px'
                        : '0',
                  }}
                />
                <div className="p-3">
                  <p
                    className="font-medium text-sm"
                    style={{
                      color: settings.colors.text,
                      fontFamily: settings.typography.bodyFont,
                    }}
                  >
                    Product {i}
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: settings.colors.primary }}
                  >
                    $99.00
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Customization Page
export default function ThemeCustomizePage() {
  const router = useRouter();
  const { currentStore } = useStoreStore();
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);
  const [savedSettings, setSavedSettings] = useState<ThemeSettings>(defaultSettings);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Section states
  const [openSections, setOpenSections] = useState({
    colors: true,
    typography: false,
    layout: false,
    components: false,
    effects: false,
  });

  // Check for changes
  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(savedSettings));
  }, [settings, savedSettings]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateSettings = <K extends keyof ThemeSettings>(
    category: K,
    key: keyof ThemeSettings[K],
    value: ThemeSettings[K][keyof ThemeSettings[K]]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSavedSettings(settings);
    setIsSaving(false);
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(savedSettings);
  };

  const handleResetToDefault = () => {
    setSettings(defaultSettings);
  };

  return (
    <div className="relative min-h-screen">
      {/* Fixed Header */}
      <div className="sticky top-0 z-40 -mx-6 -mt-6 px-6 py-4 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard/theme')}
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">Theme Customization</h1>
              <p className="text-sm text-white/40">Customize your store's appearance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Device selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {[
                { id: 'desktop', icon: Monitor },
                { id: 'tablet', icon: Tablet },
                { id: 'mobile', icon: Smartphone },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id as typeof device)}
                  className={`p-2 rounded-lg transition-colors ${
                    device === d.id
                      ? 'bg-white/[0.1] text-white'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <d.icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Preview toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                showPreview
                  ? 'bg-white/[0.08] text-white'
                  : 'bg-white/[0.04] text-white/50 hover:text-white'
              }`}
            >
              {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="text-sm hidden sm:inline">Preview</span>
            </button>

            {/* Actions */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!hasChanges}
              className="border-white/[0.1] text-white/70 hover:text-white disabled:opacity-50"
            >
              <Undo2 className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-primary hover:bg-primary/90 text-black font-semibold"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex gap-6 mt-6 ${showPreview ? '' : ''}`}>
        {/* Settings Panel */}
        <div className={`space-y-4 ${showPreview ? 'w-96 flex-shrink-0' : 'max-w-2xl mx-auto w-full'}`}>
          {/* Colors Section */}
          <div>
            <SectionHeader
              icon={Palette}
              title="Colors"
              isOpen={openSections.colors}
              onToggle={() => toggleSection('colors')}
            />
            {openSections.colors && (
              <div className="mt-2 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-5">
                <ColorPicker
                  label="Primary Color"
                  value={settings.colors.primary}
                  onChange={(color) => updateSettings('colors', 'primary', color)}
                />
                <ColorPicker
                  label="Secondary Color"
                  value={settings.colors.secondary}
                  onChange={(color) => updateSettings('colors', 'secondary', color)}
                />
                <ColorPicker
                  label="Accent Color"
                  value={settings.colors.accent}
                  onChange={(color) => updateSettings('colors', 'accent', color)}
                />
                <ColorPicker
                  label="Background Color"
                  value={settings.colors.background}
                  onChange={(color) => updateSettings('colors', 'background', color)}
                />
                <ColorPicker
                  label="Text Color"
                  value={settings.colors.text}
                  onChange={(color) => updateSettings('colors', 'text', color)}
                />
                <ColorPicker
                  label="Muted Color"
                  value={settings.colors.muted}
                  onChange={(color) => updateSettings('colors', 'muted', color)}
                />
              </div>
            )}
          </div>

          {/* Typography Section */}
          <div>
            <SectionHeader
              icon={Type}
              title="Typography"
              isOpen={openSections.typography}
              onToggle={() => toggleSection('typography')}
            />
            {openSections.typography && (
              <div className="mt-2 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-5">
                {/* Heading Font */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Heading Font</label>
                  <select
                    value={settings.typography.headingFont}
                    onChange={(e) => updateSettings('typography', 'headingFont', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {fontOptions.map((font) => (
                      <option key={font} value={font} className="bg-[#1a1a1a]">
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Body Font */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Body Font</label>
                  <select
                    value={settings.typography.bodyFont}
                    onChange={(e) => updateSettings('typography', 'bodyFont', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {fontOptions.map((font) => (
                      <option key={font} value={font} className="bg-[#1a1a1a]">
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Base Font Size */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-white/70">Base Font Size</label>
                    <span className="text-sm text-primary font-medium">{settings.typography.baseFontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    value={settings.typography.baseFontSize}
                    onChange={(e) => updateSettings('typography', 'baseFontSize', parseInt(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-white/[0.1] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>

                {/* Heading Weight */}
                <OptionSelector
                  label="Heading Weight"
                  options={['400', '600', '700'] as const}
                  value={settings.typography.headingWeight as '400' | '600' | '700'}
                  onChange={(value) => updateSettings('typography', 'headingWeight', value)}
                />
              </div>
            )}
          </div>

          {/* Layout Section */}
          <div>
            <SectionHeader
              icon={Layout}
              title="Layout"
              isOpen={openSections.layout}
              onToggle={() => toggleSection('layout')}
            />
            {openSections.layout && (
              <div className="mt-2 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-5">
                <OptionSelector
                  label="Container Width"
                  options={['narrow', 'medium', 'wide', 'full'] as const}
                  value={settings.layout.containerWidth}
                  onChange={(value) => updateSettings('layout', 'containerWidth', value)}
                />
                <OptionSelector
                  label="Header Style"
                  options={['minimal', 'centered', 'expanded'] as const}
                  value={settings.layout.headerStyle}
                  onChange={(value) => updateSettings('layout', 'headerStyle', value)}
                  icons={{
                    minimal: AlignLeft,
                    centered: AlignCenter,
                    expanded: AlignRight,
                  }}
                />
                <OptionSelector
                  label="Footer Style"
                  options={['simple', 'detailed', 'mega'] as const}
                  value={settings.layout.footerStyle}
                  onChange={(value) => updateSettings('layout', 'footerStyle', value)}
                />

                {/* Product Grid Columns */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Product Grid Columns</label>
                  <div className="flex gap-2">
                    {[2, 3, 4].map((cols) => (
                      <button
                        key={cols}
                        onClick={() => updateSettings('layout', 'productGridColumns', cols as 2 | 3 | 4)}
                        className={`flex-1 p-3 rounded-xl border transition-all ${
                          settings.layout.productGridColumns === cols
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-white/[0.02] border-white/[0.05] text-white/60 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex gap-1 justify-center mb-1">
                          {Array.from({ length: cols }).map((_, i) => (
                            <div key={i} className="w-3 h-3 rounded-sm bg-current opacity-60" />
                          ))}
                        </div>
                        <span className="text-xs font-medium">{cols} Cols</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Components Section */}
          <div>
            <SectionHeader
              icon={Layers}
              title="Components"
              isOpen={openSections.components}
              onToggle={() => toggleSection('components')}
            />
            {openSections.components && (
              <div className="mt-2 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-5">
                <OptionSelector
                  label="Button Style"
                  options={['rounded', 'pill', 'sharp'] as const}
                  value={settings.components.buttonStyle}
                  onChange={(value) => updateSettings('components', 'buttonStyle', value)}
                />
                <OptionSelector
                  label="Card Style"
                  options={['flat', 'raised', 'bordered'] as const}
                  value={settings.components.cardStyle}
                  onChange={(value) => updateSettings('components', 'cardStyle', value)}
                />
                <OptionSelector
                  label="Image Style"
                  options={['square', 'rounded', 'circle'] as const}
                  value={settings.components.imageStyle}
                  onChange={(value) => updateSettings('components', 'imageStyle', value)}
                  icons={{
                    square: Square,
                    rounded: Square,
                    circle: Circle,
                  }}
                />
              </div>
            )}
          </div>

          {/* Effects Section */}
          <div>
            <SectionHeader
              icon={Sparkles}
              title="Effects"
              isOpen={openSections.effects}
              onToggle={() => toggleSection('effects')}
            />
            {openSections.effects && (
              <div className="mt-2 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <ToggleSwitch
                  label="Enable Animations"
                  description="Smooth transitions and micro-interactions"
                  checked={settings.effects.enableAnimations}
                  onChange={(checked) => updateSettings('effects', 'enableAnimations', checked)}
                />
                <ToggleSwitch
                  label="Hover Effects"
                  description="Interactive hover states on elements"
                  checked={settings.effects.enableHoverEffects}
                  onChange={(checked) => updateSettings('effects', 'enableHoverEffects', checked)}
                />
                <ToggleSwitch
                  label="Parallax Scrolling"
                  description="Depth effect on scroll (may impact performance)"
                  checked={settings.effects.enableParallax}
                  onChange={(checked) => updateSettings('effects', 'enableParallax', checked)}
                />
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToDefault}
              className="flex-1 border-white/[0.1] text-white/70 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-white/[0.1] text-white/70 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-white/[0.1] text-white/70 hover:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="flex-1 sticky top-24 h-[calc(100vh-8rem)] rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.05]">
            <StorePreview settings={settings} device={device} />
          </div>
        )}
      </div>

      {/* Unsaved changes indicator */}
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
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
