'use client';

import { useRef, useTransition } from 'react';

import { Loader2 } from 'lucide-react';

import { deleteMember, resetScans } from './actions';
import { btnDanger, btnSecondary } from './ui';

// A quiet text button that opens a confirmation dialog before a destructive
// server action runs.
function ConfirmButton({
  label,
  title,
  text,
  confirm,
  pendingLabel,
  action,
  fields,
}: {
  label: string;
  title: string;
  text: string;
  confirm: string;
  /** Shown on the confirm button while the server works. */
  pendingLabel: string;
  action: (formData: FormData) => Promise<void>;
  fields: Record<string, string>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();

  // The dialog stays open with a working button until the server is done, then
  // closes on its own; the page behind refreshes from the revalidated data.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await action(fd);
      dialog.current?.close();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="tap cursor-pointer text-sm font-medium text-ink-2 transition-colors hover:text-err"
      >
        {label}
      </button>
      <dialog
        ref={dialog}
        // No closing by Esc or backdrop while the action runs.
        onCancel={(e) => pending && e.preventDefault()}
        onClick={(e) => !pending && e.target === dialog.current && dialog.current.close()}
        className="m-auto w-[min(420px,calc(100%-32px))] rounded-2xl bg-card p-0 text-ink backdrop:bg-ink/40"
      >
        {/* Padding lives inside, so a click on the dialog itself means the backdrop. */}
        <div className="p-6">
          <h2 className="text-xl text-ink">{title}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{text}</p>
          <form onSubmit={onSubmit} aria-busy={pending} className="mt-6 flex justify-end gap-2">
            {Object.entries(fields).map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={v} />
            ))}
            <button type="button" disabled={pending} onClick={() => dialog.current?.close()} className={btnSecondary}>
              Zrušit
            </button>
            <button type="submit" disabled={pending} className={btnDanger}>
              {pending && <Loader2 size={16} className="animate-spin" aria-hidden />}
              {pending ? pendingLabel : confirm}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}

// Deleting a card also deletes its scan history, so it asks first.
export function DeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <ConfirmButton
      label="Smazat"
      title="Smazat vizitku?"
      text={`${name}: vizitka i celá historie skenů zmizí. QR kódy a NFC čipy pak povedou na prázdnou stránku.`}
      confirm="Smazat"
      pendingLabel="Mažu…"
      action={deleteMember}
      fields={{ id }}
    />
  );
}

// Test scans skew the numbers; this clears them, for one card or for all.
export function ResetScansButton({ id, name }: { id?: string; name?: string }) {
  return (
    <ConfirmButton
      label={id ? 'Vymazat skeny' : 'Vymazat všechny skeny'}
      title="Vymazat skeny?"
      text={
        id
          ? `Smaže se celá historie skenů vizitky ${name}. Vizitka sama zůstane.`
          : 'Smaže se historie skenů všech vizitek. Vizitky samy zůstanou.'
      }
      confirm="Vymazat"
      pendingLabel="Mažu skeny…"
      action={resetScans}
      fields={id ? { id } : {}}
    />
  );
}
