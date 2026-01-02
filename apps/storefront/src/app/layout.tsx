import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { getStoreData } from '@/lib/store-server';
import { ThemeSettings } from '@/lib/api';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export async function generateMetadata(): Promise<Metadata> {
  const { store } = await getStoreData();

  return {
    title: {
      default: store?.name || 'Store',
      template: `%s | ${store?.name || 'Store'}`,
    },
    description: store?.description || 'Welcome to our store',
    icons: store?.favicon ? { icon: store.favicon } : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { store, categories, storeIdentifier } = await getStoreData();

  // Get theme settings for CSS variables
  const themeSettings = (store?.themeSettings || {}) as ThemeSettings;
  const customCss = store?.customCss || null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeStyleTag themeSettings={themeSettings} customCss={customCss} />
      </head>
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <Providers
          initialStore={store}
          initialCategories={categories}
          storeIdentifier={storeIdentifier}
          themeSettings={themeSettings}
          customCss={customCss}
        >
          <div className="flex min-h-screen flex-col">
            <Header
              storeName={store?.name}
              logo={store?.logo}
              categories={categories}
            />
            <main className="flex-1">{children}</main>
            <Footer storeName={store?.name} />
          </div>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}

// Server component for initial theme styles
function ThemeStyleTag({
  themeSettings,
  customCss
}: {
  themeSettings: ThemeSettings;
  customCss: string | null;
}) {
  // Generate CSS variables
  const defaultSettings: ThemeSettings = {
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

  const merged = {
    colors: { ...defaultSettings.colors, ...themeSettings.colors },
    typography: { ...defaultSettings.typography, ...themeSettings.typography },
    layout: { ...defaultSettings.layout, ...themeSettings.layout },
    components: { ...defaultSettings.components, ...themeSettings.components },
    effects: { ...defaultSettings.effects, ...themeSettings.effects },
  };

  const containerWidths = { narrow: '1024px', medium: '1280px', wide: '1536px' };
  const borderRadiusValues = { square: '0px', rounded: '8px', pill: '9999px' };
  const cardShadowValues = {
    flat: 'none',
    bordered: 'none',
    elevated: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0 0 0';
    return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
  };

  const c = merged.colors!;
  const t = merged.typography!;
  const l = merged.layout!;
  const comp = merged.components!;
  const cardBorder = comp.cardStyle === 'bordered' ? '1px solid var(--theme-muted)' : 'none';

  const cssVariables = `
    :root {
      --theme-primary: ${c.primary};
      --theme-primary-rgb: ${hexToRgb(c.primary!)};
      --theme-secondary: ${c.secondary};
      --theme-secondary-rgb: ${hexToRgb(c.secondary!)};
      --theme-accent: ${c.accent};
      --theme-accent-rgb: ${hexToRgb(c.accent!)};
      --theme-background: ${c.background};
      --theme-background-rgb: ${hexToRgb(c.background!)};
      --theme-foreground: ${c.foreground};
      --theme-foreground-rgb: ${hexToRgb(c.foreground!)};
      --theme-muted: ${c.muted};
      --theme-muted-rgb: ${hexToRgb(c.muted!)};
      --theme-heading-font: ${t.headingFont}, system-ui, sans-serif;
      --theme-body-font: ${t.bodyFont}, system-ui, sans-serif;
      --theme-base-font-size: ${t.baseFontSize}px;
      --theme-heading-weight: ${t.headingWeight};
      --theme-body-weight: ${t.bodyWeight};
      --theme-container-width: ${containerWidths[l.containerWidth!] || containerWidths.medium};
      --theme-product-grid-columns: ${l.productGridColumns};
      --theme-button-radius: ${borderRadiusValues[comp.buttonStyle!] || borderRadiusValues.rounded};
      --theme-card-shadow: ${cardShadowValues[comp.cardStyle!] || cardShadowValues.elevated};
      --theme-card-border: ${cardBorder};
      --theme-image-radius: ${comp.imageStyle === 'rounded' ? '8px' : '0px'};
    }
  `;

  return (
    <>
      <style id="theme-variables" dangerouslySetInnerHTML={{ __html: cssVariables }} />
      {customCss && <style id="theme-custom-css" dangerouslySetInnerHTML={{ __html: customCss }} />}
    </>
  );
}
