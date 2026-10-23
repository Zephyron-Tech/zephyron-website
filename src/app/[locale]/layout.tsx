import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SITE } from '@/content/site';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileCtaBar } from '@/components/MobileCtaBar';
import { TrackClicks } from '@/components/TrackClicks';
import { JsonLd } from '@/components/JsonLd';
import { webSiteSchema } from '@/lib/schema';

type Locale = (typeof routing.locales)[number];

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#EEEDEA',
  // Content can reach into the notch area (paddings use env(safe-area-inset-*)),
  // and the Android keyboard resizes the layout as it does on iOS.
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: t('title'),
      template: '%s | Zephyron Tech',
    },
    description: t('description'),
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    openGraph: {
      siteName: 'Zephyron Tech',
      type: 'website',
      locale: 'cs_CZ',
    },
    twitter: { card: 'summary_large_image' },
  };
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/mark-color.png`,
  image: `${SITE.url}/opengraph-image`,
  email: SITE.email,
  telephone: SITE.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    postalCode: SITE.address.zip,
    addressCountry: 'CZ',
  },
  areaServed: 'CZ',
  identifier: { '@type': 'PropertyValue', name: 'IČO', value: SITE.ico },
  ...(SITE.sameAs.length > 0 && { sameAs: SITE.sameAs }),
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <JsonLd data={orgSchema} />
      <JsonLd data={webSiteSchema()} />
      <TrackClicks />
      <Header />
      <main>{children}</main>
      <Footer />
      <MobileCtaBar />
    </NextIntlClientProvider>
  );
}
