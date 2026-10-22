import type { PrintArtKey } from './print-art';

export type ServiceIcon = 'workflow' | 'system' | 'support' | 'web';

export interface Service {
  slug: string;
  title: string;
  icon: ServiceIcon;
  /** Printed object in the page header. */
  art: PrintArtKey;
  /** One-liner for cards on the home page and /sluzby. */
  short: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroLead: string;
  pains: string[];
  deliverables: { title: string; text: string }[];
  examples: string[];
  faq: { q: string; a: string }[];
  relatedCases: string[];
  /**
   * Orientační ceny. Sekce „Orientační ceny“ se na stránce služby zobrazí,
   * jakmile tu bude aspoň jedna položka. Příklad:
   *   { title: 'Úvodní audit', price: 'od 9 900 Kč', note: 'Jednorázově' }
   */
  pricing?: { title: string; price: string; note?: string }[];
}

export const services: Service[] = [
  {
    slug: 'automatizace-procesu',
    title: 'Automatizace procesů',
    icon: 'workflow',
    art: 'hourglass',
    short:
      'Propojíme systémy, které spolu nemluví, a zbavíme vás ručního přepisování dat mezi e-mailem, Excelem a účetnictvím.',
    metaTitle: 'Automatizace firemních procesů',
    metaDescription:
      'Automatizace objednávek, faktur, reportů a notifikací nad nástroji, které už používáte. Propojení účetnictví, CRM, e-shopu a bankovnictví. Plzeň a celá ČR.',
    heroTitle: 'Opakovanou ruční práci ať dělá software.',
    heroLead:
      'Objednávky z e-mailu do systému, faktury do účetnictví, report pro vedení každé pondělí. Najdeme kroky, které vaši lidé dělají ručně, a necháme je běžet samy. Programy, které už používáte, měnit nemusíte.',
    pains: [
      'Data z jednoho systému ručně přepisujete do druhého.',
      'Report pro vedení skládá někdo každý týden z několika tabulek.',
      'Faktury, upomínky a potvrzení se posílají ručně a občas se na ně zapomene.',
      'Když klíčový člověk onemocní, proces stojí.',
    ],
    deliverables: [
      {
        title: 'Propojení systémů',
        text: 'Napojíme účetnictví, CRM, e-shop, sklad nebo bankovní výpisy přes API. Kde API chybí, najdeme jinou cestu.',
      },
      {
        title: 'Dokumenty bez kopírování',
        text: 'Faktury, nabídky, protokoly a smlouvy vznikají z dat, která už máte.',
      },
      {
        title: 'Reporty, které se počítají samy',
        text: 'Čísla pro vedení chodí e-mailem nebo jsou v přehledu. Vždy aktuální, bez ručního skládání.',
      },
      {
        title: 'Hlídání termínů',
        text: 'Systém upozorní, když se blíží splatnost, dochází materiál nebo zakázka stojí.',
      },
      {
        title: 'AI tam, kde dává smysl',
        text: 'Vytěžení údajů z faktur a e-mailů, třídění poptávek, návrhy odpovědí. Výsledek vždy kontroluje člověk.',
      },
    ],
    examples: [
      'Objednávka přijde e-mailem, zapíše se do systému, vystaví se faktura a odejde zákazníkovi.',
      'Bankovní výpis se každé ráno spáruje s fakturami. Na neuhrazené odejde upomínka.',
      'Data ze skladu, e-shopu a účetnictví v jednom týdenním reportu.',
    ],
    faq: [
      {
        q: 'Musíme měnit programy, které používáme?',
        a: 'Většinou ne. Automatizace stavíme nad tím, co už máte: účetní program, Microsoft 365 nebo Google Workspace, e-shop, CRM. Výměnu doporučíme jen tam, kde vás současný nástroj opravdu brzdí.',
      },
      {
        q: 'Co když se automatizace rozbije?',
        a: 'Každá automatizace zapisuje, co udělala, a při chybě pošle upozornění. O problému se dozvíme dřív než vy a v rámci podpory ho opravíme.',
      },
      {
        q: 'Jak poznáme, že se to vyplatí?',
        a: 'Na úvodní konzultaci spočítáme, kolik hodin měsíčně vás daný proces stojí. Když se investice nevrátí v rozumném čase, řekneme vám to rovnou.',
      },
    ],
    relatedCases: ['clearway', 'gridtime'],
    pricing: [], // TODO(Jan): orientační ceny
  },
  {
    slug: 'interni-systemy',
    title: 'Interní systémy a aplikace',
    icon: 'system',
    art: 'macintosh',
    short:
      'Evidence zakázek, plánování, sklad nebo klientský portál. Aplikace postavená podle toho, jak opravdu pracujete.',
    metaTitle: 'Interní systémy a aplikace na zakázku',
    metaDescription:
      'Vývoj interních systémů pro firmy, které přerostly Excel: evidence zakázek, plánování, sklad, klientský portál. Dodávka po etapách a podpora i po spuštění.',
    heroTitle: 'Když krabicový software nestačí a Excel už vůbec ne.',
    heroLead:
      'Stavíme interní systémy pro firmy, které přerostly tabulky, ale nepotřebují ERP za miliony. Dodáváme po etapách, takže první část používáte za pár týdnů, ne za rok.',
    pains: [
      'Firma běží na desítkách sdílených tabulek a nikdo neví, která verze platí.',
      'Krabicový systém pokryje polovinu provozu, zbytek se obchází.',
      'Stav zakázky zjistíte jen tak, že někomu zavoláte.',
      'Velký dodavatel nabízí rok vývoje a rozpočet jako pro korporát.',
    ],
    deliverables: [
      {
        title: 'Analýza provozu',
        text: 'Než napíšeme první řádek kódu, projdeme s vašimi lidmi, jak práce skutečně probíhá.',
      },
      {
        title: 'Návrh obrazovek předem',
        text: 'Hlavní obrazovky uvidíte a proklikáte dřív, než začne vývoj. Změny jsou v téhle fázi levné.',
      },
      {
        title: 'Vývoj po etapách',
        text: 'Nejdřív to, co ušetří nejvíc času. Každá etapa má vlastní cenu a termín.',
      },
      {
        title: 'Napojení na stávající nástroje',
        text: 'Účetnictví, e-mail, banka, e-shop. Data se zadávají jednou.',
      },
      {
        title: 'Web, mobil i tablet',
        text: 'Aplikace běží v prohlížeči kdekoliv. Když je potřeba, i jako nativní aplikace pro iOS a Android.',
      },
    ],
    examples: [
      'Evidence zakázek od poptávky po fakturu, s přehledem, kdo na čem pracuje.',
      'Plánování směn a kapacit pro výrobu nebo servis.',
      'Klientský portál, kde zákazník vidí stav objednávky a dokumenty.',
    ],
    faq: [
      {
        q: 'Proč ne hotový software?',
        a: 'Když existuje krabice, která vám sedí, doporučíme ji. Vlastní systém dává smysl ve chvíli, kdy kvůli krabici měníte způsob práce nebo platíte za moduly, které nepoužíváte.',
      },
      {
        q: 'Co když se během vývoje změní požadavky?',
        a: 'Počítáme s tím. Proto stavíme po etapách a po každé z nich se společně domluvíme, co dál. Změny jsou nejlevnější v analýze, a tak jí věnujeme dost času.',
      },
      {
        q: 'Kolik to stojí?',
        a: 'Záleží na rozsahu. Po úvodní konzultaci znáte orientační rozpočet, po analýze přesnou cenu první etapy.',
      },
    ],
    relatedCases: ['clearway'],
    pricing: [], // TODO(Jan): orientační ceny
  },
  {
    slug: 'it-podpora',
    title: 'IT podpora a správa',
    icon: 'support',
    art: 'wrench',
    short:
      'Účty, zálohy, zabezpečení, Microsoft 365 nebo Google Workspace. Jeden kontakt, který za vaše IT odpovídá.',
    metaTitle: 'IT podpora a správa IT pro firmy',
    metaDescription:
      'Správa IT pro malé a střední firmy: Microsoft 365, Google Workspace, zálohy, zabezpečení a servery. Jeden kontakt pro celé IT.',
    heroTitle: 'IT, na které nemusíte myslet.',
    heroLead:
      'V hodně firmách se o IT stará ten, kdo zrovna nejvíc rozumí počítačům. Převezmeme účty, zařízení, zálohy a zabezpečení, aby se vaši lidé mohli věnovat své práci.',
    pains: [
      'Nikdo přesně neví, kdo má k čemu přístup.',
      'Zálohy možná běží. Obnovu ale nikdo nezkoušel.',
      'Nový kolega čeká dva dny na účty a notebook.',
      'Když něco přestane fungovat, nikdo neví, kde začít.',
    ],
    deliverables: [
      {
        title: 'Microsoft 365 a Google Workspace',
        text: 'Nastavení, uživatelé, sdílené disky, e-mail a licence.',
      },
      {
        title: 'Zálohy a obnova',
        text: 'Pravidelné zálohy dat i systémů. Obnovu zkoušíme, protože záloha, ze které nejde obnovit, není záloha.',
      },
      {
        title: 'Zabezpečení',
        text: 'Dvoufázové ověření, správa hesel, aktualizace a oprávnění. Základ, který zastaví většinu útoků.',
      },
      {
        title: 'Nástupy a odchody',
        text: 'Účty, zařízení a přístupy připravené první den. Při odchodu je bezpečně odebereme.',
      },
      {
        title: 'Servery, domény, cloud',
        text: 'Správa serverů, DNS a cloudové infrastruktury s monitoringem. O výpadku víme první.',
      },
    ],
    examples: [
      'Úvodní audit: seznam rizik v účtech, zálohách a zabezpečení seřazený podle důležitosti.',
      'Přechod e-mailů a dokumentů do Microsoft 365 nebo Google Workspace.',
      'Pravidelná správa a dohled nad IT.',
    ],
    faq: [
      {
        q: 'Kde začít?',
        a: 'Úvodním auditem. Zmapujeme účty, zařízení, zálohy a zabezpečení a dostanete seznam rizik seřazený podle důležitosti. Co s ním uděláte, je na vás.',
      },
      {
        q: 'Jak funguje cena?',
        a: 'Cenu nastavujeme individuálně podle rozsahu a toho, co od nás potřebujete. Může jít o pravidelnou správu, jednorázové práce, nebo kombinaci obojího. Přesnou nabídku dostanete po auditu.',
      },
    ],
    relatedCases: [],
    pricing: [], // TODO(Jan): orientační ceny
  },
  {
    slug: 'weby-a-aplikace',
    title: 'Weby a webové aplikace',
    icon: 'web',
    art: 'radio',
    short:
      'Firemní weby, které se rychle načítají, jsou dohledatelné na Googlu a dají se spravovat bez programátora.',
    metaTitle: 'Firemní weby a webové aplikace',
    metaDescription:
      'Firemní weby a webové aplikace bez šablon: rychlé načítání, technické SEO, správa obsahu přes CMS, hosting a údržba.',
    heroTitle: 'Web, který pro firmu pracuje.',
    heroLead:
      'Navrhneme a postavíme web nebo webovou aplikaci bez šablon. Rychlé načítání, technické SEO, obsah, který si upravíte sami, a provoz, o který se nemusíte starat.',
    pains: [
      'Web vypadá zastarale a na mobilu se rozpadá.',
      'Každou změnu textu objednáváte u agentury.',
      'Z webu nechodí poptávky.',
      'Nikdo neví, kde web běží a kdo k němu má přístup.',
    ],
    deliverables: [
      {
        title: 'Návrh a vývoj',
        text: 'Design podle vaší značky, bez šablon. Postavené na Next.js, takže se stránky načtou hned.',
      },
      {
        title: 'Správa obsahu',
        text: 'Texty, fotky a aktuality upravíte sami v jednoduchém CMS.',
      },
      {
        title: 'SEO a měření',
        text: 'Technické SEO, strukturovaná data, Google Search Console a analytika.',
      },
      {
        title: 'Formuláře a napojení',
        text: 'Poptávky rovnou do e-mailu nebo CRM, rezervace, platby.',
      },
      {
        title: 'Hosting a údržba',
        text: 'Provoz, certifikáty, zálohy a aktualizace.',
      },
    ],
    examples: [
      'Firemní prezentace s poptávkovým formulářem.',
      'Web s přihláškami nebo rezervacemi.',
      'Webová aplikace pro zákazníky, napojená na interní systém.',
    ],
    faq: [
      {
        q: 'Jak dlouho trvá nový web?',
        a: 'Firemní prezentace typicky několik týdnů. Nejvíc záleží na tom, jak rychle máme texty a podklady.',
      },
      {
        q: 'Můžeme si web upravovat sami?',
        a: 'Ano. Obsah spravujete přes CMS. Programátora potřebujete jen na nové funkce.',
      },
    ],
    relatedCases: ['autoskola-falar', 'esn-uwb'],
    pricing: [], // TODO(Jan): orientační ceny
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
