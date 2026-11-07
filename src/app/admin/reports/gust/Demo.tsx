'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  Activity,
  Check,
  ArrowLeft,
  ArrowRight,
  Box,
  ChevronRight,
  Eye,
  FolderKanban,
  HardDrive,
  LayoutGrid,
  MoreVertical,
  Puzzle,
  Rocket,
  RotateCw,
  Search,
  Settings,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';

import { btnPrimary, btnSecondary } from '../../ui';
import { GustMark } from './GustMark';
import { type DeployState, type Deployment, demoProjects, observedStacks, sampleCommits, seedDeployments } from './data';
import s from './demo.module.css';
import { type Live, PhoneStatus, ServerView, useLiveMetrics } from './Monitor';

const MAC_W = 1280;
const MAC_H = 832;
const PHONE_W = 402;
const PHONE_H = 874;
const RUNNING: DeployState[] = ['queued', 'pulling', 'starting', 'healthy'];
const PHASES = ['Queued', 'Pull image', 'Start', 'Health check', 'Live'];

type MacView = 'projects' | 'project' | 'deployment' | 'server' | 'observed' | 'registry' | 'settings';
type Tab = 'deployments' | 'domains' | 'environment' | 'logs' | 'settings';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');
const clock = () => new Date().toLocaleTimeString('en-GB', { hour12: false });
const newId = () => 'dpl_' + Math.random().toString(36).slice(2, 8);

function Pill({ state }: { state: DeployState }) {
  return <span className={cx(s.pill, s[`p-${state}`])}>{state}</span>;
}

