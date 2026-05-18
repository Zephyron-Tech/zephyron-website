'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Logo } from './ui/Logo';
import { Button } from './ui/Button';
import { Icon } from './ui/Icon';
import { ContactModal } from './ContactModal';

export function Header() {
  const t = useTranslations('header');
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Scroll-aware blur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll lock while drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Escape closes drawer
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const navLinks: [string, string][] = [
    [t('nav.projects'), '#projects'],
    [t('nav.techStack'), '#stack'],
    [t('nav.contact'), '#contact'],
  ];

  const openModal = () => {
    setDrawerOpen(false);
    setModalOpen(true);
  };

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
          className="container zt-header-inner"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 88,
            gap: 40,
          }}
        >
          <a href="#top" aria-label="Zephyron Tech home" style={{ flexShrink: 0 }}>
            <Logo height={36} />
          </a>

          {/* Desktop nav */}
          <nav
            style={{ display: 'flex', gap: 36 }}
            className="zt-header-nav"
          >
            {navLinks.map(([label, href]) => (
              <NavLink key={label} href={href} label={label} />
            ))}
          </nav>

          {/* Desktop CTA */}
          <Button
            onClick={openModal}
            variant="ghost"
            size="sm"
            iconRight="ArrowUpRight"
            className="zt-header-cta"
          >
            {t('cta')}
          </Button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="zt-hamburger"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--fg)',
              flexShrink: 0,
              marginRight: -8,
            }}
          >
            <Icon name="Menu" size={22} strokeWidth={1.5} />
          </button>
        </div>

        <style>{`
          @media (max-width: 720px) {
            .zt-header-nav  { display: none !important; }
            .zt-header-cta  { display: none !important; }
            .zt-hamburger   { display: flex !important; }
            .zt-header-inner { height: 72px !important; gap: 16px !important; }
          }
        `}</style>
      </header>

      {/* ── Mobile drawer (full-screen overlay) ───────────────────────── */}

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'var(--navy-950)',
          display: 'flex',
          flexDirection: 'column',
          transform: drawerOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 340ms cubic-bezier(0.32, 0, 0.15, 1)',
          willChange: 'transform',
          overflowY: 'auto',
        }}
      >
        {/* Drawer header row — matches sticky header height */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 72,
            flexShrink: 0,
            padding: '0 clamp(20px, 5vw, 56px)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <Logo height={28} />
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--fg-muted)',
              marginRight: -10,
            }}
          >
            <Icon name="X" size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Nav links */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '8px clamp(20px, 5vw, 56px) 0',
          }}
        >
          {navLinks.map(([label, href]) => (
            <DrawerLink
              key={label}
              href={href}
              label={label}
              onClick={() => setDrawerOpen(false)}
            />
          ))}
        </nav>

        {/* CTA */}
        <div style={{ padding: '32px clamp(20px, 5vw, 56px) 48px', flexShrink: 0 }}>
          <Button
            onClick={openModal}
            variant="primary"
            size="lg"
            iconRight="ArrowUpRight"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {t('cta')}
          </Button>
        </div>
      </div>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

// ── Desktop nav link ──────────────────────────────────────────────────────
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

// ── Drawer nav link ───────────────────────────────────────────────────────
function DrawerLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 0',
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(28px, 7vw, 40px)',
        fontWeight: 600,
        letterSpacing: '-0.02em',
        color: hover ? 'var(--fg)' : 'var(--fg-muted)',
        borderBottom: '1px solid var(--border)',
        transition: 'color 120ms var(--ease-out)',
        textDecoration: 'none',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
      <Icon
        name="ArrowRight"
        size={20}
        strokeWidth={1.5}
        style={{ opacity: hover ? 1 : 0.25, transition: 'opacity 120ms', flexShrink: 0 }}
      />
    </a>
  );
}
