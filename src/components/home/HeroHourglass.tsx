'use client';

import { useEffect, useRef } from 'react';
import { PrintObject } from '../PrintObject';

// The hourglass behind the hero card. Turned over once on load (CSS), then it
// leans towards the pointer like an object on the desk, with its printed
// shade sliding the other way. Mouse only; still under reduced motion.
export function HeroHourglass() {
  const tilt = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const turn = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reduced.matches) return;

    let frame = 0;
    function onMove(e: PointerEvent) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5; // -0.5 … 0.5
        const y = e.clientY / window.innerHeight - 0.5;
        if (tilt.current) {
          tilt.current.style.transform = `perspective(900px) rotateY(${x * 18}deg) rotateX(${-y * 8}deg)`;
        }
        if (shade.current) {
          shade.current.style.transform = `translateX(${-x * 40}px) scaleX(${1 + Math.abs(x) * 0.15})`;
        }
      });
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  // The calculator asks for another turn when its process changes: the time is
  // counted again. One turn at a time; none under reduced motion.
  useEffect(() => {
    let running: Animation | null = null;
    function onTurn() {
      const el = turn.current;
      if (!el || running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      running = el.animate([{ transform: 'rotate(-180deg)' }, { transform: 'rotate(0deg)' }], {
        duration: 900,
        easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
      });
      running.onfinish = running.oncancel = () => { running = null; };
    }
    window.addEventListener('hourglass:turn', onTurn);
    return () => window.removeEventListener('hourglass:turn', onTurn);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute -bottom-8 -right-[140px] hidden w-[180px] xl:block">
      <div ref={tilt} className="hourglass-tilt relative z-10">
        <div ref={turn} className="hourglass-turn">
          <PrintObject name="hourglass" sizes="180px" priority className="mx-auto h-[400px] w-auto" />
        </div>
      </div>
      <div ref={shade} className="hourglass-tilt -mt-8 flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/print/hourglass-shade.png" alt="" width={720} height={140} className="w-[180px]" />
      </div>
    </div>
  );
}
