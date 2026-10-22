import { Check } from 'lucide-react';
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

        {/* Desktop table: quiet row and column rules make it read as a table; the
            Zephyron column is one accent band from header to last row. */}
        <div className="mt-10 sm:mt-14 hidden rounded-2xl bg-card p-2 md:block">
          <table className="w-full table-fixed border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th className={'w-[22%] border-b-2 border-line-strong p-5' /* taste-skill-ignore: table header rule */} />
                {columns.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={`p-5 align-bottom font-display text-lg font-semibold ${
                      i === 2 ? 'rounded-t-xl bg-accent text-white' : 'border-b-2 border-l border-b-line-strong border-l-line text-ink' // taste-skill-ignore: table header rule
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => {
                const last = ri === rows.length - 1;
                const rule = last ? '' : 'border-b border-line'; // taste-skill-ignore: table row rule
                return (
                  <tr key={r.label}>
                    <th
                      scope="row"
                      className={`${rule} rounded-l-lg p-5 text-sm font-medium text-ink`}
                    >
                      {r.label}
                    </th>
                    {r.values.map((v, i) => (
                      <td
                        key={i}
                        className={`p-5 text-[15px] ${
                          i === 2
                            ? `${last ? 'rounded-b-xl' : 'border-b border-accent-line'} bg-accent-soft font-medium text-ink` // taste-skill-ignore: table row rule
                            : `${rule} border-l border-line text-ink-2` // taste-skill-ignore: table column rule
                        }`}
                      >
                        {i === 2 ? (
                          <span className="flex gap-2.5">
                            <Check size={18} strokeWidth={2.25} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                            {v}
                          </span>
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile: one card per row, the point first. Zephyron's answer leads in
            the accent tint; the two alternatives follow, quieter, each label above
            its value so nothing breaks mid-phrase. */}
        <div className="mt-10 space-y-3 md:hidden">
          {rows.map((r) => (
            <div key={r.label} className="rounded-2xl bg-card p-5">
              <h3 className="font-display text-lg font-semibold text-ink">{r.label}</h3>
              <p className="mt-3 flex gap-2.5 rounded-xl bg-accent-soft px-3 py-2.5 text-[15px] font-medium text-ink">
                <Check size={18} strokeWidth={2.25} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="sr-only">Zephyron: </span>
                  {r.values[2]}
                </span>
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-3 px-1 text-sm">
                {columns.slice(0, 2).map((c, i) => (
                  <div key={c}>
                    <dt className="text-xs text-muted">{c}</dt>
                    <dd className="mt-0.5 text-ink-2">{r.values[i]}</dd>
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
