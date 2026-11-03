import { getServerSession } from 'next-auth';

import { authOptions, type Role } from '@/lib/auth';

export async function adminSession(): Promise<{ role: Role; email: string | null } | null> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: Role } | undefined)?.role;
  return role ? { role, email: session?.user?.email ?? null } : null;
}

// Production middleware already sends signed-out visitors to the login; this
// covers dev and a session that expired mid-visit.
export function SignInPrompt({ callbackUrl, what }: { callbackUrl: string; what: string }) {
  return (
    <p className="text-ink-2">
      {what} se{' '}
      <a
        href={`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
        className="font-medium text-accent underline-offset-4 hover:underline"
      >
        přihlaste
      </a>
      .
    </p>
  );
}

export function AdminOnly() {
  return <p className="text-ink-2">Tahle část je jen pro administrátory.</p>;
}
