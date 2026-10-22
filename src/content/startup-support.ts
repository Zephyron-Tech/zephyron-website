// Startup Support content, shared by the page and by /llms.txt.
import type { FaqItem } from './faq';

export const startupOffer = [
  {
    title: 'Technické vedení',
    text: 'Rozhodujeme o technologiích, architektuře a prioritách, jako by šlo o náš vlastní produkt.',
  },
  {
    title: 'První verze produktu',
    text: 'Navrhneme a postavíme nejmenší verzi, která ověří, jestli o produkt někdo stojí. Web, mobil, nebo obojí.',
  },
  {
    title: 'Provoz a infrastruktura',
    text: 'Servery, nasazování, zálohy a monitoring. Zakladatel se může věnovat zákazníkům, ne serverům.',
  },
  {
    title: 'Technika při jednání s partnery',
    text: 'Technická část prezentace, odhad nákladů a odpovědi na otázky k technologii od investorů, grantových výzev nebo inkubátorů.',
  },
];

export const startupCriteria = [
  'Řeší konkrétní problém, který lidé opravdu mají.',
  'Zakladatel zná obor a má přístup k prvním uživatelům.',
  'První verze se dá postavit v řádu týdnů, ne let.',
  'Existuje cesta k financování: granty, inkubátory, investoři nebo první platící zákazníci.',
  'Projekt má smysl i mimo tabulku s čísly.',
];

export const startupSteps = [
  {
    title: 'Seznámení',
    text: 'Zakladatel nám představí problém, zákazníka a kde projekt právě je.',
  },
  {
    title: 'Společné ověření',
    text: 'Projdeme trh, rozsah první verze a technická rizika. Obě strany zjistí, jestli si sedí.',
  },
  {
    title: 'Dohoda',
    text: 'Role, rozsah a pravidla spolupráce sepíšeme předem, aby bylo jasno od prvního dne.',
  },
  {
    title: 'Stavba a spuštění',
    text: 'Postavíme první verzi, spustíme ji a dál rozvíjíme podle toho, co říkají uživatelé.',
  },
];

export const startupFaq: FaqItem[] = [
  {
    q: 'Proč Startup Support děláte?',
    a: 'Baví nás stavět produkty od nuly. A dobrý nápad by neměl skončit jen proto, že jeho autor neprogramuje. Projekty si proto vybíráme pečlivě a věnujeme se jim dlouhodobě.',
  },
  {
    q: 'Jak spolupráce funguje po finanční stránce?',
    a: 'Každý projekt je v jiné fázi a má jiné možnosti. Podmínky proto skládáme individuálně podle rozsahu práce a toho, co do projektu přináší každá strana. Jsme v tom flexibilní a vše sepíšeme dřív, než začneme stavět.',
  },
  {
    q: 'Co když projekt nevyjde?',
    a: 'S tím počítáme. Riziko neseme společně se zakladatelem, a proto do projektů jdeme až po společném ověření.',
  },
  {
    q: 'Kolik projektů najednou děláte?',
    a: 'Jen pár. Každému chceme věnovat plnou pozornost, ne zbytek kapacity mezi zakázkami.',
  },
];
