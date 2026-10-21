import { Plus } from 'lucide-react';
import type { FaqItem } from '@/content/faq';
import { SectionHeader } from './ui/SectionHeader';

export function Faq({ items, num, title = 'Časté otázky' }: { items: FaqItem[]; num?: number; title?: string }) {
  return (
    <section className="section-y border-t border-line">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeader num={num} eyebrow="FAQ" title={title} />
        <div className="divide-y divide-line border-y border-line">
          {items.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-display text-lg font-semibold tracking-tight text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus
                  size={20}
                  aria-hidden
                  className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-ink-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
