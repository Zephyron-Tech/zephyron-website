import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { authOptions, type Role } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteMember } from './actions';

export const metadata = { title: 'Cards admin', robots: { index: false } };

export default async function CardsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: Role } | undefined)?.role;
  const email = session?.user?.email;
  if (!role) return <p>Unauthorized</p>;
  const isAdmin = role === 'admin';

  const members = await prisma.member.findMany({
    where: isAdmin ? {} : { email: email ?? '' },
    orderBy: { name: 'asc' },
    include: { _count: { select: { scans: true } } },
  });
  const byDevice = await prisma.scan.groupBy({
    by: ['memberId', 'device'],
    _count: { _all: true },
    where: { memberId: { in: members.map((m) => m.id) } },
  });
  const last = await prisma.scan.findMany({
    where: { memberId: { in: members.map((m) => m.id) } },
    orderBy: { scannedAt: 'desc' },
    take: 10,
    include: { member: { select: { name: true } } },
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Business cards</h1>
        {isAdmin && <Link href="/admin/cards/new" className="rounded-lg bg-[#583FFF] px-3 py-2 text-sm">New member</Link>}
      </div>

      <table className="w-full text-left text-sm">
        <thead className="text-white/50">
          <tr><th className="py-2">Name</th><th>Slug</th><th>Mode</th><th>Scans</th><th>Devices</th><th /></tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-t border-white/10">
              <td className="py-2">{m.name}{!m.active && ' (inactive)'}</td>
              <td><a className="text-violet-300" href={`/v/${m.slug}`}>/v/{m.slug}</a></td>
              <td>{m.mode}</td>
              <td>{m._count.scans}</td>
              <td className="text-white/60">
                {byDevice.filter((d) => d.memberId === m.id).map((d) => `${d.device}: ${d._count._all}`).join(', ') || '–'}
              </td>
              <td className="space-x-3 text-right">
                <Link href={`/admin/cards/${m.id}`}>Edit</Link>
                {isAdmin && (
                  <form action={deleteMember} className="inline">
                    <input type="hidden" name="id" value={m.id} />
                    <button className="text-red-400">Delete</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mb-2 mt-10 text-lg font-semibold">Latest scans</h2>
      <ul className="space-y-1 text-sm text-white/70">
        {last.map((s) => (
          <li key={s.id}>{s.scannedAt.toISOString().replace('T', ' ').slice(0, 19)} · {s.member.name} · {s.device}</li>
        ))}
        {last.length === 0 && <li>No scans yet.</li>}
      </ul>
    </>
  );
}
