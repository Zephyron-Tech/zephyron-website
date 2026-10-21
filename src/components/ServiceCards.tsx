import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { services } from '@/content/services';
import { ServiceIcon } from './ui/ServiceIcon';

export function ServiceCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {services.map((s) => (
        <Link
          key={s.slug}
          href={`/sluzby/${s.slug}`}
          className="group flex flex-col rounded-2xl bg-card p-7 transition-colors hover:bg-accent-soft sm:p-8"
        >
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <ServiceIcon name={s.icon} />
          </span>
          <h3 className="mt-6 text-2xl text-ink">{s.title}</h3>
          <p className="mt-3 flex-1 leading-relaxed text-ink-2">{s.short}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink">
            Více o službě
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </Link>
      ))}
    </div>
  );
}
