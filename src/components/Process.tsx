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

export function Process() {
  return (
    <section className="section-y bg-paper-2">
      <div className="container-page">
        <SectionHeader
          title="Žádný rok ticha a pak velké odhalení"
          lead="Projekt rozdělíme na menší části s vlastní cenou a termínem. Kdykoliv víte, kde jsme a co vás to bude stát."
        />
        <ol className="mt-10 sm:mt-14 grid gap-x-8 gap-y-8 sm:gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title}>
              {/* The bar grows step by step: order shown by length, not by numbers. */}
              <div aria-hidden className="h-1.5 rounded-full bg-accent" style={{ width: `${(i + 1) * 25}%` }} />
              <h3 className="mt-6 text-xl text-ink">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
