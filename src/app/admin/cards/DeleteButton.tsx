'use client';

import { ConfirmButton } from '../ConfirmButton';
import { deleteMember, resetScans } from './actions';

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
