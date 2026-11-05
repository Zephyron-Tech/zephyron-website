import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Check, X } from 'lucide-react';
import { Link } from '@/navigation';
import { SITE } from '@/content/site';
import { getSolution, solutions, solutionsForService } from '@/content/solutions';
import { getService } from '@/content/services';
import { caseStudies } from '@/content/case-studies';
import { getTerm } from '@/content/glossary';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { ServiceLinkTile } from '@/components/ServiceLinkTile';
import { SolutionLinkTile } from '@/components/SolutionLinkTile';
import { PainCarousel } from '@/components/home/PainCarousel';
import { CaseCards } from '@/components/CaseCards';
import { Faq } from '@/components/Faq';
import { FinalCta } from '@/components/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, webPageSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => solutions.map((s) => ({ locale, slug: s.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const s = getSolution((await params).slug);
  if (!s) return {};
  return pageMetadata({ title: s.metaTitle, description: s.metaDescription, path: `/reseni/${s.slug}` });
}

export default async function SolutionPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const s = getSolution(slug);
  if (!s) notFound();

  const service = getService(s.service);
  const related = caseStudies.filter((c) => s.relatedCases?.includes(c.slug));
  const terms = (s.relatedTerms ?? []).map(getTerm).filter((t) => !!t);
  const siblings = solutionsForService(s.service).filter((o) => o.slug !== s.slug);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.metaTitle,
          description: s.metaDescription,
          provider: { '@id': `${SITE.url}/#organization` },
          areaServed: 'CZ',
          url: `${SITE.url}/reseni/${s.slug}`,
          ...(service ? { category: service.title } : {}),
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Služby', path: '/sluzby' },
          ...(service ? [{ name: service.title, path: `/sluzby/${service.slug}` }] : []),
          { name: s.name, path: `/reseni/${s.slug}` },
        ])}
      />
      <JsonLd data={faqSchema(s.faq)} />
      <JsonLd
        data={webPageSchema({
          path: `/reseni/${s.slug}`,
          name: s.metaTitle,
          description: s.metaDescription,
          updated: s.updated,
          author: 'jan-vandlicek',
        })}
      />

      <PageHero
        art={s.art}
        crumbs={[
          { name: 'Služby', href: '/sluzby' },
          ...(service ? [{ name: service.title, href: `/sluzby/${service.slug}` }] : []),
          { name: s.name },
        ]}
        title={s.title}
        lead={s.lead}
        updated={s.updated}
      >
        <Button href="/kontakt" size="lg" arrow track={`cta_solution_${s.slug}`} className="w-full sm:w-auto">
          Domluvit konzultaci
        </Button>
      </PageHero>

      <section className="section-y">
        <div className="container-page grid gap-8 sm:gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeader title={s.answer.q} className="lg:sticky lg:top-28 lg:self-start" />
          <div className="prose-z max-w-[68ch]">
            <p>{s.answer.a}</p>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <SectionHeader title="Dnes a se systémem" />
          <div className="mt-10 grid gap-3 sm:mt-14 md:grid-cols-2">
            <div className="rounded-2xl bg-card p-6 sm:p-8">
              <h3 className="text-lg font-medium text-ink-2">Dnes</h3>
              <ul className="mt-5 space-y-4">
                {s.today.map((p) => (
                  <li key={p} className="flex items-start gap-4 text-ink">
                    <span
                      aria-hidden
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-paper text-ink-2"
                    >
                      <X size={16} strokeWidth={2.25} />
                    </span>
                    <span className="text-pretty pt-1">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-card p-6 sm:p-8">
              <h3 className="text-lg font-medium text-accent">Se systémem</h3>
              <ul className="mt-5 space-y-4">
                {s.withSystem.map((p) => (
                  <li key={p} className="flex items-start gap-4 text-ink">
                    <span
                      aria-hidden
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
                    >
                      <Check size={16} strokeWidth={2.25} />
                    </span>
                    <span className="text-pretty pt-1">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <SectionHeader title="Co systém umí" />
          <div className="mt-10 sm:mt-14">
            <PainCarousel pains={s.capabilities} label="Co systém umí" />
          </div>
        </div>
      </section>

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
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
          {service && (
            <div>
              <h2 className="text-2xl text-ink">Služba, pod kterou to patří</h2>
              <div className="mt-6 grid gap-3">
                <ServiceLinkTile service={service} />
              </div>
            </div>
          )}
          {siblings.length > 0 && (
            <div>
              <h2 className="text-2xl text-ink">Další řešení</h2>
              <div className="mt-6 grid gap-3">
                {siblings.map((o) => (
                  <SolutionLinkTile key={o.slug} solution={o} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {terms.length > 0 && (
        <section className="section-y">
          <div className="container-page">
            <h2 className="text-2xl text-ink">Pojmy, které se k tomu hodí</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {terms.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/slovnik/${t.slug}`}
                    title={t.short}
                    className="inline-flex min-h-10 items-center rounded-full bg-card px-4 text-[15px] text-ink transition-colors duration-200 hover:bg-accent hover:text-white pointer-coarse:min-h-11"
                  >
                    {t.term}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FinalCta />
    </>
  );
}
