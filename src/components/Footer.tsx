'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Logo } from './ui/Logo';

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      style={{
        fontSize: 14,
        color: hover ? 'var(--fg)' : 'var(--fg-muted)',
        transition: 'color 120ms var(--ease-out)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </a>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--fg-subtle)',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          marginBottom: 18,
        }}
      >
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  );
}

function LegalCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--fg-subtle)',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          color: 'var(--fg-2)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const localePath = (path: string) => (locale === 'en' ? path : `/${locale}${path}`);
  const addressLines = t('address').split('\n');

  return (
    <footer
      style={{
        background: 'var(--navy-950)',
        borderTop: '1px solid var(--border)',
        padding: 'clamp(40px, 6vw, 64px) 0 clamp(24px, 3vw, 32px)',
        position: 'relative',
      }}
    >
      <div className="container">
        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
            gap: 'clamp(28px, 4vw, 48px)',
            paddingBottom: 'clamp(36px, 5vw, 56px)',
            borderBottom: '1px solid var(--border)',
          }}
          className="zt-footer-grid"
        >
          <div>
            <Logo height={28} />
            <p
              style={{
                marginTop: 24,
                fontSize: 14,
                lineHeight: 1.65,
                color: 'var(--fg-muted)',
                maxWidth: '36ch',
              }}
            >
              {t('tagline')}
            </p>
          </div>

          <FooterCol title={t('nav.company')}>
            <FooterLink href="#projects">{t('nav.projects')}</FooterLink>
            <FooterLink href="#stack">{t('nav.techStack')}</FooterLink>
            <FooterLink href="#contact">{t('nav.contact')}</FooterLink>
          </FooterCol>

          <FooterCol title={t('nav.legal')}>
            <FooterLink href={localePath('/privacy')}>{t('nav.privacy')}</FooterLink>
            <FooterLink href={localePath('/terms')}>{t('nav.terms')}</FooterLink>
          </FooterCol>

          <FooterCol title={t('nav.office')}>
            <address
              style={{
                fontStyle: 'normal',
                fontSize: 14,
                lineHeight: 1.65,
                color: 'var(--fg-muted)',
              }}
            >
              {addressLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < addressLines.length - 1 && <br />}
                </span>
              ))}
            </address>
          </FooterCol>
        </div>

        {/* Legal strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
            padding: '32px 0',
            borderBottom: '1px solid var(--border)',
          }}
          className="zt-footer-legal"
        >
          <LegalCell label={t('legal.companyNumber')}>23793538</LegalCell>
          <LegalCell label={t('legal.registeredAs')}>{t('legal.registeredAsValue')}</LegalCell>
          <LegalCell label={t('legal.contact')}>
            <a
              href="mailto:hello@zephyron.tech"
              style={{ color: 'var(--fg-2)' }}
            >
              hello@zephyron.tech
            </a>
          </LegalCell>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: 28,
            fontSize: 13,
            color: 'var(--fg-subtle)',
          }}
        >
          {t('copyright')}
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .zt-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
          .zt-footer-legal { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .zt-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
