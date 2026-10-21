import { Link } from '@/navigation';
import { SectionHeader } from '../ui/SectionHeader';
import { PrintObject } from '../PrintObject';

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
    <section className="section-y">
      <div className="container-page">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <SectionHeader
            title="Kde rostoucí firmy ztrácejí čas"
            lead="Když firma roste, přibývají lidé, zakázky i pobočky. A to, co fungovalo na začátku, najednou brzdí."
          />
          <PrintObject
            name="macintosh"
            sizes="(min-width: 1024px) 260px, 200px"
            className="-mb-6 h-64 w-auto justify-self-end lg:h-[380px]"
          />
        </div>
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pains.map((p) => (
            <div key={p.title} className="rounded-2xl bg-card p-7">
              <h3 className="text-xl text-ink">{p.title}</h3>
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
