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

// Static file patterns to allow
const STATIC_FILE_PATTERNS = [
  '/_next',
  '/api',
  '/favicon',
  '/images',
  '/fonts',
];

/**
 * Set no-cache headers on the response so Netlify's edge CDN
 * never serves stale HTML after a deploy.
 */
function withNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('CDN-Cache-Control', 'no-store');
  response.headers.set('Netlify-CDN-Cache-Control', 'no-store');
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and API routes (no cache override needed)
  if (STATIC_FILE_PATTERNS.some(pattern => pathname.startsWith(pattern))) {
    return NextResponse.next();
  }

  // Allow file extensions (images, etc.)
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  // Allow the permitted routes
  if (ALLOWED_ROUTES.includes(pathname)) {
    return withNoCacheHeaders(NextResponse.next());
  }

  // Allow routes with permitted prefixes (dynamic routes like /insights/[slug])
  if (ALLOWED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return withNoCacheHeaders(NextResponse.next());
  }

  // Redirect everything else to the landing page
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
