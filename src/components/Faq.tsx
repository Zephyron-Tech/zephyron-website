import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import type { FaqItem } from '@/content/faq';
import { SectionHeader } from './ui/SectionHeader';
import { FaqList } from './FaqList';

interface FaqProps {
  items: FaqItem[];
  title?: string;
  lead?: string;
  /** Where "ask your own" leads; a page with its own form points to it. */
  askHref?: string;
  askLabel?: string;
}

// Questions are white cards one tone step above the page; one is open at a
// time (FaqList). The left column holds the heading and a way to ask
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
      <div className="container-page grid gap-8 sm:gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader title={title} lead={lead} />

          <Ask href={askHref} label={askLabel} className="mt-10 hidden lg:flex" />
        </div>

        <div className="flex flex-col gap-3">
          <FaqList items={items} />
          {/* On a phone the questions come first; asking your own follows them. */}
          <Ask href={askHref} label={askLabel} className="mt-7 flex lg:hidden" />
        </div>
      </div>
    </section>
  );
}

// "Didn't find your answer?" with the way to ask: beside the heading from lg,
// after the questions on a phone.
function Ask({ href, label, className }: { href: string; label: string; className: string }) {
  return (
    <div className={`max-w-md items-start gap-4 ${className}`}>
      <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-card">
        <Image src="/mark-256.png" alt="" width={256} height={196} className="h-6 w-auto" />
      </span>
      <div>
        <p className="font-medium text-ink">Nenašli jste odpověď?</p>
        <p className="mt-1 text-ink-2">Napište nám. Odpovídá ten, kdo to staví, ne obchodník.</p>
        <Link href={href} className="tap group mt-4 inline-flex items-center gap-2 text-[15px] font-medium text-accent">
          {label}
          <ArrowRight
            size={16}
            aria-hidden
            className="transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}
