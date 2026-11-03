import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

import { ShareButton } from '../../ShareButton';
import { AdminOnly, SignInPrompt, adminSession } from '../../session';
import { type Fit, type Plan, plans, sources, steps, verdicts } from './data';

const TITLE = 'Výběr VPS po Hetzneru';
export const metadata = { title: TITLE };

const chip: Record<Fit, string> = {
  pick: 'bg-accent text-white',
  ok: 'bg-ok/10 text-ok',
  edge: 'bg-paper-2 text-ink-2',
  out: 'bg-err-soft text-err',
};

const specs = [
  { tag: 'Dnes · Hetzner CX23', rows: [['vCPU', '2'], ['RAM', '2,4 / 4 GB'], ['Disk', '29,6 / 40 GB'], ['Cena', '4 €']], meter: 74 },
  { tag: 'Požadavek', accent: true, rows: [['vCPU', '≥ 4'], ['RAM', '≥ 8 GB'], ['Disk', '≥ 80 GB'], ['Cena', '5–10 €'], ['Lokalita', 'DE, CZ, SK']] },
  { tag: 'Rozhoduje', rows: [['Disk', 'IOPS'], ['Databáze', '5× PostgreSQL'], ['CPU', 'steal time'], ['Síť', 'latence do CZ']] },
];

const pick = [
  ['vCPU', '6', 'dnes 2'],
  ['RAM', '12 GB', 'využito 2,4'],
  ['Disk', '100 GB NVMe', 'využito 29,6'],
  ['Lokalita', 'Norimberk', ''],
];

const alternatives = [
  ['Záloha', 'OVHcloud VPS-3', '10,40 € · stabilnější disk a síť, denní záloha'],
  ['Jistota výkonu', 'Netcup VPS 1000', '10,35 € · závazek 24 měsíců, jen 8 GB'],
  ['Nebrat', 'Contabo VPS 4, Hostinger, IONOS', 'SATA SSD, nebo akční ceny, které pak vyletí'],
];

// Entrance stagger for blocks in the first screen.
const delay = (i: number) => ({ animationDelay: `${i * 70}ms` });

