import { ChevronRight } from 'lucide-react';
import { Link } from '@/navigation';
import { SectionHeader } from './ui/SectionHeader';

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  crumbs?: { name: string; href?: string }[];
  children?: React.ReactNode;
}

export function PageHero({ eyebrow, title, lead, crumbs = [], children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_80%_at_80%_0%,black,transparent)]"
      />
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
        <SectionHeader as="h1" eyebrow={eyebrow} title={title} lead={lead} className="rise" />
        {children && <div className="rise rise-2 mt-9">{children}</div>}
      </div>
    </section>
  );
}
