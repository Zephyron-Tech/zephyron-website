import Image from 'next/image';
import { ArrowRight, Plus } from 'lucide-react';
import { Link } from '@/navigation';
import type { FaqItem } from '@/content/faq';
import { SectionHeader } from './ui/SectionHeader';

interface FaqProps {
  items: FaqItem[];
  title?: string;
  lead?: string;
  /** Where "ask your own" leads; a page with its own form points to it. */
  askHref?: string;
  askLabel?: string;
}

// Questions are white cards one tone step above the page; one is open at a
// time (details[name]). The left column holds the heading and a way to ask
// whatever is not on the list, so it never stands empty.
export function Faq({
  items,
  title = 'Časté otázky',
  lead = 'Na tohle se nás firmy ptají nejčastěji, než se pustíme do práce.',
  askHref = '/kontakt',
  askLabel = 'Položit vlastní otázku',
}: FaqProps) {
  return (
    <section className="section-y">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader title={title} lead={lead} />

          <div className="mt-10 flex max-w-md items-start gap-4">
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-card">
              <Image src="/mark-256.png" alt="" width={256} height={196} className="h-6 w-auto" />
            </span>
            <div>
              <p className="font-medium text-ink">Nenašli jste odpověď?</p>
              <p className="mt-1 text-ink-2">Napište nám. Odpovídá ten, kdo to staví, ne obchodník.</p>
              <Link
                href={askHref}
                className="group mt-4 inline-flex items-center gap-2 text-[15px] font-medium text-accent"
              >
                {askLabel}
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((f, i) => (
            <details key={f.q} name="faq" open={i === 0} className="faq group rounded-2xl bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-2xl px-6 py-5 text-left font-display text-lg font-semibold tracking-tight text-ink sm:px-7 sm:py-6 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink transition-[background-color,color,rotate] duration-200 ease-[var(--ease-out)] group-open:rotate-45 group-open:bg-accent group-open:text-white"
                >
                  <Plus size={18} />
                </span>
              </summary>
              <p className="max-w-2xl px-6 pb-6 leading-relaxed text-ink-2 sm:px-7 sm:pb-7">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
