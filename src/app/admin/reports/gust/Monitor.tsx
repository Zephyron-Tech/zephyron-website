'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, HeartPulse } from 'lucide-react';

import s from './demo.module.css';

// Sample server metrics for the demo: a slow random walk every 2 s, and
// deterministic history curves for the charts.

export interface Live {
  cpu: number;
  ram: number;
  load: number;
  steal: number;
  netIn: number;
  netOut: number;
  containers: { name: string; project: string; cpu: number; mem: number; restarts: number }[];
}

const CONTAINERS: Live['containers'] = [
  { name: 'authentik-server', project: 'authentik', cpu: 3.1, mem: 512, restarts: 0 },
  { name: 'outline', project: 'outline', cpu: 1.2, mem: 298, restarts: 0 },
  { name: 'gust-smart-targets-api', project: 'smart-targets', cpu: 2.4, mem: 186, restarts: 0 },
  { name: 'gust-zephyron-web-web', project: 'zephyron-web', cpu: 1.8, mem: 164, restarts: 0 },
  { name: 'nextcloud-app', project: 'nextcloud', cpu: 0.9, mem: 141, restarts: 0 },
  { name: 'gust-gridtime-backend', project: 'gridtime', cpu: 0.7, mem: 122, restarts: 0 },
  { name: 'victoria-metrics', project: 'gust', cpu: 0.6, mem: 96, restarts: 0 },
];

const walk = (v: number, step: number, min: number, max: number) => Math.min(max, Math.max(min, v + (Math.random() - 0.5) * step));

export function useLiveMetrics(): Live {
  const [m, setM] = useState<Live>({ cpu: 14, ram: 5.1, load: 0.82, steal: 1.4, netIn: 2.1, netOut: 3.4, containers: CONTAINERS });
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setM((x) => ({
        cpu: walk(x.cpu, 6, 6, 38),
        ram: walk(x.ram, 0.12, 4.8, 5.6),
        load: walk(x.load, 0.25, 0.4, 1.9),
        steal: walk(x.steal, 0.6, 0.4, 3.2),
        netIn: walk(x.netIn, 1.2, 0.3, 8),
        netOut: walk(x.netOut, 1.6, 0.4, 11),
        containers: x.containers.map((c) => ({ ...c, cpu: walk(c.cpu, 1, 0.1, 9), mem: walk(c.mem, 6, c.mem * 0.9, c.mem * 1.1) })),
      }));
    }, 2000);
    return () => clearInterval(id);
  }, []);
  return m;
}

export type Range = '1h' | '24h' | '7d' | '30d';

// Same shape every render: a seeded pseudo-random curve.
function series(seed: number, n: number, base: number, swing: number, trend = 0) {
  let x = seed;
  const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: n }, (_, i) => base + trend * i + Math.sin(i / 5 + seed) * swing * 0.5 + (rnd() - 0.5) * swing);
}

