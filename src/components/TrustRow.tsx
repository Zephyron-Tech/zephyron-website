import { Star } from 'lucide-react';
import { SITE } from '@/content/site';

// Proof under a page heading: the public rating, linked to where it comes from.
// Renders nothing until SITE.reviews is filled in with real numbers.
export function TrustRow({ className = '' }: { className?: string }) {
  const r = SITE.reviews;
  if (!r || r.count < 1) return null;
  const rating = r.rating.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`tap inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink ${className}`}
    >
      <Star size={16} fill="currentColor" strokeWidth={0} aria-hidden className="text-accent" />
      <span>
        <span className="font-medium text-ink">{rating}</span> na {r.label} · {r.count} hodnocení
      </span>
      <span className="sr-only">(otevře se v novém okně)</span>
    </a>
  );
}
