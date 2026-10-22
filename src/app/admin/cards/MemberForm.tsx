'use client';

import { startTransition, useActionState } from 'react';

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

  // Submitting through onSubmit (not the form's action prop) keeps what was
  // typed in the fields when the server sends an error back; React resets a
  // form after an action-prop submit.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl bg-card p-6 sm:p-8">
      {member && <input type="hidden" name="id" value={member.id} />}

      <PhotoInput current={photoUrl} initials={initials} error={state.field === 'photo' ? state.error : undefined} />

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
                <div className="flex items-center">
                  <span className="mt-1.5 pr-1 text-[15px] font-normal text-muted">zephyron.tech/v/</span>
                  <input className={c} name="slug" defaultValue={member?.slug ?? ''} />
                </div>
              )}
            </Field>
            {member && (
              <>
                <Field name="mode" err={errFor('mode')} title="Režim">
                  {(c) => (
                    <select className={c} name="mode" defaultValue={member.mode}>
                      <option value="DEFAULT">Vizitka</option>
                      <option value="EVENT">Akce: přesměrovat na odkaz</option>
                    </select>
                  )}
                </Field>
                <Field name="redirectUrl" err={errFor('redirectUrl')} title="Odkaz pro režim akce">
                  {(c) => <input className={c} name="redirectUrl" defaultValue={member.redirectUrl ?? ''} placeholder="https://" />}
                </Field>
                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-ink sm:col-span-2">
                  <input type="checkbox" name="active" defaultChecked={member.active} className="size-4 accent-accent" />
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

      <div className="mt-8 flex justify-end">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? 'Ukládám…' : 'Uložit'}
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
