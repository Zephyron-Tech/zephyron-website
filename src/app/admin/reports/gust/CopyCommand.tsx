'use client';

import { useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { copyText } from '@/lib/copy-text';
import { mono } from './mono';

// A shell command on the night ground with a copy button. When the browser
// refuses the clipboard, the command is selected for a manual copy.
export function CopyCommand({ command }: { command: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const code = useRef<HTMLElement>(null);

  async function copy() {
    if (await copyText(command)) {
      setState('copied');
      window.setTimeout(() => setState('idle'), 1800);
      return;
    }
    const el = code.current;
    if (el) {
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    setState('manual');
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 rounded-2xl bg-night py-2 pl-5 pr-2 text-white">
        <span className={`select-none ${mono} text-sm text-white/40`} aria-hidden>
          $
        </span>
        <code ref={code} className={`min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-2 ${mono} text-[14px] [scrollbar-width:none]`}>
          {command}
        </code>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition-colors duration-150 hover:bg-white/20"
        >
          {state === 'copied' ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
          <span aria-live="polite">{state === 'copied' ? 'Zkopírováno' : 'Kopírovat'}</span>
        </button>
      </div>
      {state === 'manual' && <p className="text-sm text-muted">Prohlížeč nepovolil schránku. Příkaz je označený, zkopírujte ho ručně.</p>}
    </div>
  );
}
