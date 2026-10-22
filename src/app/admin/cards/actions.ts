'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isSlugFree, suggestSlug } from '@/lib/slug';

/** What the form shows after a failed save: one message, tied to a field when there is one. */
export interface SaveState {
  error?: string;
  field?: string;
  /** Set after a successful save of an existing card; the form stays open. */
  savedAt?: number;
}

const MAX_PHOTO_BYTES = 200 * 1024;

const str = (f: FormData, k: string) => f.get(k)?.toString().trim() || null;

class FormError extends Error {
  constructor(
    message: string,
    readonly field?: string,
  ) {
    super(message);
  }
}

const url = (f: FormData, k: string) => {
  const v = str(f, k);
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) throw new FormError('Odkaz musí začínat https://', k);
  return v;
};

// The admin resizes the portrait to a 400×400 JPEG in the browser and sends it
// as a data URL; here it is only checked and decoded.
function photoFrom(f: FormData): { photo: Uint8Array<ArrayBuffer>; photoType: string; photoUpdatedAt: Date } | 'remove' | null {
  if (f.get('photoRemove') === '1') return 'remove';
  const data = str(f, 'photo');
  if (!data) return null;
  const m = data.match(/^data:(image\/jpeg);base64,([A-Za-z0-9+/=]+)$/);
  if (!m) throw new FormError('Fotka musí být obrázek JPEG.', 'photo');
  const bytes = Uint8Array.from(Buffer.from(m[2], 'base64'));
  if (bytes.length > MAX_PHOTO_BYTES) throw new FormError('Fotka je po zmenšení větší než 200 kB.', 'photo');
  return { photo: bytes, photoType: m[1], photoUpdatedAt: new Date() };
}

export async function saveMember(_prev: SaveState, formData: FormData): Promise<SaveState> {
  const { role, email: sessionEmail } = await requireRole();
  const id = str(formData, 'id');
  let createdId: string | null = null;

  try {
    const profile = {
      name: str(formData, 'name') ?? '',
      titles: str(formData, 'titles'),
      role: str(formData, 'role') ?? '',
      phone: str(formData, 'phone'),
      linkedinUrl: url(formData, 'linkedinUrl'),
      bookingUrl: url(formData, 'bookingUrl'),
    };
    if (!profile.name) throw new FormError('Vyplňte jméno.', 'name');
    if (!profile.role) throw new FormError('Vyplňte roli.', 'role');

    const p = photoFrom(formData);
    const photo =
      p === 'remove'
        ? { photo: null, photoType: null, photoUpdatedAt: null }
        : p ?? {};

    if (id) {
      const existing = await prisma.member.findUniqueOrThrow({ where: { id }, omit: { photo: true } });
      if (role !== 'admin') {
        // Members may only edit their own contact data and photo, never slug/mode/active.
        if (existing.email !== sessionEmail) return { error: 'Tuhle vizitku nemůžete upravovat.' };
        await prisma.member.update({ where: { id }, data: { ...profile, ...photo } });
      } else {
        const slug = str(formData, 'slug')?.toLowerCase() ?? existing.slug;
        if (!(await isSlugFree(slug, id))) throw new FormError('Adresa je obsazená nebo neplatná.', 'slug');
        const email = str(formData, 'email') ?? existing.email;
        const mode = formData.get('mode') === 'EVENT' ? 'EVENT' : 'DEFAULT';
        const redirectUrl = url(formData, 'redirectUrl');
        if (mode === 'EVENT' && !redirectUrl) throw new FormError('Režim akce potřebuje odkaz.', 'redirectUrl');
        await prisma.member.update({
          where: { id },
          data: { ...profile, ...photo, slug, email, mode, redirectUrl, active: formData.get('active') === 'on' },
        });
      }
    } else {
      if (role !== 'admin') return { error: 'Nové vizitky zakládá jen admin.' };
      const email = str(formData, 'email');
      if (!email) throw new FormError('Vyplňte e-mail.', 'email');
      if (await prisma.member.findUnique({ where: { email }, select: { id: true } })) {
        throw new FormError('Vizitka s tímhle e-mailem už existuje.', 'email');
      }
      const requested = str(formData, 'slug')?.toLowerCase();
      const slug = requested ?? (await suggestSlug(profile.name));
      if (!(await isSlugFree(slug))) throw new FormError('Adresa je obsazená nebo neplatná.', 'slug');
      createdId = (await prisma.member.create({ data: { ...profile, ...photo, email, slug }, select: { id: true } })).id;
    }
  } catch (e) {
    if (e instanceof FormError) return { error: e.message, field: e.field };
    console.error('[cards] save failed:', e);
    return { error: 'Uložení se nepovedlo. Zkuste to prosím znovu.' };
  }

  revalidatePath('/admin/cards');
  // A new card opens in its editor (photo, print files, preview); an edit
  // stays where it was and the form reports the save.
  if (createdId) redirect(`/admin/cards/${createdId}?created=1`);
  revalidatePath(`/admin/cards/${id}`);
  return { savedAt: Date.now() };
}

export async function deleteMember(formData: FormData) {
  const { role } = await requireRole();
  if (role !== 'admin') throw new Error('Forbidden');
  await prisma.member.delete({ where: { id: formData.get('id')!.toString() } });
  revalidatePath('/admin/cards');
  redirect('/admin/cards');
}

/** Clears scan history (test scans skew the stats): one card with `id`, all cards without. */
export async function resetScans(formData: FormData) {
  const { role } = await requireRole();
  if (role !== 'admin') throw new Error('Forbidden');
  const id = formData.get('id')?.toString();
  await prisma.scan.deleteMany({ where: id ? { memberId: id } : {} });
  revalidatePath('/admin/cards');
}
