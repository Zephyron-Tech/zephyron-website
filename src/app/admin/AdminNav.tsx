'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/admin', label: 'Přehled' },
  { href: '/admin/enquiries', label: 'Poptávky' },
  { href: '/admin/cards', label: 'Vizitky' },
  { href: '/admin/reports', label: 'Přehledy' },
];

// The admin sections as one pill row; on phones it takes a line of its own and scrolls sideways.
export function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Administrace" className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:w-auto sm:px-0">
      <ul className="flex w-max gap-1 rounded-full bg-paper-2 p-1">
        {items.map((it) => {
          const active = it.href === '/admin' ? path === '/admin' : path.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={active ? 'page' : undefined}
                className={`block rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 pointer-coarse:py-2.5 ${
                  active ? 'bg-card text-ink' : 'text-ink-2 hover:text-ink'
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
