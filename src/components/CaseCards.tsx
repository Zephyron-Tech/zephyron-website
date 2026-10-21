import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import type { CaseStudy } from '@/content/case-studies';

export function CaseCards({ items, featuredFirst = false }: { items: CaseStudy[]; featuredFirst?: boolean }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((c, i) => (
        <CaseCard key={c.slug} item={c} wide={featuredFirst && i === 0} />
      ))}
    </div>
  );
}

function CaseCard({ item, wide }: { item: CaseStudy; wide: boolean }) {
  const body = (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl border border-line bg-paper-2 ${
          wide ? 'aspect-[16/10] md:aspect-[21/9]' : 'aspect-[16/10]'
        }`}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={`${item.name}: ukázka`}
            fill
            sizes={wide ? '(min-width: 768px) 1100px, 100vw' : '(min-width: 768px) 560px, 100vw'}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-grid">
            <span className="font-display text-3xl font-semibold tracking-tight text-ink/80">{item.name}</span>
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <span>{item.category}</span>
        <span aria-hidden>·</span>
        <span className={item.status === 'V provozu' ? 'text-ok' : ''}>{item.status}</span>
      </div>
      <h3 className="mt-2 text-2xl text-ink">{item.name}</h3>
      <p className="mt-1 text-sm text-muted">{item.kicker}</p>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">{item.summary}</p>
      {item.detail && (
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink">
          Celá případová studie
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      )}
    </>
  );

  const cls = `group block ${wide ? 'md:col-span-2' : ''}`;

  return item.detail ? (
    <Link href={`/reference/${item.slug}`} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
