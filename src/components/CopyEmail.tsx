'use client';

import { useEffect, useRef, useState } from 'react';
import { ClipboardCheck, ClipboardCopy } from 'lucide-react';
import { track } from '@vercel/analytics';
import { SITE } from '@/content/site';

interface CopyEmailProps {
  /** `accent` for the violet CTA band, `light` for paper backgrounds. */
  tone?: 'accent' | 'light';
  className?: string;
}

// Big e-mail address that copies itself on click: a light sweep runs across
// the text and the clipboard icon swaps to a check for a moment.
export function CopyEmail({ tone = 'light', className = '' }: CopyEmailProps) {
  const [sweeping, setSweeping] = useState(false);
  const [icon, setIcon] = useState<'idle' | 'out' | 'checked'>('idle');
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  async function copy() {
    if (sweeping) return;
    try {
      await navigator.clipboard.writeText(SITE.email);
    } catch {
      // Clipboard unavailable (e.g. insecure context): the address stays selectable.
    }
    track('email_copied');
    setSweeping(true);
    setIcon('out');
    timers.current.push(
      window.setTimeout(() => setIcon('checked'), 160),
      window.setTimeout(() => setIcon('out'), 2400),
      window.setTimeout(() => setIcon('idle'), 2560),
    );
  }

  const onAccent = tone === 'accent';
  const Icon = icon === 'checked' ? ClipboardCheck : ClipboardCopy;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={copy}
        className={`group inline-flex max-w-full items-center gap-3 text-left font-display text-[clamp(22px,3vw,34px)] font-semibold tracking-tight transition-colors duration-200 ${
          onAccent
            ? 'text-white'
            : 'text-ink hover:text-accent'
        }`}
      >
        <span
          className={`relative inline-flex overflow-hidden break-all pb-3 underline decoration-[1.5px] underline-offset-[10px] transition-[text-decoration-color] duration-200 ${
            onAccent ? 'decoration-white/40 group-hover:decoration-white' : 'decoration-line-strong group-hover:decoration-accent'
          }`}
        >
          {SITE.email}
          {sweeping && (
            <span
              aria-hidden
              onAnimationEnd={() => setSweeping(false)}
              className={`animate-sweep pointer-events-none absolute inset-0 ${
                onAccent
                  ? 'bg-[linear-gradient(90deg,transparent_5%,rgb(255_255_255/0.45)_50%,transparent_95%)]' // taste-skill-ignore: moving light sweep, not a resting fill
                  : 'bg-[linear-gradient(90deg,transparent_5%,rgb(88_63_255/0.25)_50%,transparent_95%)]' // taste-skill-ignore: moving light sweep, not a resting fill
              }`}
            />
          )}
        </span>
        <span
          aria-hidden
          className={`inline-flex shrink-0 transition-[transform,opacity] duration-150 ease-out ${
            icon === 'out' ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          <Icon size={24} strokeWidth={1.6} />
        </span>
      </button>
      <p aria-live="polite" className={`mt-2.5 text-[13px] ${onAccent ? 'text-white/65' : 'text-muted'}`}>
        {icon === 'checked' ? 'Zkopírováno do schránky' : 'Kliknutím zkopírujete e-mail'}
      </p>
    </div>
  );
}
