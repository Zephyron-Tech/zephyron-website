'use client';

import { useId, useRef, useState } from 'react';
import { Check, Share2 } from 'lucide-react';

import { copyText } from '@/lib/copy-text';
import { btnSecondary } from './ui';

// Phones get the system share sheet; desktops copy the link. When the browser
// refuses the clipboard, the link is shown selected so it can be copied by hand.
// The page stays behind the admin login: whoever opens it needs an admin account.
export function ShareButton({ title, path, compact }: { title: string; /** Defaults to the current page. */ path?: string; compact?: boolean }) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const [url, setUrl] = useState('');
  const field = useRef<HTMLInputElement>(null);
  const fieldId = useId();

  async function share() {
    const href = path ? new URL(path, window.location.origin).href : window.location.href;
    setUrl(href);
    if (navigator.share && matchMedia('(pointer: coarse)').matches) {
      try {
        await navigator.share({ title, url: href });
        return;
      } catch (e) {
        if ((e as DOMException).name === 'AbortError') return;
      }
    }
    if (await copyText(href)) {
      setState('copied');
      window.setTimeout(() => setState('idle'), 2000);
    } else {
      setState('manual');
      requestAnimationFrame(() => field.current?.focus());
    }
  }

  return (
    <div className="relative">
      {compact ? (
        <button
          type="button"
          onClick={share}
          aria-label={state === 'copied' ? 'Odkaz zkopírován' : `Sdílet: ${title}`}
          title={state === 'copied' ? 'Odkaz zkopírován' : 'Sdílet'}
          className={`grid size-9 cursor-pointer place-items-center rounded-full transition-colors duration-150 pointer-coarse:size-11 ${
            state === 'copied' ? 'bg-ok text-white' : 'bg-paper text-ink-2 hover:bg-accent-soft hover:text-accent'
          }`}
        >
          {state === 'copied' ? <Check size={16} aria-hidden /> : <Share2 size={16} aria-hidden />}
        </button>
      ) : (
        <button type="button" onClick={share} className={btnSecondary}>
          {state === 'copied' ? <Check size={16} aria-hidden /> : <Share2 size={16} aria-hidden />}
          <span aria-live="polite">{state === 'copied' ? 'Odkaz zkopírován' : 'Sdílet'}</span>
        </button>
      )}
      {state === 'manual' && (
        <div data-ui className="absolute right-0 top-full z-10 mt-2 w-[min(360px,calc(100vw-32px))] rounded-2xl bg-card p-4 shadow-[0_12px_40px_-12px_rgb(17_19_30/0.25)]">
          <label htmlFor={fieldId} className="text-sm text-ink-2">
            Zkopírujte odkaz
          </label>
          <input
            id={fieldId}
            ref={field}
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={() => setState('idle')}
            className="mt-1.5 w-full rounded-xl bg-paper px-3 py-2 text-[16px] text-ink focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
