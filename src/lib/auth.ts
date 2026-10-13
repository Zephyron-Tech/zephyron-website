import type { NextAuthOptions } from 'next-auth';
import AuthentikProvider from 'next-auth/providers/authentik';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getServerSession } from 'next-auth';

export type Role = 'admin' | 'member';

const isDev = process.env.NODE_ENV === 'development';

function roleFromGroups(groups: unknown): Role | null {
  const list = Array.isArray(groups) ? (groups as string[]) : [];
  const admin = process.env.AUTHENTIK_ADMIN_GROUP;
  const member = process.env.AUTHENTIK_MEMBER_GROUP;
  if (admin && list.includes(admin)) return 'admin';
  if (member && list.includes(member)) return 'member';
  return null;
}

export const authOptions: NextAuthOptions = {
  // Dev has no Authentik client; a local credentials login stands in (never in production).
  providers: isDev
    ? [
        CredentialsProvider({
          name: 'Dev',
          credentials: { email: { label: 'Email', type: 'email' } },
          authorize: async (c) =>
            c?.email ? { id: c.email, email: c.email, name: 'Dev admin' } : null,
        }),
      ]
    : [
        AuthentikProvider({
          clientId: process.env.AUTHENTIK_ID!,
          clientSecret: process.env.AUTHENTIK_SECRET!,
          issuer: process.env.AUTHENTIK_ISSUER,
        }),
      ],
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  callbacks: {
    async signIn({ profile }) {
      if (isDev) return true;
      return roleFromGroups((profile as { groups?: unknown } | undefined)?.groups) !== null;
    },
    async jwt({ token, profile }) {
      if (isDev) token.role = 'admin';
      else if (profile) token.role = roleFromGroups((profile as { groups?: unknown }).groups);
      return token;
    },
    async session({ session, token }) {
      (session.user as { role?: Role }).role = token.role as Role | undefined;
      return session;
    },
  },
};

export async function requireRole(): Promise<{ role: Role; email: string }> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: Role } | undefined)?.role;
  const email = session?.user?.email;
  if (!role || !email) throw new Error('Unauthorized');
  return { role, email };
}
