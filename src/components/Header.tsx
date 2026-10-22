'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Mail, Menu, Phone, X } from 'lucide-react';
import { Link, usePathname } from '@/navigation';
import { NAV, SITE } from '@/content/site';
import { services } from '@/content/services';
import { Logo } from './ui/Logo';
import { Button } from './ui/Button';
import { ContactTile } from './ContactTile';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    // Lock the root scroller, not body: overflow on body would make it the
    // sticky header's scroll container and push the header out of view.
    const root = document.documentElement;
    root.style.overflowY = open ? 'hidden' : '';
    return () => {
      root.style.overflowY = '';
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-40 bg-paper pt-[env(safe-area-inset-top)] transition-shadow duration-200 ${
        scrolled || open ? 'shadow-[0_6px_20px_-12px_rgb(17_19_30/0.18)]' : '' // taste-skill-ignore: sticky bar floats over content
      }`}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label={t('home')} className="-my-2 flex shrink-0 items-center py-2">
          <Logo height={30} />
        </Link>

        <nav aria-label="Hlavní navigace" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-[15px] transition-colors duration-150 ${
                isActive(item.href) ? 'bg-card font-medium text-accent' : 'text-ink-2 hover:bg-paper-2 hover:text-ink'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="/kontakt" track="cta_header">
            {t('cta')}
          </Button>
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t('close') : t('menu')}
          onClick={() => setOpen((v) => !v)}
        >
          {/* The two icons cross-fade with a quarter turn instead of swapping. */}
          <span className="relative size-6">
            <Menu
              size={24}
              strokeWidth={1.75}
              aria-hidden
              className={`absolute inset-0 transition-[opacity,rotate,scale] duration-300 ease-[var(--ease-out)] ${open ? 'rotate-90 scale-75 opacity-0' : ''}`}
            />
            <X
              size={24}
              strokeWidth={1.75}
              aria-hidden
              className={`absolute inset-0 transition-[opacity,rotate,scale] duration-300 ease-[var(--ease-out)] ${open ? '' : '-rotate-90 scale-75 opacity-0'}`}
            />
          </span>
        </button>
      </div>

      {/* Always mounted, so it can leave as smoothly as it came: closed it is
          invisible and inert, open it fades and settles down from the header. */}
      <div
        id="mobile-menu"
        data-open={open || undefined}
        inert={!open}
        className="mobile-menu fixed inset-x-0 bottom-0 top-[calc(72px+env(safe-area-inset-top))] z-40 overflow-y-auto overscroll-contain bg-paper pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {/* Pages large, the four services under Služby, then how to reach us:
              the whole screen is useful, and the items arrive in a short stagger. */}
        <nav aria-label="Mobilní navigace" className="container-page flex min-h-full flex-col pb-8 pt-4">
          <ul>
            {[...NAV, { href: '/kontakt', key: 'contact' } as const].map((item, i) => (
              <li key={item.href} className="menu-in" style={{ '--i': i } as React.CSSProperties}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`group flex items-center justify-between py-3 font-display text-[28px] font-semibold tracking-tight ${
                    isActive(item.href) ? 'text-accent' : 'text-ink'
                  }`}
                >
                  {t(item.key)}
                  <ArrowRight
                    size={22}
                    aria-hidden
                    className="text-ink-2 transition-transform duration-200 group-active:translate-x-1"
                  />
                </Link>
                {item.href === '/sluzby' && (
                  <ul className="mb-2 grid grid-cols-2 gap-x-4">
                    {services.map((sv) => (
                      <li key={sv.slug}>
                        <Link
                          href={`/sluzby/${sv.slug}`}
                          className="block py-2.5 text-[15px] leading-snug text-ink-2 pointer-coarse:py-3"
                        >
                          {sv.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="menu-in mt-auto grid gap-2 pt-8" style={{ '--i': 6 } as React.CSSProperties}>
            <ContactTile tone="card" icon={Mail} label="E-mail" value={SITE.email} href={`mailto:${SITE.email}`} />
            <ContactTile
              tone="card"
              icon={Phone}
              label="Telefon"
              value={SITE.phone}
              href={`tel:${SITE.phone.replace(/\s/g, '')}`}
            />
            <Button href="/kontakt" size="lg" arrow track="cta_mobile_menu" className="mt-2 w-full">
              {t('cta')}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
