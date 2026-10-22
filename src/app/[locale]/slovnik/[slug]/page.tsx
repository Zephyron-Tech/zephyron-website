import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { getTerm, glossary, termQuestion } from '@/content/glossary';
import { getService } from '@/content/services';
import { getCaseStudy } from '@/content/case-studies';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/PageHero';
import { ServiceLinkTile } from '@/components/ServiceLinkTile';
import { FinalCta } from '@/components/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, definedTermSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => glossary.map((t) => ({ locale, slug: t.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const t = getTerm((await params).slug);
  if (!t) return {};
  const question = termQuestion(t);
  return pageMetadata({
    // "Co je API" is what people type; long names keep just the name.
    title: question.length <= 45 ? question : t.term,
    description: t.short,
    path: `/slovnik/${t.slug}`,
    type: 'article',
  });
}

export default async function TermPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = getTerm(slug);
  if (!t) notFound();

  const services = (t.related.services ?? []).map(getService).filter((s) => !!s);
  const cases = (t.related.cases ?? []).map(getCaseStudy).filter((c) => !!c);
  const terms = (t.related.terms ?? []).map(getTerm).filter((x) => !!x);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Slovník pojmů', path: '/slovnik' },
          { name: t.term, path: `/slovnik/${t.slug}` },
        ])}
      />
      <JsonLd data={definedTermSchema(t)} />
      <PageHero
        crumbs={[{ name: 'Slovník pojmů', href: '/slovnik' }, { name: t.term }]}
        title={`${termQuestion(t)}?`}
        lead={t.short}
      >
        {t.aka && t.aka.length > 0 && (
          <p className="text-[15px] text-muted">
            Také se říká: <span className="text-ink-2">{t.aka.join(', ')}</span>
          </p>
        )}
      </PageHero>

      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          <article className="min-w-0">
            <div className="prose-z max-w-[68ch]">
              {t.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {t.example && (
              <div className="mt-10 max-w-[68ch] rounded-2xl bg-card p-6 sm:p-7">
                <h2 className="text-lg font-medium text-ink">Jak to vypadá u nás</h2>
                <p className="mt-2 leading-relaxed text-ink-2">{t.example.text}</p>
                <Link
                  href={t.example.href}
                  className="tap group mt-4 inline-flex items-center gap-2 text-[15px] font-medium text-accent"
                >
                  {t.example.label}
                  <ArrowRight
                    size={16}
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            )}
          </article>

          {/* What to read next: services, projects and neighbouring terms. */}
          <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
            {services.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-ink-2">Související služby</h2>
                <div className="mt-3 grid gap-2">
                  {services.map((s) => (
                    <ServiceLinkTile key={s.slug} service={s} />
                  ))}
                </div>
              </div>
            )}
            {cases.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-ink-2">V našich projektech</h2>
                <div className="mt-3 grid gap-2">
                  {cases.map((c) => (
                    <Link
                      key={c.slug}
                      href={c.detail ? `/reference/${c.slug}` : '/reference'}
                      className="group flex items-center gap-4 rounded-2xl bg-card px-5 py-4 transition-colors duration-200 hover:bg-accent-soft"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-ink">{c.name}</span>
                        <span className="mt-0.5 block text-sm text-muted">{c.kicker}</span>
                      </span>
                      <ArrowRight
                        size={16}
                        aria-hidden
                        className="shrink-0 text-ink-2 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {terms.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-ink-2">Další pojmy</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {terms.map((x) => (
                    <li key={x.slug}>
                      <Link
                        href={`/slovnik/${x.slug}`}
                        className="inline-flex min-h-10 items-center rounded-full bg-card px-4 text-[15px] text-ink transition-colors duration-200 hover:bg-accent hover:text-white pointer-coarse:min-h-11"
                      >
                        {x.term}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/slovnik"
                  className="tap group mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-accent"
                >
                  Celý slovník
                  <ArrowRight
                    size={16}
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            )}
          </aside>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