// Renders a fixed-size screen and scales it to the frame's width.
function Fit({ w, h, className, children }: { w: number; h: number; className: string; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const apply = () => setScale(el.clientWidth / w);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={box} className={className} style={{ aspectRatio: `${w} / ${h}` }}>
      <div className={s.scaler} style={{ width: w, height: h, transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}>
        {children}
      </div>
    </div>
  );
}

function phaseIndex(d: Deployment) {
  if (d.state === 'failed') return 3;
  if (d.state === 'live' || d.state === 'superseded') return 5;
  return ['queued', 'pulling', 'starting', 'healthy'].indexOf(d.state);
}
function phaseClass(d: Deployment, i: number) {
  const pi = phaseIndex(d);
  if (d.state === 'failed' && i === pi) return 'bad';
  if (i < pi) return 'done';
  if (i === pi) return 'cur';
  return '';
}

export function GustDemo() {
  const [deps, setDeps] = useState<Deployment[]>(seedDeployments);
  const [view, setView] = useState<MacView>('project');
  const [tab, setTab] = useState<Tab>('deployments');
  const [svc, setSvc] = useState('api');
  const [depId, setDepId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [toast, setToast] = useState<{ state: DeployState; text: string } | null>(null);
  const [notif, setNotif] = useState<{ title: string; body: string } | null>(null);
  const [fail, setFail] = useState(false);
  const [diskAlert, setDiskAlert] = useState(false);
  const live = useLiveMetrics();
  const timers = useRef<number[]>([]);
  const seq = useRef(0);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const busy = deps.some((d) => RUNNING.includes(d.state));
  const liveDep = deps.find((d) => d.state === 'live');

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const deploy = useCallback(
    (rollbackOf?: Deployment) => {
      if (deps.some((d) => RUNNING.includes(d.state))) return;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const k = reduce ? 0.4 : 1;
      const [sha, msg, who] = sampleCommits[seq.current++ % sampleCommits.length];
      const willFail = !rollbackOf && fail;
      const prev = deps.find((d) => d.state === 'live');
      const id = newId();
      const d: Deployment = {
        id,
        sha: rollbackOf ? rollbackOf.sha : sha,
        msg: rollbackOf ? `Roll back to ${rollbackOf.sha}` : msg,
        who: rollbackOf ? 'jan' : who,
        trigger: rollbackOf ? 'rollback' : 'push',
        state: 'queued',
        age: 'just now',
        dur: '',
        logs: [[clock(), 'queue', rollbackOf ? `${id} created by jan (rollback)` : `${id} queued by GitHub Actions (zephyron/smart-targets@main)`]],
      };
      const patch = (fn: (x: Deployment) => Partial<Deployment>, extra?: (all: Deployment[]) => Deployment[]) =>
        setDeps((all) => {
          const next = all.map((x) => (x.id === id ? { ...x, ...fn(x) } : x));
          return extra ? extra(next) : next;
        });
      const log = (phase: string, line: string, state?: DeployState) =>
        patch((x) => ({ logs: [...x.logs, [clock(), phase, line]], ...(state ? { state } : {}) }));

      setDeps((all) => [d, ...all]);
      setView('deployment');
      setDepId(id);
      setToast(null);

      const run = `gust-smart-targets-api-${id.replace('_', '')}`;
      let t = 0;
      if (rollbackOf) {
        later((t += 500) * k, () => log('pull', 'Image on this server, kept by the keep-5 rule', 'pulling'));
        later((t += 500) * k, () => log('start', `${run} on gust_edge`, 'starting'));
      } else {
        later((t += 600) * k, () => log('pull', `registry.gust.zephyron.tech/smart-targets/api:${d.sha}`, 'pulling'));
        later((t += 900) * k, () => log('pull', '5 layers, 3 cached · 38.7 MB'));
        later((t += 700) * k, () => log('start', `${run} on gust_edge, gust_proj_smart-targets`, 'starting'));
        later((t += 400) * k, () => log('start', '9 env variables injected (production)'));
      }
      later((t += 700) * k, () => log('health', 'GET /healthz → 503 (attempt 1)'));
      if (willFail) {
        later((t += 900) * k, () => log('health', 'GET /healthz → 503 (attempt 5)'));
        later((t += 1000) * k, () => log('health', 'no healthy response in 60 s'));
        later((t += 600) * k, () => {
          patch((x) => ({
            state: 'failed',
            err: 'Health check timed out after 60 s',
            dur: '1 min 3 s',
            logs: [...x.logs, [clock(), 'fail', `Container removed. ${prev?.id ?? 'Previous'} stays live.`]],
          }));
          setToast({ state: 'failed', text: 'Health check timed out. The previous deployment is still live.' });
          setNotif({ title: 'Deploy failed', body: 'smart-targets/api: health check timed out. The previous version is still live.' });
        });
      } else {
        const secs = rollbackOf ? 6 : 38;
        later((t += 800) * k, () => log('health', 'GET /healthz → 200 (attempt 2)', 'healthy'));
        later((t += 400) * k, () => log('route', 'Traefik: smart-targets-api has 2 servers'));
        later((t += 500) * k, () => log('drain', `SIGTERM to ${prev?.id ?? 'previous'}, 10 s grace`));
        later((t += 900) * k, () => {
          patch(
            (x) => ({ state: 'live', dur: `${secs} s`, logs: [...x.logs, [clock(), 'live', `Live on api.targets.zephyron.tech in ${secs} s`]] }),
            (all) => all.map((x) => (prev && x.id === prev.id ? { ...x, state: 'superseded' } : x)),
          );
          setToast({ state: 'live', text: `${rollbackOf ? 'Rolled back to' : 'Deployed'} ${d.sha} in ${secs} s` });
          setNotif({ title: 'smart-targets/api is live', body: `${d.sha} · ${d.msg} · ${secs} s` });
        });
      }
      later((t + 4500) * k, () => setToast(null));
      later((t + 5000) * k, () => setNotif(null));
    },
    [deps, fail, later],
  );

  const fillDisk = () => {
    setDiskAlert(true);
    setView('server');
    setToast({ state: 'failed', text: 'Disk 91 % full on contabo-vps6. Sent to iPhone and Discord.' });
    setNotif({ title: 'Disk 91 % full', body: 'contabo-vps6: 91 of 100 GB used. At the current rate it fills up in about 9 hours.' });
    later(4500, () => setToast(null));
    later(5000, () => setNotif(null));
  };
  const resolveDisk = () => {
    setDiskAlert(false);
    setToast({ state: 'live', text: 'Pruned 61 GB of old images. Disk alert resolved.' });
    setNotif({ title: 'Resolved: disk usage', body: 'contabo-vps6 is back to 30 % disk after image cleanup.' });
    later(4500, () => setToast(null));
    later(5000, () => setNotif(null));
  };

  const open = (v: MacView) => {
    setView(v);
    if (v === 'project') setTab('deployments');
  };

  // One route for both devices: whatever is opened on the Mac opens on the
  // iPhone too, and the other way round.
  const nav = {
    onOpen: open,
    onTab: (t: Tab) => {
      setView('project');
      setTab(t);
    },
    onSvc: setSvc,
    onDep: (id: string) => {
      setView('deployment');
      setDepId(id);
    },
    onReveal: () => setRevealed((r) => !r),
    onDeploy: deploy,
    onRestart: (name: string) => {
      setToast({ state: 'live', text: `${name} restarted. All containers are healthy.` });
      setNotif({ title: `${name} restarted`, body: 'All containers of the stack are healthy again.' });
      later(2600, () => setToast(null));
      later(3200, () => setNotif(null));
    },
  };

  return (
    <div data-ui className={s.stage}>
      {/* The phone stands in front of the laptop's right corner on wide screens. */}
      <div className="relative lg:pb-6 lg:pr-[15%]">
        <MacBook path={addressFor(view, tab, depId)} title={titleFor(view, depId)}>
          <Desktop
            deps={deps}
            view={view}
            tab={tab}
            svc={svc}
            depId={depId}
            busy={busy}
            live={liveDep}
            metrics={live}
            diskAlert={diskAlert}
            onResolveDisk={resolveDisk}
            revealed={revealed}
            toast={toast}
            {...nav}
          />
        </MacBook>
        <div className="mx-auto mt-10 w-[min(280px,80%)] lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:w-[22%]">
          <IPhone>
            <Phone
              deps={deps}
              view={view}
              tab={tab}
              svc={svc}
              depId={depId}
              busy={busy}
              revealed={revealed}
              notif={notif}
              metrics={live}
              diskAlert={diskAlert}
              onResolveDisk={resolveDisk}
              {...nav}
            />
          </IPhone>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button type="button" className={btnPrimary} onClick={() => deploy()} disabled={busy}>
          <Rocket size={16} aria-hidden />
          {busy ? 'Deploy běží…' : 'Spustit ukázkový deploy'}
        </button>
        <label className="flex items-center gap-2 text-sm text-ink-2">
          <input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} className="size-4 accent-accent" />
          Nechat health check selhat
        </label>
        <button type="button" className={btnSecondary} onClick={diskAlert ? resolveDisk : fillDisk}>
          <HardDrive size={16} aria-hidden />
          {diskAlert ? 'Uvolnit místo' : 'Simulovat plný disk'}
        </button>
        <p className="text-sm text-muted">Rollback je u každého staršího deploye, na Macu i v telefonu.</p>
      </div>
    </div>
  );
}

function addressFor(view: MacView, tab: Tab, depId: string | null) {
  if (view === 'project') return ['gust.zephyron.tech', `/smart-targets/api/${tab}`];
  if (view === 'deployment') return ['gust.zephyron.tech', `/smart-targets/api/deployments/${depId ?? ''}`];
  return ['gust.zephyron.tech', `/${view}`];
}
function titleFor(view: MacView, depId: string | null) {
  if (view === 'deployment') return `${depId} · smart-targets · Gust`;
  if (view === 'project') return 'smart-targets · Gust';
  return `${view[0].toUpperCase()}${view.slice(1)} · Gust`;
}

/* ── Frames ─────────────────────────────────────────────────────────── */

function MacBook({ path, title, children }: { path: string[]; title: string; children: ReactNode }) {
  return (
    <div className={s.mac}>
      <div className={s.lid}>
        <Fit w={MAC_W} h={MAC_H} className={s.screen}>
          <MenuBar />
          <div className={s.chrome}>
            <div className={s.tabs}>
              <div className={s.lights} aria-hidden>
                <i style={{ background: '#ff5f57' }} />
                <i style={{ background: '#febc2e' }} />
                <i style={{ background: '#28c840' }} />
              </div>
              <div className={cx(s.tab, s.active)}>
                <GustMark size={16} tile />
                <span>{title}</span>
                <b className={s.x}>×</b>
              </div>
              <div className={s.tab}>
                <i className="block size-4 rounded-full bg-[#f0f0f0]" />
                <span>Pull requests · zephyron/smart-targets</span>
                <b className={s.x}>×</b>
              </div>
              <div className={s.tab}>
                <i className="block size-4 rounded-full bg-[#5cdd8b]" />
                <span>Uptime Kuma</span>
                <b className={s.x}>×</b>
              </div>
              <div className={s.newtab}>+</div>
            </div>
            <div className={s.toolbar}>
              <span className={s.tbtn}><ArrowLeft size={18} /></span>
              <span className={s.tbtn} style={{ opacity: 0.45 }}><ArrowRight size={18} /></span>
              <span className={s.tbtn}><RotateCw size={16} /></span>
              <div className={s.omni}>
                <SlidersHorizontal size={15} className="text-[#c4c4c9]" />
                <span>
                  {path[0]}
                  <span className={s.path}>{path[1]}</span>
                </span>
                <Star size={16} className="ml-auto text-[#c4c4c9]" />
              </div>
              <span className={s.tbtn}><Puzzle size={17} /></span>
              <span className={s.profile}>JV</span>
              <span className={s.tbtn}><MoreVertical size={17} /></span>
            </div>
          </div>
          <div style={{ height: MAC_H - 32 - 42 - 42 }} className="flex">
            {children}
          </div>
        </Fit>
        <div className={s.notch} aria-hidden />
      </div>
      <div className={s.deck} aria-hidden />
    </div>
  );
}

function MenuBar() {
  return (
    <div className={s.menubar}>
      <svg width="14" height="17" viewBox="0 0 14 17" aria-hidden>
        <path
          fill="#f5f5f7"
          d="M11.6 9c0-2 1.7-3 1.8-3.1-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.2.8-.6 0-1.6-.7-2.7-.7C3.1 4.4 1.8 5.3 1 6.6c-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.2 2.6 2.1 1-.1 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.7 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4 0 0-2.1-.8-2.1-3.8ZM9.6 3c.6-.7 1-1.7.9-2.7-.8 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6.9.1 1.9-.5 2.5-1.2Z"
        />
      </svg>
      <b>Chrome</b>
      <span>File</span>
      <span>Edit</span>
      <span>View</span>
      <span>History</span>
      <span>Bookmarks</span>
      <span>Profiles</span>
      <span>Tab</span>
      <span>Window</span>
      <span>Help</span>
      <span className={s.gap} />
      <svg width="24" height="12" viewBox="0 0 27 13" aria-hidden>
        <rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="#f5f5f7" strokeOpacity=".5" fill="none" />
        <rect x="2" y="2" width="15" height="9" rx="2" fill="#f5f5f7" />
        <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="#f5f5f7" fillOpacity=".5" />
      </svg>
      <WifiIcon />
      <Search size={15} />
      <span className={s.muted}>Fri 7 Nov</span>
      <span>14:02</span>
    </div>
  );
}

function IPhone({ children }: { children: ReactNode }) {
  return (
    <div className={cx(s.phone, 'justify-self-center')}>
      <div className={s.band}>
        <i className={s.btnL} style={{ left: -2, top: '17%', height: '4%' }} />
        <i className={s.btnL} style={{ left: -2, top: '24%', height: '7%' }} />
        <i className={s.btnL} style={{ left: -2, top: '33%', height: '7%' }} />
        <i className={s.btnR} style={{ right: -2, top: '26%', height: '11%' }} />
        <div className={s.phoneScreen}>
          <Fit w={PHONE_W} h={PHONE_H} className="relative">
            {children}
          </Fit>
          <div className={s.island} aria-hidden />
        </div>
      </div>
    </div>
  );
}

function WifiIcon({ fill = '#f5f5f7' }: { fill?: string }) {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" aria-hidden>
      <path
        fill={fill}
        d="M8.5 2.3c2.4 0 4.6.9 6.3 2.4l1.2-1.3A10.6 10.6 0 0 0 8.5.5 10.6 10.6 0 0 0 1 3.4l1.2 1.3a9 9 0 0 1 6.3-2.4Zm0 3.5c1.5 0 2.9.6 4 1.5l1.2-1.3a7.6 7.6 0 0 0-10.4 0L4.5 7.3c1.1-.9 2.5-1.5 4-1.5Zm0 3.4c-.7 0-1.4.3-1.9.7L8.5 12l1.9-2.1c-.5-.4-1.2-.7-1.9-.7Z"
      />
    </svg>
  );
}

