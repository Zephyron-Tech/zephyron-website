import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE } from '@/content/site';
import { PageHero } from '@/components/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import { TeamCards } from '@/components/TeamCards';
import { FinalCta } from '@/components/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'O nás',
  description:
    'Zephyron Tech je softwarové studio z Plzně. Malý tým vývojářů, který staví software šetřící firmám čas a stará se o něj i po spuštění.',
  alternates: { canonical: `${SITE.url}/o-nas` },
};

const principles = [
  {
    title: 'Nejdřív problém, pak technologie',
    text: 'Ptáme se, co vás stojí čas a peníze. Někdy je odpovědí nový systém, někdy propojení dvou tabulek. A někdy nestavět nic.',
  },
  {
    title: 'Řekneme, když to nedává smysl',
    text: 'Pokud se investice nevrátí nebo existuje hotové řešení, které vám sedí, řekneme to. I když tím přijdeme o zakázku.',
  },
  {
    title: 'Software, který vydrží',
    text: 'Čitelný kód, testy a dokumentace. Aby ho za pět let mohl rozvíjet kdokoliv, nejen my.',
  },
  {
    title: 'Spuštěním to nekončí',
    text: 'Systém po spuštění hlídáme, opravujeme a rozvíjíme podle toho, jak se firma mění.',
  },
];

const stack = [
  { group: 'Web a aplikace', items: ['TypeScript', 'React', 'Next.js', 'Expo (iOS, Android)'] },
  { group: 'Backend a data', items: ['Python', 'FastAPI', 'Spring Boot', 'PostgreSQL', 'PostGIS', 'Redis', 'Kafka'] },
  { group: 'Provoz', items: ['Docker', 'GitHub Actions', 'Vercel', 'Linux servery', 'Monitoring'] },
  { group: 'Firemní IT', items: ['Microsoft 365', 'Google Workspace', 'Zálohy', 'Správa identit'] },
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'O nás', path: '/o-nas' }])} />
      <PageHero
        crumbs={[{ name: 'O nás' }]}
        eyebrow="O nás"
        title="Softwarové studio z Plzně"
        lead="Jsme malý tým vývojářů. Stavíme software, který firmám šetří čas, a staráme se o něj i po spuštění. Bez obchodníků, bez account manažerů, bez zbytečných mezičlánků."
      />

      <section className="section-y">
        <div className="container-page">
          <SectionHeader eyebrow="Tým" title="Kdo s vámi bude mluvit" />
          <div className="mt-14">
            <TeamCards />
          </div>
        </div>
      </section>

      <section className="section-y border-t border-line">
        <div className="container-page">
          <SectionHeader eyebrow="Jak přemýšlíme" title="Čeho se držíme" />
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
            {principles.map((p, i) => (
              <div key={p.title} className="bg-card p-7 sm:p-9">
                <div className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="mt-4 text-2xl text-ink">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-2">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y border-t border-line">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Technologie"
            title="S čím pracujeme"
            lead="Nástroje volíme podle zadání. Tohle jsou ty, se kterými máme nejvíc zkušeností."
          />
          <dl className="divide-y divide-line border-y border-line">
            {stack.map((s) => (
              <div key={s.group} className="grid gap-3 py-6 sm:grid-cols-[0.35fr_0.65fr]">
                <dt className="font-mono text-xs uppercase tracking-[0.12em] text-muted sm:pt-1.5">{s.group}</dt>
                <dd className="flex flex-wrap gap-2">
                  {s.items.map((it) => (
                    <Tag key={it}>{it}</Tag>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-line py-16">
        <div className="container-page grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Firma', SITE.legalName],
            ['IČO', SITE.ico],
            ['Sídlo', `${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}`],
            ['E-mail', SITE.email],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{k}</div>
              <div className="mt-2 text-ink">{v}</div>
            </div>
          ))}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
