import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Mail, Phone, MapPin } from 'lucide-react';
import { SITE } from '@/content/site';
import { PageHero } from '@/components/PageHero';
import { ContactForm } from '@/components/ContactForm';
import { CalEmbed } from '@/components/CalEmbed';
import { CopyEmail } from '@/components/CopyEmail';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Domluvte si úvodní konzultaci zdarma nebo nám napište. Zephyron Tech s.r.o., Čermákova 2587/60, Plzeň.',
  alternates: { canonical: `${SITE.url}/kontakt` },
};

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
        crumbs={[{ name: 'Kontakt' }]}
        eyebrow="Kontakt"
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
        <div className={`container-page grid gap-10 ${hasCal ? 'lg:grid-cols-2' : 'lg:grid-cols-[1.3fr_0.7fr]'}`}>
          {hasCal && (
            <div>
              <h2 className="text-2xl text-ink">Rezervovat termín</h2>
              <p className="mt-2 text-ink-2">Online a zdarma.</p>
              <div className="mt-6 min-h-[640px] overflow-hidden rounded-3xl border border-line bg-card">
                <CalEmbed calLink={SITE.calLink} />
              </div>
            </div>
          )}
          <div>
            <h2 className="text-2xl text-ink">{hasCal ? 'Nebo nám napište' : 'Napište nám'}</h2>
            <p className="mt-2 text-ink-2">Čím konkrétněji, tím lépe se na hovor připravíme.</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
          {!hasCal && <ContactDetails />}
        </div>
        {hasCal && (
          <div className="container-page mt-16">
            <ContactDetails horizontal />
          </div>
        )}
      </section>

      <section className="section-y border-t border-line bg-paper-2">
        <div className="container-page">
          <h2 className="text-3xl text-ink sm:text-4xl">Co bude následovat</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {next.map((n, i) => (
              <li key={n.title}>
                <div className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="mt-3 text-xl text-ink">{n.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-2">{n.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

function ContactDetails({ horizontal = false }: { horizontal?: boolean }) {
  const items = [
    { icon: Mail, label: 'E-mail', value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Phone, label: 'Telefon', value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, '')}` },
    {
      icon: MapPin,
      label: 'Sídlo',
      value: `${SITE.legalName}, ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}, IČO ${SITE.ico}`,
    },
  ];
  return (
    <aside
      className={`grid gap-px overflow-hidden rounded-3xl border border-line bg-line self-start ${
        horizontal ? 'md:grid-cols-3' : 'lg:mt-[68px]'
      }`}
    >
      {items.map(({ icon: Icon, label, value, href }) => (
        <div key={label} className="flex gap-4 bg-card p-6">
          <Icon size={20} strokeWidth={1.6} className="mt-0.5 shrink-0 text-accent" aria-hidden />
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{label}</div>
            {href ? (
              <a href={href} data-track={`contact_${label.toLowerCase()}`} className="mt-1 block text-ink hover:text-accent">
                {value}
              </a>
            ) : (
              <div className="mt-1 text-ink">{value}</div>
            )}
          </div>
        </div>
      ))}
    </aside>
  );
}