/* ── Desktop app ────────────────────────────────────────────────────── */

interface DesktopProps {
  deps: Deployment[];
  view: MacView;
  tab: Tab;
  svc: string;
  depId: string | null;
  busy: boolean;
  live?: Deployment;
  metrics: Live;
  diskAlert: boolean;
  onResolveDisk: () => void;
  revealed: boolean;
  toast: { state: DeployState; text: string } | null;
  onOpen: (v: MacView) => void;
  onTab: (t: Tab) => void;
  onSvc: (s: string) => void;
  onDep: (id: string) => void;
  onReveal: () => void;
  onDeploy: (rollbackOf?: Deployment) => void;
  onRestart: (name: string) => void;
}

function Desktop(p: DesktopProps) {
  const nav: [MacView, string, ReactNode, string?][] = [
    ['projects', 'Projects', <LayoutGrid key="i" size={16} />, '6'],
    ['server', 'Server', <Activity key="i" size={16} />, p.diskAlert ? '1' : undefined],
    ['observed', 'Observed stacks', <Eye key="i" size={16} />, '4'],
    ['registry', 'Registry', <Box key="i" size={16} />],
    ['settings', 'Settings', <Settings key="i" size={16} />],
  ];
  const inProjects = p.view === 'project' || p.view === 'deployment';
  return (
    <div className={s.app} style={{ width: MAC_W, height: '100%' }}>
      <aside className={s.side}>
        <div className={s.sideBrand}>
          <GustMark size={26} tile />
          gust
        </div>
        {nav.map(([v, label, icon, count]) => (
          <button key={v} type="button" className={cx(s.navBtn, (p.view === v || (v === 'projects' && inProjects)) && s.on)} onClick={() => p.onOpen(v)}>
            {icon}
            {label}
            {count && <span className={s.count}>{count}</span>}
          </button>
        ))}
        <div className={s.sideLabel}>Pinned</div>
        <button type="button" className={cx(s.navBtn, inProjects && s.on)} onClick={() => p.onOpen('project')}>
          <span className={cx(s.dot, s.live)} />
          smart-targets
        </button>
        <button type="button" className={s.navBtn} onClick={() => p.onOpen('projects')}>
          <span className={cx(s.dot, s.live)} />
          zephyron-web
        </button>
        <div className={s.server}>
          <div className="mb-1 flex items-center justify-between">
            <span>Contabo · VPS 6</span>
            <span className={s.mono}>6 vCPU</span>
          </div>
          {[
            ['CPU', p.metrics.cpu, `${p.metrics.cpu.toFixed(0)} %`],
            ['RAM', (p.metrics.ram / 12) * 100, `${p.metrics.ram.toFixed(1)} / 12 GB`],
            ['Disk', p.diskAlert ? 91 : 31, p.diskAlert ? '91 / 100 GB' : '31 / 100 GB'],
          ].map(([k, v, t]) => (
            <div key={k} className={s.meterRow}>
              <span>{k}</span>
              <span className={s.meter}>
                <i style={{ width: `${v}%` }} />
              </span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </aside>
      <div className={s.main}>
        <div key={`${p.view}-${p.tab}-${p.depId}`} className={s.viewIn}>
          {p.view === 'projects' && <Projects {...p} />}
          {p.view === 'project' && <Project {...p} />}
          {p.view === 'deployment' && <DeploymentView {...p} />}
          {p.view === 'server' && <ServerView live={p.metrics} alert={p.diskAlert} onResolve={p.onResolveDisk} />}
          {p.view === 'observed' && <Observed {...p} />}
          {p.view === 'registry' && <Registry />}
          {p.view === 'settings' && <SettingsView />}
        </div>
        {p.toast && (
          <div className={s.toast} role="status">
            <Pill state={p.toast.state} />
            {p.toast.text}
          </div>
        )}
      </div>
    </div>
  );
}

function Head({ children }: { children: ReactNode }) {
  return (
    <div className={s.head}>
      <div className={s.crumbs}>{children}</div>
      <div className={s.kbd}>
        <span>Search projects, deploys…</span>
        <span>⌘K</span>
      </div>
    </div>
  );
}

function Projects(p: DesktopProps) {
  return (
    <>
      <Head>
        <b>Projects</b>
      </Head>
      <div className={s.body}>
        <div className={cx(s.row, s.between)}>
          <div>
            <h2 className={s.title}>Projects</h2>
            <p className={s.sub}>6 projects · 15 services · 4 observed stacks</p>
          </div>
          <button type="button" className={cx(s.gbtn, s.primary)}>New project</button>
        </div>
        <div className={s.stats}>
          {[
            ['Deploys today', '7'],
            ['Median deploy', '41 s'],
            ['Failed this week', '1'],
            ['Images kept', '4.8 GB'],
          ].map(([k, v]) => (
            <div key={k} className={s.stat}>
              <span className={s.sub}>{k}</span>
              <b>{v}</b>
            </div>
          ))}
        </div>
        <div className={s.grid3}>
          {demoProjects.map((pr) => (
            <button key={pr.id} type="button" className={s.pcard} onClick={() => p.onOpen('project')}>
              <div className={cx(s.row, s.between)}>
                <span className={s.pname}>{pr.id}</span>
                <span className={cx(s.dot, pr.health === 'live' && s.live, pr.health === 'failed' && s.failed)} />
              </div>
              <span className={cx(s.mono, s.sub)}>{pr.domain}</span>
              <div className={s.chips}>
                {pr.services.map(([n, t]) => (
                  <span key={n} className={cx(s.chip, t === 'stateful' && s.st)}>
                    {n}
                  </span>
                ))}
              </div>
              <span className={s.sub}>{pr.last === 'stopped' ? 'Stopped' : `Last deploy ${pr.last}`}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function Project(p: DesktopProps) {
  const tabs: Tab[] = ['deployments', 'domains', 'environment', 'logs', 'settings'];
  return (
    <>
      <Head>
        <button type="button" onClick={() => p.onOpen('projects')}>Projects</button>/<b>smart-targets</b>
      </Head>
      <div className={s.body}>
        <div className={cx(s.row, s.between)}>
          <div>
            <h2 className={s.title}>smart-targets</h2>
            <p className={s.sub}>zephyron/smart-targets · production · api.targets.zephyron.tech</p>
          </div>
          <div className={s.row}>
            <button type="button" className={cx(s.gbtn, s.secondary)} onClick={() => p.onTab('logs')}>View logs</button>
            <button type="button" className={cx(s.gbtn, s.primary)} disabled={p.busy} onClick={() => p.onDeploy()}>
              <Rocket size={14} /> Redeploy
            </button>
          </div>
        </div>
        <div className={s.svcRow}>
          {[
            ['api', 'app'],
            ['admin', 'app'],
            ['db', 'stateful'],
          ].map(([n, t]) => (
            <button key={n} type="button" className={cx(s.svc, p.svc === n && s.on)} onClick={() => p.onSvc(n)}>
              <span className={cx(s.dot, s.live)} />
              {n}
              <span className={s.sub}>{t}</span>
            </button>
          ))}
        </div>
        <div className={s.gtabs}>
          {tabs.map((t) => (
            <button key={t} type="button" className={cx(s.gtab, p.tab === t && s.on)} onClick={() => p.onTab(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {p.tab === 'deployments' && (
          <div className={s.list}>
            {p.deps.map((d) => (
              <button key={d.id} type="button" className={s.drow} onClick={() => p.onDep(d.id)}>
                <Pill state={d.state} />
                <span className={s.ell}>
                  {d.msg} <span className={s.sub}>· {d.who}</span>
                </span>
                <span className={cx(s.mono, s.sub)}>
                  {d.sha} · {d.trigger === 'rollback' ? 'rollback' : 'main'}
                </span>
                <span className={s.sub}>{d.age}</span>
                <span className={cx(s.sub, s.mono)}>{d.dur}</span>
              </button>
            ))}
          </div>
        )}
        {p.tab === 'domains' && (
          <>
            <table className={s.tbl}>
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Service</th>
                  <th>Certificate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['api.targets.zephyron.tech', 'api', 'Let’s Encrypt · renews in 61 days'],
                  ['admin.targets.zephyron.tech', 'admin', 'Let’s Encrypt · renews in 61 days'],
                  ['*.smart-targets.preview.zephyron.tech', 'previews', 'Wildcard · DNS-01 via Cloudflare'],
                ].map(([d, sv, c]) => (
                  <tr key={d}>
                    <td className={s.mono}>{d}</td>
                    <td>{sv}</td>
                    <td className={s.sub}>{c}</td>
                    <td>
                      <Pill state="live" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={s.banner}>Point an A record at 203.0.113.24. Gust requests the certificate as soon as the name resolves.</p>
          </>
        )}
        {p.tab === 'environment' && (
          <>
            <table className={s.tbl}>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th>Scope</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ['DATABASE_URL', 'postgres://app:k2Lq…@gust-smart-targets-db:5432/app', true],
                    ['JWT_SECRET', 'k8Zr0vQm…', true],
                    ['SENTRY_DSN', 'https://4f1c…@sentry.io/88', true],
                    ['NODE_ENV', 'production', false],
                    ['PUBLIC_URL', 'https://api.targets.zephyron.tech', false],
                  ] as [string, string, boolean][]
                ).map(([k, v, secret]) => (
                  <tr key={k}>
                    <td className={s.mono}>{k}</td>
                    <td className={!secret || p.revealed ? s.mono : s.masked}>{!secret || p.revealed ? v : '••••••••••••'}</td>
                    <td className={s.sub}>production</td>
                    <td>
                      {secret && (
                        <button type="button" className={s.link} onClick={p.onReveal}>
                          {p.revealed ? 'Hide' : 'Reveal'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={s.banner}>Secrets are encrypted at rest. Revealing one is written to the audit log.</p>
          </>
        )}
        {p.tab === 'logs' && (
          <div className={s.logs}>
            {[
              ['15:40:02', 'api', 'GET /v1/targets?plan=q4 200 18ms'],
              ['15:40:03', 'api', 'POST /v1/targets/sync 202 41ms'],
              ['15:40:03', 'api', 'sync job 8812 enqueued (3 plans)'],
              ['15:40:05', 'warn', 'slow query 412ms: SELECT … FROM targets WHERE plan_id = $1'],
              ['15:40:06', 'api', 'GET /healthz 200 1ms'],
              ['15:40:08', 'api', 'sync job 8812 done in 4.8s'],
            ].map(([t, ph, l], i) => (
              <div key={i} className={s.ln}>
                <span className={s.ts}>{t}</span>
                <span className={ph === 'warn' ? s.warnc : s.ph}>{ph}</span>
                <span>{l}</span>
              </div>
            ))}
            <span className={s.cursor} />
          </div>
        )}
        {p.tab === 'settings' && (
          <dl className={s.kv}>
            {[
              ['Repository', 'zephyron/smart-targets'],
              ['Image', 'registry.gust.zephyron.tech/smart-targets/api'],
              ['Port', '3000'],
              ['Health path', '/healthz'],
              ['Limits', '1 CPU · 512 MB'],
              ['Strategy', 'blue/green (app)'],
              ['Keep images', '5'],
              ['Networks', 'gust_edge, gust_proj_smart-targets'],
            ].map(([k, v]) => (
              <div key={k} className="contents">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </>
  );
}


function LogLines({ d }: { d: Deployment }) {
  return (
    <>
      {d.logs.map(([t, ph, l], i) => {
        const bad = ph === 'fail' || / 503 |no healthy/.test(l);
        const good = ph === 'live' || / 200 /.test(l);
        return (
          <div key={i} className={s.ln}>
            <span className={s.ts}>{t}</span>
            <span className={ph === 'fail' ? s.errc : ph === 'live' ? s.okc : s.ph}>{ph}</span>
            <span className={bad ? s.errc : good ? s.okc : undefined}>{l}</span>
          </div>
        );
      })}
    </>
  );
}

function DeploymentView(p: DesktopProps) {
  const d = p.deps.find((x) => x.id === p.depId) ?? p.deps[0];
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [d.logs.length]);
  const canRollback = d.state === 'superseded' && !p.busy;
  return (
    <>
      <Head>
        <button type="button" onClick={() => p.onOpen('projects')}>Projects</button>/
        <button type="button" onClick={() => p.onOpen('project')}>smart-targets</button>/<b>{d.id}</b>
      </Head>
      <div className={s.body}>
        <div className={cx(s.row, s.between)}>
          <div>
            <div className={s.row}>
              <Pill state={d.state} />
              <h2 className={s.title}>{d.msg}</h2>
            </div>
            <p className={s.sub} style={{ marginTop: 6 }}>
              {d.sha} · {d.who} · {d.trigger === 'rollback' ? 'rollback' : 'push to main'} · {d.age}
            </p>
          </div>
          <div className={s.row}>
            {canRollback && (
              <button type="button" className={cx(s.gbtn, s.secondary)} onClick={() => p.onDeploy(d)}>
                Roll back to this
              </button>
            )}
            <button type="button" className={cx(s.gbtn, s.ghost)} onClick={() => p.onOpen('project')}>
              All deployments
            </button>
          </div>
        </div>
        <div className={s.steps}>
          {PHASES.map((n, i) => {
            const c = phaseClass(d, i);
            return (
              <div key={n} className={cx(s.step, c && s[c])}>
                <b>{n}</b>
                <span>{c === 'done' ? 'done' : c === 'cur' ? 'in progress' : c === 'bad' ? 'failed' : 'waiting'}</span>
              </div>
            );
          })}
        </div>
        {d.err && <p className={cx(s.banner, s.bad)}>{d.err}. The previous deployment is still live.</p>}
        <div ref={logRef} className={s.logs}>
          <LogLines d={d} />
          {RUNNING.includes(d.state) && <span className={s.cursor} />}
        </div>
      </div>
    </>
  );
}

function Observed(p: DesktopProps) {
  return (
    <>
      <Head>
        <b>Observed stacks</b>
      </Head>
      <div className={s.body}>
        <h2 className={s.title}>Observed stacks</h2>
        <p className={s.sub}>Docker Compose projects in /opt/docker. Gust shows them and can restart them, nothing else.</p>
        <table className={s.tbl}>
          <thead>
            <tr>
              <th>Stack</th>
              <th>Domain</th>
              <th>Containers</th>
              <th>Memory</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {observedStacks.map((o) => (
              <tr key={o.id}>
                <td>
                  <b>{o.id}</b>
                  <div className={cx(s.sub, s.mono)}>/opt/docker/{o.id}</div>
                </td>
                <td className={s.mono}>{o.domain}</td>
                <td>
                  <div className={s.chips}>
                    {o.containers.map((c) => (
                      <span key={c} className={s.chip}>{c}</span>
                    ))}
                  </div>
                </td>
                <td className={s.mono}>{o.mem}</td>
                <td>
                  <Pill state="live" />
                </td>
                <td>
                  <button type="button" className={cx(s.gbtn, s.secondary)} onClick={() => p.onRestart(o.id)}>
                    Restart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Registry() {
  return (
    <>
      <Head>
        <b>Registry</b>
      </Head>
      <div className={s.body}>
        <div className={cx(s.row, s.between)}>
          <div>
            <h2 className={s.title}>Registry</h2>
            <p className={s.sub}>Zot · registry.gust.zephyron.tech · keeps the last 20 tags per repository</p>
          </div>
          <button type="button" className={cx(s.gbtn, s.secondary)}>Run garbage collection</button>
        </div>
        <table className={s.tbl}>
          <thead>
            <tr>
              <th>Repository</th>
              <th>Tags</th>
              <th>Size</th>
              <th>Push access</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['smart-targets/api', 18, '612 MB'],
              ['smart-targets/admin', 11, '240 MB'],
              ['zephyron-web/web', 20, '1.9 GB'],
              ['gridtime/backend', 7, '380 MB'],
              ['gridtime/frontend', 7, '520 MB'],
              ['converter/backend', 4, '1.1 GB'],
            ].map(([r, t, z]) => (
              <tr key={r}>
                <td className={s.mono}>{r}</td>
                <td>{t}</td>
                <td className={s.mono}>{z}</td>
                <td className={s.sub}>robot:{String(r).split('/')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SettingsView() {
  return (
    <>
      <Head>
        <b>Settings</b>
      </Head>
      <div className={s.body}>
        <h2 className={s.title}>Settings</h2>
        <dl className={s.kv}>
          {[
            ['Version', 'gust 0.1.0 · up to date'],
            ['Server', 'Contabo Cloud VPS 6 · 6 vCPU · 12 GB · Ubuntu 24.04'],
            ['Sign-in', 'Authentik OIDC · auth.zephyron.tech · break-glass on'],
            ['GitHub App', 'gust-zephyron · zephyron, vandlj, clearway-dev'],
            ['Wildcard DNS', 'Cloudflare token · *.preview.zephyron.tech'],
            ['Backups', 'restic → Storage Box · nightly 03:00 · last OK 6 h ago'],
            ['Image cleanup', 'keep 5 per service · nightly'],
          ].map(([k, v]) => (
            <div key={k} className="contents">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}

/* ── iPhone app ─────────────────────────────────────────────────────── */
// The same screens as the Mac, laid out the iOS way. Everything follows the
// shared route, so the two devices always show the same place.

const PHONE_TABS: [Tab, string][] = [
  ['deployments', 'Deploys'],
  ['domains', 'Domains'],
  ['environment', 'Env'],
  ['logs', 'Logs'],
  ['settings', 'Settings'],
];

function Row({ title, meta, right, onClick, danger }: { title: ReactNode; meta?: ReactNode; right?: ReactNode; onClick?: () => void; danger?: boolean }) {
  const body = (
    <>
      <span className={s.msg} style={danger ? { color: 'var(--g-err)' } : undefined}>
        {title}
      </span>
      {right ?? (onClick ? <ChevronRight size={18} className={s.chev} /> : null)}
      {meta && <span className={s.meta}>{meta}</span>}
    </>
  );
  return onClick ? (
    <button type="button" className={s.cell} onClick={onClick}>
      {body}
    </button>
  ) : (
    <div className={s.cell} style={{ cursor: 'default' }}>
      {body}
    </div>
  );
}

function Phone(
  p: {
    deps: Deployment[];
    view: MacView;
    tab: Tab;
    svc: string;
    depId: string | null;
    busy: boolean;
    revealed: boolean;
    notif: { title: string; body: string } | null;
    metrics: Live;
    diskAlert: boolean;
    onResolveDisk: () => void;
  } & Pick<DesktopProps, 'onOpen' | 'onTab' | 'onSvc' | 'onDep' | 'onReveal' | 'onDeploy' | 'onRestart'>,
) {
  const d = p.view === 'deployment' ? (p.deps.find((x) => x.id === p.depId) ?? p.deps[0]) : null;
  const inProjects = p.view === 'projects' || p.view === 'project' || p.view === 'deployment';

  // iOS-style motion: going deeper pushes in from the right, going back from
  // the left, switching tabs cross-fades. Decided once per route change.
  const routeKey = `${p.view}-${p.tab}-${p.depId}`;
  const depth = p.view === 'deployment' ? 2 : p.view === 'project' ? 1 : 0;
  const motion = useRef({ key: routeKey, depth, root: inProjects, cls: '' });
  if (motion.current.key !== routeKey) {
    const m = motion.current;
    const sameStack = m.root === inProjects && inProjects;
    const cls = !sameStack ? s.fadeIn : depth > m.depth ? s.pushIn : depth < m.depth ? s.popIn : s.fadeIn;
    motion.current = { key: routeKey, depth, root: inProjects, cls };
  }

  let screen: ReactNode;
  if (p.view === 'projects') {
    screen = (
      <>
        <div className={s.nav} />
        <div className={s.large}>Projects</div>
        <div className={s.iosSub}>6 projects · 15 services</div>
        <div className={s.iosBody}>
          <div className={s.group}>
            {demoProjects.map((pr) => (
              <Row
                key={pr.id}
                onClick={() => p.onOpen('project')}
                title={
                  <span className={s.row}>
                    <span className={cx(s.dot, pr.health === 'live' && s.live, pr.health === 'failed' && s.failed)} />
                    {pr.id}
                  </span>
                }
                meta={pr.domain}
              />
            ))}
          </div>
        </div>
      </>
    );
  } else if (p.view === 'project') {
    screen = (
      <>
        <div className={s.nav}>
          <button type="button" className={s.back} onClick={() => p.onOpen('projects')}>
            <ArrowLeft size={20} /> Projects
          </button>
        </div>
        <div className={s.large} style={{ fontSize: 30 }}>
          smart-targets
        </div>
        <div className={s.iosSub}>production · api.targets.zephyron.tech</div>
        <div className={s.svcChips}>
          {['api', 'admin', 'db'].map((n) => (
            <button key={n} type="button" className={p.svc === n ? s.on : undefined} onClick={() => p.onSvc(n)}>
              <span className={cx(s.dot, s.live)} />
              {n}
            </button>
          ))}
        </div>
        <div className={s.seg}>
          {PHONE_TABS.map(([t, label]) => (
            <button key={t} type="button" className={p.tab === t ? s.on : undefined} onClick={() => p.onTab(t)}>
              {label}
            </button>
          ))}
        </div>
        <div className={s.iosBody} style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          {p.tab === 'deployments' && (
            <div className={s.group}>
              {p.deps.map((x) => (
                <button key={x.id} type="button" className={s.cell} onClick={() => p.onDep(x.id)}>
                  <span className={s.row}>
                    <Pill state={x.state} />
                    <span className={s.meta}>{x.age}</span>
                  </span>
                  <ChevronRight size={18} className={s.chev} />
                  <span className={s.msg}>{x.msg}</span>
                  <span className={s.meta}>
                    {x.sha} · {x.who}
                  </span>
                </button>
              ))}
            </div>
          )}
          {p.tab === 'domains' && (
            <div className={s.group}>
              {PHONE_DOMAINS.map(([dom, sv, cert]) => (
                <Row key={dom} title={dom} meta={`${sv} · ${cert}`} right={<Pill state="live" />} />
              ))}
            </div>
          )}
          {p.tab === 'environment' && (
            <>
              <div className={s.group}>
                {PHONE_ENV.map(([k, v, secret]) => (
                  <Row key={k} title={k} meta={!secret || p.revealed ? v : '••••••••••••'} />
                ))}
              </div>
              <button type="button" className={cx(s.iosBtn, s.tinted)} onClick={p.onReveal}>
                {p.revealed ? 'Hide secrets' : 'Reveal secrets'}
              </button>
            </>
          )}
          {p.tab === 'logs' && (
            <div className={s.plogs}>
              {RUNTIME_LOGS.map(([t, ph, l], i) => (
                <div key={i}>
                  <span className={s.ts}>{t}</span> <span className={ph === 'warn' ? s.warnc : s.ph}>{ph}</span> {l}
                </div>
              ))}
            </div>
          )}
          {p.tab === 'settings' && (
            <div className={s.group}>
              {PROJECT_SETTINGS.map(([k, v]) => (
                <Row key={k} title={k} meta={v} />
              ))}
            </div>
          )}
        </div>
      </>
    );
  } else if (d) {
    screen = (
      <>
        <div className={s.nav}>
          <button type="button" className={s.back} onClick={() => p.onOpen('project')}>
            <ArrowLeft size={20} /> smart-targets
          </button>
        </div>
        <div className={s.iosBody} style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
          <div className="grid gap-2">
            <Pill state={d.state} />
            <div style={{ font: '700 26px/1.2 var(--g-sys)' }}>{d.msg}</div>
            <div className={s.meta}>
              {d.id} · {d.sha} · {d.who}
            </div>
          </div>
          <div className={s.timeline}>
            {PHASES.map((n, i) => {
              const c = phaseClass(d, i);
              return (
                <div key={n} className={cx(s.tl, c && s[c])}>
                  <span className={s.ic}>
                    {c === 'done' ? <Check size={13} strokeWidth={3} /> : c === 'bad' ? <X size={13} strokeWidth={3} /> : c === 'cur' ? <span className="size-1.5 rounded-full bg-current" /> : null}
                  </span>
                  {n}
                </div>
              );
            })}
          </div>
          {d.err && <div className={s.iosAlert}>{d.err}. The previous deployment is still live.</div>}
          {d.state === 'superseded' && (
            <button type="button" className={cx(s.iosBtn, s.tinted)} disabled={p.busy} onClick={() => p.onDeploy(d)}>
              Roll back to this
            </button>
          )}
          {d.state === 'live' && (
            <button type="button" className={cx(s.iosBtn, s.fill)} disabled={p.busy} onClick={() => p.onDeploy()}>
              Redeploy
            </button>
          )}
          <div className={s.plogs}>
            {d.logs.slice(-7).map(([t, ph, l], i) => (
              <div key={i}>
                <span className={s.ts}>{t}</span> <span className={ph === 'fail' ? s.errc : ph === 'live' ? s.okc : s.ph}>{ph}</span> {l}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  } else if (p.view === 'server') {
    screen = <PhoneStatus live={p.metrics} alert={p.diskAlert} onResolve={p.onResolveDisk} />;
  } else if (p.view === 'observed') {
    screen = (
      <>
        <div className={s.nav} />
        <div className={s.large}>Stacks</div>
        <div className={s.iosSub}>Compose projects Gust only watches</div>
        <div className={s.iosBody}>
          <div className={s.group}>
            {observedStacks.map((o) => (
              <Row
                key={o.id}
                title={
                  <span className={s.row}>
                    <span className={cx(s.dot, s.live)} />
                    {o.id}
                  </span>
                }
                meta={`${o.containers.length} containers · ${o.mem}`}
                right={
                  <button type="button" className={cx(s.cellBtn, s.chev)} onClick={() => p.onRestart(o.id)}>
                    Restart
                  </button>
                }
              />
            ))}
          </div>
        </div>
      </>
    );
  } else if (p.view === 'registry') {
    screen = (
      <>
        <div className={s.nav} />
        <div className={s.large}>Registry</div>
        <div className={s.iosSub}>Zot · last 20 tags per repository</div>
        <div className={s.iosBody}>
          <div className={s.group}>
            {REGISTRY.map(([r, t, z]) => (
              <Row key={r} title={r} meta={`${t} tags · ${z}`} />
            ))}
          </div>
        </div>
      </>
    );
  } else {
    screen = (
      <>
        <div className={s.nav} />
        <div className={s.large}>Settings</div>
        <div className={s.iosSub}>gust 0.1.0 · up to date</div>
        <div className={s.iosBody}>
          <div className={s.group}>
            {GUST_SETTINGS.map(([k, v]) => (
              <Row key={k} title={k} meta={v} />
            ))}
          </div>
        </div>
      </>
    );
  }

  const tabs: [MacView, string, ReactNode, boolean][] = [
    ['projects', 'Projects', <FolderKanban key="i" size={24} />, inProjects],
    ['server', 'Server', <Activity key="i" size={24} />, p.view === 'server'],
    ['observed', 'Stacks', <Eye key="i" size={24} />, p.view === 'observed'],
    ['registry', 'Registry', <Box key="i" size={24} />, p.view === 'registry'],
    ['settings', 'Settings', <Settings key="i" size={24} />, p.view === 'settings'],
  ];

  return (
    <div className={s.ios}>
      <div className={s.status}>
        <span>9:41</span>
        <span className={s.icons}>
          <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={i * 5} y={9 - i * 3} width="3" height={3 + i * 3} rx="1" fill="#fff" />
            ))}
          </svg>
          <WifiIcon fill="#fff" />
          <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden>
            <rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="#fff" strokeOpacity=".4" fill="none" />
            <rect x="2" y="2" width="20" height="9" rx="2" fill="#fff" />
            <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="#fff" fillOpacity=".45" />
          </svg>
        </span>
      </div>

      {p.notif && (
        <div className={s.notif} role="status">
          <GustMark size={38} tile />
          <b>{p.notif.title}</b>
          <time>now</time>
          <p>{p.notif.body}</p>
        </div>
      )}

      <div key={routeKey} className={cx(s.screenIn, motion.current.cls)}>
        {screen}
      </div>

      <div className={s.tabbar} style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {tabs.map(([v, label, icon, on]) => (
          <button key={v} type="button" className={on ? s.on : undefined} onClick={() => p.onOpen(v)}>
            {icon}
            {label}
          </button>
        ))}
      </div>
      <div className={s.home} aria-hidden />
    </div>
  );
}

const PHONE_DOMAINS = [
  ['api.targets.zephyron.tech', 'api', 'renews in 61 days'],
  ['admin.targets.zephyron.tech', 'admin', 'renews in 61 days'],
  ['*.smart-targets.preview.zephyron.tech', 'previews', 'wildcard, DNS-01'],
];
const PHONE_ENV: [string, string, boolean][] = [
  ['DATABASE_URL', 'postgres://app:k2Lq…@gust-smart-targets-db:5432/app', true],
  ['JWT_SECRET', 'k8Zr0vQm…', true],
  ['SENTRY_DSN', 'https://4f1c…@sentry.io/88', true],
  ['NODE_ENV', 'production', false],
  ['PUBLIC_URL', 'https://api.targets.zephyron.tech', false],
];
const RUNTIME_LOGS = [
  ['15:40:02', 'api', 'GET /v1/targets?plan=q4 200 18ms'],
  ['15:40:03', 'api', 'POST /v1/targets/sync 202 41ms'],
  ['15:40:03', 'api', 'sync job 8812 enqueued (3 plans)'],
  ['15:40:05', 'warn', 'slow query 412ms on targets'],
  ['15:40:06', 'api', 'GET /healthz 200 1ms'],
  ['15:40:08', 'api', 'sync job 8812 done in 4.8s'],
];
const PROJECT_SETTINGS = [
  ['Repository', 'zephyron/smart-targets'],
  ['Image', 'registry.gust.zephyron.tech/smart-targets/api'],
  ['Port and health', '3000 · /healthz'],
  ['Limits', '1 CPU · 512 MB'],
  ['Strategy', 'blue/green (app)'],
  ['Keep images', '5'],
];
const REGISTRY = [
  ['smart-targets/api', 18, '612 MB'],
  ['smart-targets/admin', 11, '240 MB'],
  ['zephyron-web/web', 20, '1.9 GB'],
  ['gridtime/backend', 7, '380 MB'],
  ['gridtime/frontend', 7, '520 MB'],
  ['converter/backend', 4, '1.1 GB'],
] as const;
const GUST_SETTINGS = [
  ['Server', 'Contabo Cloud VPS 6 · Ubuntu 24.04'],
  ['Sign-in', 'Authentik OIDC · break-glass on'],
  ['GitHub App', 'zephyron, vandlj, clearway-dev'],
  ['Wildcard DNS', 'Cloudflare · *.preview.zephyron.tech'],
  ['Backups', 'restic → Storage Box · nightly 03:00'],
  ['Alerts', 'iPhone push · Discord #ops'],
];
