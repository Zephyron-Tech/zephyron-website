import { getServerSession } from 'next-auth';

import { authOptions, type Role } from '@/lib/auth';
import MemberForm from '../MemberForm';

export default async function NewMemberPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: Role } | undefined)?.role !== 'admin') return <p>Forbidden</p>;
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">New member</h1>
      <MemberForm isAdmin />
    </>
  );
}
