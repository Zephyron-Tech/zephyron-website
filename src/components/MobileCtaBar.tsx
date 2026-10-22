'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/navigation';
import { Button } from './ui/Button';

// Phones only: once the page's own header has scrolled away, the main action
// waits at the bottom within thumb reach. It steps aside whenever another way
// to act is on screen (a form, the closing call to action, the footer) and on
// the contact page itself.
export function MobileCtaBar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);
  const [zoneInView, setZoneInView] = useState(false);

  useEffect(() => {
    setPastHero(false);
    setZoneInView(false);
    const hero = document.querySelector('[data-hero]');
    const zones = [...document.querySelectorAll('[data-cta-zone]')];
    const visible = new Set<Element>();

    const heroIo = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { threshold: 0 });
    if (hero) heroIo.observe(hero);
    else setPastHero(true);

    const zoneIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setZoneInView(visible.size > 0);
      },
      { threshold: 0 },
    );
    zones.forEach((z) => zoneIo.observe(z));

    return () => {
      heroIo.disconnect();
      zoneIo.disconnect();
    };
  }, [pathname]);

  const shown = pastHero && !zoneInView && pathname !== '/kontakt';
  const lift = 'shadow-[0_-10px_24px_-16px_rgb(17_19_30/0.22)]'; // taste-skill-ignore: a sticky bar over content, like the header

  return (
    <div
      aria-hidden={!shown}
      inert={!shown}
      className={`fixed inset-x-0 bottom-0 z-30 bg-paper px-[var(--gutter)] pb-[max(12px,env(safe-area-inset-bottom))] pt-3 ${lift} transition-transform duration-[250ms] ease-[var(--ease-out)] motion-reduce:transition-none md:hidden pointer-fine:hidden ${
        shown ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <Button href="/kontakt" size="lg" arrow track="cta_mobile_bar" className="w-full">
        {t('cta')}
      </Button>
    </div>
  );
}
