import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { team } from '@/content/team';
import { ContactTile } from './ContactTile';

// One card per person: the portrait beside who they are, what to bring to
// them, and how to reach them directly. The bio stays in the content, unshown.
export function TeamCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {team.map((p) => (
        <article key={p.name} className="group/card flex flex-col rounded-2xl bg-card p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {p.photo ? (
              // A field of halftone dots sits offset behind the photo, like a
              // second print pass that missed its register. On hover the two
              // passes drift a little further apart and the portrait leans in.
              <div className="relative size-40 shrink-0">
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl bg-[url('/print/dots.png')] bg-cover transition-[translate] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/card:translate-x-3.5 group-hover/card:translate-y-3.5 motion-reduce:transition-none"
                />
                <div className="relative size-full overflow-hidden rounded-2xl bg-paper-2 transition-[translate] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/card:-translate-x-0.5 group-hover/card:-translate-y-0.5 motion-reduce:transition-none">
                  <Image
                    src={p.photo}
                    alt={p.name}
                    fill
                    sizes="160px"
                    className="object-cover transition-[scale] duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/card:scale-[1.04] motion-reduce:transition-none"
                  />
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

            <div className="flex flex-1 flex-col">
              <h3 className="text-2xl text-ink">{p.name}</h3>
              <div className="mt-1 text-sm font-medium text-accent">{p.role}</div>
              <div className="mt-4 text-sm text-muted">Na co se ho ptát</div>
              <ul className="mt-2 space-y-1.5 text-[15px] text-ink">
                {p.focus.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contacts run the full width under the portrait row, two tiles. */}
          <div className="mt-6 grid gap-2 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            {p.email && <ContactTile href={`mailto:${p.email}`} value={p.email} label="E-mail" icon={Mail} />}
            {p.phone && (
              <ContactTile href={`tel:${p.phone.replace(/\s/g, '')}`} value={p.phone} label="Telefon" icon={Phone} />
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
