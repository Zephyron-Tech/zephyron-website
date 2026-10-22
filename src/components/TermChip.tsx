import { Link } from '@/navigation';
import { termForLabel } from '@/content/glossary';

// A tag or technology label. When the glossary explains it, the chip links
// there and its short definition shows on hover; otherwise it stays plain.
export function TermChip({ label, tone }: { label: string; tone: 'paper' | 'card' }) {
  const term = termForLabel(label);
  const ground = tone === 'paper' ? 'bg-paper' : 'bg-card';
  const chip = `inline-flex items-center rounded-full ${ground} px-3 py-1 text-[13px] text-ink-2`;
  if (!term) return <span className={chip}>{label}</span>;
  return (
    <Link
      href={`/slovnik/${term.slug}`}
      title={term.short}
      className={`${chip} underline decoration-line-strong decoration-dotted underline-offset-4 transition-colors duration-200 hover:bg-accent hover:text-white hover:decoration-transparent`}
    >
      {label}
    </Link>
  );
}
