import Link from 'next/link';

import { type Report, reportDate } from './registry';

export function ReportTile({ report: r }: { report: Report }) {
  return (
    <Link href={`/admin/reports/${r.slug}`} className="group flex h-full flex-col gap-2 rounded-2xl bg-card p-6 transition-colors duration-150 hover:bg-card/70">
      <span className="text-xs text-muted">Ověřeno {reportDate(r.date)}</span>
      <span className="font-display text-lg font-semibold text-ink group-hover:text-accent">{r.title}</span>
      <span className="text-sm text-ink-2">{r.description}</span>
    </Link>
  );
}
