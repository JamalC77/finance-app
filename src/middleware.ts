import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that are allowed during the landing page focus period
const ALLOWED_ROUTES = [
  '/',
  '/privacy-policy',
  '/eula',
  '/pricing',
  '/about',
  '/demo',
];

// Route prefixes that are allowed (for dynamic routes)
const ALLOWED_PREFIXES: string[] = [
  '/for/',  // Prospect intelligence pages
];

// Static file patterns to allow
const STATIC_FILE_PATTERNS = [
  '/_next',
  '/api',
  '/favicon',
  '/images',
  '/fonts',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and API routes
  if (STATIC_FILE_PATTERNS.some(pattern => pathname.startsWith(pattern))) {
    return NextResponse.next();
  }

  // Allow file extensions (images, etc.)
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  // Allow the permitted routes
  if (ALLOWED_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow routes with permitted prefixes (dynamic routes like /insights/[slug])
  if (ALLOWED_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
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
