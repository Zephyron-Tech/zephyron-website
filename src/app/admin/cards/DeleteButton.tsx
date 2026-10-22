'use client';

import { useRef } from 'react';

import { deleteMember, resetScans } from './actions';
import { btnDanger, btnSecondary } from './ui';

// A quiet text button that opens a confirmation dialog before a destructive
// server action runs.
function ConfirmButton({
  label,
  title,
  text,
  confirm,
  action,
  fields,
}: {
  label: string;
  title: string;
  text: string;
  confirm: string;
  action: (formData: FormData) => Promise<void>;
  fields: Record<string, string>;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="cursor-pointer text-sm font-medium text-ink-2 transition-colors hover:text-err"
      >
        {label}
      </button>
      <dialog
        ref={dialog}
        className="m-auto w-[min(420px,calc(100%-32px))] rounded-2xl bg-card p-6 text-ink backdrop:bg-ink/40"
      >
        <h2 className="text-xl text-ink">{title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{text}</p>
        <form action={action} className="mt-6 flex justify-end gap-2">
          {Object.entries(fields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          <button type="button" onClick={() => dialog.current?.close()} className={btnSecondary}>
            Zrušit
          </button>
          <button type="submit" className={btnDanger}>
            {confirm}
          </button>
        </form>
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
      action={resetScans}
      fields={id ? { id } : {}}
    />
  );
}
