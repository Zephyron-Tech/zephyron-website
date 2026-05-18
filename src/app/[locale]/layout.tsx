import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SmoothScroll } from '@/components/SmoothScroll';
import '@/app/globals.css';

type Locale = (typeof routing.locales)[number];

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#010F22',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const base = 'https://zephyron.tech';
  const url  = locale === 'en' ? base : `${base}/${locale}`;

  return {
    metadataBase: new URL(base),
    title: {
      default:  t('title'),
      template: `%s | Zephyron Tech`,
    },
    description: t('description'),
    icons: { icon: '/favicon.ico' },
    openGraph: {
      title:       t('title'),
      description: t('description'),
      url,
      siteName: 'Zephyron Tech',
      type:     'website',
      locale:   locale === 'cs' ? 'cs_CZ' : 'en_US',
    },
    twitter: {
      card:        'summary_large_image',
      title:       t('title'),
      description: t('description'),
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
