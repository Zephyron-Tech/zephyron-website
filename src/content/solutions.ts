import type { PrintArtKey } from './print-art';

// Řešení: jedna stránka na jeden konkrétní problém majitele firmy.
// Služby říkají, co děláme; řešení říkají, co se u vás změní. Titulek je
// výsledek pro majitele, metaTitle je to, co lidé hledají. Žádná vymyšlená
// čísla ani klienti.

export interface Solution {
  slug: string;
  /** The service this solution belongs to (services.ts slug). */
  service: string;
  /** Short name for links, tiles and breadcrumbs. */
  name: string;
  /** H1: the outcome for the owner, in their words. */
  title: string;
  /** Search title, up to ~45 chars; the layout appends " | Zephyron Tech". */
  metaTitle: string;
  /** 140–160 chars. */
  metaDescription: string;
  /** One line for tiles. */
  short: string;
  lead: string;
  /**
   * The question people ask and a self-contained answer (40–70 words) right
   * under the hero; search snippets and AI answers quote it on its own.
   */
  answer: { q: string; a: string };
  art: PrintArtKey;
  /** How it works today, as the owner would describe it. */
  today: string[];
  /** The same points once the system runs. */
  withSystem: string[];
  capabilities: { title: string; text: string }[];
  faq: { q: string; a: string }[];
  relatedCases?: string[];
  relatedTerms?: string[];
  /** Last content change (ISO date), shown on the page and in the sitemap. */
  updated: string;
}

const UPDATED = '2026-11-05';

