'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactPayload {
  name: string;
  email: string;
  project: string;
}

export interface ContactResult {
  success: boolean;
}

export async function sendContact(data: ContactPayload): Promise<ContactResult> {
  const { name, email, project } = data;

  try {
    await resend.emails.send({
      from: 'Zephyron Website <noreply@zephyron.tech>',
      to: 'hello@zephyron.tech',
      replyTo: email,
      subject: `Project inquiry${name ? ` — ${name}` : ''}`,
      text: [
        name ? `Name: ${name}` : null,
        `Email: ${email}`,
        '',
        'Project:',
        project || '(no description provided)',
      ]
        .filter((l): l is string => l !== null)
        .join('\n'),
    });

    return { success: true };
  } catch (err) {
    console.error('[sendContact] Resend error:', err);
    return { success: false };
  }
}
