import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { SITE } from '@/content/site';
import { detailedCaseStudies, getCaseStudy } from '@/content/case-studies';
import { getService } from '@/content/services';
import { routing } from '@/i18n/routing';
import { PageHero } from '@/components/PageHero';
import { Tag } from '@/components/ui/Tag';
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
    <section className="grid gap-6 py-12 md:grid-cols-[0.35fr_0.65fr]">
      <h2 className="text-lg text-ink">{label}</h2>
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
        <dl className="grid max-w-2xl grid-cols-2 gap-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">Klient</dt>
            <dd className="mt-1 text-ink">{c.client}</dd>
          </div>
          <div>
            <dt className="text-muted">Stav</dt>
            <dd className={`mt-1 ${c.status === 'V provozu' ? 'text-ok' : 'text-ink'}`}>{c.status}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-muted">Oblast</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {c.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </dd>
          </div>
        </dl>
        {c.partners && (
          <div className="mt-10 pt-6">
            <div className="text-sm font-medium text-ink-2">Ve spolupráci s</div>
            <PartnerLogos partners={c.partners} className="mt-4" />
          </div>
        )}
      </PageHero>

      {c.image && (
        <div className="container-page pt-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-paper-2">
            <Image src={c.image} alt={`${c.name}: ukázka`} fill priority sizes="(min-width: 1200px) 1120px, 100vw" className="object-cover object-top" />
          </div>
        </div>
      )}

      <div className="container-page py-12">
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
              {d.result.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Block>
          )}
          <Block label="Technologie">
            <div className="flex flex-wrap gap-2">
              {d.stack.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </Block>
          <Block label="Související služby">
            <ul className="flex flex-col gap-2">
              {d.services.map((slug) => {
                const s = getService(slug);
                return s ? (
                  <li key={slug}>
                    <Link href={`/sluzby/${slug}`} className="inline-flex items-center gap-2 font-medium text-accent hover:underline">
                      {s.title} <ArrowRight size={16} aria-hidden />
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </Block>
        </div>
      </div>

      {next && next.slug !== c.slug && (
        <div className="container-page">
          <Link
            href={`/reference/${next.slug}`}
            className="group flex items-center justify-between gap-6 rounded-2xl bg-card p-7 transition-colors hover:bg-accent-soft sm:p-9"
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
