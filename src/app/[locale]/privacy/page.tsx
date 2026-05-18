import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const en = {
  title: 'Privacy Policy',
  updated: 'Last updated: May 2026',
  sections: [
    {
      heading: 'Controller',
      body: 'Zephyron Tech s.r.o., Company No. 23793538, Čermákova 2587/60, 301 00 Plzeň, Czech Republic. Contact: hello@zephyron.tech',
    },
    {
      heading: 'What we collect',
      body: 'When you contact us via the inquiry form or email, we process your name (if provided), email address, and any project information you share. This website does not use tracking cookies or analytics.',
    },
    {
      heading: 'Why we process it',
      body: 'Solely to respond to your inquiry. Legal basis: Art. 6(1)(b) GDPR — steps prior to entering into a contract — or Art. 6(1)(f) GDPR — our legitimate interest in responding to business enquiries.',
    },
    {
      heading: 'Retention',
      body: 'Inquiry data is kept for up to 2 years from the last contact, or until you request deletion.',
    },
    {
      heading: 'Your rights',
      body: 'Under GDPR you have the right to access, rectify, erase, restrict, or receive a copy of your personal data, and to object to its processing. Send a request to hello@zephyron.tech — we will respond within 30 days.',
    },
    {
      heading: 'Supervisory authority',
      body: 'You may lodge a complaint with the Czech Office for Personal Data Protection (ÚOOÚ) at uoou.cz.',
    },
  ],
};

const cs = {
  title: 'Zásady ochrany osobních údajů',
  updated: 'Poslední aktualizace: květen 2026',
  sections: [
    {
      heading: 'Správce',
      body: 'Zephyron Tech s.r.o., IČO 23793538, Čermákova 2587/60, 301 00 Plzeň, Česká republika. Kontakt: hello@zephyron.tech',
    },
    {
      heading: 'Co zpracováváme',
      body: 'Pokud nás kontaktujete prostřednictvím formuláře nebo emailem, zpracováváme vaše jméno (pokud ho poskytnete), emailovou adresu a informace o projektu. Na tomto webu nepoužíváme sledovací cookies ani analytické nástroje.',
    },
    {
      heading: 'Proč to zpracováváme',
      body: 'Výhradně za účelem odpovědi na váš dotaz. Právní základ: čl. 6 odst. 1 písm. b) GDPR (kroky před uzavřením smlouvy) nebo čl. 6 odst. 1 písm. f) GDPR (oprávněný zájem reagovat na obchodní dotazy).',
    },
    {
      heading: 'Doba uchování',
      body: 'Údaje z dotazů uchováváme nejvýše 2 roky od posledního kontaktu, nebo dokud nás nepožádáte o jejich smazání.',
    },
    {
      heading: 'Vaše práva',
      body: 'Dle GDPR máte právo na přístup, opravu, výmaz, omezení zpracování nebo přenositelnost svých osobních údajů a právo vznést námitku. Žádost zašlete na hello@zephyron.tech — odpovíme do 30 dnů.',
    },
    {
      heading: 'Dozorový úřad',
      body: 'Stížnost můžete podat u Úřadu pro ochranu osobních údajů (ÚOOÚ) na uoou.cz.',
    },
  ],
};

export default async function PrivacyPage({
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
          margin: '0 0 clamp(28px, 4vw, 56px)',
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
