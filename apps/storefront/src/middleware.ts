import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Domains that should be excluded from subdomain extraction
const EXCLUDED_SUBDOMAINS = ['www', 'app', 'api', 'admin', 'dashboard'];

// Root domains that the storefront runs on
const ROOT_DOMAINS = [
  'rendrix.store',
  'rendrix.local',
  'localhost',
];

/**
 * Extract store identifier from the hostname
 * Supports:
 * - Subdomain: xcybersecurity.rendrix.store -> xcybersecurity
 * - Subdomain: xcybersecurity.rendrix.local:3001 -> xcybersecurity
 * - Subdomain: xcybersecurity.localhost:3001 -> xcybersecurity
 * - Query param fallback: localhost:3001?store=xcybersecurity -> xcybersecurity
 */
function extractStoreIdentifier(request: NextRequest): string | null {
  const hostname = request.headers.get('host') || '';
  const hostnameWithoutPort = hostname.split(':')[0];

  // Check for subdomain pattern
  const parts = hostnameWithoutPort.split('.');

  // For localhost with subdomain: xcybersecurity.localhost
  if (parts.length === 2 && parts[1] === 'localhost') {
    const subdomain = parts[0];
    if (!EXCLUDED_SUBDOMAINS.includes(subdomain)) {
      return subdomain;
    }
  }

  // For multi-part domains: xcybersecurity.rendrix.store or xcybersecurity.rendrix.local
  if (parts.length >= 3) {
    const subdomain = parts[0];
    if (!EXCLUDED_SUBDOMAINS.includes(subdomain)) {
      return subdomain;
    }
  }

  // For two-part local domains like: xcybersecurity.rendrix (with .local in /etc/hosts)
  if (parts.length === 2) {
    const potentialSubdomain = parts[0];
    const potentialDomain = parts[1];

    // Check if it matches our root domains pattern
    if (['rendrix', 'localhost'].includes(potentialDomain) &&
        !EXCLUDED_SUBDOMAINS.includes(potentialSubdomain)) {
      return potentialSubdomain;
    }
  }

  // Fallback to URL query parameter for development
  const url = new URL(request.url);
  const storeParam = url.searchParams.get('store');
  if (storeParam) {
    return storeParam;
  }

  return null;
}

export function middleware(request: NextRequest) {
  const storeIdentifier = extractStoreIdentifier(request);

  // Clone the request headers and add store identifier
  const requestHeaders = new Headers(request.headers);

  if (storeIdentifier) {
    // Set the store identifier in a custom header
    requestHeaders.set('x-store-identifier', storeIdentifier);
  }

  // Create response with modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Also set a cookie for client-side access
  if (storeIdentifier) {
    response.cookies.set('store-identifier', storeIdentifier, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
