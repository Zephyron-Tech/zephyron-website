import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE } from '@/content/site';
import { caseStudies } from '@/content/case-studies';
import { PageHero } from '@/components/PageHero';
import { CaseCards } from '@/components/CaseCards';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Link } from '@/navigation';
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
        art="key"
        crumbs={[{ name: 'Reference' }]}
        title="Projekty, které už běží"
        lead="Systémy pro klienty, vlastní produkty i startupy, kterým děláme technického partnera. U každého popisujeme, s čím zadavatel přišel a co jsme postavili."
      />
      <section className="section-y">
        <div className="container-page">
          <CaseCards items={clientWork} featuredFirst showMeta={false} />
        </div>
      </section>
      <section className="section-y">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader
              title="Startupy, které stavíme jako partner"
              lead="Projekty, do kterých vstupujeme jako technický partner."
            />
            <Link
              href="/startup-support"
              className="tap shrink-0 text-[15px] font-medium text-ink underline decoration-line-strong decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-ink"
            >
              Jak Startup Support funguje
            </Link>
          </div>
          <div className="mt-12">
            <CaseCards items={startups} showMeta={false} />
          </div>
        </div>
      </section>
      <FinalCta title="Chcete být další reference?" />
    </>
  );
}
