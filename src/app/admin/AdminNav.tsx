'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/admin', label: 'Přehled' },
  { href: '/admin/enquiries', label: 'Poptávky' },
  { href: '/admin/cards', label: 'Vizitky' },
  { href: '/admin/reports', label: 'Podklady' },
];

const match = (href: string, path: string) => (href === '/admin' ? path === '/admin' : path.startsWith(href));

// The admin sections as one pill row; on phones it takes a line of its own and
// scrolls sideways. The white pill slides to the tab on click, before the server
// has answered, so switching feels immediate; it follows the real path after.
export function AdminNav() {
  const path = usePathname();
  const [pending, setPending] = useState<{ href: string; from: string } | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  // A click counts until the path it was made on changes.
  const current = pending && pending.from === path ? pending.href : (items.find((it) => match(it.href, path))?.href ?? null);

  useLayoutEffect(() => {
    const el = list.current?.querySelector<HTMLElement>(`[data-href="${current}"]`);
    setPill(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
  }, [current]);

  return (
    <nav aria-label="Administrace" className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:w-auto sm:px-0">
      <ul ref={list} className="relative flex w-max gap-1 rounded-full bg-paper-2 p-1">
        {pill && (
          <span
            aria-hidden
            className="absolute bottom-1 top-1 left-0 rounded-full bg-card transition-[transform,width] duration-300 ease-[var(--ease-out)] motion-reduce:transition-none"
            style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
          />
        )}
        {items.map((it) => {
          const active = it.href === current;
          return (
            <li key={it.href} data-href={it.href} className="relative">
              <Link
                href={it.href}
                onClick={() => setPending({ href: it.href, from: path })}
                aria-current={match(it.href, path) ? 'page' : undefined}
                className={`block rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 pointer-coarse:py-2.5 ${
                  active ? `text-ink ${pill ? '' : 'bg-card'}` : 'text-ink-2 hover:text-ink'
                }`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
