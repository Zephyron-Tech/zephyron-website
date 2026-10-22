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
          className={"group flex flex-col rounded-2xl bg-card p-6 outline-2 -outline-offset-2 outline-transparent transition-[outline-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] hover:-translate-y-1.5 hover:outline-accent hover:shadow-[0_24px_48px_-24px_rgb(66_53_229/0.35)] motion-reduce:hover:translate-y-0 sm:p-8" /* taste-skill-ignore: hover-only lift shadow, none at rest */}
        >
          {/* On a phone the icon sits beside the title, so each card is a few lines shorter. */}
          <div className="flex items-center gap-4 sm:block">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
              <ServiceIcon name={s.icon} />
            </span>
            <h3 className="text-xl text-ink transition-colors duration-300 group-hover:text-accent sm:mt-6 sm:text-2xl">{s.title}</h3>
          </div>
          <p className="mt-3 flex-1 leading-relaxed text-ink-2">{s.short}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium sm:mt-6 text-ink transition-colors duration-300 group-hover:text-accent">
            Více o službě
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </span>
        </Link>
      ))}
    </div>
  );
}
