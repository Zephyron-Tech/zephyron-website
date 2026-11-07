'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, StepBack, StepForward } from 'lucide-react';

import { archEdges, archFlows, archNodes } from './data';
import { mono } from './mono';

const W = 200;
const H = 58;

type Pt = { x: number; y: number };

function box(id: string) {
  const n = archNodes[id];
  return { x: n.x, y: n.y, w: n.w ?? W, h: H };
}

function path(a: string, b: string) {
  const A = box(a);
  const B = box(b);
  const ac = { x: A.x + A.w / 2, y: A.y + A.h / 2 };
  const bc = { x: B.x + B.w / 2, y: B.y + B.h / 2 };
  const dx = bc.x - ac.x;
  const dy = bc.y - ac.y;
  let p: Pt;
  let q: Pt;
  if (Math.abs(dx) * 0.45 > Math.abs(dy)) {
    p = { x: dx > 0 ? A.x + A.w : A.x, y: ac.y };
    q = { x: dx > 0 ? B.x : B.x + B.w, y: bc.y };
    const mx = (p.x + q.x) / 2;
    return { d: `M${p.x} ${p.y}C${mx} ${p.y} ${mx} ${q.y} ${q.x} ${q.y}`, mid: { x: mx, y: (p.y + q.y) / 2 } };
  }
  p = { x: ac.x, y: dy > 0 ? A.y + A.h : A.y };
  q = { x: bc.x, y: dy > 0 ? B.y : B.y + B.h };
  const my = (p.y + q.y) / 2;
  return { d: `M${p.x} ${p.y}C${p.x} ${my} ${q.x} ${my} ${q.x} ${q.y}`, mid: { x: (p.x + q.x) / 2, y: my } };
}

const key = (a: string, b: string) => archEdges.find(([x, y]) => (x === a && y === b) || (x === b && y === a));

