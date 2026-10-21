import { Eyebrow } from './Eyebrow';

interface SectionHeaderProps {
  eyebrow: string;
  num?: number;
  title: React.ReactNode;
  lead?: React.ReactNode;
  dark?: boolean;
  as?: 'h1' | 'h2';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  num,
  title,
  lead,
  dark = false,
  as: H = 'h2',
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <Eyebrow num={num} dark={dark}>
        {eyebrow}
      </Eyebrow>
      <H
        className={`mt-5 ${H === 'h1' ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-3xl sm:text-4xl md:text-[44px]'} ${
          dark ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </H>
      {lead && (
        <p className={`mt-5 max-w-2xl text-lg leading-relaxed ${dark ? 'text-white/70' : 'text-ink-2'}`}>{lead}</p>
      )}
    </div>
  );
}
