import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { ArrowLeft, Download } from 'lucide-react';

import { authOptions, type Role } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import MemberForm from '../MemberForm';
import { CopyButton } from '../CopyButton';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zephyron.tech';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default async function EditMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: Role } | undefined)?.role;
  if (!role) return (
      <p className="text-ink-2">
        Pro správu vizitek se{' '}
        <a href="/api/auth/signin?callbackUrl=/admin/cards" className="font-medium text-accent underline-offset-4 hover:underline">
          přihlaste
        </a>
        .
      </p>
    );

  const member = await prisma.member.findUnique({ where: { id }, omit: { photo: true } });
  if (!member) notFound();
  if (role !== 'admin' && member.email !== session?.user?.email) {
    return <p className="text-ink-2">Tuhle vizitku nemůžete upravovat.</p>;
  }

  const cardUrl = `${SITE_URL}/v/${member.slug}`;
  const photoUrl = member.photoUpdatedAt ? `/v/${member.slug}/photo?v=${member.photoUpdatedAt.getTime()}` : null;
  const download = 'inline-flex items-center gap-2 rounded-xl bg-paper px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-200 hover:bg-accent-soft';

  return (
    <div>
      <Link href="/admin/cards" className="tap inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft size={16} aria-hidden />
        Všechny vizitky
      </Link>
      <h1 className="mt-3 text-3xl text-ink">{member.name}</h1>
      {created && (
        <p role="status" className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm text-ink">
          Vizitka je vytvořená. Teď můžete nahrát fotku a stáhnout podklady pro tisk.
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] [&>*]:min-w-0">
        <MemberForm member={member} isAdmin={role === 'admin'} photoUrl={photoUrl} initials={initials(member.name)} />

        {/* The live card beside the form, as it is saved now. */}
        <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-2xl bg-card p-2">
            <iframe
              // Re-created after every save, so it shows what was just stored.
              key={member.updatedAt.getTime()}
              src={`/v/${member.slug}?preview=1`}
              title="Náhled vizitky"
              className="h-[620px] w-full rounded-xl bg-paper"
            />
          </div>

          <section className="rounded-2xl bg-card p-5">
            <h2 className="text-lg text-ink">Tisk a NFC</h2>
            <p className="mt-3 text-xs text-muted">Adresa pro NFC čip (záznam URI)</p>
            <CopyButton value={cardUrl} />
            <div className="mt-4 grid gap-2">
              <a className={download} href={`/admin/cards/${id}/card.pdf`} download={`${member.slug}-vizitka.pdf`}>
                <Download size={16} aria-hidden />
                Tisková vizitka (PDF, 85 × 55 mm)
              </a>
              <a className={download} href={`/admin/cards/${id}/qr.svg`} download={`${member.slug}-qr.svg`}>
                <Download size={16} aria-hidden />
                QR kód (SVG)
              </a>
              <a className={download} href={`/admin/cards/${id}/qr.svg?color=accent`} download={`${member.slug}-qr-fialovy.svg`}>
                <Download size={16} aria-hidden />
                QR kód fialový (SVG)
              </a>
              <a className={download} href={`/admin/cards/${id}/qr.pdf`} download={`${member.slug}-qr.pdf`}>
                <Download size={16} aria-hidden />
                QR kód (PDF)
              </a>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