export default async function VpsReport({ searchParams }: { searchParams: Promise<{ filtr?: string }> }) {
  const session = await adminSession();
  if (!session) return <SignInPrompt callbackUrl="/admin/reports/vps" what="Pro zobrazení přehledu" />;
  if (session.role !== 'admin') return <AdminOnly />;

  const budget = (await searchParams).filtr === 'rozpocet';
  const rows = budget ? plans.filter((p) => p.inBudget) : plans;

  return (
    <article className="space-y-14">
      <header className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/admin/reports" className="tap inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
            <ArrowLeft size={14} aria-hidden />
            Přehledy
          </Link>
          <ShareButton title={TITLE} />
        </div>
        <div className="rise space-y-3">
          <h1 className="max-w-3xl text-[clamp(32px,5vw,52px)] leading-[1.08] text-ink">
            Kam přestěhovat <span className="text-accent">26 kontejnerů</span> z Hetzneru
          </h1>
          <p className="text-ink-2">Ceny bez DPH, ověřeno 3. 11. 2026.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {specs.map((c, i) => (
            <div key={c.tag} className="rise flex flex-col gap-3 rounded-2xl bg-card p-6" style={delay(i + 1)}>
              <span
                className={`self-start rounded-full px-3 py-0.5 text-sm font-medium ${c.accent ? 'bg-accent-soft text-accent' : 'bg-paper-2 text-ink-2'}`}
              >
                {c.tag}
              </span>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 tabular-nums">
                {c.rows.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-sm text-muted">{k}</dt>
                    <dd className="text-right font-medium text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              {c.meter && (
                <div className="mt-auto space-y-1.5">
                  <div className="h-2 overflow-hidden rounded-full bg-paper-2">
                    <div className="grow-x h-full rounded-full bg-accent" style={{ width: `${c.meter}%`, animationDelay: '300ms' }} />
                  </div>
                  <p className="text-xs text-muted">Disk plný ze {c.meter} %</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </header>

      <section aria-labelledby="t-compare" className="reveal space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="t-compare" className="text-2xl text-ink">
            Tarify
          </h2>
          <div className="flex gap-1 rounded-full bg-paper-2 p-1" role="group" aria-label="Filtr tarifů">
            {[
              { href: '/admin/reports/vps', label: 'Všechny', active: !budget },
              { href: '/admin/reports/vps?filtr=rozpocet', label: 'Jen v rozpočtu', active: budget },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                scroll={false}
                aria-current={t.active ? 'page' : undefined}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 pointer-coarse:py-2.5 ${
                  t.active ? 'bg-card text-ink' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-card">
          <table className="w-full min-w-[1040px] text-[15px]">
            <thead>
              <tr className="bg-paper-2 text-left text-sm font-medium text-muted">
                <th className="px-3 py-3">Poskytovatel</th>
                <th className="px-3 py-3">Tarif</th>
                <th className="px-3 py-3 text-right">vCPU</th>
                <th className="px-3 py-3 text-right">RAM</th>
                <th className="px-3 py-3">Úložiště</th>
                <th className="whitespace-nowrap px-3 py-3 text-right">Cena / měs.</th>
                <th className="px-3 py-3">Lokalita</th>
                <th className="px-3 py-3">Stav</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rows.map((p, i) => (
                <PlanRow key={p.plan} p={p} i={i} />
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted">Červeně: nesplňuje požadavek. Hostinger a IONOS jsou úvodní ceny.</p>
      </section>

      <section aria-labelledby="t-pc" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="t-pc" className="text-2xl text-ink">
            Klady a zápory
          </h2>
          <p className="text-sm text-muted">Skóre je odhad, ne vlastní měření.</p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {verdicts.map((v) => (
            <li
              key={v.name}
              className="reveal flex flex-col gap-5 rounded-2xl bg-card p-6 transition-transform duration-200 ease-[var(--ease-out)] [@media(hover:hover)]:hover:-translate-y-0.5"
            >
              <div>
                <h3 className="text-lg text-ink">{v.name}</h3>
                <p className="text-sm text-muted">{v.where}</p>
              </div>
              <dl className="space-y-2">
                {v.scores.map(([label, n]) => (
                  <div key={label} className="grid grid-cols-[112px_1fr] items-center gap-3 text-sm">
                    <dt className="text-ink-2">{label}</dt>
                    <dd className="h-2 overflow-hidden rounded-full bg-paper-2" aria-label={`${n} z 5`}>
                      <div className="grow-x h-full rounded-full bg-accent" style={{ width: `${n * 20}%` }} />
                    </dd>
                  </div>
                ))}
              </dl>
              <ul className="space-y-1.5 text-[15px] leading-snug">
                {v.plus.map((t) => (
                  <li key={t} className="grid grid-cols-[16px_1fr] gap-2 text-ink">
                    <span className="font-semibold text-ok" aria-label="Výhoda">+</span>
                    {t}
                  </li>
                ))}
                {v.minus.map((t) => (
                  <li key={t} className="grid grid-cols-[16px_1fr] gap-2 text-ink-2">
                    <span className="font-semibold text-err" aria-label="Nevýhoda">−</span>
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="t-rec" className="reveal space-y-10 rounded-[28px] bg-night p-6 text-white sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div className="space-y-3">
            <p className="text-sm font-medium text-accent-line">Doporučení</p>
            <h2 id="t-rec" className="text-[clamp(28px,4vw,44px)] leading-tight text-white">
              Contabo Cloud VPS 6 s NVMe
            </h2>
            <p className="font-display text-[clamp(40px,6vw,60px)] font-semibold leading-none tracking-tight tabular-nums">
              6,00 € <span className="font-sans text-base font-normal tracking-normal text-white/60">/ měs. bez DPH</span>
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {pick.map(([k, v, note]) => (
              <div key={k} className="rounded-2xl bg-night-2 p-4">
                <dt className="text-xs text-white/60">{k}</dt>
                <dd className="mt-1 font-medium tabular-nums">{v}</dd>
                {note && <dd className="text-xs text-white/50">{note}</dd>}
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-5">
          <h3 className="text-xl text-white">Postup</h3>
          <ol className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[28px_1fr] gap-3">
                <span className="font-display text-sm font-semibold tabular-nums text-accent-line">{i + 1}</span>
                <div className="space-y-1">
                  <h4 className="font-display text-base font-semibold text-white">{s.title}</h4>
                  <p className="text-[15px] leading-relaxed text-white/70">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {alternatives.map(([label, name, text]) => (
            <div key={label} className="space-y-1 rounded-2xl bg-night-2 p-5">
              <p className="text-xs text-white/60">{label}</p>
              <p className="font-medium text-white">{name}</p>
              <p className="text-sm text-white/70">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap items-baseline gap-x-5 gap-y-2 text-sm">
        <span className="text-muted">Zdroje:</span>
        {sources.map((s) => (
          <a key={s.href} href={s.href} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-accent hover:underline">
            {s.label}
            <ArrowUpRight size={13} aria-hidden />
          </a>
        ))}
      </footer>
    </article>
  );
}

function PlanRow({ p, i }: { p: Plan; i: number }) {
  const miss = (k: Plan['miss']) => (p.miss === k ? 'font-semibold text-err' : '');
  return (
    // taste-skill-ignore: rules between rows of a real data table
    <tr
      className={`rise border-t border-line align-top first:border-t-0 ${p.fit === 'pick' ? 'bg-accent-soft' : 'transition-colors duration-150 hover:bg-paper/60'}`}
      style={{ animationDelay: `${i * 40}ms`, animationDuration: '500ms' }}
    >
      <td className="px-3 py-3.5 font-medium text-ink">{p.provider}</td>
      <td className="min-w-40 px-3 py-3.5 text-ink-2">{p.plan}</td>
      <td className="whitespace-nowrap px-3 py-3.5 text-right">{p.vcpu}</td>
      <td className={`whitespace-nowrap px-3 py-3.5 text-right ${miss('ram')}`}>{p.ram}</td>
      <td className="px-3 py-3.5">
        <span className={`whitespace-nowrap ${miss('storage')}`}>{p.storage}</span>
        {p.storageNote && <span className="block text-xs text-muted">{p.storageNote}</span>}
      </td>
      <td className="px-3 py-3.5 text-right">
        <span className={`whitespace-nowrap text-base font-semibold ${miss('price') || 'text-ink'}`}>{p.price}</span>
        <span className="block text-xs text-muted">{p.priceNote}</span>
      </td>
      <td className="min-w-48 px-3 py-3.5 text-ink-2">{p.location}</td>
      <td className="px-3 py-3.5">
        <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${chip[p.fit]}`}>{p.status}</span>
      </td>
    </tr>
  );
}
