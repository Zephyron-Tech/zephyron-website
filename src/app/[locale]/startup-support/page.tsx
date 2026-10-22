import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Check, Mail, Phone } from 'lucide-react';
import { SITE } from '@/content/site';
import { caseStudies } from '@/content/case-studies';
import { startupCriteria, startupFaq, startupOffer, startupSteps } from '@/content/startup-support';
import { PageHero } from '@/components/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { CaseCards } from '@/components/CaseCards';
import { ContactForm } from '@/components/ContactForm';
import { ContactTile } from '@/components/ContactTile';
import { Faq } from '@/components/Faq';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Startup Support: technický partner pro startupy',
  description:
    'Zakladatelům bez technického týmu děláme dlouhodobého technického partnera: navrhneme a postavíme první verzi produktu a staráme se o provoz.',
  path: '/startup-support',
});

export default async function StartupSupportPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  const startups = caseStudies.filter((c) => c.category === 'Startup Support');

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Startup Support', path: '/startup-support' }])} />
      <JsonLd data={faqSchema(startupFaq)} />

      <PageHero
        art="bulb"
        crumbs={[{ name: 'Startup Support' }]}
        title="Technický partner pro zakladatele"
        lead="Pomáháme lidem, kteří mají dobrý nápad a znají svůj obor, ale chybí jim vývojáři. Do vybraných projektů vstupujeme jako dlouhodobý technický partner: od návrhu přes první verzi až po provoz. Podmínky přizpůsobujeme fázi projektu."
      >
        {/* One action; the second way in is a text link, as on the landing page. */}
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Button href="#prihlaska" size="lg" arrow track="cta_startup_hero" className="w-full sm:w-auto">
            Napsat nám o projektu
          </Button>
          <a
            href="#jak-to-funguje"
            className="tap self-center text-[15px] font-medium text-ink underline sm:self-auto decoration-line-strong decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-ink"
          >
            Jak to funguje
          </a>
        </div>
      </PageHero>

      <section className="section-y">
        <div className="container-page">
          <SectionHeader title="Spoluzakladatel, ne dodavatel" />
          <div className="mt-10 sm:mt-14 grid gap-3 sm:grid-cols-2">
            {startupOffer.map((o) => (
              <div key={o.title} className="rounded-2xl bg-card p-7 sm:p-9">
                <h3 className="text-2xl text-ink">{o.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-2">{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-8 sm:gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeader
            title="Projekty si vybíráme"
            lead="Nejsme investiční fond ani agentura, která vezme cokoliv. Do projektu jdeme, když v něj sami věříme."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <ul className="space-y-5 rounded-2xl bg-card p-6 sm:p-8">
            {startupCriteria.map((c) => (
              <li key={c} className="flex items-start gap-4 text-base text-ink sm:text-lg">
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
          <ol className="mt-10 sm:mt-14 grid gap-x-8 gap-y-8 sm:gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {startupSteps.map((s, i) => (
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
          <div className="mt-10 sm:mt-14">
            <CaseCards items={startups} showMeta={false} />
          </div>
        </div>
      </section>

      <Faq items={startupFaq} askHref="#prihlaska" askLabel="Napsat nám o projektu" />

      <section id="prihlaska" className="section-y scroll-mt-20">
        {/* Mirrored against the FAQ above: form left, heading right, so the two
            neighbouring splits do not read as one. On a phone the heading leads. */}
        <div className="container-page grid gap-8 sm:gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
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
