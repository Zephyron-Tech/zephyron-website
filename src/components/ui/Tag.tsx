interface TagProps {
  children: React.ReactNode;
}

export function Tag({ children }: TagProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 10px',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--fg-muted)',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        letterSpacing: '0.01em',
        cursor: 'default',
      }}
    >
      {children}
    </span>
  );
}
