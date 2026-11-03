'use server';

import { revalidatePath } from 'next/cache';

import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const { role } = await requireRole();
  if (role !== 'admin') throw new Error('Forbidden');
}

function refresh() {
  revalidatePath('/admin');
  revalidatePath('/admin/enquiries');
}

/** Marks an enquiry handled, or back to open. */
export async function toggleHandled(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const row = await prisma.enquiry.findUnique({ where: { id }, select: { handledAt: true } });
  if (!row) return;
  await prisma.enquiry.update({ where: { id }, data: { handledAt: row.handledAt ? null : new Date() } });
  refresh();
}

/** Erases an enquiry for good, e.g. when the sender asks to be forgotten. */
export async function deleteEnquiry(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  await prisma.enquiry.deleteMany({ where: { id } });
  refresh();
}
