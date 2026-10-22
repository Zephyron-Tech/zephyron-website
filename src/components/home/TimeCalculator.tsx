'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import { processes } from '@/content/calculator';

/** Czech plural for hours, to the half hour under ten: 0 hodin, 1 hodina, 3 hodiny, 3,5 hodiny, 12 hodin. */
function hoursLabel(h: number) {
  const v = h < 10 ? Math.round(h * 2) / 2 : Math.round(h);
  if (!Number.isInteger(v)) return `${String(v).replace('.', ',')} hodiny`;
  if (v === 1) return '1 hodina';
  return `${v} ${v >= 2 && v <= 4 ? 'hodiny' : 'hodin'}`;
}
const hoursShort = (h: number) => `${h < 10 ? String(Math.round(h * 2) / 2).replace('.', ',') : Math.round(h)} h`;

/**
 * Follows `target` with a 300ms ease-out, retargeting from wherever it is when
 * the target moves again; jumps straight there under reduced motion.
 */
function useTween(target: number) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  const shown = useRef(target);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shown.current = target;
      setValue(target);
      return;
    }
    from.current = shown.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 300);
      const e = 1 - Math.pow(1 - t, 3);
      shown.current = from.current + (target - from.current) * e;
      setValue(shown.current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    // If the browser holds frames back (background or throttled tab), land anyway.
    const land = window.setTimeout(() => {
      cancelAnimationFrame(frame);
      shown.current = target;
      setValue(target);
    }, 360);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(land);
    };
  }, [target]);

  return value;
}

// The hero's live thing: pick a process and how often it happens, and see the
// hours a month it costs by hand against automated. Illustrative numbers.
export function TimeCalculator() {
  const id = useId();
  const [pid, setPid] = useState(processes[0].id);
  const process = processes.find((p) => p.id === pid)!;
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(processes.map((p) => [p.id, p.initial])),
  );
  const n = counts[pid];
  const tracked = useRef(false);

  const manualMin = process.steps.reduce((s, x) => s + x.min, 0);
  const manualH = (manualMin * n) / 60;
  const autoH = (process.auto * n) / 60;
  const saved = useTween(manualH - autoH);
  const autoShare = manualH > 0 ? autoH / manualH : 0;

  function used() {
    if (tracked.current) return;
    tracked.current = true;
    track('calculator_used', { process: pid });
  }

  function pick(next: string) {
    if (next === pid) return;
    setPid(next);
    used();
    // the hourglass behind the card turns over: the time is counted again
    window.dispatchEvent(new Event('hourglass:turn'));
  }

  return (
    <figure className="rise rise-3 relative rounded-2xl bg-card p-5 sm:p-8">
      <figcaption className="text-[15px] font-medium text-ink">Kolik času vám vrátí automatizace?</figcaption>

      <div role="radiogroup" aria-label="Proces" className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-paper-2 p-1">
        {processes.map((p) => (
          <label
            key={p.id}
            className={`flex cursor-pointer items-center justify-center rounded-lg px-2 py-2.5 text-center pointer-coarse:min-h-11 text-[13px] leading-tight text-balance transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
              p.id === pid ? 'bg-card font-medium text-ink' : 'text-ink-2 hover:text-ink'
            }`}
          >
            <input
              type="radio"
              name={`${id}-process`}
              value={p.id}
              checked={p.id === pid}
              onChange={() => pick(p.id)}
              className="sr-only"
            />
            {p.label}
          </label>
        ))}
      </div>

      <div className="mt-6">
        {/* On a phone the question and the count stack, so neither breaks mid-phrase. */}
        <div className="flex flex-col gap-0.5 text-sm min-[420px]:flex-row min-[420px]:items-baseline min-[420px]:justify-between min-[420px]:gap-4">
          <label htmlFor={`${id}-count`} className="text-ink-2">
            {process.question}
          </label>
          <span className="whitespace-nowrap font-medium tabular-nums text-ink">
            {n} {process.unit(n)}
          </span>
        </div>
        <input
          id={`${id}-count`}
          type="range"
          min={process.min}
          max={process.max}
          step={process.step}
          value={n}
          onChange={(e) => {
            setCounts((c) => ({ ...c, [pid]: Number(e.target.value) }));
            used();
          }}
          className="calc-range mt-2 w-full"
        />
      </div>

      <div className="mt-6" aria-live="polite">
        <p className="font-display text-[44px] font-semibold leading-none tracking-tight text-accent tabular-nums">
          ≈ {hoursLabel(saved)}
        </p>
        <p className="mt-2 text-sm text-ink-2">vám každý měsíc zůstane navíc</p>
      </div>

      {/* Each group holds only its dt and dd, as a description list must; the bar
          is part of the value (a second dd), drawn under the label row. */}
      <dl className="mt-6 space-y-3 text-sm">
        <div className="grid grid-cols-[1fr_auto] gap-y-1.5">
          <dt className="text-ink-2">Ručně</dt>
          <dd className="tabular-nums text-ink">{hoursShort(manualH)}</dd>
          <dd aria-hidden className="col-span-2 h-2 overflow-hidden rounded-full bg-paper-2">
            <div className="h-full w-full rounded-full bg-ink-2" />
          </dd>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-y-1.5">
          <dt className="text-ink-2">S automatizací</dt>
          <dd className="tabular-nums text-ink">{hoursShort(autoH)}</dd>
          <dd aria-hidden className="col-span-2 h-2 overflow-hidden rounded-full bg-paper-2">
            <div
              className="h-full w-full origin-left rounded-full bg-accent transition-transform duration-300 ease-[var(--ease-out)] motion-reduce:transition-none"
              style={{ transform: `scaleX(${Math.max(autoShare, autoH > 0 ? 0.02 : 0)})` }}
            />
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-[13px] leading-relaxed text-ink-2">{process.autoNote}</p>

      <details className="group mt-4 text-[13px]">
        <summary className="tap cursor-pointer list-none text-ink-2 underline-offset-4 hover:text-ink hover:underline [&::-webkit-details-marker]:hidden">
          Z čeho to počítáme
        </summary>
        <ul className="mt-3 space-y-1.5">
          {process.steps.map((s) => (
            <li key={s.name} className="flex justify-between gap-4 text-ink-2">
              <span>{s.name}</span>
              <span className="shrink-0 tabular-nums">{s.min} min</span>
            </li>
          ))}
          <li className="flex justify-between gap-4 pt-1 font-medium text-ink">
            <span>Ručně celkem / s automatizací</span>
            <span className="shrink-0 tabular-nums">
              {manualMin} / {process.auto} min
            </span>
          </li>
        </ul>
      </details>

      <p className="mt-4 text-[13px] text-muted">Ilustrativní odhad. Skutečné časy změříme u vás.</p>
    </figure>
  );
}
