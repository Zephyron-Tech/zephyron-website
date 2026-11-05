import createMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { ATTRIBUTION_COOKIE, ATTRIBUTION_MAX_AGE, attributionFrom } from './lib/attribution';

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
  const res = intlMiddleware(req);
  // First touch only: an existing cookie is never overwritten.
  if (!req.cookies.has(ATTRIBUTION_COOKIE)) {
    res.cookies.set(ATTRIBUTION_COOKIE, JSON.stringify(attributionFrom(req.nextUrl, req.headers.get('referer'))), {
      maxAge: ATTRIBUTION_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  }
  return res;
}

export const config = {
  matcher: [
    // Match all pathnames except for those starting with:
    // - api (API routes), v (business card endpoint, handled by Hono)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico, sitemap.xml, robots.txt, llms.txt, llms-full.txt, seznam-wmt-*.txt, <IndexNow key>.txt (metadata and verification files)
    // - opengraph-image routes, so social previews load without a locale redirect
    '/((?!api|v/|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|llms.txt|llms-full.txt|seznam-wmt-[A-Za-z0-9]+\\.txt|[a-f0-9]{32}\\.txt|fonts|.*\\.png|.*\\.jpg|.*\\.webp|.*\\.svg|.*\\.ico|.*\\.webmanifest|.*opengraph-image).*)',
  ],
};
