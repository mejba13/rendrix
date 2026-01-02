'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeSettings } from './api';

// Default theme settings for Minimal theme
const defaultThemeSettings: ThemeSettings = {
  colors: {
    primary: '#000000',
    secondary: '#6B7280',
    accent: '#F59E0B',
    background: '#FFFFFF',
    foreground: '#111827',
    muted: '#F3F4F6',
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseFontSize: 16,
    headingWeight: 600,
    bodyWeight: 400,
  },
  layout: {
    containerWidth: 'medium',
    headerStyle: 'minimal',
    footerStyle: 'standard',
    productGridColumns: 4,
  },
  components: {
    buttonStyle: 'rounded',
    cardStyle: 'elevated',
    imageStyle: 'rounded',
  },
  effects: {
    enableAnimations: true,
    enableHoverEffects: true,
    enableParallax: false,
  },
};

// Container width values
const containerWidths = {
  narrow: '1024px',
  medium: '1280px',
  wide: '1536px',
};

// Border radius values for different styles
const borderRadiusValues = {
  square: '0px',
  rounded: '8px',
  pill: '9999px',
};

// Card shadow values
const cardShadowValues = {
  flat: 'none',
  bordered: 'none',
  elevated: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
};

// Convert hex to RGB values
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0 0';
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
}

// Merge theme settings with defaults
function mergeSettings(settings: ThemeSettings): Required<ThemeSettings> {
  return {
    colors: { ...defaultThemeSettings.colors, ...settings.colors },
    typography: { ...defaultThemeSettings.typography, ...settings.typography },
    layout: { ...defaultThemeSettings.layout, ...settings.layout },
    components: { ...defaultThemeSettings.components, ...settings.components },
    effects: { ...defaultThemeSettings.effects, ...settings.effects },
  } as Required<ThemeSettings>;
}

// Generate CSS variables from theme settings
function generateCssVariables(settings: ThemeSettings): string {
  const merged = mergeSettings(settings);
  const { colors, typography, layout, components } = merged;

  const variables: string[] = [];

  // Color variables
  if (colors.primary) {
    variables.push(`--theme-primary: ${colors.primary}`);
    variables.push(`--theme-primary-rgb: ${hexToRgb(colors.primary)}`);
  }
  if (colors.secondary) {
    variables.push(`--theme-secondary: ${colors.secondary}`);
    variables.push(`--theme-secondary-rgb: ${hexToRgb(colors.secondary)}`);
  }
  if (colors.accent) {
    variables.push(`--theme-accent: ${colors.accent}`);
    variables.push(`--theme-accent-rgb: ${hexToRgb(colors.accent)}`);
  }
  if (colors.background) {
    variables.push(`--theme-background: ${colors.background}`);
    variables.push(`--theme-background-rgb: ${hexToRgb(colors.background)}`);
  }
  if (colors.foreground) {
    variables.push(`--theme-foreground: ${colors.foreground}`);
    variables.push(`--theme-foreground-rgb: ${hexToRgb(colors.foreground)}`);
  }
  if (colors.muted) {
    variables.push(`--theme-muted: ${colors.muted}`);
    variables.push(`--theme-muted-rgb: ${hexToRgb(colors.muted)}`);
  }

  // Typography variables
  if (typography.headingFont) {
    variables.push(`--theme-heading-font: ${typography.headingFont}, system-ui, sans-serif`);
  }
  if (typography.bodyFont) {
    variables.push(`--theme-body-font: ${typography.bodyFont}, system-ui, sans-serif`);
  }
  if (typography.baseFontSize) {
    variables.push(`--theme-base-font-size: ${typography.baseFontSize}px`);
  }
  if (typography.headingWeight) {
    variables.push(`--theme-heading-weight: ${typography.headingWeight}`);
  }
  if (typography.bodyWeight) {
    variables.push(`--theme-body-weight: ${typography.bodyWeight}`);
  }

  // Layout variables
  if (layout.containerWidth) {
    variables.push(`--theme-container-width: ${containerWidths[layout.containerWidth] || containerWidths.medium}`);
  }
  if (layout.productGridColumns) {
    variables.push(`--theme-product-grid-columns: ${layout.productGridColumns}`);
  }

  // Component variables
  if (components.buttonStyle) {
    variables.push(`--theme-button-radius: ${borderRadiusValues[components.buttonStyle] || borderRadiusValues.rounded}`);
  }
  if (components.cardStyle) {
    const cardBorder = components.cardStyle === 'bordered' ? '1px solid var(--theme-muted)' : 'none';
    variables.push(`--theme-card-shadow: ${cardShadowValues[components.cardStyle] || cardShadowValues.elevated}`);
    variables.push(`--theme-card-border: ${cardBorder}`);
  }
  if (components.imageStyle) {
    variables.push(`--theme-image-radius: ${components.imageStyle === 'rounded' ? '8px' : '0px'}`);
  }

  return variables.join('; ');
}

// Generate CSS for animations and effects
function generateEffectsCss(settings: ThemeSettings): string {
  const merged = mergeSettings(settings);
  const { effects } = merged;

  const rules: string[] = [];

  if (!effects.enableAnimations) {
    rules.push(`
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `);
  }

  if (!effects.enableHoverEffects) {
    rules.push(`
      * {
        --hover-transform: none !important;
        --hover-opacity: 1 !important;
      }
    `);
  }

  return rules.join('\n');
}

// Dark mode context
type Theme = 'light' | 'dark' | 'system';

interface DarkModeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const DarkModeContext = createContext<DarkModeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDark: false,
});

export function useDarkMode() {
  return useContext(DarkModeContext);
}

interface ThemeStyleProviderProps {
  children: React.ReactNode;
  themeSettings?: ThemeSettings;
  customCss?: string | null;
}

export function ThemeStyleProvider({
  children,
  themeSettings = {},
  customCss,
}: ThemeStyleProviderProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('storefront-theme') as Theme | null;
    if (stored) {
      setTheme(stored);
    }
  }, []);

  // Handle theme changes
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (dark: boolean) => {
      if (dark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      setIsDark(dark);
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  // Save theme to localStorage
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('storefront-theme', newTheme);
  };

  // Apply CSS variables
  useEffect(() => {
    // Apply CSS variables to root
    const cssVariables = generateCssVariables(themeSettings);
    document.documentElement.style.cssText = cssVariables;

    // Create or update style element for effects and custom CSS
    let styleElement = document.getElementById('theme-styles') as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'theme-styles';
      document.head.appendChild(styleElement);
    }

    const effectsCss = generateEffectsCss(themeSettings);
    styleElement.textContent = `
      ${effectsCss}
      ${customCss || ''}
    `;

    // Cleanup
    return () => {
      document.documentElement.style.cssText = '';
      if (styleElement) {
        styleElement.textContent = '';
      }
    };
  }, [themeSettings, customCss]);

  return (
    <DarkModeContext.Provider value={{ theme, setTheme: handleSetTheme, isDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

// Server-side style generation for initial render
export function getThemeStyleTag(themeSettings: ThemeSettings, customCss?: string | null): string {
  const cssVariables = generateCssVariables(themeSettings);
  const effectsCss = generateEffectsCss(themeSettings);

  return `
    <style id="theme-variables">
      :root { ${cssVariables} }
    </style>
    <style id="theme-styles">
      ${effectsCss}
      ${customCss || ''}
    </style>
  `;
}

// Export default settings for reference
export { defaultThemeSettings };
