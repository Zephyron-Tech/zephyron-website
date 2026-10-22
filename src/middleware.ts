import createMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Dev has no Authentik client (see src/lib/auth.ts), so /admin is open locally.
const adminMiddleware =
  process.env.NODE_ENV === 'development'
    ? (_req: NextRequest) => NextResponse.next()
    : withAuth({ pages: { signIn: '/api/auth/signin' } });

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (adminMiddleware as any)(req);
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Match all pathnames except for those starting with:
    // - api (API routes), v (business card endpoint, handled by Hono)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico, sitemap.xml, robots.txt (metadata files)
    // - opengraph-image routes, so social previews load without a locale redirect
    '/((?!api|v/|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|fonts|.*\\.png|.*\\.jpg|.*\\.webp|.*\\.svg|.*\\.ico|.*\\.webmanifest|.*opengraph-image).*)',
  ],
};
