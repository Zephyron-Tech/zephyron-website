interface PulseProps {
  color?: string;
  size?: number;
}

export function Pulse({ color = 'var(--success-500)', size = 8 }: PulseProps) {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: color,
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: color,
          opacity: 0.5,
          animation: 'pulse-ring 1.8s ease-out infinite',
        }}
      />
    </span>
  );
}
