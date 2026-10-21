'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/navigation';
import { NAV } from '@/content/site';
import { Logo } from './ui/Logo';
import { Button } from './ui/Button';

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
      className={`sticky top-0 z-40 bg-paper transition-shadow duration-200 ${
        scrolled || open ? 'shadow-[0_6px_20px_-12px_rgb(17_19_30/0.18)]' : '' // taste-skill-ignore: sticky bar floats over content
      }`}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label={t('home')} className="shrink-0">
          <Logo height={30} />
        </Link>

        <nav aria-label="Hlavní navigace" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-[15px] transition-colors duration-150 ${
                isActive(item.href)
                  ? 'bg-card font-medium text-accent'
                  : 'text-ink-2 hover:bg-paper-2 hover:text-ink'
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
          {open ? <X size={24} strokeWidth={1.75} /> : <Menu size={24} strokeWidth={1.75} />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-paper lg:hidden">
          <nav aria-label="Mobilní navigace" className="container-page flex flex-col py-6">
            {[...NAV, { href: '/kontakt', key: 'contact' } as const].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`py-4 font-display text-2xl font-semibold tracking-tight ${
                  isActive(item.href) ? 'text-accent' : 'text-ink'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-8">
              <Button href="/kontakt" size="lg" arrow track="cta_mobile_menu" className="w-full">
                {t('cta')}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
