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
    <section data-hero className="page-hero relative overflow-hidden">
      <div className="container-page relative pb-16 pt-10 md:pb-24 md:pt-14">
        {/* Phones: the page's printed object rides on the breadcrumb row, small,
            so the heading below keeps its full width. From md it stands beside the heading. */}
        {art && (
          <div aria-hidden className="pointer-events-none absolute right-[var(--gutter)] top-6 md:hidden">
            {art === 'bulb' ? (
              <LitBulb name="bulb" sizes="72px" className="h-[88px]" />
            ) : (
              <PrintObject name={art} sizes="96px" className="h-[72px] w-auto max-w-[110px] object-contain" />
            )}
          </div>
        )}
        {crumbs.length > 0 && (
          <nav
            aria-label="Drobečková navigace"
            className={`mb-10 flex flex-wrap items-center gap-1.5 text-sm text-muted ${art ? 'max-md:min-h-[72px] max-md:pr-32' : ''}`}
          >
            <Link href="/" className="tap hover:text-ink">
              Úvod
            </Link>
            {crumbs.map((c, i) => (
              // Phones drop the current page from a deeper trail: the heading
              // right below already names it, and the trail stays on one line.
              <span key={c.name} className={`flex items-center gap-1.5 ${!c.href && i > 0 ? 'max-md:hidden' : ''}`}>
                <ChevronRight size={14} aria-hidden />
                {c.href ? (
                  <Link href={c.href} className="tap hover:text-ink">
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
        <div className={art ? 'grid items-center gap-10 md:grid-cols-[1fr_auto]' : undefined}>
          <div>
            <SectionHeader as="h1" title={title} lead={lead} className="rise" />
            {children && <div className="rise rise-2 mt-9">{children}</div>}
          </div>
          {art === 'bulb' ? (
            // The one header object that does something: it switches on.
            <LitBulb
              name="bulb"
              sizes="(min-width: 1024px) 320px, (min-width: 768px) 220px, 0px"
              priority
              className="hidden h-[220px] md:block lg:h-[340px]"
            />
          ) : (
            art && (
              <PrintObject
                name={art}
                sizes="(min-width: 1024px) 320px, (min-width: 768px) 220px, 0px"
                priority
                className="hidden max-h-[220px] w-auto max-w-[220px] object-contain md:block lg:max-h-[340px] lg:max-w-[320px]"
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
