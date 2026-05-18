interface EyebrowProps {
  num?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Eyebrow({ num, children, className, style }: EyebrowProps) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--violet-300)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {num !== undefined && (
        <span style={{ color: 'var(--violet-400)' }}>
          [ {String(num).padStart(2, '0')} ]
        </span>
      )}
      <span style={{ color: 'var(--fg-muted)' }}>{children}</span>
    </div>
  );
}
