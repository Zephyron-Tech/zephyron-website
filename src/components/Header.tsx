'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Logo } from './ui/Logo';
import { Button } from './ui/Button';
import { ContactModal } from './ContactModal';

export function Header() {
  const t = useTranslations('header');
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: scrolled ? 'rgba(1, 15, 34, 0.72)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px) saturate(160%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(160%)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
          transition: 'all 200ms var(--ease-out)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 88,
            gap: 40,
          }}
        >
          <a href="#top" aria-label="Zephyron Tech home">
            <Logo height={36} />
          </a>

          <nav
            style={{ display: 'flex', gap: 36 }}
            className="zt-header-nav"
          >
            {(
              [
                [t('nav.projects'), '#projects'],
                [t('nav.techStack'), '#stack'],
                [t('nav.contact'), '#contact'],
              ] as [string, string][]
            ).map(([label, href]) => (
              <NavLink key={label} href={href} label={label} />
            ))}
          </nav>

          <Button
            onClick={() => setModalOpen(true)}
            variant="ghost"
            size="sm"
            iconRight="ArrowUpRight"
          >
            {t('cta')}
          </Button>
        </div>

        <style>{`
          @media (max-width: 720px) {
            .zt-header-nav { display: none !important; }
          }
        `}</style>
      </header>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      style={{
        fontSize: 15,
        fontWeight: 500,
        color: hover ? 'var(--fg)' : 'var(--fg-muted)',
        transition: 'color 120ms var(--ease-out)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </a>
  );
}
