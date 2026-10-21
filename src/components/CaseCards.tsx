import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import type { CaseStudy } from '@/content/case-studies';
import { PrintObject } from './PrintObject';

interface CaseCardsProps {
  items: CaseStudy[];
  /** First item spans the row, picture beside its text. */
  featuredFirst?: boolean;
  /** Category and status line; the landing page leaves it out. */
  showMeta?: boolean;
}

// Each case is its own white card one tone step above the page, the picture
// inset in it, so neighbouring projects never run together.
export function CaseCards({ items, featuredFirst = false, showMeta = true }: CaseCardsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((c, i) => (
        <CaseCard key={c.slug} item={c} wide={featuredFirst && i === 0} showMeta={showMeta} />
      ))}
    </div>
  );
}

function CaseCard({ item, wide, showMeta }: { item: CaseStudy; wide: boolean; showMeta: boolean }) {
  const body = (
    <>
      <div
        className={`relative aspect-[16/10] overflow-hidden rounded-2xl bg-paper-2 ${wide ? 'md:aspect-auto md:min-h-[360px]' : ''}`}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={`${item.name}: ukázka`}
            fill
            sizes={wide ? '(min-width: 768px) 700px, 100vw' : '(min-width: 768px) 560px, 100vw'}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : item.art ? (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <PrintObject
              name={item.art}
              sizes="(min-width: 768px) 320px, 60vw"
              decorative={false}
              className="max-h-full w-auto object-contain"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-3xl font-semibold tracking-tight text-ink/80">{item.name}</span>
          </div>
        )}
      </div>
      <div className={`px-3 pb-4 pt-5 sm:px-4 ${wide ? 'md:self-center md:py-6 md:pl-6 md:pr-4' : ''}`}>
        {showMeta && (
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
            <span>{item.category}</span>
            <span aria-hidden>·</span>
            <span className={item.status === 'V provozu' ? 'text-ok' : ''}>{item.status}</span>
          </div>
        )}
        <h3 className={`text-ink transition-colors duration-300 group-hover:text-accent ${wide ? 'text-3xl' : 'text-2xl'}`}>{item.name}</h3>
        <p className="mt-1 text-sm text-muted">{item.kicker}</p>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">{item.summary}</p>
        {item.detail && (
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors duration-300 group-hover:text-accent">
            Celá případová studie
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </span>
        )}
      </div>
    </>
  );

  const cls = `group grid content-start rounded-3xl bg-card p-2.5 sm:p-3 ${
    wide ? 'md:col-span-2 md:grid-cols-[1.45fr_1fr]' : ''
  } ${
    item.detail
      ? 'outline-2 -outline-offset-2 outline-transparent transition-[outline-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] hover:-translate-y-1.5 hover:outline-accent hover:shadow-[0_24px_48px_-24px_rgb(66_53_229/0.35)] motion-reduce:hover:translate-y-0' // taste-skill-ignore: hover-only lift shadow, as the service tiles
      : ''
  }`;

  return item.detail ? (
    <Link href={`/reference/${item.slug}`} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
