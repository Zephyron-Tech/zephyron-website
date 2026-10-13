import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/lib/generated/prisma/client';

// Next.js hot-reloads modules in development; cache the client on globalThis
// so each reload does not open a new connection pool.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');

  // DATABASE_CA = PEM of the VPS's self-signed server cert (pinned CA). Keep `sslmode` out of the
  // URL: pg lets URL params override this `ssl` option. Local dev (no CA) connects without TLS.
  const ca = process.env.DATABASE_CA;
  const adapter = new PrismaPg({
    connectionString,
    ssl: ca ? { ca: ca.replace(/\\n/g, '\n') } : undefined,
    max: 3, // serverless instances x pool size must stay under the server's max_connections=20
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
