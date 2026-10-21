import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pdfkit'],
  async redirects() {
    return [
      { source: '/technologies', destination: '/o-nas', permanent: true },
      { source: '/privacy', destination: '/ochrana-osobnich-udaju', permanent: true },
      { source: '/terms', destination: '/obchodni-podminky', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
