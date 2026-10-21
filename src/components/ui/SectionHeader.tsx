interface SectionHeaderProps {
  title: React.ReactNode;
  lead?: React.ReactNode;
  dark?: boolean;
  as?: 'h1' | 'h2';
  className?: string;
}

export function SectionHeader({ title, lead, dark = false, as: H = 'h2', className = '' }: SectionHeaderProps) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <H
        className={`${H === 'h1' ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-[28px] sm:text-4xl md:text-[44px]'} ${
          dark ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </H>
      {lead && (
        <p className={`mt-5 max-w-2xl text-lg leading-relaxed ${dark ? 'text-white/75' : 'text-ink-2'}`}>{lead}</p>
      )}
    </div>
  );
}
