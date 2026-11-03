import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

import { AdminOnly, SignInPrompt, adminSession } from '../../session';
import { type Fit, type Plan, plans, sources, steps, verdicts } from './data';

export const metadata = { title: 'Výběr VPS po Hetzneru' };

const chip: Record<Fit, string> = {
  pick: 'bg-accent text-white',
  ok: 'bg-ok/10 text-ok',
  edge: 'bg-paper-2 text-ink-2',
  out: 'bg-err-soft text-err',
};

const now = [
  ['vCPU', '2'],
  ['RAM', '2,4 / 4 GB'],
  ['Disk', '29,6 / 40 GB'],
  ['Cena', '4 €'],
];
const need = [
  ['vCPU', '≥ 4'],
  ['RAM', '≥ 8 GB'],
  ['Disk', '≥ 80 GB SSD/NVMe'],
  ['Cena', '5–10 € / měs.'],
];
const matters = [
  ['Disk', 'IOPS a latence'],
  ['Databáze', '5× PostgreSQL'],
  ['CPU', 'steal time'],
  ['Síť', 'latence do CZ'],
];

export default async function VpsReport({ searchParams }: { searchParams: Promise<{ filtr?: string }> }) {
  const session = await adminSession();
  if (!session) return <SignInPrompt callbackUrl="/admin/reports/vps" what="Pro zobrazení přehledu" />;
  if (session.role !== 'admin') return <AdminOnly />;

  const budget = (await searchParams).filtr === 'rozpocet';
  const rows = budget ? plans.filter((p) => p.inBudget) : plans;

  return (
    <article className="space-y-12">
      <header className="space-y-6">
        <Link href="/admin/reports" className="tap inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
          <ArrowLeft size={14} aria-hidden />
          Přehledy
        </Link>
        <div className="space-y-4">
          <h1 className="max-w-3xl text-[clamp(32px,5vw,52px)] leading-[1.08] text-ink">
            Kam přestěhovat <span className="text-accent">26 kontejnerů</span> z Hetzneru
          </h1>
          <p className="max-w-2xl text-lg text-ink-2">
            Srovnání evropských VPS pro náš jeden server s Dockerem a Traefikem. Ceny jsou ověřené na webech poskytovatelů
            3. 11. 2026. Hlavní cena je bez DPH, protože nakupujeme jako firma (reverse charge). České nabídky jsou přepočtené
            kurzem ≈ 24,5 Kč/€.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SpecCard tag="Dnes · Hetzner CX23" rows={now}>
            <div className="h-2 overflow-hidden rounded-full bg-paper-2" title="Disk zaplněn na 74 %">
              <div className="h-full w-[74%] rounded-full bg-accent" />
            </div>
            <p className="text-sm text-muted">Disk je plný ze 74 %. Paměť stačí jen na aktivní projekty.</p>
          </SpecCard>
          <SpecCard tag="Požadavek" accent rows={need}>
            <p className="text-sm text-muted">
              Lokalita DE, CZ nebo SK. Rezerva pro ClearWay (PostGIS, Celery), MoodTracker, GridTime a Smart Targets.
            </p>
          </SpecCard>
          <SpecCard tag="Na čem záleží" rows={matters}>
            <p className="text-sm text-muted">Pět instancí PostgreSQL na jednom disku dělá z náhodných zápisů úzké hrdlo dřív než CPU.</p>
          </SpecCard>
        </div>
      </header>

      <section aria-labelledby="t-compare" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="t-compare" className="text-2xl text-ink">
              Srovnání tarifů
            </h2>
            <p className="mt-1 text-sm text-muted">Seřazeno podle ceny bez DPH. Červeně je parametr, který nesplňuje požadavek.</p>
          </div>
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
                className={`rounded-full px-4 py-1.5 text-sm font-medium pointer-coarse:py-2.5 ${t.active ? 'bg-card text-ink' : 'text-ink-2 hover:text-ink'}`}
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
              {rows.map((p) => (
                <PlanRow key={p.plan} p={p} />
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted">
          Hostinger a IONOS jsou úvodní ceny, po skončení akce platí cena „obnova“. Netcup s měsíčním závazkem stojí 21,04 € s DPH.
          U Contaba si v objednávce zkontrolujte poplatek za zřízení, který závisí na délce závazku.
        </p>
      </section>

      <section aria-labelledby="t-pc" className="space-y-4">
        <div>
          <h2 id="t-pc" className="text-2xl text-ink">
            Klady a zápory
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Hodnocení stability, disku a sítě je odhad z veřejných benchmarků a provozní zkušenosti, ne vlastní měření. Po
            objednávce ho ověřte během prvního dne podle postupu níže.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {verdicts.map((v) => (
            <li key={v.name} className="flex flex-col gap-5 rounded-2xl bg-card p-6">
              <div>
                <h3 className="text-lg text-ink">{v.name}</h3>
                <p className="text-sm text-muted">{v.where}</p>
              </div>
              <dl className="space-y-2">
                {v.scores.map(([label, n]) => (
                  <div key={label} className="grid grid-cols-[112px_1fr] items-center gap-3 text-sm">
                    <dt className="text-ink-2">{label}</dt>
                    <dd className="flex gap-1" aria-label={`${n} z 5`}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className={`h-2 flex-1 rounded-full ${i <= n ? 'bg-accent' : 'bg-paper-2'}`} />
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              <ul className="space-y-2 text-[15px] leading-snug">
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

      <section aria-labelledby="t-rec" className="space-y-10 rounded-[28px] bg-night p-6 text-white sm:p-10">
        <div className="space-y-3">
          <h2 id="t-rec" className="max-w-2xl text-[clamp(26px,4vw,40px)] leading-tight text-white">
            Doporučení: Contabo Cloud VPS 6 s NVMe
          </h2>
          <p className="max-w-2xl text-white/70">
            Jako jediný tarif v rozpočtu splňuje všechny požadavky s rezervou. Pro náš stack rozhoduje disk, proto berte variantu
            se 100 GB NVMe, ne 200 GB SSD. Když výkon v prvním týdnu nebude sedět, je záložní volbou OVHcloud VPS-3.
          </p>
        </div>

        <div className="grid gap-6 rounded-2xl bg-night-2 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <p className="font-display text-[clamp(40px,6vw,56px)] font-semibold leading-none tracking-tight tabular-nums">
              6,00 € <span className="font-sans text-base font-normal tracking-normal text-white/60">/ měs. bez DPH</span>
            </p>
            <p className="mt-3 text-sm text-white/60">7,14 € s DPH, měsíční platba</p>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-[15px] tabular-nums">
            {[
              ['vCPU', '6 (dnes 2)'],
              ['RAM', '12 GB (dnes využito 2,4 GB)'],
              ['Disk', '100 GB NVMe (dnes 29,6 GB)'],
              ['Lokalita', 'EU, Norimberk'],
              ['Rezerva', '≈ 9 GB RAM pro ClearWay a další projekty'],
            ].map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-white/60">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-5">
          <h3 className="text-xl text-white">Jak na stack s 26 kontejnery</h3>
          <ol className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <li key={s.title} className="space-y-2 border-t-2 border-night-line pt-4">
                <span className="text-sm font-medium text-accent-line">{s.tag}</span>
                <h4 className="font-display text-base font-semibold text-white">{s.title}</h4>
                <p className="text-[15px] leading-relaxed text-white/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Záložní volba', 'OVHcloud VPS-3', ': 6 vCPU, 12 GB, 100 GB NVMe za 10,40 € bez DPH. Stabilnější síť a disk, denní záloha v ceně, ale těsně nad rozpočtem.'],
            ['Když chcete jistotu výkonu', 'Netcup VPS 1000 G12.5', ' za 10,35 € při závazku 24 měsíců. Nejstabilnější z levných, ale jen 8 GB RAM a dlouhý závazek.'],
            ['Co nedoporučuji', 'Contabo Cloud VPS 4', ' se SATA SSD pro pět PostgreSQL a akční ceny Hostingeru a IONOS, které se po skončení akce dvoj- až trojnásobně zvednou.'],
          ].map(([title, name, rest]) => (
            <div key={title} className="space-y-2 rounded-2xl bg-night-2 p-5">
              <h3 className="text-base text-white">{title}</h3>
              <p className="text-[15px] text-white/70">
                <strong className="font-medium text-white">{name}</strong>
                {rest}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="space-y-3">
        <h2 className="text-lg text-ink">Zdroje cen (ověřeno 3. 11. 2026)</h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {sources.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener" className="group inline-flex items-center gap-1 text-accent hover:underline">
                {s.label}
                <ArrowUpRight size={13} aria-hidden />
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">
          Ceny v Kč přepočteny kurzem ≈ 24,5 Kč/€. Hodnocení stability, IOPS a sítě je odborný odhad, ne vlastní benchmark.
          Hetzner je ze srovnání vyřazený záměrně.
        </p>
      </footer>
    </article>
  );
}

function SpecCard({ tag, rows, accent, children }: { tag: string; rows: string[][]; accent?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-6">
      <span className={`self-start rounded-full px-3 py-0.5 text-sm font-medium ${accent ? 'bg-accent-soft text-accent' : 'bg-paper-2 text-ink-2'}`}>
        {tag}
      </span>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 tabular-nums">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="text-right font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      {children}
    </div>
  );
}

function PlanRow({ p }: { p: Plan }) {
  const miss = (k: Plan['miss']) => (p.miss === k ? 'font-semibold text-err' : '');
  return (
    // taste-skill-ignore: rules between rows of a real data table
    <tr className={`border-t border-line first:border-t-0 align-top ${p.fit === 'pick' ? 'bg-accent-soft' : ''}`}>
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
