'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { track } from '@vercel/analytics';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from '@/navigation';
import { Button } from './ui/Button';
import { sendContact } from '@/app/actions/contact';
import { COMPANY_SIZES, TOPICS, type Topic } from '@/lib/contact-options';

// Fields are a tone inside the white card, not boxes drawn with lines; focus
// lifts them to the card colour with a single accent border.
const field =
  'mt-1.5 w-full rounded-xl border border-transparent bg-paper px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 transition-[background-color,border-color,box-shadow] duration-150 focus:border-accent focus:bg-card focus:outline-none';
const fieldErr = 'border-err! bg-card!';
const label = 'block text-sm font-medium text-ink';

type FieldName = 'name' | 'email' | 'message';
type Errors = Partial<Record<FieldName, string>>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Choice pills for topic and company size: a tone, the chosen one in accent.
const pill = (on: boolean) =>
  `cursor-pointer rounded-full px-3.5 py-2 text-sm transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
    on ? 'bg-accent font-medium text-white' : 'bg-paper text-ink-2 hover:bg-accent-soft hover:text-ink'
  }`;

export function ContactForm({ defaultTopic = 'automatizace' }: { defaultTopic?: Topic }) {
  const t = useTranslations('form');
  const [topic, setTopic] = useState<Topic>(defaultTopic);
  const [size, setSize] = useState<string>(defaultTopic === 'startup' ? 'startup' : '');
  const [status, setStatus] = useState<'idle' | 'sent' | 'invalid' | 'error'>('idle');
  const [pending, startTransition] = useTransition();
  const isStartup = topic === 'startup';
  const [errors, setErrors] = useState<Errors>({});

  // Our own checks instead of the browser's bubbles: the message sits under
  // the field in the site's type, and clears as soon as the field is edited.
  function validate(fd: FormData): Errors {
    const v = (k: FieldName) => String(fd.get(k) ?? '').trim();
    const out: Errors = {};
    if (!v('name')) out.name = t('required');
    if (!v('email')) out.email = t('required');
    else if (!EMAIL.test(v('email'))) out.email = t('emailInvalid');
    if (!v('message')) out.message = t('required');
    else if (v('message').length < 5) out.message = t('messageShort');
    return out;
  }

  function clear(name: FieldName) {
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function fieldProps(name: FieldName) {
    const err = errors[name];
    return {
      name,
      'aria-invalid': err ? true : undefined,
      'aria-describedby': err ? `${name}-error` : undefined,
      onInput: () => clear(name),
    };
  }

  function errorText(name: FieldName) {
    return errors[name] ? (
      <span id={`${name}-error`} className="mt-1.5 block text-[13px] font-normal text-err">
        {errors[name]}
      </span>
    ) : null;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const found = validate(fd);
    setErrors(found);
    const first = (['name', 'email', 'message'] as const).find((k) => found[k]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
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
      <div role="status" className="rounded-2xl bg-card p-8">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Check size={22} strokeWidth={2.25} aria-hidden />
        </span>
        <h3 className="mt-5 text-2xl text-ink">{t('successTitle')}</h3>
        <p className="mt-2 text-ink-2">{t('successBody')}</p>
        <Link href="/reference" className="group mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-accent">
          {t('successNext')}
          <ArrowRight size={16} aria-hidden className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl bg-card p-6 sm:p-8">
      <fieldset>
        <legend className={label}>{t('topic')}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((tp) => (
            <label
              key={tp}
              className={pill(topic === tp)}
            >
              <input
                type="radio"
                name="topic"
                value={tp}
                checked={topic === tp}
                onChange={() => {
                  setTopic(tp);
                  if (tp === 'startup') setSize('startup');
                }}
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
          <input {...fieldProps('name')} autoComplete="name" className={`${field} ${errors.name ? fieldErr : ''}`} />
          {errorText('name')}
        </label>
        <label className={label}>
          {t('email')}
          <input
            {...fieldProps('email')}
            type="email"
            autoComplete="email"
            className={`${field} ${errors.email ? fieldErr : ''}`}
          />
          {errorText('email')}
        </label>
        <label className={`${label} sm:col-span-2`}>
          {t('company')}
          <input name="company" autoComplete="organization" className={field} />
        </label>
        <label className={`${label} sm:col-span-2`}>
          {t('phone')}
          <input name="phone" type="tel" autoComplete="tel" className={field} />
        </label>
        <fieldset className="sm:col-span-2">
          <legend className={label}>{t('companySize')}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {COMPANY_SIZES.map((sz) => (
              <label key={sz} className={pill(size === sz)}>
                <input
                  type="radio"
                  name="companySize"
                  value={sz}
                  checked={size === sz}
                  onChange={() => setSize(sz)}
                  className="sr-only"
                />
                {t(`sizes.${sz}`)}
              </label>
            ))}
          </div>
        </fieldset>
        <label className={`${label} sm:col-span-2`}>
          {t('message')}
          <textarea
            {...fieldProps('message')}
            rows={5}
            placeholder={isStartup ? t('messagePlaceholderStartup') : t('messagePlaceholder')}
            className={`${field} resize-y ${errors.message ? fieldErr : ''}`}
          />
          {errorText('message')}
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
        <p role="alert" className="mt-5 rounded-xl bg-err-soft px-4 py-3 text-sm text-err">
          {status === 'invalid' ? t('invalid') : t('error')}
        </p>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-pretty text-[13px] leading-relaxed text-muted">
          {t('consent')}{' '}
          <Link href="/ochrana-osobnich-udaju" className="whitespace-nowrap underline underline-offset-2 hover:text-ink">
            Zásady ochrany osobních údajů
          </Link>
          .
        </p>
        <Button type="submit" size="lg" arrow disabled={pending} className="shrink-0">
          {pending ? t('sending') : t('submit')}
        </Button>
      </div>
    </form>
  );
}
