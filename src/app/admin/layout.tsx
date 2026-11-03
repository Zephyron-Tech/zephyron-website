import Image from 'next/image';
import Link from 'next/link';

import { AdminNav } from './AdminNav';

export const dynamic = 'force-dynamic';
export const metadata = { title: { default: 'Admin · Zephyron', template: '%s · Zephyron' }, robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-paper text-ink">
      <header className="bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/admin" className="-my-2 flex items-center gap-2.5 py-2 pointer-coarse:min-h-11">
            <Image src="/mark-256.png" alt="" width={256} height={196} className="h-6 w-auto" />
            <span className="font-display text-lg font-semibold tracking-tight">Admin</span>
          </Link>
          <a href="/" className="tap text-sm text-ink-2 hover:text-ink sm:order-last">
            zephyron.tech
          </a>
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">{children}</main>
    </div>
  );
}
