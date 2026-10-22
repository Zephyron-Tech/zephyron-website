'use client';

import Link from 'next/link';

import { btnPrimary, btnSecondary } from './ui';

// A failed load or action in the cards admin: say so in Czech and offer a way on.
export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-lg rounded-2xl bg-card p-6">
      <h1 className="text-2xl text-ink">Něco se nepovedlo</h1>
      <p className="mt-2 text-ink-2">
        Akci se nepodařilo dokončit. Zkuste to znovu, a když to nepomůže, přihlaste se prosím znovu.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={reset} className={btnPrimary}>
          Zkusit znovu
        </button>
        <Link href="/admin/cards" className={btnSecondary}>
          Zpět na vizitky
        </Link>
      </div>
    </div>
  );
}
