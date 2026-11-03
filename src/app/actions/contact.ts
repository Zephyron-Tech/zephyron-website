'use server';

import { Resend } from 'resend';
import { COMPANY_SIZES, TOPICS, TOPIC_LABELS, type Topic } from '@/lib/contact-options';
import { enquiryEmailHtml } from '@/lib/contact-email';

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  companySize?: string;
  topic?: string;
  message: string;
  /** Honeypot: real users never fill this in. */
  website?: string;
}

export interface ContactResult {
  success: boolean;
  error?: 'invalid' | 'send';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function sendContact(data: ContactPayload): Promise<ContactResult> {
  // Bots get a fake success so they don't retry.
  if (clean(data.website, 200)) return { success: true };

  const name = clean(data.name, 120);
  const email = clean(data.email, 200);
  const phone = clean(data.phone, 40);
  const company = clean(data.company, 160);
  const companySize = (COMPANY_SIZES as readonly string[]).includes(data.companySize ?? '') ? data.companySize! : '';
  const topic = (TOPICS as readonly string[]).includes(data.topic ?? '') ? (data.topic as Topic) : 'jine';
  const message = clean(data.message, 5000);

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return { success: false, error: 'invalid' };
  }

  const subject = `${topic === 'startup' ? 'Startup Support' : 'Poptávka'}: ${company || name}`;
  // Plain-text version for clients that do not show HTML. Optional fields that
  // were left empty are dropped, so no blank lines are left in their place.
  const fields = [
    `Jméno: ${name}`,
    `E-mail: ${email}`,
    phone && `Telefon: ${phone}`,
    company && `Firma: ${company}`,
    companySize && `Velikost: ${companySize}`,
    `Téma: ${TOPIC_LABELS[topic]}`,
  ].filter(Boolean);
  const text = `${fields.join('\n')}\n\n${message}`;
  const html = enquiryEmailHtml({
    subject,
    topic: TOPIC_LABELS[topic],
    name,
    email,
    phone,
    company,
    companySize,
    message,
    sentAt: new Date(),
  });

  // Kept for the admin dashboard. Never in the way of the e-mail: if the database
  // is down (or the migration has not reached it yet), the enquiry still goes out.
  const id = await saveEnquiry({ topic, name, email, phone, company, companySize, message });

  if (!process.env.RESEND_API_KEY) {
    // Local dev without Resend: log instead of failing.
    console.info('[sendContact] RESEND_API_KEY missing, would send:\n' + subject + '\n' + text);
    return { success: true };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: 'Zephyron Website <noreply@zephyron.tech>',
      to: 'hello@zephyron.tech',
      replyTo: email,
      subject,
      text,
      html,
    });
    if (error) throw error;
    if (id) await markEmailSent(id);
    return { success: true };
  } catch (err) {
    console.error('[sendContact] Resend error:', err);
    return { success: false, error: 'send' };
  }
}

async function saveEnquiry(e: {
  topic: Topic;
  name: string;
  email: string;
  phone: string;
  company: string;
  companySize: string;
  message: string;
}): Promise<string | null> {
  try {
    // Imported here: the client throws at load without DATABASE_URL, and that must not take the form down.
    const { prisma } = await import('@/lib/prisma');
    const row = await prisma.enquiry.create({
      data: { ...e, phone: e.phone || null, company: e.company || null, companySize: e.companySize || null },
      select: { id: true },
    });
    return row.id;
  } catch (err) {
    console.error('[sendContact] could not store the enquiry:', err);
    return null;
  }
}

async function markEmailSent(id: string) {
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.enquiry.update({ where: { id }, data: { emailSent: true } });
  } catch {
    // The row stays emailSent=false; the e-mail itself went out.
  }
}
