import Image from 'next/image';
import { team } from '@/content/team';

export function TeamCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {team.map((p) => (
        <article key={p.name} className="flex gap-5 rounded-3xl border border-line bg-card p-6">
          {p.photo ? (
            <Image
              src={p.photo}
              alt={p.name}
              width={96}
              height={96}
              className="size-20 shrink-0 rounded-2xl object-cover sm:size-24"
            />
          ) : (
            <div
              aria-hidden
              className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-paper-2 font-display text-2xl font-semibold text-ink-2 sm:size-24"
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
