import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that are allowed during the landing page focus period
const ALLOWED_ROUTES = [
  '/',
  '/privacy-policy',
  '/eula',
  '/about',
  '/demo',
  '/chat',
];

// Route prefixes that are allowed (for dynamic routes)
const ALLOWED_PREFIXES: string[] = [
  '/for/',           // Prospect intelligence pages
  '/demo/',          // Demo pages (CFO OS, etc.)
  '/health-score/',  // Health score processing + complete pages
];

// Static file patterns to allow (no cache override — content-hashed)
const STATIC_FILE_PATTERNS = [
  '/_next',
  '/api',
  '/favicon',
  '/images',
  '/fonts',
];

/**
 * Force-disable caching for HTML pages so Netlify's edge CDN
 * never serves stale markup after a deploy.
 *
 * Uses every known header that Netlify / CloudFront / Fastly /
 * generic CDN layers respect.  Belt-and-suspenders approach.
 */
function withNoCacheHeaders(response: NextResponse): NextResponse {
  // Browser cache
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  // Netlify-specific CDN cache
  response.headers.set('Netlify-CDN-Cache-Control', 'no-store, no-cache, must-revalidate');
  // Generic CDN cache (CloudFront / shared caches)
  response.headers.set('CDN-Cache-Control', 'no-store');
  response.headers.set('Surrogate-Control', 'no-store');
  // Vary on everything to prevent serving wrong cached variant
  response.headers.set('Netlify-Vary', 'query');
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and API routes — these are content-hashed, caching is fine
  if (STATIC_FILE_PATTERNS.some(pattern => pathname.startsWith(pattern))) {
    return NextResponse.next();
  }

  // Allow file extensions (images, etc.) — also content-addressed
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  // Allow the permitted routes — always no-cache the HTML
  if (ALLOWED_ROUTES.includes(pathname)) {
    return withNoCacheHeaders(NextResponse.next());
  }

  // Allow routes with permitted prefixes — always no-cache the HTML
  if (ALLOWED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return withNoCacheHeaders(NextResponse.next());
  }

  // Redirect everything else to the landing page — also no-cache the redirect
  const redirect = NextResponse.redirect(new URL('/', request.url));
  return withNoCacheHeaders(redirect);
}

export const config = {
  // Match everything EXCEPT static assets with content hashes
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
