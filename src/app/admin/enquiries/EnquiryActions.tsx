'use client';

import { useState, useTransition } from 'react';
import { Check, Copy, Loader2 } from 'lucide-react';

import { copyText } from '@/lib/copy-text';
import { ConfirmButton } from '../ConfirmButton';
import { btnPrimary, btnSecondary } from '../ui';
import { deleteEnquiry, toggleHandled } from './actions';

export function EnquiryActions({
  id,
  name,
  email,
  replyHref,
  handled,
}: {
  id: string;
  name: string;
  email: string;
  replyHref: string;
  handled: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  function toggle() {
    const fd = new FormData();
    fd.set('id', id);
    startTransition(() => toggleHandled(fd));
  }

  async function copy() {
    if (await copyText(email)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={replyHref} className={btnPrimary}>
        Odpovědět
      </a>
      <button type="button" onClick={copy} className={btnSecondary}>
        {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
        <span aria-live="polite">{copied ? 'Zkopírováno' : 'Kopírovat e-mail'}</span>
      </button>
      <button type="button" onClick={toggle} disabled={pending} className={btnSecondary}>
        {pending && <Loader2 size={16} className="animate-spin" aria-hidden />}
        {handled ? 'Vrátit mezi nevyřízené' : 'Označit jako vyřízené'}
      </button>
      <span className="ml-auto">
        <ConfirmButton
          label="Smazat"
          title="Smazat poptávku?"
          text={`Poptávka od ${name} zmizí z administrace natrvalo. E-mail ve schránce hello@ zůstane.`}
          confirm="Smazat"
          pendingLabel="Mažu…"
          action={deleteEnquiry}
          fields={{ id }}
        />
      </span>
    </div>
  );
}
