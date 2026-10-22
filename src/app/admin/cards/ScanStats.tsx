// Scans over the last 30 days: two headline counts, one bar per day, and the
// split by device. Rendered on the server from rows already fetched by the page.

const DAY = 24 * 60 * 60 * 1000;

const deviceLabel: Record<string, string> = {
  ios: 'iPhone a iPad',
  android: 'Android',
  desktop: 'Počítač',
  other: 'Jiné',
};

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

export function ScanStats({
  scans,
  total,
  reset,
}: {
  scans: { scannedAt: Date; device: string }[];
  total: number;
  /** Admin-only control to clear the history. */
  reset?: React.ReactNode;
}) {
  const now = Date.now();
  const last7 = scans.filter((s) => now - s.scannedAt.getTime() < 7 * DAY).length;

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now - (29 - i) * DAY);
    return { key: dayKey(d), date: d, count: 0 };
  });
  const byKey = new Map(days.map((d) => [d.key, d]));
  for (const s of scans) {
    const day = byKey.get(dayKey(s.scannedAt));
    if (day) day.count++;
  }
  const max = Math.max(1, ...days.map((d) => d.count));

  const devices = Object.entries(
    scans.reduce<Record<string, number>>((acc, s) => ({ ...acc, [s.device]: (acc[s.device] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]);

  const fmt = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric' });

  return (
    <section className="rounded-2xl bg-card p-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="text-xl text-ink">Skeny</h2>
          {reset && <div className="mt-1">{reset}</div>}
        </div>
        <dl className="flex gap-8">
          {[
            ['Za 7 dní', last7],
            ['Za 30 dní', scans.length],
            ['Celkem', total],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-muted">{k}</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6">
        <div className="flex h-28 items-end gap-[3px]" role="img" aria-label={`Skeny po dnech za posledních 30 dní, nejvíc ${max} za den.`}>
          {days.map((d) => (
            <div key={d.key} className="group relative flex h-full flex-1 items-end">
              <div
                className={`w-full rounded-t-[3px] ${d.count ? 'bg-accent' : 'bg-paper'}`}
                style={{ height: d.count ? `${Math.max(8, (d.count / max) * 100)}%` : '4px' }}
              />
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-white group-hover:block">
                {fmt.format(d.date)}: {d.count}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{fmt.format(days[0].date)}</span>
          <span>dnes</span>
        </div>
      </div>

      {devices.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {devices.map(([device, count]) => (
            <li key={device} className="rounded-full bg-paper px-3 py-1 text-[13px] text-ink-2">
              {deviceLabel[device] ?? device} <span className="font-medium tabular-nums text-ink">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
