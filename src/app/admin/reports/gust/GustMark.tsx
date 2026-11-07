// The Gust mark: one stroke that draws a G from its crossbar round the bowl and
// leaves the top as a straight stream, with a shorter stream above it. On the
// app tile it is white on night ink; on its own it takes the text colour.

const STROKE = 'M33 34H44A15 15 0 1 1 29 19H56';
const ECHO = 'M41 9H54';

export function GustMark({
  size = 32,
  tile = false,
  className = '',
  title,
}: {
  size?: number;
  tile?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {tile && <rect width="64" height="64" rx="15" fill="#11131E" />}
      <path d={STROKE} fill="none" stroke={tile ? '#FFFFFF' : 'currentColor'} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={ECHO} fill="none" stroke={tile ? '#8B80FF' : 'var(--gust-echo, #4235E5)'} strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

// Wordmark with an optional "by Zephyron"; Zephyron is set in the brand face
// (Surgena), the same as the Zephyron logo.
export function GustLockup({
  size = 40,
  byline = false,
  tile = true,
  className = '',
}: {
  size?: number;
  byline?: boolean;
  tile?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: size * 0.3 }}>
      <GustMark size={size} tile={tile} />
      <span className="flex flex-col leading-none">
        <span className="font-display font-semibold" style={{ fontSize: size * 0.82, letterSpacing: '-0.045em', lineHeight: 0.9 }}>
          gust
        </span>
        {byline && <ByZephyron size={size * 0.27} className="mt-[0.35em]" />}
      </span>
    </span>
  );
}

export function ByZephyron({ size = 12, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.35em] whitespace-nowrap ${className}`} style={{ fontSize: size }}>
      <span className="font-sans opacity-60">by</span>
      <span style={{ fontFamily: 'var(--font-brand)', fontWeight: 600, fontSize: '1.18em', letterSpacing: '-0.01em' }}>Zephyron</span>
    </span>
  );
}
