import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import type { Service } from '@/content/services';
import { ServiceIcon } from './ui/ServiceIcon';

// A service as one white tile: icon bubble, name, arrow. Used wherever a page
// points on to services (service detail, case study, glossary term).
export function ServiceLinkTile({ service: s }: { service: Service }) {
  return (
    <Link
      href={`/sluzby/${s.slug}`}
      className="group flex items-center gap-4 rounded-2xl bg-card px-5 py-4 no-underline transition-colors duration-200 hover:bg-accent-soft"
    >
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-paper text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
        <ServiceIcon name={s.icon} size={18} />
      </span>
      <span className="flex-1 font-medium text-ink">{s.title}</span>
      <ArrowRight
        size={16}
        aria-hidden
        className="shrink-0 text-ink-2 transition-transform duration-200 group-hover:translate-x-1"
      />
    </Link>
  );
}
