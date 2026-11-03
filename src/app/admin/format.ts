const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/** Czech plural: 1 poptávka, 2–4 poptávky, 5+ poptávek. */
export const plural = (n: number, one: string, few: string, many: string) =>
  n === 1 ? one : n >= 2 && n <= 4 ? few : many;

const dateFmt = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'Europe/Prague' });
const timeFmt = new Intl.DateTimeFormat('cs-CZ', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Prague' });

/** "před 5 min", "před 3 h", "včera 14:05", then the date. */
export function ago(d: Date, now = Date.now()) {
  const diff = now - d.getTime();
  if (diff < MIN) return 'právě teď';
  if (diff < HOUR) return `před ${Math.floor(diff / MIN)} min`;
  if (diff < 12 * HOUR) return `před ${Math.floor(diff / HOUR)} h`;
  if (diff < 2 * DAY) return `${dateFmt.format(d) === dateFmt.format(new Date(now)) ? 'dnes' : 'včera'} ${timeFmt.format(d)}`;
  return dateFmt.format(d);
}

export const dateTime = (d: Date) => `${dateFmt.format(d)} ${timeFmt.format(d)}`;

export { DAY };
