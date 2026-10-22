import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Phone, MapPin } from 'lucide-react';
import { SITE } from '@/content/site';
import { PageHero } from '@/components/PageHero';
import { ContactForm } from '@/components/ContactForm';
import { CalEmbed } from '@/components/CalEmbed';
import { CopyEmail } from '@/components/CopyEmail';
import { ContactTile } from '@/components/ContactTile';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Kontakt a nezávazná konzultace',
  description:
    'Domluvte si úvodní konzultaci zdarma nebo nám napište. Ozveme se do dvou pracovních dnů. Zephyron Tech s.r.o., Čermákova 2587/60, Plzeň.',
  path: '/kontakt',
});

const next = [
  { title: 'Ozveme se', text: 'Nejpozději do dvou pracovních dnů. Když jste si vybrali termín, rovnou se uvidíme.' },
  { title: 'Úvodní konzultace', text: 'Zdarma. Probereme, co vás zdržuje, a řekneme, jestli umíme pomoct.' },
  { title: 'Návrh a cena', text: 'Když to dává smysl, pošleme návrh řešení a cenu první etapy.' },
];

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  const hasCal = SITE.calLink.length > 0;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Kontakt', path: '/kontakt' }])} />
      <PageHero
        art="phone"
        crumbs={[{ name: 'Kontakt' }]}
        title="Pojďme to probrat"
        lead={
          hasCal
            ? 'Vyberte si termín úvodní konzultace, nebo nám napište. Konzultace je zdarma a nezávazná.'
            : 'Napište nám pár vět o tom, co řešíte. Ozveme se a domluvíme si úvodní konzultaci. Je zdarma a nezávazná.'
        }
      >
        <CopyEmail />
      </PageHero>

      <section className="section-y">
        {hasCal ? (
          <>
            <div className="container-page grid gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl text-ink">Rezervovat termín</h2>
                <p className="mt-2 text-ink-2">Online a zdarma.</p>
                <div className="mt-6 min-h-[640px] overflow-hidden rounded-2xl bg-card">
                  <CalEmbed calLink={SITE.calLink} />
                </div>
              </div>
              <FormColumn title="Nebo nám napište" />
            </div>
            <div className="container-page mt-16 grid gap-3 md:grid-cols-[2fr_1fr]">
              <NextSteps />
              <DirectContact />
            </div>
          </>
        ) : (
          <div className="container-page">
            <h2 className="text-2xl text-ink">Napište nám</h2>
            <p className="mt-2 text-ink-2">Čím konkrétněji, tím lépe se na hovor připravíme.</p>
            {/* Form and aside start on one line; the aside holds while the form scrolls. */}
            <div className="mt-6 grid gap-3 lg:grid-cols-[1.25fr_0.75fr] lg:gap-6">
              <ContactForm />
              <aside className="flex flex-col gap-3 lg:sticky lg:top-28 lg:self-start">
                <NextSteps />
                <DirectContact />
              </aside>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function FormColumn({ title }: { title: string }) {
  return (
    <div>
      <h2 className="text-2xl text-ink">{title}</h2>
      <p className="mt-2 text-ink-2">Čím konkrétněji, tím lépe se na hovor připravíme.</p>
      <div className="mt-6">
        <ContactForm />
      </div>
    </div>
  );
}

// What happens after sending, in order: one white card, numbered steps.
function NextSteps() {
  return (
    <div className="rounded-2xl bg-card p-6">
      <h2 className="font-display text-lg font-semibold tracking-tight text-ink">Co bude následovat</h2>
      <ol className="mt-5 space-y-5">
        {next.map((n, i) => (
          <li key={n.title} className="flex gap-4">
            <span
              aria-hidden
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent"
            >
              {i + 1}
            </span>
            <div>
              <h3 className="font-medium text-ink">{n.title}</h3>
              <p className="mt-1 text-pretty text-[15px] leading-relaxed text-ink-2">{n.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// The e-mail is large in the header already; here the phone and the company.
function DirectContact() {
  return (
    <div className="grid gap-3">
      <ContactTile
        tone="card"
        icon={Phone}
        label="Telefon"
        value={SITE.phone}
        href={`tel:${SITE.phone.replace(/\s/g, '')}`}
      />
      <ContactTile
        tone="card"
        icon={MapPin}
        label="Sídlo"
        value={SITE.legalName}
        lines={[`${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}`, `IČO ${SITE.ico}`]}
      />
    </div>
  );
}
