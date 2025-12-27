import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if running in development environment
 */
export function isDevelopment(): boolean {
  return (
    process.env.NODE_ENV === 'development' ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost')
  );
}

/**
 * Get the storefront URL based on environment
 * In development: http://localhost:3001?store={slug}
 * In production: https://{subdomain}.rendrix.store or custom domain
 */
export function getStorefrontUrl(options: {
  slug: string;
  subdomain?: string | null;
  customDomain?: string | null;
}): { url: string; displayUrl: string; protocol: 'http' | 'https'; isDev: boolean } {
  const { slug, subdomain, customDomain } = options;
  const isDev = isDevelopment();

  // Production URL (for display purposes)
  const productionDomain = customDomain || (subdomain ? `${subdomain}.rendrix.store` : `${slug}.rendrix.store`);
  const productionUrl = `https://${productionDomain}`;

  if (isDev) {
    // In development, use localhost:3001 with query parameter
    const storefrontPort = process.env.NEXT_PUBLIC_STOREFRONT_PORT || '3001';
    const devUrl = `http://localhost:${storefrontPort}?store=${slug}`;
    return {
      url: devUrl,
      displayUrl: productionDomain, // Show production domain but link to dev
      protocol: 'http',
      isDev: true,
    };
  }

  return {
    url: productionUrl,
    displayUrl: productionDomain,
    protocol: 'https',
    isDev: false,
  };
}
