import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from '@/navigation';
import { SITE } from '@/content/site';
import { getService, services } from '@/content/services';
import { caseStudies } from '@/content/case-studies';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { Button } from '@/components/ui/Button';
import { CaseCards } from '@/components/CaseCards';
import { Process } from '@/components/Process';
import { PainCarousel } from '@/components/home/PainCarousel';
import { Faq } from '@/components/Faq';
import { FinalCta } from '@/components/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: `${SITE.url}/sluzby/${s.slug}` },
    openGraph: { title: s.metaTitle, description: s.metaDescription },
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const s = getService(slug);
  if (!s) notFound();

  const related = caseStudies.filter((c) => s.relatedCases.includes(c.slug));
  const others = services.filter((o) => o.slug !== s.slug);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.title,
          description: s.metaDescription,
          provider: { '@id': `${SITE.url}/#organization` },
          areaServed: 'CZ',
          url: `${SITE.url}/sluzby/${s.slug}`,
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Služby', path: '/sluzby' },
          { name: s.title, path: `/sluzby/${s.slug}` },
        ])}
      />
      <JsonLd data={faqSchema(s.faq)} />

      <PageHero
        art={s.art}
        crumbs={[{ name: 'Služby', href: '/sluzby' }, { name: s.title }]}
        title={s.heroTitle}
        lead={s.heroLead}
      >
        {/* One action; work samples are a text link, as on the other pages. */}
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Button href="/kontakt" size="lg" arrow track={`cta_service_${s.slug}`} className="w-full sm:w-auto">
            Domluvit konzultaci
          </Button>
          {related.length > 0 && (
            <a
              href="#reference"
              className="tap self-center text-[15px] font-medium text-ink underline sm:self-auto decoration-line-strong decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-ink"
            >
              Ukázky práce
            </a>
          )}
        </div>
      </PageHero>

      <section className="section-y">
        <div className="container-page grid gap-8 sm:gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeader title="Kdy dává smysl se ozvat" className="lg:sticky lg:top-28 lg:self-start" />
          <ul className="space-y-5 rounded-2xl bg-card p-6 sm:p-8">
            {s.pains.map((p) => (
              <li key={p} className="flex items-start gap-4 text-base text-ink sm:text-lg">
                <CheckBubble />
                <span className="text-pretty pt-0.5">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <SectionHeader title="Co od nás dostanete" />
          <div className="mt-10 sm:mt-14">
            <PainCarousel pains={s.deliverables} label="Co od nás dostanete" />
          </div>

          <div className="mt-6 rounded-2xl bg-card p-6 sm:mt-3 sm:p-8">
            <h3 className="text-lg font-medium text-ink">Typické zakázky</h3>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {s.examples.map((e) => (
                <li key={e} className="flex items-start gap-3 text-ink">
                  <CheckBubble />
                  <span className="text-pretty pt-1">{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Process />

      {s.pricing && s.pricing.length > 0 && (
        <section id="cena" className="section-y scroll-mt-20">
          <div className="container-page">
            <SectionHeader
              title="Orientační ceny"
              lead="Přesnou cenu stanovíme po úvodní konzultaci a analýze, vždy předem."
            />
            <div className="mt-10 sm:mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {s.pricing.map((p) => (
                <div key={p.title} className="rounded-2xl bg-card p-7">
                  <h3 className="text-lg text-ink">{p.title}</h3>
                  <div className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">{p.price}</div>
                  {p.note && <p className="mt-2 text-sm text-muted">{p.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section id="reference" className="section-y scroll-mt-20">
          <div className="container-page">
            <SectionHeader title="Na čem jsme to už dělali" />
            <div className="mt-10 sm:mt-14">
              <CaseCards items={related} showMeta={false} />
            </div>
          </div>
        </section>
      )}

      <Faq items={s.faq} />

      <section className="section-y">
        <div className="container-page">
          <h2 className="text-2xl text-ink">Další služby</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/sluzby/${o.slug}`}
                className="group flex items-center gap-4 rounded-2xl bg-card px-5 py-4 transition-colors duration-200 hover:bg-accent-soft"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-paper text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                  <ServiceIcon name={o.icon} size={18} />
                </span>
                <span className="flex-1 font-medium text-ink">{o.title}</span>
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="shrink-0 text-ink-2 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

// The accent check in a soft bubble used for every list of points on the site.
function CheckBubble() {
  return (
    <span
      aria-hidden
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
    >
      <Check size={16} strokeWidth={2.25} />
    </span>
  );
}
