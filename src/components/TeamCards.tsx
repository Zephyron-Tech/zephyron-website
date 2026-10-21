import Image from 'next/image';
import { Mail, Phone, type LucideIcon } from 'lucide-react';
import { team } from '@/content/team';
import { CopyLink } from './CopyLink';

// One card per person: the portrait beside who they are, what to bring to
// them, and how to reach them directly. The bio stays in the content, unshown.
export function TeamCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {team.map((p) => (
        <article key={p.name} className="flex flex-col rounded-2xl bg-card p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
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

// A tile on the page tone inside the white card: icon, what it is, the value.
// It copies on click with a mouse, like every contact on the site.
function ContactTile({
  href,
  value,
  label,
  icon: Icon,
}: {
  href: string;
  value: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <CopyLink
      href={href}
      value={value}
      className="group flex min-w-0 rounded-xl bg-paper px-3 py-2.5 transition-colors duration-200 hover:bg-accent-soft [&>span:first-child]:flex [&>span:first-child]:min-w-0 [&>span:first-child]:flex-1 [&>span:first-child]:items-center [&>span:first-child]:gap-3"
    >
      <span
        aria-hidden
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white"
      >
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-muted">{label}</span>
        <span className="block truncate text-sm font-medium text-ink">{value}</span>
      </span>
    </CopyLink>
  );
}
