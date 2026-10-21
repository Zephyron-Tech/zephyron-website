interface EyebrowProps {
  children: React.ReactNode;
  num?: number;
  dark?: boolean;
  className?: string;
}

export function Eyebrow({ children, num, dark = false, className = '' }: EyebrowProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] ${
        dark ? 'text-white/60' : 'text-muted'
      } ${className}`}
    >
      <span aria-hidden className="inline-block size-1.5 rounded-full bg-accent" />
      {num !== undefined && <span>{String(num).padStart(2, '0')} /</span>}
      <span>{children}</span>
    </div>
  );
}
