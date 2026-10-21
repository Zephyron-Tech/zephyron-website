import { SectionHeader } from '../ui/SectionHeader';

const columns = ['Krabicový software', 'Velký dodavatel', 'Zephyron'] as const;

const rows: { label: string; values: [string, string, string] }[] = [
  { label: 'Přizpůsobení', values: ['Vy se přizpůsobíte jemu', 'Na míru', 'Na míru, po částech'] },
  { label: 'Cena', values: ['Licence napořád', 'Často miliony', 'Po etapách, známá předem'] },
  { label: 'První výsledek', values: ['Hned, s kompromisy', 'Za měsíce', 'Za týdny'] },
  { label: 'S kým mluvíte', values: ['S helpdeskem', 'S account manažerem', 'S tím, kdo to staví'] },
  { label: 'Po spuštění', values: ['Čekáte na další verzi', 'Servisní fronta požadavků', 'Podpora a rozvoj od těch, kdo to postavili'] },
];

export function Comparison() {
  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeader
          title="Mezi krabicí a korporátem"
          lead="Firmy na cestě ke střední velikosti často volí mezi softwarem, který nesedí, a projektem, který si nemohou dovolit. Jsme ta třetí možnost."
        />

        {/* Desktop table */}
        <div className="mt-14 hidden overflow-hidden rounded-2xl md:block">
          <table className="w-full table-fixed text-left">
            <thead>
              <tr className="">
                <th className="w-[22%] bg-card p-5" />
                {columns.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={`p-5 font-display text-lg font-semibold ${
                      i === 2 ? 'bg-accent text-white' : 'bg-card text-ink'
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className="bg-card p-5 text-sm font-medium text-ink-2">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td
                      key={i}
                      className={`p-5 text-[15px] ${i === 2 ? 'bg-accent-soft font-medium text-ink' : 'bg-card text-ink-2'}`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: one block per row */}
        <div className="mt-10 space-y-3 md:hidden">
          {rows.map((r) => (
            <div key={r.label} className="bg-card p-5">
              <div className="text-sm font-medium text-ink-2">{r.label}</div>
              <dl className="mt-3 space-y-2 text-sm">
                {columns.map((c, i) => (
                  <div
                    key={c}
                    className={`flex justify-between gap-4 ${i === 2 ? '-mx-2 rounded-lg bg-accent-soft px-2 py-1.5 font-medium text-ink' : 'text-ink-2'}`}
                  >
                    <dt className={i === 2 ? 'text-accent' : 'text-muted'}>{c}</dt>
                    <dd className="text-right">{r.values[i]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
