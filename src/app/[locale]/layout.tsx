import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SmoothScroll } from '@/components/SmoothScroll';

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
      locale:   'en_US',
      images: [
        {
          url:    '/og-image.webp',
          width:  1200,
          height: 630,
          alt:    'Zephyron Tech — Custom software engineering',
          type:   'image/webp',
        },
      ],
    },
    twitter: {
      card:        'summary_large_image',
      title:       t('title'),
      description: t('description'),
      images:      ['/og-image.webp'],
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
    <NextIntlClientProvider messages={messages}>
      <SmoothScroll />
      {children}
    </NextIntlClientProvider>
  );
}
