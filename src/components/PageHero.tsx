import { ChevronRight } from 'lucide-react';
import { Link } from '@/navigation';
import { SectionHeader } from './ui/SectionHeader';
import { PrintObject } from './PrintObject';
import { LitBulb } from './home/LitBulb';
import type { PrintArtKey } from '@/content/print-art';

interface PageHeroProps {
  title: React.ReactNode;
  lead?: React.ReactNode;
  crumbs?: { name: string; href?: string }[];
  /** Printed object set beside the heading on wide screens. */
  art?: PrintArtKey;
  children?: React.ReactNode;
}

export function PageHero({ title, lead, crumbs = [], art, children }: PageHeroProps) {
  return (
    <section className="page-hero relative overflow-hidden">
      <div className="container-page relative pb-16 pt-10 md:pb-24 md:pt-14">
        {crumbs.length > 0 && (
          <nav aria-label="Drobečková navigace" className="mb-10 flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="hover:text-ink">
              Úvod
            </Link>
            {crumbs.map((c) => (
              <span key={c.name} className="flex items-center gap-1.5">
                <ChevronRight size={14} aria-hidden />
                {c.href ? (
                  <Link href={c.href} className="hover:text-ink">
                    {c.name}
                  </Link>
                ) : (
                  <span className="text-ink-2" aria-current="page">
                    {c.name}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        <div className={art ? 'grid items-center gap-10 lg:grid-cols-[1fr_auto]' : undefined}>
          <div>
            <SectionHeader as="h1" title={title} lead={lead} className="rise" />
            {children && <div className="rise rise-2 mt-9">{children}</div>}
          </div>
          {art === 'bulb' ? (
            // The one header object that does something: it switches on.
            <LitBulb name="bulb" sizes="(min-width: 1024px) 320px, 0px" priority className="hidden h-[340px] lg:block" />
          ) : art && (
            <PrintObject
              name={art}
              sizes="(min-width: 1024px) 320px, 0px"
              priority
              className="hidden max-h-[340px] w-auto max-w-[320px] object-contain lg:block"
            />
          )}
        </div>
      </div>
    </section>
  );
}
