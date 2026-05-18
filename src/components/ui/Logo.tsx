import Image from 'next/image';

interface LogoProps {
  height?: number;
}

export function Logo({ height = 28 }: LogoProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <Image
        src="/mark-color.png"
        alt="Zephyron Tech mark"
        width={height}
        height={height}
        style={{ width: 'auto', height }}
        priority
      />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 3 }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: height * 0.78,
            letterSpacing: '-0.02em',
            color: 'var(--fg)',
          }}
        >
          Zephyron
        </span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: height * 0.32,
            letterSpacing: '0.32em',
            color: 'var(--fg-muted)',
          }}
        >
          TECH
        </span>
      </div>
    </div>
  );
}
