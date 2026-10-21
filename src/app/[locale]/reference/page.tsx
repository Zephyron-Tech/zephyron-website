import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE } from '@/content/site';
import { caseStudies } from '@/content/case-studies';
import { PageHero } from '@/components/PageHero';
import { CaseCards } from '@/components/CaseCards';
import { FinalCta } from '@/components/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Reference',
  description:
    'Projekty Zephyron Tech: GIS platforma pro správu silnic, weby pro klienty, vlastní produkty a startupy, se kterými stavíme jako technický partner.',
  alternates: { canonical: `${SITE.url}/reference` },
};

export default async function CasesPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  const clientWork = caseStudies.filter((c) => c.category !== 'Startup Support');
  const startups = caseStudies.filter((c) => c.category === 'Startup Support');

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Reference', path: '/reference' }])} />
      <PageHero
        crumbs={[{ name: 'Reference' }]}
        eyebrow="Reference"
        title="Projekty, které už běží"
        lead="Systémy pro klienty, vlastní produkty i startupy, kterým děláme technického partnera. U každého popisujeme, s čím zadavatel přišel a co jsme postavili."
      />
      <section className="section-y">
        <div className="container-page">
          <CaseCards items={clientWork} featuredFirst />
        </div>
      </section>
      <section className="section-y border-t border-line">
        <div className="container-page">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Startup Support</div>
            <h2 className="mt-4 text-3xl text-ink sm:text-4xl">Startupy, které stavíme jako partner</h2>
          </div>
          <div className="mt-12">
            <CaseCards items={startups} />
          </div>
        </div>
      </section>
      <FinalCta title="Chcete být další reference?" />
    </>
  );
}
