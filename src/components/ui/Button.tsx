import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from '@/navigation';

type Variant = 'primary' | 'secondary' | 'onDark';

interface ButtonProps {
  children: React.ReactNode;
  href: string;
  variant?: Variant;
  size?: 'md' | 'lg';
  arrow?: boolean;
  /** Analytics event name, picked up by <TrackClicks />. */
  track?: string;
  className?: string;
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-paper-2 text-ink hover:bg-line',
  onDark: 'bg-white text-ink hover:bg-accent-soft',
};

export function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  arrow = false,
  track,
  className = '',
}: ButtonProps) {
  const plain = /^(https?:|mailto:|tel:|#)/.test(href);
  const external = /^https?:/.test(href);
  const cls = [
    'group inline-flex whitespace-nowrap items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200',
    size === 'lg' ? 'px-6 py-3.5 text-[15px]' : 'px-5 py-2.5 text-sm',
    variants[variant],
    className,
  ].join(' ');

  const content = (
    <>
      <span>{children}</span>
      {arrow &&
        (external ? (
          <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
        ) : (
          <ArrowRight
            size={16}
            strokeWidth={2}
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        ))}
    </>
  );

  if (plain) {
    return (
      <a href={href} className={cls} data-track={track}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} data-track={track}>
      {content}
    </Link>
  );
}
