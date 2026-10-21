import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Check, Mail, Phone } from 'lucide-react';
import { SITE } from '@/content/site';
import { caseStudies } from '@/content/case-studies';
import type { FaqItem } from '@/content/faq';
import { PageHero } from '@/components/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { CaseCards } from '@/components/CaseCards';
import { ContactForm } from '@/components/ContactForm';
import { ContactTile } from '@/components/ContactTile';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Startup Support: technický partner pro startupy',
  description:
    'Startup Support je program Zephyron Tech pro zakladatele, kterým chybí technický tým. Do vybraných projektů vstupujeme jako dlouhodobý technický partner: od návrhu přes první verzi po provoz.',
  alternates: { canonical: `${SITE.url}/startup-support` },
};

const offer = [
  {
    title: 'Technické vedení',
    text: 'Rozhodujeme o technologiích, architektuře a prioritách, jako by šlo o náš vlastní produkt.',
  },
  {
    title: 'První verze produktu',
    text: 'Navrhneme a postavíme nejmenší verzi, která ověří, jestli o produkt někdo stojí. Web, mobil, nebo obojí.',
  },
  {
    title: 'Provoz a infrastruktura',
    text: 'Servery, nasazování, zálohy a monitoring. Zakladatel se může věnovat zákazníkům, ne serverům.',
  },
  {
    title: 'Technika při jednání s partnery',
    text: 'Technická část prezentace, odhad nákladů a odpovědi na otázky k technologii od investorů, grantových výzev nebo inkubátorů.',
  },
];

const criteria = [
  'Řeší konkrétní problém, který lidé opravdu mají.',
  'Zakladatel zná obor a má přístup k prvním uživatelům.',
  'První verze se dá postavit v řádu týdnů, ne let.',
  'Existuje cesta k financování: granty, inkubátory, investoři nebo první platící zákazníci.',
  'Projekt má smysl i mimo tabulku s čísly.',
];

const steps = [
  {
    title: 'Seznámení',
    text: 'Zakladatel nám představí problém, zákazníka a kde projekt právě je.',
  },
  {
    title: 'Společné ověření',
    text: 'Projdeme trh, rozsah první verze a technická rizika. Obě strany zjistí, jestli si sedí.',
  },
  {
    title: 'Dohoda',
    text: 'Role, rozsah a pravidla spolupráce sepíšeme předem, aby bylo jasno od prvního dne.',
  },
  {
    title: 'Stavba a spuštění',
    text: 'Postavíme první verzi, spustíme ji a dál rozvíjíme podle toho, co říkají uživatelé.',
  },
];

const faq: FaqItem[] = [
  {
    q: 'Proč Startup Support děláte?',
    a: 'Baví nás stavět produkty od nuly. A dobrý nápad by neměl skončit jen proto, že jeho autor neprogramuje. Projekty si proto vybíráme pečlivě a věnujeme se jim dlouhodobě.',
  },
  {
    q: 'Jak spolupráce funguje po finanční stránce?',
    a: 'Každý projekt je v jiné fázi a má jiné možnosti. Podmínky proto skládáme individuálně podle rozsahu práce a toho, co do projektu přináší každá strana. Jsme v tom flexibilní a vše sepíšeme dřív, než začneme stavět.',
  },
  {
    q: 'Co když projekt nevyjde?',
    a: 'S tím počítáme. Riziko neseme společně se zakladatelem, a proto do projektů jdeme až po společném ověření.',
  },
  {
    q: 'Kolik projektů najednou děláte?',
    a: 'Jen pár. Každému chceme věnovat plnou pozornost, ne zbytek kapacity mezi zakázkami.',
  },
];

export default async function StartupSupportPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  const startups = caseStudies.filter((c) => c.category === 'Startup Support');

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Startup Support', path: '/startup-support' }])} />
      <JsonLd data={faqSchema(faq)} />

      <PageHero
        art="bulb"
        crumbs={[{ name: 'Startup Support' }]}
        title="Technický partner pro zakladatele"
        lead="Pomáháme lidem, kteří mají dobrý nápad a znají svůj obor, ale chybí jim vývojáři. Do vybraných projektů vstupujeme jako dlouhodobý technický partner: od návrhu přes první verzi až po provoz. Podmínky přizpůsobujeme fázi projektu."
      >
        {/* One action; the second way in is a text link, as on the landing page. */}
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
          <Button href="#prihlaska" size="lg" arrow track="cta_startup_hero">
            Napsat nám o projektu
          </Button>
          <a
            href="#jak-to-funguje"
            className="text-[15px] font-medium text-ink underline decoration-line-strong decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-ink"
          >
            Jak to funguje
          </a>
        </div>
      </PageHero>

      <section className="section-y">
        <div className="container-page">
          <SectionHeader title="Spoluzakladatel, ne dodavatel" />
          <div className="mt-14 grid gap-3 sm:grid-cols-2">
            {offer.map((o) => (
              <div key={o.title} className="rounded-2xl bg-card p-7 sm:p-9">
                <h3 className="text-2xl text-ink">{o.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-2">{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeader
            title="Projekty si vybíráme"
            lead="Nejsme investiční fond ani agentura, která vezme cokoliv. Do projektu jdeme, když v něj sami věříme."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <ul className="space-y-5 rounded-2xl bg-card p-6 sm:p-8">
            {criteria.map((c) => (
              <li key={c} className="flex items-start gap-4 text-lg text-ink">
                <span
                  aria-hidden
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
                >
                  <Check size={16} strokeWidth={2.25} />
                </span>
                <span className="text-pretty pt-0.5">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="jak-to-funguje" className="section-y scroll-mt-20 bg-night text-white">
        <div className="container-page">
          <SectionHeader dark title="Od nápadu k prvním zákazníkům" />
          <ol className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title}>
                <div aria-hidden className="h-1.5 rounded-full bg-white" style={{ width: `${(i + 1) * 25}%` }} />
                <h3 className="mt-6 text-xl text-white">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <SectionHeader title="S kým se právě rozjíždíme" />
          <div className="mt-14">
            <CaseCards items={startups} showMeta={false} />
          </div>
        </div>
      </section>

      <Faq items={faq} askHref="#prihlaska" askLabel="Napsat nám o projektu" />

      <section id="prihlaska" className="section-y scroll-mt-20">
        {/* Mirrored against the FAQ above: form left, heading right, so the two
            neighbouring splits do not read as one. On a phone the heading leads. */}
        <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          {/* Holds beside the long form, as the FAQ heading does. */}
          <div className="lg:sticky lg:top-28 lg:order-2 lg:self-start">
            <SectionHeader
              title="Máte zajímavý projekt?"
              lead="Napište pár vět o problému, který řešíte, a kde teď jste. Ozveme se."
            />
            <p className="mt-10 font-medium text-ink">Raději napřímo?</p>
            <div className="mt-3 grid max-w-sm gap-3">
              <ContactTile tone="card" icon={Mail} label="E-mail" value={SITE.email} href={`mailto:${SITE.email}`} />
              <ContactTile
                tone="card"
                icon={Phone}
                label="Telefon"
                value={SITE.phone}
                href={`tel:${SITE.phone.replace(/\s/g, '')}`}
              />
            </div>
          </div>
          <div className="lg:order-1">
            <ContactForm defaultTopic="startup" />
          </div>
        </div>
      </section>
    </>
  );
}
