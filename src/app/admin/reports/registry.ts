// Internal reports kept in the admin. Each one is a folder under reports/ and
// an entry here, so the dashboard and the list pick it up.
export interface Report {
  slug: string;
  title: string;
  description: string;
  /** ISO date the figures were checked. */
  date: string;
}

export const reports: Report[] = [
  {
    slug: 'gust',
    title: 'Gust: náhrada Vercelu',
    description: 'Specifikace vlastní deploy platformy: ukázka na Macu a iPhonu, architektura, API, bezpečnost, design a milníky.',
    date: '2026-11-07',
  },
  {
    slug: 'vps',
    title: 'Výběr VPS po Hetzneru',
    description: 'Srovnání evropských VPS pro náš stack s 26 kontejnery: ceny, disk, síť a doporučení.',
    date: '2026-11-03',
  },
];

export const reportDate = (iso: string) =>
  new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(new Date(iso));
