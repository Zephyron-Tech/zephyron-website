import { Link } from '@/navigation';
import { SectionHeader } from '../ui/SectionHeader';
import { PrintObject } from '../PrintObject';
import { PainCarousel } from './PainCarousel';

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
        <div className="grid grid-cols-[1fr_auto] items-end gap-4 sm:gap-10">
          <SectionHeader
            title="Kde rostoucí firmy ztrácejí čas"
            lead="Když firma roste, přibývají lidé, zakázky i pobočky. A to, co fungovalo na začátku, najednou brzdí."
          />
          <PrintObject
            name="macintosh"
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 160px, 70px"
            className="-mb-2 h-24 w-auto justify-self-end sm:-mb-4 sm:h-44 md:h-56 lg:h-[300px]"
          />
        </div>
        <div className="mt-10 sm:mt-14">
          <PainCarousel pains={pains} label="Kde firmy ztrácejí čas" />
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