export const solutions: Solution[] = [
  {
    slug: 'evidence-zakazek',
    service: 'interni-systemy',
    name: 'Evidence zakázek',
    title: 'Stav každé zakázky vidíte bez jediného telefonátu.',
    metaTitle: 'Evidence zakázek na míru',
    metaDescription:
      'Systém pro evidenci zakázek od poptávky po fakturu: kdo na čem pracuje, co se zpožďuje a co se má fakturovat. Postavený podle toho, jak pracujete vy.',
    short: 'Od poptávky po fakturu na jednom místě, s přehledem, kdo na čem pracuje.',
    lead: 'Zakázky dnes žijí v tabulkách, e-mailech a v hlavách lidí. Postavíme systém, ve kterém je každá zakázka od poptávky po fakturu na jednom místě a stav vidí každý, kdo ho potřebuje.',
    answer: {
      q: 'Co je evidence zakázek na míru?',
      a: 'Evidence zakázek na míru je interní systém, ve kterém má každá zakázka jedno místo od poptávky po fakturu: stav, odpovědného člověka, termíny, dokumenty a historii změn. Na rozdíl od tabulky ji upravuje více lidí najednou bez přepisování a na rozdíl od krabicového programu kopíruje postup, jakým zakázky ve vaší firmě skutečně probíhají.',
    },
    art: 'macintosh',
    today: [
      'Stav zakázky zjišťujete telefonem nebo na chodbě.',
      'Každé oddělení má vlastní tabulku a čísla se nepotkávají.',
      'Na fakturaci hotové práce se občas zapomene.',
      'Když chybí jeden člověk, nikdo neví, co měl rozdělané.',
    ],
    withSystem: [
      'Stav každé zakázky je vidět na jedné obrazovce.',
      'Údaje se zadávají jednou a platí pro všechny.',
      'Hotová zakázka sama připomene, že se má fakturovat.',
      'Historie, dokumenty a poznámky zůstávají u zakázky, ne v něčí hlavě.',
    ],
    capabilities: [
      {
        title: 'Zakázka od poptávky po fakturu',
        text: 'Každá fáze má svůj stav a odpovědného člověka. Postup si nastavíme podle vašeho provozu, ne podle šablony.',
      },
      {
        title: 'Přehled pro vedení',
        text: 'Co se zpožďuje, co čeká na materiál a co je hotové k fakturaci. Bez skládání reportu z tabulek.',
      },
      {
        title: 'Dokumenty u zakázky',
        text: 'Nabídky, výkresy, fotky a protokoly na jednom místě. Ke každé změně je vidět, kdo ji udělal a kdy.',
      },
      {
        title: 'Napojení na účetnictví',
        text: 'Hotová zakázka se propíše do účetního programu, takže fakturu nikdo nepřepisuje ručně.',
      },
    ],
    faq: [
      {
        q: 'Proč ne hotový program na evidenci zakázek?',
        a: 'Pokud existuje hotový nástroj, který vám sedí, doporučíme ho. Systém na míru dává smysl, když vaše zakázky mají vlastní postup, který krabicový program neumí, nebo když platíte za moduly, které nepoužíváte.',
      },
      {
        q: 'Můžeme začít jen s částí?',
        a: 'Ano, a doporučujeme to. Obvykle začínáme přehledem zakázek a stavů. Fakturace, sklad nebo klientský portál přicházejí v dalších etapách.',
      },
      {
        q: 'Co se stane s daty z našich tabulek?',
        a: 'Převedeme je. Před spuštěním je projdeme s vámi, aby nová evidence začínala s daty, kterým věříte.',
      },
    ],
    relatedTerms: ['interni-system', 'erp', 'integrace-systemu'],
    updated: UPDATED,
  },
  {
    slug: 'planovani-kapacit',
    service: 'interni-systemy',
    name: 'Plánování kapacit a směn',
    title: 'Víte, kdo má volno, dřív než slíbíte termín.',
    metaTitle: 'Plánování kapacit a směn na míru',
    metaDescription:
      'Systém pro plánování kapacit, směn a lidí na zakázky. Uvidíte vytížení dopředu, termíny slibujete podle reality a změny se propíšou všem najednou.',
    short: 'Vytížení lidí a strojů dopředu, termíny podle reality, ne podle odhadu.',
    lead: 'Plán v tabulce funguje, dokud se nic nezmění. Postavíme plánování, ve kterém vidíte vytížení lidí a strojů dopředu a změna se propíše všem, kterých se týká.',
    answer: {
      q: 'Jak funguje plánování kapacit na míru?',
      a: 'Plánování kapacit na míru je systém, který ukazuje vytížení lidí, strojů nebo vozidel dopředu a počítá ho ze skutečných směn, nepřítomností a zakázek. Plánovač v něm přiřazuje práci, systém hlídá kolize a přetížení a při změně upozorní všechny, kterých se týká. Termín zákazníkovi tak slibujete podle volné kapacity, ne odhadem.',
    },
    art: 'hourglass',
    today: [
      'Plán žije v tabulce, kterou umí upravovat jeden člověk.',
      'Termín zákazníkovi slibujete odhadem.',
      'Změna směny se šíří telefonem a SMS.',
      'Až v pátek se ukáže, že někdo byl naplánovaný dvakrát.',
    ],
    withSystem: [
      'Plán upravuje víc lidí a nikdo si ho nepřepíše.',
      'Volnou kapacitu vidíte dřív, než slíbíte termín.',
      'Změna se propíše a dotčení lidé dostanou upozornění.',
      'Systém upozorní na kolize a přetížení předem.',
    ],
    capabilities: [
      {
        title: 'Plán lidí, strojů i vozidel',
        text: 'Kalendář po dnech nebo týdnech, podle toho, jak plánujete. Kapacity se počítají ze skutečných směn a nepřítomností.',
      },
      {
        title: 'Zakázky přímo do plánu',
        text: 'Zakázka z evidence se přetáhne do plánu. Kdo na ní dělá a kdy, je vidět u zakázky i v kalendáři.',
      },
      {
        title: 'Upozornění na změny',
        text: 'Při změně dostanou dotčení lidé upozornění e-mailem nebo v mobilu. Nikdo nejede na místo, kde už se nepracuje.',
      },
      {
        title: 'Plán v mobilu',
        text: 'Technici a pracovníci v terénu vidí svůj plán v telefonu, včetně adresy a poznámek k zakázce.',
      },
    ],
    faq: [
      {
        q: 'Zvládne to naše specifické směny a pravidla?',
        a: 'Pravidla plánování nastavíme podle vás: typy směn, kvalifikace, přestávky, střídání. Právě v nich se plánování na míru liší od obecných kalendářů.',
      },
      {
        q: 'Musí se plánovač učit nový program?',
        a: 'Obrazovky navrhujeme s člověkem, který dnes plánuje. Uvidí je a proklikne dřív, než začne vývoj, takže výsledek odpovídá tomu, jak skutečně pracuje.',
      },
    ],
    relatedTerms: ['interni-system', 'webova-aplikace', 'mobilni-aplikace'],
    updated: UPDATED,
  },
  {
    slug: 'klientsky-portal',
    service: 'interni-systemy',
    name: 'Klientský portál',
    title: 'Zákazník vidí stav objednávky sám. Vy nemusíte odpovídat na e-maily.',
    metaTitle: 'Klientský portál na míru',
    metaDescription:
      'Klientský portál, kde zákazník vidí stav objednávky, dokumenty a faktury. Méně dotazů e-mailem a telefonem, data přímo z vašeho interního systému.',
    short: 'Stav objednávek, dokumenty a faktury pro zákazníky na jednom místě.',
    lead: 'Část práce vašich lidí tvoří odpovědi na otázku „jak to vypadá s naší objednávkou“. Klientský portál zákazníkovi ukáže stav, dokumenty a faktury sám, s daty přímo z vašeho systému.',
    answer: {
      q: 'Co je klientský portál?',
      a: 'Klientský portál je zabezpečená webová aplikace, kde zákazník po přihlášení vidí stav svých objednávek, stahuje dokumenty a faktury a nahrává podklady. Data čte přímo z vašeho interního systému, takže ukazuje stejný stav jako vašim lidem a nic se nepřepisuje. Ubývá tím dotazů e-mailem a telefonem na to, jak objednávka vypadá.',
    },
    art: 'key',
    today: [
      'Zákazníci volají a píšou, jak je na tom jejich objednávka.',
      'Dokumenty a faktury se posílají e-mailem znovu a znovu.',
      'Každý obchodník má jiný přehled o tom, co zákazník dostal.',
      'Podklady od zákazníka chodí do různých schránek.',
    ],
    withSystem: [
      'Zákazník vidí stav objednávky po přihlášení.',
      'Dokumenty a faktury si stáhne sám, kdykoliv je potřebuje.',
      'Všichni vidí stejnou historii komunikace se zákazníkem.',
      'Podklady nahrává zákazník přímo k objednávce.',
    ],
    capabilities: [
      {
        title: 'Stav objednávky v reálném čase',
        text: 'Portál čte data z vašeho interního systému, takže ukazuje stejný stav, jaký vidí vaši lidé. Nic se nepřepisuje.',
      },
      {
        title: 'Dokumenty a faktury',
        text: 'Smlouvy, protokoly, faktury a dodací listy ke stažení. Zákazník vidí jen to, co mu patří.',
      },
      {
        title: 'Bezpečné přihlášení',
        text: 'Účty pro více lidí za jednoho zákazníka, oprávnění podle role a dvoufázové ověření tam, kde je potřeba.',
      },
      {
        title: 'Podklady a schvalování',
        text: 'Zákazník nahraje podklady nebo schválí nabídku přímo v portálu. Vaši lidé dostanou upozornění.',
      },
    ],
    faq: [
      {
        q: 'Potřebujeme kvůli portálu nový interní systém?',
        a: 'Ne nutně. Portál umíme napojit na systém, který už máte, pokud má rozhraní pro předávání dat (API) nebo jiný spolehlivý přístup k datům. Když nic takového neexistuje, navrhneme, kde začít.',
      },
      {
        q: 'Jak je to s bezpečností dat zákazníků?',
        a: 'Každý zákazník vidí jen svá data. Přístupy, přihlášení a změny se zaznamenávají a portál běží na infrastruktuře se zálohami a monitoringem.',
      },
    ],
    relatedTerms: ['klientsky-portal', 'webova-aplikace', 'api'],
    updated: UPDATED,
  },
  {
    slug: 'vytezovani-faktur',
    service: 'automatizace-procesu',
    name: 'Vytěžování faktur a dokumentů',
    title: 'Faktury se přepisují samy. Člověk jen kontroluje.',
    metaTitle: 'Vytěžování faktur a dokumentů',
    metaDescription:
      'Automatické vytěžování faktur, objednávek a dalších dokumentů: údaje se přečtou, zkontrolují a zapíšou do účetnictví nebo systému. Nejisté případy jdou k člověku.',
    short: 'Údaje z faktur a objednávek se přečtou a zapíšou samy, sporné jdou ke kontrole.',
    lead: 'Přijaté faktury, objednávky a dodací listy dnes někdo přepisuje ručně. Nastavíme vytěžování, které údaje přečte, zkontroluje a zapíše tam, kam patří. Kde si systém není jistý, pošle dokument člověku.',
    answer: {
      q: 'Jak funguje vytěžování faktur?',
      a: 'Vytěžování faktur znamená, že software z přijaté faktury v PDF, skenu nebo e-mailu sám přečte dodavatele, IČO, částky, DPH, splatnost a položky, ověří je proti tomu, co už znáte, a zapíše je do účetnictví nebo interního systému. Dokumenty, u kterých si není jistý, pošle člověku ke kontrole, takže chybný údaj neprojde bez povšimnutí.',
    },
    art: 'typewriter',
    today: [
      'Někdo přepisuje přijaté faktury do účetního programu.',
      'Objednávky z e-mailu a PDF se ručně zakládají do systému.',
      'Překlep v částce nebo čísle účtu se zjistí až při platbě.',
      'Dokumenty leží v různých schránkách a složkách.',
    ],
    withSystem: [
      'Údaje z faktury se přečtou a zapíšou automaticky.',
      'Objednávka z e-mailu se založí v systému sama.',
      'Částky, IČO a čísla účtů se kontrolují proti tomu, co už znáte.',
      'Dokumenty chodí do jedné schránky a mají jasný stav.',
    ],
    capabilities: [
      {
        title: 'Čtení dokumentů',
        text: 'Dodavatel, IČO, částky, DPH, splatnost, položky objednávky. Z PDF, skenu i těla e-mailu.',
      },
      {
        title: 'Kontrola před zápisem',
        text: 'Údaje se ověří proti adresáři dodavatelů, objednávkám a registru. Co nesedí, se nezapíše bez člověka.',
      },
      {
        title: 'Zápis do účetnictví a systémů',
        text: 'Vytěžené údaje se zapíšou do účetního programu, ERP nebo interního systému přes jejich rozhraní.',
      },
      {
        title: 'Fronta ke kontrole',
        text: 'Nejisté dokumenty čekají na jednom místě s vyznačenými údaji. Kontrola trvá chvíli, ne přepisování celého dokladu.',
      },
    ],
    faq: [
      {
        q: 'Jak spolehlivé je to vytěžování?',
        a: 'Záleží na tom, jak vaše dokumenty vypadají. Proto začínáme na vzorku vašich skutečných faktur a objednávek a výsledek vám ukážeme dřív, než se cokoliv napojí na účetnictví. Sporné dokumenty vždy jdou k člověku.',
      },
      {
        q: 'Používáte k tomu umělou inteligenci?',
        a: 'Tam, kde to pomáhá, ano. U dokumentů s pevnou strukturou stačí jednodušší pravidla. Rozhodující je kontrola výsledku, ne použitá technologie.',
      },
      {
        q: 'Funguje to s naším účetním programem?',
        a: 'Většina účetních programů umí data přijmout přes rozhraní nebo import. Na úvodní konzultaci ověříme, jak to jde u toho vašeho.',
      },
    ],
    relatedTerms: ['vytezovani-dokumentu', 'umela-inteligence', 'api'],
    updated: UPDATED,
  },
  {
    slug: 'parovani-plateb-a-upominky',
    service: 'automatizace-procesu',
    name: 'Párování plateb a upomínky',
    title: 'Neuhrazené faktury hlídá systém, ne účetní.',
    metaTitle: 'Párování plateb a automatické upomínky',
    metaDescription:
      'Automatické párování plateb z banky s fakturami a upomínky na neuhrazené faktury. Každé ráno víte, kdo zaplatil, a nikdo nemusí kontrolovat výpisy ručně.',
    short: 'Výpisy se každé ráno spárují s fakturami a na neuhrazené odejde upomínka.',
    lead: 'Kontrola, kdo zaplatil, se dělá ručně nad výpisem a seznamem faktur. Nastavíme párování plateb, které proběhne každé ráno samo, a upomínky, které odejdou včas.',
    answer: {
      q: 'Jak funguje automatické párování plateb?',
      a: 'Automatické párování plateb každý den načte pohyby na firemním účtu a přiřadí je k vystaveným fakturám podle variabilního symbolu, částky a protistrany. Faktury, které zůstanou neuhrazené, dostanou v nastavených termínech připomínku nebo upomínku. Platby, u kterých shoda není jistá, systém navrhne a potvrdí je člověk.',
    },
    art: 'abacus',
    today: [
      'Někdo ručně porovnává výpis z banky se seznamem faktur.',
      'Na upomínky se zapomíná, nebo odcházejí pozdě.',
      'Platby bez variabilního symbolu se dohledávají ručně.',
      'Přehled o pohledávkách je jen v účetnictví.',
    ],
    withSystem: [
      'Platby se každé ráno spárují s fakturami.',
      'Upomínky odcházejí v termínech, které si nastavíte.',
      'Nespárované platby čekají na jednom místě s návrhem.',
      'Vedení vidí pohledávky po splatnosti v přehledu.',
    ],
    capabilities: [
      {
        title: 'Napojení na banku',
        text: 'Pohyby na účtu se načítají automaticky přes rozhraní banky nebo z výpisů, které banka posílá.',
      },
      {
        title: 'Párování s fakturami',
        text: 'Podle variabilního symbolu, částky a protistrany. Kde shoda není jistá, systém navrhne a člověk potvrdí.',
      },
      {
        title: 'Upomínky v pravý čas',
        text: 'Připomenutí před splatností, upomínka po ní, další stupně podle vašich pravidel. S vaším textem a podpisem.',
      },
      {
        title: 'Přehled pohledávek',
        text: 'Kdo dluží, kolik a jak dlouho. Jako přehled nebo e-mail pro vedení každý týden.',
      },
    ],
    faq: [
      {
        q: 'Nebudou upomínky odcházet i těm, kdo už zaplatili?',
        a: 'Upomínka odchází až po párování plateb a jen na faktury, které zůstaly neuhrazené. U zákazníků, kde chcete upomínat osobně, ji systém jen připraví ke schválení.',
      },
      {
        q: 'Které banky to podporují?',
        a: 'Většina českých bank nabízí rozhraní pro firemní účty nebo pravidelné výpisy e-mailem. Na úvodní konzultaci ověříme, co umí ta vaše.',
      },
    ],
    relatedTerms: ['integrace-systemu', 'api', 'webhook'],
    updated: UPDATED,
  },
  {
    slug: 'reporty-pro-vedeni',
    service: 'automatizace-procesu',
    name: 'Reporty pro vedení',
    title: 'Čísla pro vedení jsou hotová v pondělí ráno. Bez skládání tabulek.',
    metaTitle: 'Automatické reporty pro vedení firmy',
    metaDescription:
      'Automatické reporty z účetnictví, e-shopu, skladu a CRM: čísla pro vedení chodí e-mailem nebo jsou v přehledu, vždy aktuální a bez ručního skládání tabulek.',
    short: 'Data z účetnictví, e-shopu a skladu v jednom reportu, který se počítá sám.',
    lead: 'Report pro vedení dnes někdo skládá z exportů a tabulek a než je hotový, čísla už neplatí. Propojíme zdroje dat tak, aby se report počítal sám a byl vždy aktuální.',
    answer: {
      q: 'Co jsou automatické reporty pro vedení?',
      a: 'Automatické reporty pro vedení jsou přehledy, které se samy počítají z dat v účetnictví, e-shopu, skladu nebo CRM a přicházejí e-mailem, případně jsou kdykoliv aktuální v prohlížeči. Výpočty jako marže, obrat nebo vytížení jsou jednou definované a platí pro všechny, takže čísla nezávisí na tom, kdo report zrovna skládá.',
    },
    art: 'radio',
    today: [
      'Report skládá někdo každý týden z několika exportů.',
      'Čísla z účetnictví a z e-shopu si neodpovídají.',
      'Na aktuální stav se čeká do konce měsíce.',
      'Když autor reportu chybí, report nevznikne.',
    ],
    withSystem: [
      'Report se spočítá sám a přijde e-mailem.',
      'Čísla se berou z jednoho zdroje pravdy.',
      'Aktuální stav vidíte v přehledu kdykoliv.',
      'Report nezávisí na jednom člověku.',
    ],
    capabilities: [
      {
        title: 'Propojení zdrojů dat',
        text: 'Účetnictví, e-shop, sklad, CRM i tabulky, které zatím zůstávají. Data se načítají pravidelně a automaticky.',
      },
      {
        title: 'Jednotné výpočty',
        text: 'Marže, obrat nebo vytížení se počítají vždy stejně. Definice si domluvíme s vámi a zapíšeme je.',
      },
      {
        title: 'Report e-mailem nebo v přehledu',
        text: 'Pravidelný e-mail pro vedení, přehled v prohlížeči, nebo obojí. Podle toho, jak s čísly pracujete.',
      },
      {
        title: 'Upozornění na odchylky',
        text: 'Když něco vybočí, třeba propad tržeb nebo nízká zásoba, přijde upozornění hned, ne v příštím reportu.',
      },
    ],
    faq: [
      {
        q: 'Proč ne Power BI nebo jiný hotový nástroj?',
        a: 'Hotový nástroj na vizualizaci je často správná volba a umíme ho napojit. Většina práce ale není v grafech, nýbrž v tom, dostat do nich spolehlivá data. To řešíme my.',
      },
      {
        q: 'Co když se čísla v reportu neshodují s účetnictvím?',
        a: 'Při zavádění porovnáváme report s vašimi současnými čísly, dokud nesedí. Rozdíly vysvětlíme a definice výpočtů zapíšeme, aby se k nim dalo vrátit.',
      },
    ],
    relatedTerms: ['datova-pipeline', 'sber-dat', 'integrace-systemu'],
    updated: UPDATED,
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}

export function solutionsForService(serviceSlug: string) {
  return solutions.filter((s) => s.service === serviceSlug);
}
