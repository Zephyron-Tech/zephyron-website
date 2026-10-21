import { Link } from '@/navigation';
import { SectionHeader } from '../ui/SectionHeader';

const pains = [
  {
    title: 'Stejná data zadáváte dvakrát',
    text: 'Objednávka v e-mailu, pak v tabulce, pak v účetnictví. Každé přepsání je šance na chybu.',
  },
  {
    title: 'Každý má svou tabulku',
    text: 'Která verze platí, ví jen ten, kdo ji naposledy upravoval.',
  },
  {
    title: 'Krabice umí jen půlku',
    text: 'Hotový systém nepokryje, jak pracujete vy. Zbytek se řeší bokem.',
  },
  {
    title: 'Přehled je jen v jedné hlavě',
    text: 'Kdo na čem dělá a co hoří, ví jeden člověk. Jeho dovolená je pro firmu riziko.',
  },
  {
    title: 'IT dělá ten, kdo zrovna může',
    text: 'Účty, zálohy a hesla řeší kolega, který tomu trochu rozumí. Vedle své práce.',
  },
  {
    title: 'Velký dodavatel chce milion',
    text: 'A rok času. Za systém, ze kterého využijete pětinu.',
  },
];

export function PainPoints() {
  return (
    <section className="section-y border-t border-line">
      <div className="container-page">
        <SectionHeader
          num={1}
          eyebrow="Poznáváte se?"
          title="Kde rostoucí firmy ztrácejí čas"
          lead="Když firma roste, přibývají lidé, zakázky i pobočky. A to, co fungovalo na začátku, najednou brzdí."
        />
        <div className="mt-14 grid overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3 gap-px">
          {pains.map((p, i) => (
            <div key={p.title} className="bg-card p-7">
              <div className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="mt-4 text-xl text-ink">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-ink-2">
          Trápí vás něco jiného?{' '}
          <Link href="/kontakt" className="font-medium text-accent underline-offset-4 hover:underline">
            Popište nám to
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
