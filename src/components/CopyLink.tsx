'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';
import { copyText } from '@/lib/copy-text';

interface CopyLinkProps {
  /** mailto: or tel: link. On touch a tel: link still dials; a mailto: copies. */
  href: string;
  /** Text copied to the clipboard. */
  value: string;
  children: React.ReactNode;
  /** Sweep colour: light on dark backgrounds, violet on paper. */
  tone?: 'dark' | 'light';
  className?: string;
}

// E-mail or phone link that copies its value and runs the same light sweep as
// <CopyEmail />. With a mouse both copy. On a phone a number still dials, but an
// address copies: a mailto there throws you into whichever mail app is default.
// While copied the link carries data-copied, so its contents can say so.
export function CopyLink({ href, value, children, tone = 'light', className = '' }: CopyLinkProps) {
  const [sweeping, setSweeping] = useState(false);
  const [copied, setCopied] = useState(false);

  async function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine && !href.startsWith('mailto:')) return;
    e.preventDefault();
    if (sweeping) return;
    // Never falls back to the mailto: if copying fails the address is still on screen to select.
    if (!(await copyText(value))) return;
    track('contact_copied', { kind: href.split(':')[0] });
    setSweeping(true);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  }

  return (
    <a
      href={href}
      onClick={onClick}
      title="Kliknutím zkopírujete"
      data-copied={copied || undefined}
      className={className}
    >
      <span className="relative inline-flex overflow-hidden">
        {children}
        {sweeping && (
          <span
            aria-hidden
            onAnimationEnd={() => setSweeping(false)}
            className={`animate-sweep pointer-events-none absolute inset-0 ${
              tone === 'dark'
                ? 'bg-[linear-gradient(90deg,transparent_5%,rgb(255_255_255/0.45)_50%,transparent_95%)]' // taste-skill-ignore: moving light sweep, not a resting fill
                : 'bg-[linear-gradient(90deg,transparent_5%,rgb(88_63_255/0.25)_50%,transparent_95%)]' // taste-skill-ignore: moving light sweep, not a resting fill
            }`}
          />
        )}
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Zkopírováno do schránky' : ''}
      </span>
    </a>
  );
}
