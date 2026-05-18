import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const en = {
  title: 'Terms of Service',
  updated: 'Last updated: May 2026',
  sections: [
    {
      heading: 'Company',
      body: 'This website is operated by Zephyron Tech s.r.o., Company No. 23793538, Čermákova 2587/60, 301 00 Plzeň, Czech Republic.',
    },
    {
      heading: 'Website use',
      body: 'This website is provided for informational purposes. We make reasonable efforts to keep the content accurate and current, but make no warranties — express or implied — regarding its completeness or fitness for a particular purpose.',
    },
    {
      heading: 'Intellectual property',
      body: 'All content on this website — including text, graphics, logos, and code — is the property of Zephyron Tech s.r.o. and may not be reproduced without prior written permission.',
    },
    {
      heading: 'Inquiries',
      body: 'Submitting the contact form or sending an email constitutes an inquiry, not a binding offer or contract. Any engagement of our services is subject to a separate written agreement.',
    },
    {
      heading: 'Liability',
      body: 'To the extent permitted by applicable law, Zephyron Tech s.r.o. shall not be liable for indirect or consequential damages arising from the use of this website.',
    },
    {
      heading: 'Governing law',
      body: 'These terms are governed by the laws of the Czech Republic. Any disputes shall be resolved by the competent Czech courts.',
    },
    {
      heading: 'Contact',
      body: 'hello@zephyron.tech',
    },
  ],
};

const cs = {
  title: 'Podmínky použití',
  updated: 'Poslední aktualizace: květen 2026',
  sections: [
    {
      heading: 'Provozovatel',
      body: 'Tento web provozuje Zephyron Tech s.r.o., IČO 23793538, Čermákova 2587/60, 301 00 Plzeň, Česká republika.',
    },
    {
      heading: 'Použití webu',
      body: 'Tento web slouží pouze pro informační účely. Snažíme se udržovat obsah přesný a aktuální, ale neposkytujeme žádné záruky — výslovné ani předpokládané — ohledně jeho úplnosti nebo vhodnosti pro konkrétní účel.',
    },
    {
      heading: 'Duševní vlastnictví',
      body: 'Veškerý obsah na tomto webu — včetně textů, grafiky, log a kódu — je majetkem společnosti Zephyron Tech s.r.o. a nesmí být reprodukován bez předchozího písemného souhlasu.',
    },
    {
      heading: 'Dotazy',
      body: 'Odeslání kontaktního formuláře nebo emailu představuje dotaz, nikoli závaznou nabídku nebo smlouvu. Případné angažování našich služeb podléhá samostatné písemné smlouvě.',
    },
    {
      heading: 'Odpovědnost',
      body: 'V rozsahu povoleném platným právem nenese Zephyron Tech s.r.o. odpovědnost za nepřímé nebo následné škody vzniklé v důsledku použití tohoto webu.',
    },
    {
      heading: 'Rozhodné právo',
      body: 'Tyto podmínky se řídí právem České republiky. Případné spory budou řešeny příslušnými českými soudy.',
    },
    {
      heading: 'Kontakt',
      body: 'hello@zephyron.tech',
    },
  ],
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = locale === 'cs' ? cs : en;

  return (
    <>
      <Header />
      <main>
        <LegalContent content={content} />
      </main>
      <Footer />
    </>
  );
}

function LegalContent({
  content,
}: {
  content: { title: string; updated: string; sections: { heading: string; body: string }[] };
}) {
  return (
    <article
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 40px)',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 'clamp(32px, 5vw, 52px)',
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
          color: 'var(--fg)',
          margin: '0 0 12px',
        }}
      >
        {content.title}
      </h1>
      <p
        style={{
          fontSize: 13,
          color: 'var(--fg-subtle)',
          margin: '0 0 56px',
          letterSpacing: '0.01em',
        }}
      >
        {content.updated}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {content.sections.map((s) => (
          <section key={s.heading}>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--fg)',
                margin: '0 0 10px',
                letterSpacing: '-0.01em',
              }}
            >
              {s.heading}
            </h2>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: 'var(--fg-muted)',
                margin: 0,
              }}
            >
              {s.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
