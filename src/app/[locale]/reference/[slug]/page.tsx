import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from '@/navigation';
import { SITE } from '@/content/site';
import { detailedCaseStudies, getCaseStudy } from '@/content/case-studies';
import { getService } from '@/content/services';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/PageHero';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { PartnerLogos } from '@/components/PartnerLogos';
import { FinalCta } from '@/components/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => detailedCaseStudies.map((c) => ({ locale, slug: c.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const c = getCaseStudy((await params).slug);
  if (!c?.detail) return {};
  const title = `${c.name}: ${c.kicker}`;
  return {
    title,
    description: c.summary,
    alternates: { canonical: `${SITE.url}/reference/${c.slug}` },
    openGraph: { title, description: c.summary, images: c.image ? [c.image] : undefined },
  };
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 py-10 md:grid-cols-[0.35fr_0.65fr]">
      {/* The label holds beside long text, as the FAQ heading does. */}
      <h2 className="text-2xl text-ink md:sticky md:top-28 md:self-start">{label}</h2>
      <div>{children}</div>
    </section>
  );
}

export default async function CasePage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const c = getCaseStudy(slug);
  if (!c?.detail) notFound();
  const d = c.detail;

  const idx = detailedCaseStudies.findIndex((x) => x.slug === c.slug);
  const next = detailedCaseStudies[(idx + 1) % detailedCaseStudies.length];

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Reference', path: '/reference' }, { name: c.name, path: `/reference/${c.slug}` }])} />
      <PageHero crumbs={[{ name: 'Reference', href: '/reference' }, { name: c.name }]} title={c.name} lead={c.summary}>
        <dl className="grid max-w-3xl gap-5 rounded-2xl bg-card p-5 sm:grid-cols-[1fr_auto_1.4fr] sm:gap-8 sm:p-6">
          <div>
            <dt className="text-xs text-muted">Klient</dt>
            <dd className="mt-1 font-medium text-ink">{c.client}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Stav</dt>
            <dd className={`mt-1 font-medium ${c.status === 'V provozu' ? 'text-ok' : 'text-ink'}`}>{c.status}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Oblast</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {c.tags.map((t) => (
                <span key={t} className="inline-flex items-center rounded-full bg-paper px-3 py-1 text-[13px] text-ink-2">
                  {t}
                </span>
              ))}
            </dd>
          </div>
        </dl>
        {c.url && (
          <a
            href={c.url}
            target="_blank"
            rel="noopener"
            className="group mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-accent"
          >
            Navštívit web {new URL(c.url).hostname.replace(/^www\./, '')}
            <ArrowUpRight
              size={16}
              aria-hidden
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        )}
        {c.partners && (
          <div className="mt-8">
            <div className="text-sm font-medium text-ink-2">Ve spolupráci s</div>
            <PartnerLogos partners={c.partners} className="mt-4" />
          </div>
        )}
      </PageHero>

      {c.image && (
        // Set in a white card, as the picture on every case card is.
        <div className="container-page">
          <div className="rounded-3xl bg-card p-2.5 sm:p-3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-paper-2">
              <Image src={c.image} alt={`${c.name}: ukázka`} fill priority sizes="(min-width: 1200px) 1120px, 100vw" className="object-cover object-top" />
            </div>
          </div>
        </div>
      )}

      <div className="container-page section-y">
        <div className="prose-z">
          <Block label="Výchozí situace">
            {d.problem.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Block>
          <Block label="Co jsme postavili">
            {d.solution.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {d.pipeline && (
              <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {d.pipeline.map((st) => (
                  <li key={st.title} className="rounded-2xl bg-card p-5">
                    <div className="font-display text-base font-semibold leading-snug text-ink">{st.title}</div>
                    <div className="mt-1 text-[13px] text-muted">{st.sub}</div>
                  </li>
                ))}
              </ol>
            )}
          </Block>
          {d.result && (
            <Block label="Výsledek">
              {/* The point of the story: the one card in the accent, white type on it. */}
              <div className="rounded-2xl bg-accent p-6 text-lg font-medium sm:p-8 [&_p]:text-pretty [&_p]:text-white">
                {d.result.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Block>
          )}
          <Block label="Technologie">
            <div className="flex flex-wrap gap-2">
              {d.stack.map((t) => (
                <span key={t} className="inline-flex items-center rounded-full bg-card px-3 py-1 text-[13px] text-ink-2">
                  {t}
                </span>
              ))}
            </div>
          </Block>
          <Block label="Související služby">
            <div className="grid gap-3 sm:grid-cols-2">
              {d.services.map((slug) => {
                const s = getService(slug);
                return s ? (
                  <Link
                    key={slug}
                    href={`/sluzby/${slug}`}
                    className="group flex items-center gap-4 rounded-2xl bg-card px-5 py-4 no-underline transition-colors duration-200 hover:bg-accent-soft"
                  >
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-paper text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                      <ServiceIcon name={s.icon} size={18} />
                    </span>
                    <span className="flex-1 font-medium text-ink">{s.title}</span>
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="shrink-0 text-ink-2 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                ) : null;
              })}
            </div>
          </Block>
        </div>
      </div>

      {next && next.slug !== c.slug && (
        <div className="container-page pb-4">
          <Link
            href={`/reference/${next.slug}`}
            className={"group flex items-center justify-between gap-6 rounded-2xl bg-card p-7 outline-2 -outline-offset-2 outline-transparent transition-[outline-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] hover:-translate-y-1.5 hover:outline-accent hover:shadow-[0_24px_48px_-24px_rgb(66_53_229/0.35)] motion-reduce:hover:translate-y-0 sm:p-9" /* taste-skill-ignore: hover-only lift shadow, as the service tiles */}
          >
            <div>
              <div className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Další reference: {next.name}
              </div>
              <div className="mt-1 text-sm text-muted">{next.kicker}</div>
            </div>
            <ArrowRight size={28} className="shrink-0 text-ink transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      )}

      <FinalCta title="Řešíte něco podobného?" />
    </>
  );
}