export function Architecture() {
  const [flow, setFlow] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const [sel, setSel] = useState('engine');
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);

  const paths = useMemo(() => archEdges.map(([a, b]) => ({ a, b, ...path(a, b) })), []);
  const steps = flow ? archFlows[flow].steps : [];

  useEffect(() => {
    if (!playing) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = window.setInterval(
      () =>
        setStep((s) => {
          if (s >= steps.length - 1) {
            setPlaying(false);
            return s;
          }
          return s + 1;
        }),
      reduce ? 2200 : 1500,
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, steps.length]);

  const startFlow = (f: string | null) => {
    setFlow(f);
    setStep(f ? 0 : -1);
    setPlaying(Boolean(f));
  };

  // Which edges are lit, and which one is the current step.
  const lit = new Map<string, number>();
  if (flow) {
    steps.forEach(([a, b], i) => {
      if (i > step) return;
      const e = key(a, b);
      if (e) lit.set(e.join('>'), i);
    });
  } else {
    archEdges.forEach(([a, b]) => {
      if (a === sel || b === sel) lit.set(`${a}>${b}`, -1);
    });
  }
  const current = flow && steps[step] ? steps[step] : null;
  const n = archNodes[sel];
  const connections = archEdges
    .filter(([a, b]) => a === sel || b === sel)
    .map(([a, b]) => archNodes[a === sel ? b : a].title);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 rounded-full bg-paper-2 p-1 sm:w-max" role="group" aria-label="Tok ve schématu">
        {[[null, 'Schéma'] as const, ...Object.entries(archFlows).map(([k, v]) => [k, v.name] as const)].map(([k, label]) => (
          <button
            key={label}
            type="button"
            onClick={() => startFlow(k)}
            aria-pressed={flow === k}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 pointer-coarse:py-2.5 ${
              flow === k ? 'bg-card text-ink' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="overflow-x-auto rounded-2xl bg-card">
          <svg viewBox="0 0 1190 850" className="block h-auto w-full min-w-[820px]" role="img" aria-label="Architektura Gustu">
            <rect x="250" y="120" width="760" height="720" rx="20" fill="var(--color-paper)" opacity="0.55" />
            <text x="270" y="146" className="fill-muted text-[12px] font-medium" style={{ letterSpacing: '0.06em' }}>
              CONTABO VPS · UBUNTU 24.04 · DOCKER
            </text>
            <rect x="505" y="265" width="230" height="330" rx="16" fill="var(--color-accent-soft)" />
            <text x="518" y="586" className="fill-accent text-[12px] font-medium">gust_internal</text>

            {paths.map((p) => {
              const i = lit.get(`${p.a}>${p.b}`);
              const on = i !== undefined;
              const now = flow && current && key(current[0], current[1])?.join('>') === `${p.a}>${p.b}`;
              return (
                <path
                  key={`${p.a}>${p.b}`}
                  d={p.d}
                  fill="none"
                  stroke={on ? 'var(--color-accent)' : 'var(--color-line-strong)'}
                  strokeWidth={on ? 2.6 : 1.5}
                  strokeDasharray={now ? '7 6' : undefined}
                  className={now ? 'gust-flow' : undefined}
                />
              );
            })}

            {Object.entries(archNodes).map(([id, node]) => {
              const w = node.w ?? W;
              const active = current ? current[0] === id || current[1] === id : sel === id && !flow;
              return (
                <g
                  key={id}
                  transform={`translate(${node.x},${node.y})`}
                  role="button"
                  tabIndex={0}
                  aria-label={node.title}
                  aria-pressed={sel === id}
                  className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-accent"
                  onClick={() => {
                    setSel(id);
                    startFlow(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSel(id);
                      startFlow(null);
                    }
                  }}
                >
                  <rect
                    width={w}
                    height={H}
                    rx={14}
                    fill={active ? 'var(--color-accent)' : node.ext ? 'var(--color-card)' : 'var(--color-card)'}
                    stroke={active ? 'var(--color-accent)' : node.ext ? 'var(--color-line-strong)' : 'transparent'}
                    strokeDasharray={node.ext && !active ? '5 4' : undefined}
                    strokeWidth={1.5}
                  />
                  <text x={16} y={26} className="font-display text-[14px] font-semibold" fill={active ? '#fff' : 'var(--color-ink)'}>
                    {node.title}
                  </text>
                  <text x={16} y={44} className="text-[11.5px]" fill={active ? 'rgba(255,255,255,0.75)' : 'var(--color-muted)'}>
                    {node.sub}
                  </text>
                </g>
              );
            })}

            {flow &&
              paths.map((p) => {
                const i = lit.get(`${p.a}>${p.b}`);
                if (i === undefined) return null;
                return (
                  <g key={`n${p.a}${p.b}`} transform={`translate(${p.mid.x},${p.mid.y})`}>
                    <circle r="11" fill="var(--color-accent)" />
                    <text y="4" textAnchor="middle" className="text-[11px] font-semibold tabular-nums" fill="#fff">
                      {i + 1}
                    </text>
                  </g>
                );
              })}
          </svg>
        </div>

        <aside className="rounded-2xl bg-card p-6 lg:sticky lg:top-6" aria-live="polite">
          {flow ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg text-ink">{archFlows[flow].name}</h3>
                <div className="flex gap-1">
                  <IconBtn label="Předchozí krok" onClick={() => { setPlaying(false); setStep((s) => Math.max(0, s - 1)); }}>
                    <StepBack size={16} />
                  </IconBtn>
                  <IconBtn
                    label={playing ? 'Pozastavit' : 'Přehrát'}
                    onClick={() => {
                      if (!playing && step >= steps.length - 1) setStep(0);
                      setPlaying((x) => !x);
                    }}
                    primary
                  >
                    {playing ? <Pause size={16} /> : <Play size={16} />}
                  </IconBtn>
                  <IconBtn label="Další krok" onClick={() => { setPlaying(false); setStep((s) => Math.min(steps.length - 1, s + 1)); }}>
                    <StepForward size={16} />
                  </IconBtn>
                </div>
              </div>
              <ol className="space-y-1">
                {steps.map(([, , text], i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => {
                        setPlaying(false);
                        setStep(i);
                      }}
                      className={`grid w-full grid-cols-[24px_1fr] gap-2.5 rounded-xl px-2 py-1.5 text-left text-[14.5px] leading-snug transition-colors duration-150 ${
                        i === step ? 'bg-accent-soft text-ink' : i < step ? 'text-ink-2' : 'text-muted hover:text-ink-2'
                      }`}
                    >
                      <span
                        className={`mt-px grid size-6 place-items-center rounded-full text-xs font-semibold tabular-nums ${
                          i <= step ? 'bg-accent text-white' : 'bg-paper-2 text-ink-2'
                        }`}
                      >
                        {i + 1}
                      </span>
                      {text}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted">{n.ext ? 'Externí služba' : 'Na serveru'}</p>
                <h3 className="text-xl text-ink">{n.title}</h3>
              </div>
              <p className="text-[15px] leading-relaxed text-ink-2">{n.role}</p>
              <dl className="grid grid-cols-[84px_1fr] gap-x-3 gap-y-2 text-sm">
                {(
                  [
                    ['Image', n.image],
                    ['Síť', n.net],
                    ['Ověření', n.auth],
                    ['Důvěra', n.trust],
                    ['Spojení', connections.join(', ')],
                  ] as [string, string | undefined][]
                )
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted">{k}</dt>
                      <dd className={`min-w-0 break-words text-ink ${k === 'Image' ? `${mono} text-[13px]` : ''}`}>{v}</dd>
                    </div>
                  ))}
              </dl>
              <p className="text-sm text-muted">Klikněte na jinou část schématu, nebo nahoře spusťte některý z toků.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function IconBtn({ label, onClick, primary, children }: { label: string; onClick: () => void; primary?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid size-9 place-items-center rounded-full transition-colors duration-150 pointer-coarse:size-11 ${
        primary ? 'bg-accent text-white hover:bg-accent-hover' : 'bg-paper-2 text-ink-2 hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}
