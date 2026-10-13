import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions, type Role } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import MemberForm from '../MemberForm';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zephyron.tech';

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: Role } | undefined)?.role;
  if (!role) return <p>Unauthorized</p>;

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) notFound();
  if (role !== 'admin' && member.email !== session?.user?.email) return <p>Forbidden</p>;

  const nfcUrl = `${SITE_URL}/v/${member.slug}`;

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">{member.name}</h1>
      <MemberForm member={member} isAdmin={role === 'admin'} />

      <h2 className="mb-2 mt-10 text-lg font-semibold">Print &amp; NFC</h2>
      <p className="mb-2 text-sm text-white/60">NFC URL payload (write as NDEF URI record):</p>
      <code className="block rounded bg-white/5 p-2 text-sm select-all">{nfcUrl}</code>
      <div className="mt-3 space-x-4 text-sm">
        <a className="text-violet-300" href={`/admin/cards/${id}/qr.svg`} download={`${member.slug}.svg`}>QR (SVG)</a>
        <a className="text-violet-300" href={`/admin/cards/${id}/qr.pdf`} download={`${member.slug}.pdf`}>QR (PDF)</a>
      </div>
    </>
  );
}
