import Image from 'next/image';

export interface Partner {
  name: string;
  logo?: string;
  /** Rendered height in px; stacked logos need more than wide ones. */
  height?: number;
}

// Logo when a file exists in public/logos/, otherwise the name set as a
// quiet wordmark so the row still reads as a list of organisations.
export function PartnerLogos({ partners, className = '' }: { partners: Partner[]; className?: string }) {
  return (
    <ul className={`grid grid-cols-2 items-center gap-x-6 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-10 sm:gap-y-4 ${className}`}>
      {partners.map((p) => (
        <li key={p.name} className="flex items-center">
          <Mark partner={p} />
        </li>
      ))}
    </ul>
  );
}

// Phones: the same logos in one row that drifts right to left without end.
// The row is set twice and slides by half its width, so the loop has no seam;
// the copy is hidden from screen readers. With reduced motion it stands still
// and scrolls by hand instead.
export function PartnerMarquee({ partners, className = '' }: { partners: Partner[]; className?: string }) {
  return (
    <div className={`marquee bleed-x overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center gap-10 pr-10">
            {partners.map((p) => (
              <li key={p.name} className="flex shrink-0 items-center">
                <Mark partner={p} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function Mark({ partner: p }: { partner: Partner }) {
  return p.logo ? (
    <Image
      src={p.logo}
      alt={p.name}
      width={160}
      height={48}
      style={{ height: p.height ?? 32, width: 'auto', maxWidth: '100%' }}
      className="object-contain"
    />
  ) : (
    <span className="whitespace-nowrap font-display text-lg font-semibold tracking-tight text-ink-2">{p.name}</span>
  );
}
