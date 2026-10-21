import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE } from '@/content/site';
import { PageHero } from '@/components/PageHero';
import { ServiceCards } from '@/components/ServiceCards';
import { Process } from '@/components/Process';
import { FinalCta } from '@/components/FinalCta';
import { Button } from '@/components/ui/Button';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Služby',
  description:
    'Automatizace procesů, interní systémy, IT podpora a weby pro malé a střední firmy. Dodávka po etapách s cenou známou předem.',
  alternates: { canonical: `${SITE.url}/sluzby` },
};

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Služby', path: '/sluzby' }])} />
      <PageHero
        art="abacus"
        crumbs={[{ name: 'Služby' }]}
        title="Méně ruční práce, víc času na firmu"
        lead="Nezačínáme technologií, ale tím, kde vás to stojí nejvíc hodin. Někdy stačí propojit dva systémy, jindy je potřeba postavit nový."
      >
        <Button href="/kontakt" size="lg" arrow track="cta_services_hero">
          Domluvit konzultaci
        </Button>
      </PageHero>
      <section className="section-y">
        <div className="container-page">
          <ServiceCards />
        </div>
      </section>
      <Process />
      <FinalCta />
    </>
  );
}
