// Illustrative processes for the hero calculator. Minutes are typical values,
// not measurements; the card says so and offers to measure them for real.

export interface Process {
  id: string;
  label: string;
  /** The slider's question. */
  question: string;
  /** Unit for the slider, in the plural form the label reads with. */
  unit: (n: number) => string;
  min: number;
  max: number;
  step: number;
  initial: number;
  steps: { name: string; min: number }[];
  /** Minutes per unit once automated (the check that stays with a person). */
  auto: number;
  autoNote: string;
}

/** Czech plural: 1 objednávka, 2–4 objednávky, 5+ objednávek. */
const plural = (one: string, few: string, many: string) => (n: number) =>
  n === 1 ? one : n >= 2 && n <= 4 ? few : many;

export const processes: Process[] = [
  {
    id: 'faktura',
    label: 'Fakturace',
    question: 'Kolik objednávek měsíčně',
    unit: plural('objednávka', 'objednávky', 'objednávek'),
    min: 10,
    max: 400,
    step: 10,
    initial: 80,
    steps: [
      { name: 'Přepsat objednávku z e-mailu do tabulky', min: 12 },
      { name: 'Vystavit fakturu v účetnictví', min: 8 },
      { name: 'Poslat fakturu a potvrzení zákazníkovi', min: 5 },
      { name: 'Hlídat platbu, případně upomenout', min: 10 },
    ],
    auto: 2,
    autoNote: 'Objednávka se načte, faktura vystaví a odešle, platba se spáruje sama. Vy kontrolujete výjimky.',
  },
  {
    id: 'nabidka',
    label: 'Cenové nabídky',
    question: 'Kolik nabídek měsíčně',
    unit: plural('nabídka', 'nabídky', 'nabídek'),
    min: 5,
    max: 200,
    step: 5,
    initial: 40,
    steps: [
      { name: 'Dohledat ceny a dostupnost', min: 10 },
      { name: 'Spočítat nabídku v Excelu', min: 15 },
      { name: 'Sepsat PDF a poslat zákazníkovi', min: 10 },
    ],
    auto: 5,
    autoNote: 'Nabídka se poskládá z ceníku sama, vy ji projdete a jedním klikem odešlete.',
  },
  {
    id: 'mzdy',
    label: 'Docházka a mzdy',
    question: 'Kolik máte zaměstnanců',
    unit: plural('zaměstnanec', 'zaměstnanci', 'zaměstnanců'),
    min: 5,
    max: 250,
    step: 5,
    initial: 25,
    steps: [
      { name: 'Sesbírat výkazy a docházku', min: 6 },
      { name: 'Přepsat je do tabulky pro mzdy', min: 8 },
      { name: 'Zkontrolovat a dohledat chyby', min: 4 },
    ],
    auto: 1,
    autoNote: 'Docházka se sbírá průběžně a podklady pro mzdy jsou hotové na konci měsíce.',
  },
  {
    id: 'report',
    label: 'Reporty pro vedení',
    question: 'Kolik reportů měsíčně',
    unit: plural('report', 'reporty', 'reportů'),
    min: 1,
    max: 30,
    step: 1,
    initial: 4,
    steps: [
      { name: 'Stáhnout data ze tří systémů', min: 25 },
      { name: 'Poskládat je v Excelu', min: 30 },
      { name: 'Rozeslat vedení', min: 5 },
    ],
    auto: 0,
    autoNote: 'Report se spočítá a chodí sám, vždy s aktuálními čísly.',
  },
];
