import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import type { Solution } from '@/content/solutions';

// A solution as one white tile: the problem's name, one line of outcome, an
// arrow. Used on the home page, service pages and glossary terms.
export function SolutionLinkTile({ solution: s, compact }: { solution: Solution; compact?: boolean }) {
  return (
    <Link
      href={`/reseni/${s.slug}`}
      className="group flex items-center gap-4 rounded-2xl bg-card px-5 py-4 no-underline transition-colors duration-200 hover:bg-accent-soft"
    >
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink">{s.name}</span>
        {!compact && <span className="mt-1 block text-pretty text-sm text-muted">{s.short}</span>}
      </span>
      <ArrowRight
        size={16}
        aria-hidden
        className="shrink-0 text-ink-2 transition-transform duration-200 group-hover:translate-x-1"
      />
    </Link>
  );
}