function Chart({ data, max, unit, forecast }: { data: number[]; max: number; unit: string; forecast?: number }) {
  const w = 440;
  const h = 120;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - (Math.min(v, max) / max) * h] as const);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h + 18}`} className={s.chart} preserveAspectRatio="none" aria-hidden>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} className={s.grid} />
      ))}
      <path d={`${line}L${w} ${h}L0 ${h}Z`} className={s.area} />
      <path d={line} className={s.line} />
      {forecast !== undefined && (
        <path d={`M${last[0]} ${last[1]}L${w} ${h - (Math.min(forecast, max) / max) * h}`} className={s.forecast} />
      )}
      <circle cx={last[0]} cy={last[1]} r="3.5" className={s.end} />
      <text x="0" y={h + 14} className={s.axis}>
        0 {unit}
      </text>
      <text x={w} y={h + 14} textAnchor="end" className={s.axis}>
        max {max} {unit}
      </text>
    </svg>
  );
}

const fmt = (n: number, d = 1) => n.toFixed(d).replace('.', '.');

export function ServerView({ live, alert, onResolve }: { live: Live; alert: boolean; onResolve: () => void }) {
  const [range, setRange] = useState<Range>('24h');
  const n = { '1h': 60, '24h': 96, '7d': 84, '30d': 90 }[range];
  const charts = useMemo(() => {
    const disk = series(7, n, range === '30d' ? 22 : 30, 0.6, range === '30d' ? 0.1 : 0.01);
    if (alert) disk.splice(-6, 6, 58, 66, 74, 82, 88, 91);
    return {
      cpu: series(3, n, 16, 14),
      ram: series(5, n, 5.1, 0.5),
      disk,
      net: series(11, n, 3, 4),
    };
  }, [n, range, alert]);
  const disk = alert ? 91 : 31;
  return (
    <>
      <div className={s.head}>
        <div className={s.crumbs}>
          <b>Server</b>
        </div>
        <div className={s.range} role="group" aria-label="Time range">
          {(['1h', '24h', '7d', '30d'] as Range[]).map((r) => (
            <button key={r} type="button" className={range === r ? s.on : undefined} onClick={() => setRange(r)}>
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className={s.body}>
        <div className={`${s.row} ${s.between}`}>
          <div>
            <h2 className={s.title}>contabo-vps6</h2>
            <p className={s.sub}>Contabo Cloud VPS 6 · 6 vCPU · 12 GB · Ubuntu 24.04 · up 41 days</p>
          </div>
          <span className={`${s.row} ${s.sub}`}>
            <HeartPulse size={15} className={s.okc} /> Heartbeat to healthchecks.io 12 s ago
          </span>
        </div>

        {alert ? (
          <div className={`${s.alertBar} ${s.crit}`}>
            <AlertTriangle size={18} />
            <div>
              <b>Disk 91 % full</b> · 91 of 100 GB. At the current rate it fills up in about 9 hours. Sent to iPhone and #ops on Discord.
            </div>
            <button type="button" className={`${s.gbtn} ${s.secondary}`} onClick={onResolve}>
              Prune images
            </button>
          </div>
        ) : (
          <div className={s.alertBar}>
            <CheckCircle2 size={18} className={s.okc} />
            <div>All 9 rules passing. Last alert: RAM above 90 % for 6 min, 4 days ago, resolved.</div>
          </div>
        )}

        <div className={s.stats} style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {[
            ['CPU', `${fmt(live.cpu, 0)} %`, ''],
            ['RAM', `${fmt(live.ram)} / 12 GB`, ''],
            ['Load (1 min)', fmt(live.load, 2), '6 vCPU'],
            ['Disk', `${disk} %`, alert ? 'full in ~9 h' : 'full in ~210 days'],
            ['CPU steal', `${fmt(live.steal)} %`, 'rule at 10 %'],
          ].map(([k, v, note]) => (
            <div key={k} className={s.stat}>
              <span className={s.sub}>{k}</span>
              <b className={k === 'Disk' && alert ? s.errc : undefined}>{v}</b>
              {note && <span className={s.sub}>{note}</span>}
            </div>
          ))}
        </div>

        <div className={s.charts}>
          <div className={s.chartCard}>
            <div className={`${s.row} ${s.between}`}>
              <b>CPU</b>
              <span className={s.sub}>{fmt(live.cpu, 0)} %</span>
            </div>
            <Chart data={charts.cpu} max={100} unit="%" />
          </div>
          <div className={s.chartCard}>
            <div className={`${s.row} ${s.between}`}>
              <b>Memory</b>
              <span className={s.sub}>{fmt(live.ram)} GB used</span>
            </div>
            <Chart data={charts.ram} max={12} unit="GB" />
          </div>
          <div className={s.chartCard}>
            <div className={`${s.row} ${s.between}`}>
              <b>Disk</b>
              <span className={s.sub}>{alert ? 'forecast: full in ~9 h' : 'forecast: full in ~210 days'}</span>
            </div>
            <Chart data={charts.disk} max={100} unit="%" forecast={alert ? 100 : 33} />
          </div>
          <div className={s.chartCard}>
            <div className={`${s.row} ${s.between}`}>
              <b>Network</b>
              <span className={s.sub}>
                ↓ {fmt(live.netIn)} · ↑ {fmt(live.netOut)} MB/s
              </span>
            </div>
            <Chart data={charts.net} max={20} unit="MB/s" />
          </div>
        </div>

        <table className={s.tbl}>
          <thead>
            <tr>
              <th>Container · live</th>
              <th>Project</th>
              <th>CPU</th>
              <th>Memory</th>
              <th>Restarts</th>
            </tr>
          </thead>
          <tbody>
            {live.containers.map((c) => (
              <tr key={c.name}>
                <td className={s.mono}>{c.name}</td>
                <td className={s.sub}>{c.project}</td>
                <td className={s.mono}>{fmt(c.cpu)} %</td>
                <td className={s.mono}>{Math.round(c.mem)} MB</td>
                <td className={s.mono}>{c.restarts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function PhoneStatus({ live, alert, onResolve }: { live: Live; alert: boolean; onResolve: () => void }) {
  const tiles: [string, string, number, string][] = [
    ['CPU', `${fmt(live.cpu, 0)} %`, live.cpu, ''],
    ['RAM', `${fmt(live.ram)} GB`, (live.ram / 12) * 100, 'of 12 GB'],
    ['Disk', `${alert ? 91 : 31} %`, alert ? 91 : 31, alert ? 'full in ~9 h' : '69 GB free'],
    ['Load', fmt(live.load, 2), (live.load / 6) * 100, '6 vCPU'],
  ];
  return (
    <>
      <div className={s.nav} />
      <div className={s.large}>Server</div>
      <div className={s.iosSub}>contabo-vps6 · up 41 days</div>
      <div className={s.iosBody} style={{ display: 'grid', gap: 18, alignContent: 'start' }}>
        {alert && (
          <div className={s.iosAlert}>
            <AlertTriangle size={20} />
            <div>
              <b>Disk 91 % full</b>
              <span>Fills up in about 9 hours. Firing for 2 min.</span>
            </div>
          </div>
        )}
        {alert && (
          <button type="button" className={`${s.iosBtn} ${s.tinted}`} onClick={onResolve}>
            Prune old images
          </button>
        )}
        <div className={s.tiles}>
          {tiles.map(([k, v, pct, note]) => (
            <div key={k} className={s.tile}>
              <span className={s.meta}>{k}</span>
              <b className={k === 'Disk' && alert ? s.errc : undefined}>{v}</b>
              <span className={s.meter}>
                <i style={{ width: `${Math.min(100, pct)}%`, background: k === 'Disk' && alert ? 'var(--g-err)' : undefined }} />
              </span>
              {note && <span className={s.meta}>{note}</span>}
            </div>
          ))}
        </div>
        <div>
          <div className={s.groupLabel}>Alerts</div>
          <div className={s.group}>
            {[
              alert ? ['Disk above 90 %', 'firing · now', true] : null,
              ['RAM above 90 % for 5 min', 'resolved · 4 days ago', false],
              ['gridtime-backend restart loop', 'resolved · 12 days ago', false],
            ]
              .filter(Boolean)
              .map((a) => {
                const [t, m, firing] = a as [string, string, boolean];
                return (
                  <div key={t} className={s.cell} style={{ cursor: 'default' }}>
                    <span className={s.msg} style={firing ? { color: 'var(--g-err)' } : undefined}>
                      {t}
                    </span>
                    <span className={s.meta}>{m}</span>
                  </div>
                );
              })}
          </div>
        </div>
        <div className={s.group}>
          <div className={s.cell} style={{ cursor: 'default' }}>
            <span className={s.msg}>Heartbeat</span>
            <span className={s.meta}>healthchecks.io · 12 s ago</span>
          </div>
        </div>
      </div>
    </>
  );
}
