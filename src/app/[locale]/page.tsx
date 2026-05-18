import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Portfolio } from '@/components/Portfolio';
import { TechStack } from '@/components/TechStack';
import { ContactCTA } from '@/components/ContactCTA';
import { Footer } from '@/components/Footer';

const BASE = 'https://zephyron.tech';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const url = locale === 'en' ? `${BASE}/` : `${BASE}/${locale}/`;

  return {
    alternates: {
      canonical: url,
      languages: {
        'en':        `${BASE}/`,
        'cs':        `${BASE}/cs/`,
        'x-default': `${BASE}/`,
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zephyron Tech s.r.o.',
    legalName: 'Zephyron Tech s.r.o.',
    url: BASE,
    logo: `${BASE}/mark-color.png`,
    email: 'hello@zephyron.tech',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Čermákova 2587/60',
      addressLocality: 'Plzeň',
      postalCode: '301 00',
      addressCountry: 'CZ',
    },
    identifier: {
      '@type': 'PropertyValue',
      name: 'IČO',
      value: '23793538',
    },
    sameAs: [`${BASE}/`],
  };

  const siteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Zephyron Tech',
    url: BASE,
    description:
      locale === 'cs'
        ? 'Zakázkový software pro firmy, které potřebují aby to fungovalo v produkci.'
        : 'Custom software engineering for companies that need it to work in production.',
    inLanguage: ['en', 'cs'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
      />
      <Header />
      <main>
        <Hero />
        <Portfolio />
        <TechStack />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
