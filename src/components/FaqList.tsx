'use client';

import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import type { FaqItem } from '@/content/faq';

// One answer open at a time. The answer slides open by animating its grid row
// from 0fr to 1fr, which every browser can tween (Safari cannot tween a
// <details> to auto height, so there it used to snap). Closed answers stay in
// the DOM for search engines, hidden from focus and screen readers.
export function FaqList({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <>
      {items.map((f, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <div key={f.q} data-open={isOpen || undefined} className="group rounded-2xl bg-card">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-6 rounded-2xl px-5 py-5 text-left font-display text-lg font-semibold tracking-tight text-ink sm:px-7 sm:py-6"
              >
                {f.q}
                <span
                  aria-hidden
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink transition-[background-color,color,rotate] duration-300 ease-[var(--ease-out)] group-data-open:rotate-45 group-data-open:bg-accent group-data-open:text-white"
                >
                  <Plus size={18} />
                </span>
              </button>
            </h3>
            <div
              id={id}
              role="region"
              inert={!isOpen}
              className="faq-panel grid grid-rows-[0fr] opacity-0 group-data-open:grid-rows-[1fr] group-data-open:opacity-100"
            >
              <div className="min-h-0 overflow-hidden">
                <p className="max-w-2xl px-5 pb-6 leading-relaxed text-ink-2 sm:px-7 sm:pb-7">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
