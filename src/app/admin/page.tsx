import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { TOPIC_LABELS, type Topic } from '@/lib/contact-options';
import { prisma } from '@/lib/prisma';
import { DAY, ago, plural } from './format';
import { ReportTile } from './reports/ReportTile';
import { reports } from './reports/registry';
import { SignInPrompt, adminSession } from './session';

export const metadata = { title: { absolute: 'Admin · Zephyron' } };

const RETENTION = 2 * 365 * DAY;

export default async function AdminHome() {
  const session = await adminSession();
  if (!session) return <SignInPrompt callbackUrl="/admin" what="Pro vstup do administrace" />;
  const isAdmin = session.role === 'admin';
  const since = new Date(Date.now() - 30 * DAY);

  // Enquiries are kept two years at most (see /ochrana-osobnich-udaju); older rows go on every visit.
  if (isAdmin) await prisma.enquiry.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - RETENTION) } } });

  const memberWhere = isAdmin ? {} : { email: session.email ?? '' };
  const [open, month, latest, members, scans] = await Promise.all([
    isAdmin ? prisma.enquiry.count({ where: { handledAt: null } }) : 0,
    isAdmin ? prisma.enquiry.count({ where: { createdAt: { gte: since } } }) : 0,
    isAdmin
      ? prisma.enquiry.findMany({
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, createdAt: true, name: true, company: true, topic: true, handledAt: true },
        })
      : [],
    prisma.member.findMany({
      where: memberWhere,
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true, active: true, mode: true },
    }),
    prisma.scan.groupBy({
      by: ['memberId'],
      where: { scannedAt: { gte: since }, member: memberWhere },
      _count: true,
    }),
  ]);
  const scansBy = new Map(scans.map((s) => [s.memberId, s._count]));
  const scanTotal = scans.reduce((n, s) => n + s._count, 0);
  const activeCards = members.filter((m) => m.active).length;

  const stats = [
    ...(isAdmin
      ? [
          { label: 'Nevyřízené poptávky', value: open, href: '/admin/enquiries', hot: open > 0 },
          { label: 'Poptávky za 30 dní', value: month, href: '/admin/enquiries?stav=vse' },
        ]
      : []),
    { label: plural(activeCards, 'Aktivní vizitka', 'Aktivní vizitky', 'Aktivních vizitek'), value: activeCards, href: '/admin/cards' },
    { label: 'Skeny za 30 dní', value: scanTotal, href: '/admin/cards' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl text-ink">Přehled</h1>
        <p className="mt-1 text-ink-2">Co se děje na zephyron.tech: poptávky, vizitky a interní přehledy.</p>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group rounded-2xl bg-card p-5 transition-colors duration-150 hover:bg-card/70">
            <dt className="text-sm text-ink-2">{s.label}</dt>
            <dd className="mt-1 flex items-center gap-2 font-display text-3xl font-semibold tabular-nums text-ink">
              {s.value}
              {s.hot && <span className="size-2 rounded-full bg-accent" aria-label="Čeká na odpověď" />}
            </dd>
          </Link>
        ))}
      </dl>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {isAdmin && (
          <section className="rounded-2xl bg-card p-6">
            <SectionHead title="Poslední poptávky" href="/admin/enquiries" link="Všechny poptávky" />
            <ul className="mt-3 space-y-1">
              {latest.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries?stav=vse#${e.id}`} className="flex items-start justify-between gap-4 py-3 hover:text-accent">
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-ink">{e.company || e.name}</span>
                        {!e.handledAt && (
                          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">Nová</span>
                        )}
                      </span>
                      <span className="block truncate text-sm text-ink-2">
                        {e.company ? `${e.name} · ` : ''}
                        {TOPIC_LABELS[e.topic as Topic] ?? e.topic}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-muted">{ago(e.createdAt)}</span>
                  </Link>
                </li>
              ))}
              {latest.length === 0 && (
                <li className="py-3 text-ink-2">Zatím žádná poptávka. Nové z formuláře na /kontakt se objeví tady.</li>
              )}
            </ul>
          </section>
        )}

        <section className="rounded-2xl bg-card p-6">
          <SectionHead title="Vizitky" href="/admin/cards" link="Spravovat" />
          <ul className="mt-3 space-y-1">
            {members.map((m) => {
              const n = scansBy.get(m.id) ?? 0;
              return (
                <li key={m.id} className="flex items-start justify-between gap-4 py-3">
                  <span className="min-w-0">
                    <Link href={`/admin/cards/${m.id}`} className="font-medium text-ink hover:text-accent">
                      {m.name}
                    </Link>
                    <a href={`/v/${m.slug}`} target="_blank" className="block truncate text-sm text-accent hover:underline">
                      /v/{m.slug}
                    </a>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1 text-sm">
                    <span className="tabular-nums text-muted">
                      {n} {plural(n, 'sken', 'skeny', 'skenů')}
                    </span>
                    {m.mode === 'EVENT' && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">Akce</span>}
                    {!m.active && <span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs font-medium text-ink-2">Vypnutá</span>}
                  </span>
                </li>
              );
            })}
            {members.length === 0 && <li className="py-3 text-ink-2">Zatím tu není žádná vizitka.</li>}
          </ul>
        </section>
      </div>

      {isAdmin && (
        <section>
          <SectionHead title="Přehledy" href="/admin/reports" link="Všechny přehledy" />
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((r) => (
              <li key={r.slug}>
                <ReportTile report={r} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function SectionHead({ title, href, link }: { title: string; href: string; link: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="text-xl text-ink">{title}</h2>
      <Link href={href} className="tap group inline-flex items-center gap-1 text-sm font-medium text-accent">
        {link}
        <ArrowRight size={14} aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
