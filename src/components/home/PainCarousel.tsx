'use client';

import { useEffect, useRef, useState } from 'react';

interface Pain {
  title: string;
  text: string;
}

// On a phone a set of short cards (the pains, a service's deliverables) is a
// swipe row: one card and the edge of the next, snapping card by card, with a
// quiet position marker below. From sm up the same list is a grid, so nothing
// is duplicated for screen readers.
export function PainCarousel({ pains, label }: { pains: Pain[]; label: string }) {
  const list = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const card = el.firstElementChild as HTMLElement | null;
        if (!card) return;
        const step = card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0');
        setActive(Math.min(pains.length - 1, Math.round(el.scrollLeft / step)));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
    };
  }, [pains.length]);

  return (
    <>
      <ul
        ref={list}
        tabIndex={0}
        aria-label={label}
        className="bleed-x flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
      >
        {pains.map((p) => (
          <li key={p.title} className="w-[82%] shrink-0 snap-start rounded-2xl bg-card p-6 sm:w-auto sm:p-7">
            <h3 className="text-xl text-ink">{p.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{p.text}</p>
          </li>
        ))}
      </ul>
      <div aria-hidden className="mt-4 flex justify-center gap-1.5 sm:hidden">
        {pains.map((p, i) => (
          <span
            key={p.title}
            // The active dot grows into a pill rather than stretching, so its ends stay round.
            className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ease-[var(--ease-out)] ${
              i === active ? 'w-5 bg-accent' : 'w-1.5 bg-line-strong'
            }`}
          />
        ))}
      </div>
    </>
  );
}
