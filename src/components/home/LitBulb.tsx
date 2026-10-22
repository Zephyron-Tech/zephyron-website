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
// Without script it simply stays off, as printed. Once lit, a touch or a
// pointer passing over it makes it flicker like a failing lamp in a film.
export function LitBulb({
  name = 'bulbLight',
  sizes = '(min-width: 1024px) 220px, 160px',
  className = 'mx-auto h-[220px] sm:h-[300px] lg:h-[460px]',
  priority,
}: LitBulbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const flickering = useRef(false);

  // Film-style failing lamp: a burst of hard cuts, each one a different length,
  // a new pattern every time. The light dies almost completely between cuts
  // and lands back on full.
  function flicker() {
    const el = ref.current;
    if (!el || !on || flickering.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    flickering.current = true;

    const steps: { opacity: number; ms: number }[] = [];
    const cuts = 9 + Math.floor(Math.random() * 4);
    for (let i = 0; i < cuts; i++) {
      const dark = i % 2 === 0;
      steps.push({
        opacity: dark ? Math.random() * 0.08 : 0.55 + Math.random() * 0.45,
        // Short stabs early, one longer dark hold near the end before it catches.
        ms: dark && i === cuts - 3 ? 220 : 35 + Math.random() * 95,
      });
    }
    const total = steps.reduce((t, x) => t + x.ms, 0);
    let at = 0;
    // step-end holds each value until the next keyframe: hard cuts, no fades.
    const frames: Keyframe[] = [{ opacity: 1, offset: 0, easing: 'step-end' }];
    for (const x of steps) {
      frames.push({ opacity: x.opacity, offset: at / total, easing: 'step-end' });
      at += x.ms;
    }
    frames.push({ opacity: 1, offset: 1 });

    // Every layer cuts together, the filament too: the power is what fails.
    const layers = el.querySelectorAll<HTMLElement>('.bulb-glow, .bulb-tint, .bulb-filament');
    const runs = [...layers].map((layer) => layer.animate(frames, { duration: total }));
    Promise.all(runs.map((r) => r.finished)).finally(() => {
      flickering.current = false;
    });
  }

  function onPointerEnter(e: React.PointerEvent) {
    // Touch fires enter on tap; the click handles that.
    if (e.pointerType === 'mouse') flicker();
  }

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
      onPointerEnter={onPointerEnter}
      onClick={flicker}
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
