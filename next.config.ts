import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pdfkit'],
  // Dev only: let a phone on the same Wi-Fi load the dev server by the Mac's
  // LAN address or .local name (Next blocks other origins from dev assets/HMR).
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '*.local'],
  // The print card PDF embeds Poppins read from disk; make sure the function bundle carries it.
  outputFileTracingIncludes: {
    '/admin/cards/[id]/card.pdf': ['./assets/fonts/**', './public/mark-256.png'],
    // The business card route draws its link preview (/v/:slug/og.png) with Sora.
    '/v/**': ['./assets/fonts/Sora-*.ttf', './public/print/dots.png', './public/mark-256.png'],
    // Social preview images (src/lib/og.tsx) read their fonts and pictures by
    // computed paths, which the tracer cannot follow.
    '/**/opengraph-image*': [
      './assets/fonts/Sora-*.ttf',
      './assets/og/*.jpg',
      './public/print/*.png',
      './public/mark-256.png',
    ],
    '/**/opengraph-image/**': [
      './assets/fonts/Sora-*.ttf',
      './assets/og/*.jpg',
      './public/print/*.png',
      './public/mark-256.png',
    ],
  },
  async redirects() {
    return [
      { source: '/technologies', destination: '/o-nas', permanent: true },
      { source: '/privacy', destination: '/ochrana-osobnich-udaju', permanent: true },
      { source: '/terms', destination: '/obchodni-podminky', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
