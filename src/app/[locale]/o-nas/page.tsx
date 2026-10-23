import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Building2, Hash, Mail, MapPin } from 'lucide-react';
import { SITE } from '@/content/site';
import { PageHero } from '@/components/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactTile } from '@/components/ContactTile';
import { TeamCards } from '@/components/TeamCards';
import { FinalCta } from '@/components/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'O nás: softwarové studio z Plzně',
  description:
    'Zephyron Tech je malý tým vývojářů z Plzně. Stavíme software, který firmám šetří čas. Komunikujete přímo s vývojáři a o řešení se staráme i po spuštění.',
  path: '/o-nas',
});

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
        art="draftingTools"
        crumbs={[{ name: 'O nás' }]}
        title="Softwarové studio z Plzně"
        lead="Jsme malý tým vývojářů. Stavíme software, který firmám šetří čas, a staráme se o něj i po spuštění. Bez obchodníků, bez account manažerů, bez zbytečných mezičlánků."
      />

      <section className="section-y">
        <div className="container-page">
          <SectionHeader title="Kdo s vámi bude mluvit" />
          <div className="mt-10 sm:mt-14">
            <TeamCards />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-8 sm:gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeader
            title="Čeho se držíme"
            lead="Čtyři pravidla, podle kterých se rozhodujeme u každé zakázky."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <ol className="space-y-6 rounded-2xl bg-card p-6 sm:p-8">
            {principles.map((p, i) => (
              <li key={p.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent"
                >
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <h3 className="text-lg font-medium text-ink">{p.title}</h3>
                  <p className="mt-1 text-pretty leading-relaxed text-ink-2">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <SectionHeader
            title="S čím pracujeme"
            lead="Nástroje volíme podle zadání. Tohle jsou ty, se kterými máme nejvíc zkušeností."
          />
          {/* One card across the width, a column per group; the chips sit on the
              page tone inside it so they read. */}
          <dl className="mt-10 grid gap-8 rounded-2xl bg-card p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
            {stack.map((s) => (
              <div key={s.group}>
                <dt className="text-sm font-medium text-ink">{s.group}</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {s.items.map((it) => (
                    <span key={it} className="inline-flex items-center rounded-full bg-paper px-3 py-1 text-[13px] text-ink-2">
                      {it}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <h2 className="text-2xl text-ink">Fakturační údaje</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ContactTile tone="card" icon={Building2} label="Firma" value={SITE.legalName} />
            <ContactTile tone="card" icon={Hash} label="IČO" value={SITE.ico} />
            <ContactTile
              tone="card"
              icon={MapPin}
              label="Sídlo"
              value={SITE.address.street}
              lines={[`${SITE.address.zip} ${SITE.address.city}`]}
            />
            <ContactTile tone="card" icon={Mail} label="E-mail" value={SITE.email} href={`mailto:${SITE.email}`} />
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
