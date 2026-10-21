'use server';

import { Resend } from 'resend';
import { COMPANY_SIZES, TOPICS, type Topic } from '@/lib/contact-options';


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

const TOPIC_LABELS: Record<Topic, string> = {
  automatizace: 'Automatizace procesů',
  system: 'Interní systém / aplikace',
  support: 'IT podpora a správa',
  web: 'Web / webová aplikace',
  startup: 'Startup Support',
  jine: 'Jiné',
};

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
  const text = [
    `Jméno: ${name}`,
    `E-mail: ${email}`,
    phone && `Telefon: ${phone}`,
    company && `Firma: ${company}`,
    companySize && `Velikost: ${companySize}`,
    `Téma: ${TOPIC_LABELS[topic]}`,
    '',
    message,
  ]
    .filter((l): l is string => typeof l === 'string')
    .join('\n');

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
    });
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('[sendContact] Resend error:', err);
    return { success: false, error: 'send' };
  }
}
