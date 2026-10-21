import { SectionHeader } from './ui/SectionHeader';

const steps = [
  {
    title: 'Úvodní hovor',
    text: 'Zdarma a nezávazně. Řeknete, co vás zdržuje. My řekneme, jestli a jak umíme pomoct.',
  },
  {
    title: 'Analýza a návrh',
    text: 'Zadání s vámi projdeme do detailu, včetně lidí, kteří proces dělají. Dostanete návrh řešení, cenu a termín první etapy.',
  },
  {
    title: 'Dodávka po etapách',
    text: 'Nejdřív to, co ušetří nejvíc času. Hotové části používáte hned, nečekáte na konec projektu.',
  },
  {
    title: 'Provoz a rozvoj',
    text: 'Po spuštění nezmizíme. Hlídáme provoz, opravujeme, aktualizujeme a rozšiřujeme, jak firma roste.',
  },
];

export function Process({ num }: { num?: number }) {
  return (
    <section className="section-y bg-paper-2">
      <div className="container-page">
        <SectionHeader
          num={num}
          eyebrow="Jak spolupráce probíhá"
          title="Žádný rok ticha a pak velké odhalení"
          lead="Projekt rozdělíme na menší části s vlastní cenou a termínem. Kdykoliv víte, kde jsme a co vás to bude stát."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="bg-paper p-7">
              <div className="font-display text-5xl font-semibold tracking-tight text-accent/40">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="mt-6 text-xl text-ink">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
