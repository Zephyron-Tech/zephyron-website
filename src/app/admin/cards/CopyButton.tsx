'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// The NFC address with a copy button that says it worked, on touch as well as with a mouse.
export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the address is still selectable.
    }
  }

  return (
    <div className="mt-1 flex items-center gap-2 rounded-xl bg-paper py-1.5 pl-3 pr-1.5">
      <code className="min-w-0 flex-1 truncate font-sans text-sm text-ink select-all">{value}</code>
      <button
        type="button"
        onClick={copy}
        className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
          copied ? 'bg-ok text-white' : 'bg-card text-ink hover:bg-accent-soft'
        }`}
      >
        {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
        <span aria-live="polite">{copied ? 'Zkopírováno' : 'Kopírovat'}</span>
      </button>
    </div>
  );
}
