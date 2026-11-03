import Link from 'next/link';

import { ShareButton } from '../ShareButton';
import { type Report, reportDate } from './registry';

// The whole tile opens the report; the share button sits above that link.
export function ReportTile({ report: r }: { report: Report }) {
  const href = `/admin/reports/${r.slug}`;
  return (
    <div className="group relative flex h-full flex-col gap-2 rounded-2xl bg-card p-6 transition-colors duration-150 has-[a:hover]:bg-card/70">
      <div className="flex items-start justify-between gap-3">
        <span className="pt-1 text-xs text-muted">Ověřeno {reportDate(r.date)}</span>
        <div className="relative z-10 -mr-2 -mt-2">
          <ShareButton title={r.title} path={href} compact />
        </div>
      </div>
      <Link href={href} className="font-display text-lg font-semibold text-ink after:absolute after:inset-0 after:rounded-2xl group-has-[a:hover]:text-accent">
        {r.title}
      </Link>
      <span className="text-sm text-ink-2">{r.description}</span>
    </div>
  );
}
