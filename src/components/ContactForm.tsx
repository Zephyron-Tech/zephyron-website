'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { track } from '@vercel/analytics';
import { CheckCircle2 } from 'lucide-react';
import { Link } from '@/navigation';
import { sendContact } from '@/app/actions/contact';
import { COMPANY_SIZES, TOPICS, type Topic } from '@/lib/contact-options';

const field =
  'mt-1.5 w-full rounded-xl border border-line-strong bg-card px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10';
const label = 'block text-sm font-medium text-ink';

export function ContactForm({ defaultTopic = 'automatizace' }: { defaultTopic?: Topic }) {
  const t = useTranslations('form');
  const [topic, setTopic] = useState<Topic>(defaultTopic);
  const [status, setStatus] = useState<'idle' | 'sent' | 'invalid' | 'error'>('idle');
  const [pending, startTransition] = useTransition();
  const isStartup = topic === 'startup';

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? '');
    startTransition(async () => {
      const res = await sendContact({
        name: get('name'),
        email: get('email'),
        phone: get('phone'),
        company: get('company'),
        companySize: get('companySize'),
        topic,
        message: get('message'),
        website: get('website'),
      });
      if (res.success) {
        track('contact_form_sent', { topic });
        setStatus('sent');
      } else {
        setStatus(res.error === 'invalid' ? 'invalid' : 'error');
      }
    });
  }

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-3xl border border-line bg-card p-8">
        <CheckCircle2 size={32} strokeWidth={1.6} className="text-ok" aria-hidden />
        <h3 className="mt-5 text-2xl text-ink">{t('successTitle')}</h3>
        <p className="mt-2 text-ink-2">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-card p-6 sm:p-8">
      <fieldset>
        <legend className={label}>{t('topic')}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((tp) => (
            <label
              key={tp}
              className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/20 ${
                topic === tp ? 'border-accent bg-accent-soft text-ink' : 'border-line-strong text-ink-2 hover:border-ink'
              }`}
            >
              <input
                type="radio"
                name="topic"
                value={tp}
                checked={topic === tp}
                onChange={() => setTopic(tp)}
                className="sr-only"
              />
              {t(`topics.${tp}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className={label}>
          {t('name')}
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className={label}>
          {t('email')}
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className={label}>
          {t('company')}
          <input name="company" autoComplete="organization" className={field} />
        </label>
        <label className={label}>
          {t('companySize')}
          <select name="companySize" defaultValue={isStartup ? 'startup' : ''} key={isStartup ? 's' : 'b'} className={field}>
            <option value="">—</option>
            {COMPANY_SIZES.map((s) => (
              <option key={s} value={s}>
                {t(`sizes.${s}`)}
              </option>
            ))}
          </select>
        </label>
        <label className={`${label} sm:col-span-2`}>
          {t('phone')}
          <input name="phone" type="tel" autoComplete="tel" className={field} />
        </label>
        <label className={`${label} sm:col-span-2`}>
          {t('message')}
          <textarea
            name="message"
            required
            minLength={5}
            rows={5}
            placeholder={isStartup ? t('messagePlaceholderStartup') : t('messagePlaceholder')}
            className={`${field} resize-y`}
          />
        </label>
        {/* Honeypot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Web
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>

      {(status === 'invalid' || status === 'error') && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {status === 'invalid' ? t('invalid') : t('error')}
        </p>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-muted">
          {t('consent')}{' '}
          <Link href="/ochrana-osobnich-udaju" className="underline underline-offset-2 hover:text-ink">
            Zásady ochrany osobních údajů
          </Link>
          .
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? t('sending') : t('submit')}
        </button>
      </div>
    </form>
  );
}
