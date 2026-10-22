import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Plus } from 'lucide-react';

import { authOptions, type Role } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DeleteButton, ResetScansButton } from './DeleteButton';
import { ScanStats } from './ScanStats';
import { btnPrimary } from './ui';

const DAY = 24 * 60 * 60 * 1000;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default async function CardsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: Role } | undefined)?.role;
  const email = session?.user?.email;
  if (!role) return (
      <p className="text-ink-2">
        Pro správu vizitek se{' '}
        <a href="/api/auth/signin?callbackUrl=/admin/cards" className="font-medium text-accent underline-offset-4 hover:underline">
          přihlaste
        </a>
        .
      </p>
    );
  const isAdmin = role === 'admin';

  const members = await prisma.member.findMany({
    where: isAdmin ? {} : { email: email ?? '' },
    orderBy: { name: 'asc' },
    omit: { photo: true },
    include: { _count: { select: { scans: true } } },
  });
  const ids = members.map((m) => m.id);
  const since = new Date(Date.now() - 30 * DAY);
  const scans = await prisma.scan.findMany({
    where: { memberId: { in: ids }, scannedAt: { gte: since } },
    select: { memberId: true, scannedAt: true, device: true },
    orderBy: { scannedAt: 'desc' },
  });
  const total = members.reduce((n, m) => n + m._count.scans, 0);
  const last = await prisma.scan.findMany({
    where: { memberId: { in: ids } },
    orderBy: { scannedAt: 'desc' },
    take: 8,
    include: { member: { select: { name: true } } },
  });
  const fmt = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl text-ink">Digitální vizitky</h1>
          <p className="mt-1 text-ink-2">
            {isAdmin ? 'Vizitky týmu na zephyron.tech/v/…' : 'Vaše vizitka na zephyron.tech/v/…'}
          </p>
        </div>
        {isAdmin && (
          <Link href="/admin/cards/new" className={btnPrimary}>
            <Plus size={16} aria-hidden />
            Nová vizitka
          </Link>
        )}
      </div>

      <ul className="grid gap-3 md:grid-cols-2">
        {members.map((m) => {
          const recent = scans.filter((s) => s.memberId === m.id).length;
          return (
            <li key={m.id} className="flex items-center gap-4 rounded-2xl bg-card p-4">
              {m.photoUpdatedAt ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/v/${m.slug}/photo?v=${m.photoUpdatedAt.getTime()}`}
                  alt=""
                  className="size-14 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-paper font-display font-semibold text-ink-2">
                  {initials(m.name)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-ink">{m.name}</span>
                  {m.mode === 'EVENT' && (
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">Akce</span>
                  )}
                  {!m.active && (
                    <span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs font-medium text-ink-2">Vypnutá</span>
                  )}
                </div>
                <a href={`/v/${m.slug}`} target="_blank" className="block truncate text-sm text-accent hover:underline">
                  /v/{m.slug}
                </a>
                <span className="text-[13px] text-muted">
                  {recent} {recent === 1 ? 'sken' : recent >= 2 && recent <= 4 ? 'skeny' : 'skenů'} za 30 dní
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <Link href={`/admin/cards/${m.id}`} className="text-sm font-medium text-ink hover:text-accent">
                  Upravit
                </Link>
                {isAdmin && <DeleteButton id={m.id} name={m.name} />}
                {isAdmin && m._count.scans > 0 && <ResetScansButton id={m.id} name={m.name} />}
              </div>
            </li>
          );
        })}
        {members.length === 0 && (
          <li className="rounded-2xl bg-card p-6 text-ink-2 md:col-span-2">
            {isAdmin ? 'Zatím tu není žádná vizitka.' : 'K vašemu e-mailu zatím vizitka nepatří.'}
          </li>
        )}
      </ul>

      <ScanStats scans={scans} total={total} reset={isAdmin && total > 0 ? <ResetScansButton /> : null} />

      <section className="rounded-2xl bg-card p-6">
        <h2 className="text-xl text-ink">Poslední skeny</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {last.map((s) => (
            <li key={s.id} className="flex justify-between gap-4">
              <span className="text-ink">{s.member.name}</span>
              <span className="tabular-nums text-muted">{fmt.format(s.scannedAt)}</span>
            </li>
          ))}
          {last.length === 0 && <li className="text-ink-2">Zatím žádný sken.</li>}
        </ul>
      </section>
    </div>
  );
}
