import type { LucideIcon } from 'lucide-react';
import { CopyLink } from './CopyLink';

interface ContactTileProps {
  label: string;
  value: string;
  icon: LucideIcon;
  /** mailto: or tel:. Without it the tile is plain text (an address). */
  href?: string;
  /** `paper` inside a white card, `card` straight on the page. */
  tone?: 'paper' | 'card';
  /** Further lines under the value, quieter (an address, a company ID). */
  lines?: string[];
}

// Icon, what it is, the value. With an href it copies on click with a mouse,
// like every contact on the site, and stays a normal link on touch.
export function ContactTile({ label, value, icon: Icon, href, tone = 'paper', lines }: ContactTileProps) {
  const ground = tone === 'paper' ? 'bg-paper' : 'bg-card';
  const bubble = tone === 'paper' ? 'bg-card' : 'bg-paper';
  // Straight on the page it sits beside cards padded p-6, so it pads closer to them.
  const pad = tone === 'paper' ? 'px-3 py-2.5' : 'px-5 py-4';
  const body = (
    <>
      <span
        aria-hidden
        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full ${bubble} text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white`}
      >
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-muted">{label}</span>
        <span className={`block text-sm font-medium text-ink ${href ? 'truncate' : ''}`}>{value}</span>
        {lines?.map((l) => (
          <span key={l} className="block text-sm text-ink-2">
            {l}
          </span>
        ))}
      </span>
    </>
  );

  if (!href) {
    return <div className={`flex min-w-0 items-start gap-3 rounded-2xl ${ground} ${pad}`}>{body}</div>;
  }

  return (
    <CopyLink
      href={href}
      value={value}
      className={`group flex min-w-0 ${tone === 'paper' ? 'rounded-xl' : 'rounded-2xl'} ${ground} ${pad} transition-colors duration-200 hover:bg-accent-soft [&>span:first-child]:flex [&>span:first-child]:min-w-0 [&>span:first-child]:flex-1 [&>span:first-child]:items-center [&>span:first-child]:gap-3`}
    >
      {body}
    </CopyLink>
  );
}
