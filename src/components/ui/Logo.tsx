import Image from 'next/image';

interface LogoProps {
  height?: number;
  dark?: boolean;
}

// Wordmark set in Surgena (brand typeface). Surgena has no diacritics, so it
// is used only here.
export function Logo({ height = 30, dark = false }: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src="/mark-256.png"
        alt=""
        width={256}
        height={196}
        style={{ height, width: 'auto' }}
        priority
      />
      <span className="flex flex-col leading-none" style={{ gap: height * 0.08 }}>
        <span
          className={dark ? 'text-white' : 'text-ink'}
          style={{ fontFamily: 'var(--font-brand)', fontWeight: 600, fontSize: height * 0.74, letterSpacing: '-0.01em' }}
        >
          Zephyron
        </span>
        {/* A space between the two words, so the link's text reads "Zephyron TECH"
            and matches its accessible name; in the flex column it takes no room. */}{' '}
        <span
          className={`self-end ${dark ? 'text-white/70' : 'text-ink-2'}`}
          style={{ fontFamily: 'var(--font-brand)', fontWeight: 600, fontSize: height * 0.26, letterSpacing: '0.45em', marginRight: '-0.45em' }}
        >
          TECH
        </span>
      </span>
    </span>
  );
}
