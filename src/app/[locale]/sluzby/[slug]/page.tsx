import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Check } from 'lucide-react';
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
      <JsonLd data={breadcrumbSchema([{ name: 'Služby', path: '/sluzby' }, { name: s.title, path: `/sluzby/${s.slug}` }])} />
      <JsonLd data={faqSchema(s.faq)} />

      <PageHero
        crumbs={[{ name: 'Služby', href: '/sluzby' }, { name: s.title }]}
        eyebrow={s.title}
        title={s.heroTitle}
        lead={s.heroLead}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/kontakt" size="lg" arrow track={`cta_service_${s.slug}`}>
            Domluvit konzultaci
          </Button>
          {related.length > 0 && (
            <Button href="#reference" size="lg" variant="secondary">
              Ukázky práce
            </Button>
          )}
        </div>
      </PageHero>

      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="Poznáváte to?" title="Kdy dává smysl se ozvat" />
          <ul className="divide-y divide-line border-y border-line">
            {s.pains.map((p) => (
              <li key={p} className="flex gap-4 py-5 text-lg text-ink">
                <span aria-hidden className="mt-2.5 inline-block size-1.5 shrink-0 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y border-t border-line">
        <div className="container-page">
          <SectionHeader eyebrow="Co dodáme" title="Co od nás dostanete" />
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {s.deliverables.map((d) => (
              <div key={d.title} className="bg-card p-7">
                <h3 className="text-xl text-ink">{d.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{d.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-paper-2 p-7 sm:p-10">
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Typické zakázky</div>
            <ul className="mt-5 grid gap-4 md:grid-cols-3">
              {s.examples.map((e) => (
                <li key={e} className="flex gap-3 text-ink">
                  <Check size={18} strokeWidth={2} className="mt-1 shrink-0 text-accent" aria-hidden />
                  {e}
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
              eyebrow="Cena"
              title="Orientační ceny"
              lead="Přesnou cenu stanovíme po úvodní konzultaci a analýze, vždy předem."
            />
            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {s.pricing.map((p) => (
                <div key={p.title} className="bg-card p-7">
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
            <SectionHeader eyebrow="Reference" title="Na čem jsme to už dělali" />
            <div className="mt-14">
              <CaseCards items={related} />
            </div>
          </div>
        </section>
      )}

      <Faq items={s.faq} />

      <section className="border-t border-line py-16">
        <div className="container-page">
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Další služby</div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {others.map((o) => (
              <Button key={o.slug} href={`/sluzby/${o.slug}`} variant="secondary" arrow className="!justify-between">
                <span className="inline-flex items-center gap-3">
                  <ServiceIcon name={o.icon} size={18} />
                  {o.title}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
