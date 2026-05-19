import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Portfolio } from '@/components/Portfolio';
import { TechStack } from '@/components/TechStack';
import { ContactCTA } from '@/components/ContactCTA';
import { Footer } from '@/components/Footer';

const BASE = 'https://zephyron.tech';

export async function generateMetadata(): Promise<Metadata> {
  return {
    alternates: {
      canonical: `${BASE}/`,
    },
  };
}

export default function HomePage() {
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
    description: 'Custom software engineering for companies that need it to work in production.',
    inLanguage: 'en',
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
