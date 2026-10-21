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
    <ul className={`flex flex-wrap items-center gap-x-10 gap-y-4 ${className}`}>
      {partners.map((p) => (
        <li key={p.name} className="flex items-center">
          {p.logo ? (
            <Image
              src={p.logo}
              alt={p.name}
              width={160}
              height={48}
              style={{ height: p.height ?? 32, width: 'auto' }}
              className="object-contain"
            />
          ) : (
            <span className="font-display text-lg font-semibold tracking-tight text-ink-2">{p.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
