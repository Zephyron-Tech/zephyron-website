'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { Check } from 'lucide-react';

import { saveMember, type SaveState } from './actions';
import { PhotoInput } from './PhotoInput';
import { btnPrimary, field, fieldErr, label } from './ui';

interface Props {
  isAdmin: boolean;
  member?: {
    id: string;
    slug: string;
    name: string;
    titles: string | null;
    role: string;
    phone: string | null;
    email: string;
    linkedinUrl: string | null;
    bookingUrl: string | null;
    mode: 'DEFAULT' | 'EVENT';
    redirectUrl: string | null;
    active: boolean;
  };
  photoUrl?: string | null;
  initials?: string;
}

export default function MemberForm({ member, isAdmin, photoUrl = null, initials = '' }: Props) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveMember, {});

  const errFor = (name: string) => (state.field === name ? state.error : undefined);

  // Until React has hydrated, a submit would fall back to a plain GET and put
  // the fields in the URL; the button stays disabled until then.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  // "Uloženo" shows for a few seconds after each successful save, then goes.
  const [savedShown, setSavedShown] = useState(false);
  useEffect(() => {
    if (!state.savedAt) return;
    setSavedShown(true);
    const t = window.setTimeout(() => setSavedShown(false), 3000);
    return () => window.clearTimeout(t);
  }, [state.savedAt]);

  // Submitting through onSubmit (not the form's action prop) keeps what was
  // typed in the fields when the server sends an error back; React resets a
  // form after an action-prop submit.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  }

  return (
    <form onSubmit={onSubmit} method="post" noValidate className="min-w-0 rounded-2xl bg-card p-5 sm:p-8">
      {member && <input type="hidden" name="id" value={member.id} />}

      {/* Keyed on the saved photo, so after a save it shows the stored one and stops re-sending the upload. */}
      <PhotoInput key={photoUrl ?? 'none'} current={photoUrl} initials={initials} error={state.field === 'photo' ? state.error : undefined} />

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field name="titles" err={errFor('titles')} title="Tituly" hint="Před jménem, např. Ing.">
          {(c) => <input className={c} name="titles" defaultValue={member?.titles ?? ''} />}
        </Field>
        <Field name="name" err={errFor('name')} title="Jméno a příjmení">
          {(c) => <input className={c} name="name" defaultValue={member?.name} autoComplete="off" />}
        </Field>
        <Field name="role" err={errFor('role')} title="Role" wide>
          {(c) => <input className={c} name="role" defaultValue={member?.role} placeholder="Co-Founder & Tech Lead" />}
        </Field>
        <Field name="phone" err={errFor('phone')} title="Telefon">
          {(c) => <input className={c} name="phone" type="tel" defaultValue={member?.phone ?? ''} />}
        </Field>
        {isAdmin ? (
          <Field name="email" err={errFor('email')} title="E-mail" hint="Podle něj se člen přihlašuje.">
            {(c) => <input className={c} name="email" type="email" defaultValue={member?.email} />}
          </Field>
        ) : (
          <div className={label}>
            E-mail
            <p className="mt-1.5 py-2.5 text-[15px] font-normal text-ink-2">{member?.email}</p>
          </div>
        )}
        <Field name="linkedinUrl" err={errFor('linkedinUrl')} title="LinkedIn" wide>
          {(c) => (
            <input
              className={c}
              name="linkedinUrl"
              defaultValue={member?.linkedinUrl ?? ''}
              placeholder="https://www.linkedin.com/in/…"
            />
          )}
        </Field>
        <Field name="bookingUrl" err={errFor('bookingUrl')} title="Odkaz na rezervaci schůzky" hint="Cal.com nebo Calendly, nepovinné." wide>
          {(c) => <input className={c} name="bookingUrl" defaultValue={member?.bookingUrl ?? ''} placeholder="https://cal.com/…" />}
        </Field>

        {isAdmin && (
          <>
            <Field name="slug" err={errFor('slug')} title="Adresa vizitky" hint={member ? undefined : 'Prázdné = vytvoří se ze jména.'} wide>
              {(c) => (
                <div className="flex flex-wrap items-center sm:flex-nowrap">
                  <span className="mt-1.5 w-full pr-1 text-[15px] font-normal text-muted sm:w-auto">zephyron.tech/v/</span>
                  <input className={c} name="slug" defaultValue={member?.slug ?? ''} />
                </div>
              )}
            </Field>
            {member && (
              <>
                {/* Two options read faster as a pair of pills than as a dropdown. */}
                <fieldset>
                  <legend className={label}>Režim</legend>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {[
                      ['DEFAULT', 'Vizitka'],
                      ['EVENT', 'Akce: přesměrovat'],
                    ].map(([value, text]) => (
                      <label
                        key={value}
                        className="cursor-pointer rounded-full bg-paper px-4 py-2.5 text-sm text-ink-2 transition-colors duration-150 hover:bg-accent-soft hover:text-ink has-[:checked]:bg-accent has-[:checked]:font-medium has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
                      >
                        <input
                          type="radio"
                          name="mode"
                          value={value}
                          defaultChecked={member.mode === value}
                          className="sr-only"
                        />
                        {text}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <Field name="redirectUrl" err={errFor('redirectUrl')} title="Odkaz pro režim akce">
                  {(c) => <input className={c} name="redirectUrl" defaultValue={member.redirectUrl ?? ''} placeholder="https://" />}
                </Field>
                <label className="group flex cursor-pointer items-center gap-3 text-sm font-medium text-ink sm:col-span-2">
                  <input type="checkbox" name="active" defaultChecked={member.active} className="peer sr-only" />
                  {/* A switch in the site's colours instead of the system checkbox. */}
                  <span
                    aria-hidden
                    className="relative h-6 w-10 shrink-0 rounded-full bg-paper-2 transition-colors duration-200 peer-checked:bg-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-card after:transition-transform after:duration-200 after:ease-[var(--ease-out)] peer-checked:after:translate-x-4"
                  />
                  Vizitka je aktivní
                </label>
              </>
            )}
          </>
        )}
      </div>

      {state.error && !state.field && (
        <p role="alert" className="mt-6 rounded-xl bg-err-soft px-4 py-3 text-sm text-err">
          {state.error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-end gap-4">
        <span
          role="status"
          className={`inline-flex items-center gap-1.5 text-sm font-medium text-ok transition-opacity duration-300 ${
            savedShown && !pending ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Check size={16} aria-hidden />
          {savedShown ? 'Uloženo' : ''}
        </span>
        <button type="submit" disabled={pending || !ready} className={btnPrimary}>
          {pending ? 'Ukládám…' : member ? 'Uložit změny' : 'Vytvořit vizitku'}
        </button>
      </div>
    </form>
  );
}

function Field({
  title,
  hint,
  err,
  children,
  wide,
}: {
  name: string;
  title: string;
  hint?: string;
  err?: string;
  children: (cls: string) => React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`${label} ${wide ? 'sm:col-span-2' : ''}`}>
      {title}
      {children(`${field} ${err ? fieldErr : ''}`)}
      {err ? (
        <span className="mt-1.5 block text-[13px] font-normal text-err">{err}</span>
      ) : (
        hint && <span className="mt-1.5 block text-[13px] font-normal text-muted">{hint}</span>
      )}
    </label>
  );
}
