import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { ArrowLeft } from 'lucide-react';

import { authOptions, type Role } from '@/lib/auth';
import MemberForm from '../MemberForm';

export default async function NewMemberPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: Role } | undefined)?.role !== 'admin') {
    return <p className="text-ink-2">Nové vizitky zakládá jen admin.</p>;
  }
  return (
    <div className="max-w-2xl">
      <Link href="/admin/cards" className="tap inline-flex items-center gap-2 text-sm text-ink-2 hover:text-ink">
        <ArrowLeft size={16} aria-hidden />
        Všechny vizitky
      </Link>
      <h1 className="mb-6 mt-3 text-3xl text-ink">Nová vizitka</h1>
      <MemberForm isAdmin />
    </div>
  );
}
