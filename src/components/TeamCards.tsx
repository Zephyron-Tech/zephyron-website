import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { team } from '@/content/team';
import { ContactTile } from './ContactTile';
import { ScrollActive } from './ScrollActive';

// One card per person: the portrait beside who they are, what to bring to
// them, and how to reach them directly. The bio stays in the content, unshown.
export function TeamCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {team.map((p) => (
        <ScrollActive as="article" key={p.name} className="group/card flex flex-col rounded-2xl bg-card p-6">
          {/* Phone: portrait and name side by side, the points below across the card.
              From sm: portrait left, everything else beside it. */}
          <div className="grid grid-cols-[96px_1fr] items-center gap-x-6 gap-y-5 sm:grid-cols-[160px_1fr] sm:gap-x-6 sm:gap-y-3">
            {p.photo ? (
              // A field of halftone dots sits offset behind the photo, like a
              // second print pass that missed its register. On hover the two
              // passes drift a little further apart and the portrait leans in; on a
              // phone the same happens while the card crosses mid-screen.
              <PhotoFrame card={p.card} name={p.name}>
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl bg-[url('/print/dots.png')] bg-cover transition-[translate] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/card:translate-x-3.5 group-hover/card:translate-y-3.5 group-data-active/card:translate-x-3.5 group-data-active/card:translate-y-3.5 motion-reduce:transition-none"
                />
                <div className="relative size-full overflow-hidden rounded-2xl bg-paper-2 transition-[translate] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/card:-translate-x-0.5 group-hover/card:-translate-y-0.5 group-data-active/card:-translate-x-0.5 group-data-active/card:-translate-y-0.5 motion-reduce:transition-none">
                  <Image
                    src={p.photo}
                    alt={p.name}
                    fill
                    sizes="(min-width: 640px) 160px, 96px"
                    className="object-cover transition-[scale] duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/card:scale-[1.04] group-data-active/card:scale-[1.04] motion-reduce:transition-none"
                  />
                </div>
              </PhotoFrame>
            ) : (
              <div
                aria-hidden
                className="flex size-24 shrink-0 items-center justify-center rounded-2xl bg-paper-2 font-display text-3xl font-semibold text-ink-2 sm:row-span-2 sm:size-40"
              >
                {p.initials}
              </div>
            )}

            <div className="sm:self-end">
              <h3 className="text-xl text-ink sm:text-2xl">{p.name}</h3>
              <div className="mt-1 text-sm font-medium text-accent">{p.role}</div>
            </div>
            <div className="col-span-2 sm:col-span-1 sm:col-start-2 sm:self-start">
              <div className="text-sm text-muted">Na co se ho ptát</div>
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
        </ScrollActive>
      ))}
    </div>
  );
}

// The portrait opens the person's digital business card when they have one.
function PhotoFrame({ card, name, children }: { card?: string; name: string; children: React.ReactNode }) {
  const frame = 'relative block size-24 shrink-0 rounded-2xl sm:row-span-2 sm:size-40';
  if (!card) return <div className={frame}>{children}</div>;
  return (
    <a href={`/v/${card}?src=web`} aria-label={`Digitální vizitka: ${name}`} className={`${frame} cursor-pointer`}>
      {children}
    </a>
  );
}
