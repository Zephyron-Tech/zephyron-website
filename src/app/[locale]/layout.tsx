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
import { personId, webSiteSchema } from '@/lib/schema';
import { team } from '@/content/team';

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

// One organisation entity for the whole site: every page's schema points at it
// through this @id. Combining Organization and ProfessionalService binds the B2B
// brand to its local service areas.
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': `${SITE.url}/#organization`,
  // Short brand name first, so the Knowledge Panel does not need the legal suffix.
  name: SITE.name,
  // Exact registered name, bridging the entity listed in the company registry.
  legalName: SITE.legalName,
  alternateName: ['Zephyron', SITE.legalName],
  url: SITE.url,
  // Square 512x512 PNG of the mark (the only square logo asset in /public).
  logo: {
    '@type': 'ImageObject',
    url: `${SITE.url}/web-app-manifest-512x512.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE.url}/opengraph-image`,
  email: SITE.email,
  // Same number as in Google Business Profile.
  telephone: '+420722635417',
  taxID: SITE.ico,
  identifier: { '@type': 'PropertyValue', name: 'IČO', value: SITE.ico },
  description:
    'B2B softwarové studio zaměřené na vývoj webových aplikací na míru, datových systémů a firemní automatizace.',
  // City level only, consistent with the hidden address of a service-area business.
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Plzeň',
    addressRegion: 'Plzeňský kraj',
    addressCountry: 'CZ',
  },
  // Mirrors the service areas configured in Google Business Profile.
  areaServed: [
    { '@type': 'City', name: 'Plzeň' },
    { '@type': 'AdministrativeArea', name: 'Plzeňský kraj' },
    { '@type': 'City', name: 'Praha' },
    { '@type': 'AdministrativeArea', name: 'Středočeský kraj' },
    { '@type': 'AdministrativeArea', name: 'Jihočeský kraj' },
  ],
  // Service catalog aligned with the Services section of Google Business Profile.
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Vývoj softwaru a IT služby',
    itemListElement: [
      'Vývoj webových aplikací na míru',
      'Datové systémy a backendová architektura',
      'Automatizace firemních procesů a AI integrace',
      'Technické konzultace, audit kódu a DevOps',
    ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
  },
  // The people behind the firm, described in full on /o-nas.
  founder: team.map((p) => ({ '@id': personId(p.slug) })),
  employee: team.map((p) => ({ '@id': personId(p.slug) })),
  knowsAbout: [
    'Automatizace firemních procesů',
    'Interní systémy na míru',
    'Vytěžování faktur a dokumentů',
    'Integrace systémů a API',
    'Klientské portály',
    'IT správa pro firmy',
    'Webové aplikace v Next.js',
    'PostgreSQL a PostGIS',
  ],
  // TODO: add the verified Google Business Profile share URL (via SITE.sameAs) once verification completes.
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
