import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const BASE = 'https://zephyron.tech';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms of Service',
    description: 'Terms of Service for the Zephyron Tech s.r.o. website.',
    alternates: {
      canonical: `${BASE}/terms`,
    },
  };
}

const content = {
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

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <LegalContent />
      </main>
      <Footer />
    </>
  );
}

function LegalContent() {
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
