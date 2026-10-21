import Image from 'next/image';
import { team } from '@/content/team';

export function TeamCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {team.map((p) => (
        <article key={p.name} className="group flex flex-col gap-6 rounded-2xl bg-card p-6 sm:flex-row">
          {p.photo ? (
            // A field of halftone dots sits offset behind the photo, like a
            // second print pass that missed its register.
            <div className="relative size-40 shrink-0">
              <div
                aria-hidden
                className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl bg-[url('/print/dots.png')] bg-cover"
              />
              <div className="relative size-full overflow-hidden rounded-2xl bg-paper-2">
                <Image src={p.photo} alt={p.name} fill sizes="160px" className="object-cover" />
              </div>
            </div>
          ) : (
            <div
              aria-hidden
              className="flex size-40 shrink-0 items-center justify-center rounded-2xl bg-paper-2 font-display text-3xl font-semibold text-ink-2"
            >
              {p.initials}
            </div>
          )}
          <div>
            <h3 className="text-xl text-ink">{p.name}</h3>
            <div className="mt-0.5 text-sm text-muted">{p.role}</div>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{p.bio}</p>
            <div className="mt-3 flex flex-col gap-1 text-sm">
              {p.email && (
                <a href={`mailto:${p.email}`} className="text-accent hover:underline">
                  {p.email}
                </a>
              )}
              {p.phone && (
                <a href={`tel:${p.phone.replace(/\s/g, '')}`} className="text-ink-2 hover:text-ink">
                  {p.phone}
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
