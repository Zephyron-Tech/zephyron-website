'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isSlugFree, suggestSlug } from '@/lib/slug';

const str = (f: FormData, k: string) => (f.get(k)?.toString().trim() || null);
const url = (f: FormData, k: string) => {
  const v = str(f, k);
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) throw new Error(`${k} must be an http(s) URL`);
  return v;
};

export async function saveMember(formData: FormData) {
  const { role, email: sessionEmail } = await requireRole();
  const id = str(formData, 'id');

  const profile = {
    name: str(formData, 'name') ?? '',
    titles: str(formData, 'titles'),
    role: str(formData, 'role') ?? '',
    phone: str(formData, 'phone'),
    linkedinUrl: url(formData, 'linkedinUrl'),
    bookingUrl: url(formData, 'bookingUrl'),
  };
  if (!profile.name || !profile.role) throw new Error('Name and role are required');

  if (id) {
    const existing = await prisma.member.findUniqueOrThrow({ where: { id } });
    if (role !== 'admin') {
      // Members may only edit their own contact data, never slug/mode/active.
      if (existing.email !== sessionEmail) throw new Error('Forbidden');
      await prisma.member.update({ where: { id }, data: profile });
    } else {
      const slug = str(formData, 'slug')?.toLowerCase() ?? existing.slug;
      if (!(await isSlugFree(slug, id))) throw new Error('Slug is invalid or already taken');
      const email = str(formData, 'email') ?? existing.email;
      await prisma.member.update({
        where: { id },
        data: {
          ...profile,
          slug,
          email,
          mode: formData.get('mode') === 'EVENT' ? 'EVENT' : 'DEFAULT',
          redirectUrl: url(formData, 'redirectUrl'),
          active: formData.get('active') === 'on',
        },
      });
    }
  } else {
    if (role !== 'admin') throw new Error('Forbidden');
    const email = str(formData, 'email');
    if (!email) throw new Error('Email is required');
    const requested = str(formData, 'slug')?.toLowerCase();
    const slug = requested ?? (await suggestSlug(profile.name));
    if (!(await isSlugFree(slug))) throw new Error('Slug is invalid or already taken');
    await prisma.member.create({ data: { ...profile, email, slug } });
  }

  revalidatePath('/admin/cards');
  redirect('/admin/cards');
}

export async function deleteMember(formData: FormData) {
  const { role } = await requireRole();
  if (role !== 'admin') throw new Error('Forbidden');
  await prisma.member.delete({ where: { id: formData.get('id')!.toString() } });
  revalidatePath('/admin/cards');
  redirect('/admin/cards');
}
