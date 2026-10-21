'use client';

import { useEffect, useRef, useState } from 'react';
import { PrintObject } from '../PrintObject';
import { printArt } from '@/content/print-art';

interface LitBulbProps {
  /** The white print for dark sections, the violet one for paper. */
  name?: 'bulbLight' | 'bulb';
  sizes?: string;
  className?: string;
  priority?: boolean;
}

// The printed bulb switches on once, the first time it is well into view:
// the filament glows orange, stutters while it heats, turns white-hot, and
// warm light blooms behind the glass and catches the printed lines near it.
// Without script it simply stays off, as printed.
export function LitBulb({
  name = 'bulbLight',
  sizes = '(min-width: 1024px) 220px, 160px',
  className = 'mx-auto h-[300px] lg:h-[460px]',
  priority,
}: LitBulbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setOn(true);
        io.disconnect();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-on={on || undefined}
      data-tone={name === 'bulb' ? 'paper' : undefined}
      style={{ '--bulb-mask': `url('${printArt[name].src}')` } as React.CSSProperties}
      className={`bulb relative w-fit ${className}`}
    >
      <span aria-hidden className="bulb-glow" />
      <PrintObject name={name} sizes={sizes} priority={priority} className="relative h-full w-auto" />
      <span aria-hidden className="bulb-tint" />
      <span aria-hidden className="bulb-filament bulb-filament-warm" />
      <span aria-hidden className="bulb-filament bulb-filament-hot" />
    </div>
  );
}
