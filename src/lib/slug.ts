import { prisma } from '@/lib/prisma';

export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED = new Set(['api', 'admin', 'new']);

export async function isSlugFree(slug: string, exceptId?: string): Promise<boolean> {
  if (!SLUG_RE.test(slug) || RESERVED.has(slug)) return false;
  const found = await prisma.member.findUnique({ where: { slug }, select: { id: true } });
  return !found || found.id === exceptId;
}

export async function suggestSlug(name: string): Promise<string> {
  const base = slugify(name) || 'card';
  for (let i = 1; ; i++) {
    const candidate = i === 1 ? base : `${base}-${i}`;
    if (await isSlugFree(candidate)) return candidate;
  }
}
