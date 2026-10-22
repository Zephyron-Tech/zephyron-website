import type { PrintArtKey } from './print-art';

export type CaseCategory = 'Pro klienta' | 'Vlastní produkt' | 'Startup Support';

export interface CaseStudy {
  slug: string;
  name: string;
  client: string;
  kicker: string;
  category: CaseCategory;
  status: 'V provozu' | 'Ve vývoji' | 'V přípravě';
  /** The live site, for projects that are running. */
  url?: string;
  /** Partner organisations shown with logos (files in public/logos/). */
  partners?: { name: string; logo?: string; height?: number }[];
  /** Printed object shown in place of a screenshot. */
  art?: PrintArtKey;
  summary: string;
  image?: string;
  tags: string[];
  /** Projects without detail content render as a card only (no /reference/[slug] page). */
  detail?: {
    problem: string[];
    solution: string[];
    /** Optional measurable outcome. Leave out rather than invent numbers. */
    result?: string[];
    pipeline?: { title: string; sub: string }[];
    stack: string[];
    services: string[];
  };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'clearway',
    name: 'ClearWay',
    client: 'Město Plzeň a SIT Port',
    kicker: 'Analýza stavu silniční infrastruktury',
    category: 'Pro klienta',
    status: 'Ve vývoji',
    summary:
      'Data ze senzorů na vozidle se automaticky zpracují a zobrazí na mapě jako stav povrchu jednotlivých úseků silnic. Vyvíjíme ve spolupráci s městem Plzeň, SIT Port a Západočeskou univerzitou.',
    partners: [
      { name: 'Město Plzeň', logo: '/logos/plzen.svg' },
      { name: 'SIT Port', logo: '/logos/sitport.svg' },
      { name: 'Západočeská univerzita v Plzni', logo: '/logos/zcu.svg', height: 52 },
    ],
    image: '/screenshots/clearway.webp',
    tags: ['GIS', 'Datová pipeline', 'Mobilní aplikace', 'Hardware'],
    detail: {
      problem: [
        'Stav povrchu silnic se ve městech obvykle zjišťuje ručně: pochůzkami, fotkami a tabulkami. Je to pomalé, drahé a data rychle zastarávají.',
        'Spolu s městem Plzeň, SIT Port a Západočeskou univerzitou hledáme způsob, jak mít průběžný a objektivní přehled o stavu komunikací. Aby se opravy daly plánovat podle dat, a ne podle stížností.',
      ],
      solution: [
        'Navrhli jsme celý řetězec od hardwaru po mapu. Senzory na vozidle zaznamenávají průběh jízdy, mobilní aplikace data sbírá a odesílá.',
        'Na serveru se záznamy spárují se silniční sítí z OpenStreetMap, vyčistí a vyhodnotí. Správce pak ve webové GIS aplikaci vidí barevnou mapu úseků podle stavu.',
        'Celý tok běží bez ručního zásahu. Řidič jen jezdí.',
      ],
      result: [
        'Systém je ve vývoji. S SIT Port připravujeme nasazení do alfa testovacího provozu.',
      ],
      pipeline: [
        { title: 'Senzory na vozidle', sub: 'IMU · GNSS · LiDAR' },
        { title: 'Sběr v mobilu', sub: 'iOS · Android' },
        { title: 'Párování s mapou', sub: 'OSM · PostGIS' },
        { title: 'GIS aplikace', sub: 'WebGL dlaždice' },
      ],
      stack: ['Python', 'FastAPI', 'PostgreSQL + PostGIS', 'OpenStreetMap', 'Expo (iOS, Android)', 'WebGL'],
      services: ['automatizace-procesu', 'interni-systemy'],
    },
  },
  {
    slug: 'gridtime',
    name: 'GridTime',
    client: 'Vlastní produkt',
    kicker: 'Kalendář motorsportu napříč sériemi',
    category: 'Vlastní produkt',
    status: 'Ve vývoji',
    summary:
      'Rozpisy závodů z mnoha zdrojů v jednom kalendáři, automaticky přepočtené do vašeho časového pásma.',
    image: '/screenshots/gridtime.webp',
    tags: ['Sběr dat', 'Web', 'Mobilní aplikace'],
    detail: {
      problem: [
        'Kdo sleduje F1, MotoGP i vytrvalostní závody, má rozpis v pěti aplikacích a pokaždé v jiném časovém pásmu.',
      ],
      solution: [
        'GridTime sbírá rozpisy ze scraperů a API jednotlivých sérií, sjednotí je a zobrazí v čase uživatele. Filtruje se podle sérií, data servíruje rychlé API.',
        'Webová verze je ve vývoji, mobilní aplikace v Expo se připravuje.',
        'Na vlastním produktu zkoušíme to, co pak dodáváme klientům: sběr dat z mnoha nesourodých zdrojů, jejich čištění a automatické zpracování.',
      ],
      stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Expo'],
      services: ['automatizace-procesu', 'weby-a-aplikace'],
    },
  },
  {
    slug: 'autoskola-falar',
    name: 'Autoškola Falář',
    client: 'Autoškola Falář, Vimperk',
    kicker: 'Web s přehledem kurzů a přihláškou',
    category: 'Pro klienta',
    status: 'V provozu',
    url: 'https://www.autoskola-falar.cz/',
    summary:
      'Web, který vysvětlí nabídku kurzů, odpoví na časté dotazy a přivede přihlášky. Obsah si autoškola spravuje sama.',
    image: '/screenshots/autoskola.webp',
    tags: ['Web', 'CMS', 'Formuláře'],
    detail: {
      problem: [
        'Autoškola potřebovala web, který srozumitelně představí kurzy, odpoví na otázky, které zájemci řeší po telefonu, a umožní se rovnou přihlásit.',
        'Zároveň si ho musí umět aktualizovat sama, bez objednávání každé změny.',
      ],
      solution: [
        'Navrhli jsme a postavili web bez šablony: přehled kurzů, FAQ, kontakt a přihlášku.',
        'Texty a ceny upravuje autoškola sama přes CMS. Web běží na Vercelu, takže se načítá rychle a o provoz se nestará.',
      ],
      stack: ['Next.js', 'TypeScript', 'CMS', 'Vercel'],
      services: ['weby-a-aplikace'],
    },
  },
  {
    slug: 'esn-uwb',
    name: 'ESN UWB Pilsen',
    client: 'Erasmus Student Network UWB Pilsen',
    kicker: 'Web studentské organizace',
    category: 'Pro klienta',
    status: 'V provozu',
    url: 'https://www.esnuwbpilsen.cz/',
    partners: [{ name: 'Západočeská univerzita v Plzni', logo: '/logos/zcu.svg', height: 52 }],
    summary:
      'Web pro místní i zahraniční studenty s aktualitami, galerií a partnery. Spravuje ho tým, který se každý rok mění.',
    image: '/screenshots/esnuwb.webp',
    tags: ['Web', 'CMS'],
    detail: {
      problem: [
        'Studentský spolek, jehož členové se každý rok střídají, potřeboval web, který zvládne spravovat kdokoliv z týmu.',
        'Web musí obsloužit dvě skupiny: místní studenty, kteří chtějí pomáhat, a zahraniční studenty, kteří do Plzně přijíždějí.',
      ],
      solution: [
        'Anglický web se samostatnými cestami pro místní a zahraniční studenty, s aktualitami, galerií a partnery.',
        'Obsah upravují členové spolku přes CMS bez znalosti programování.',
      ],
      stack: ['Next.js', 'TypeScript', 'CMS', 'Vercel'],
      services: ['weby-a-aplikace'],
    },
  },
  {
    slug: 'testamentist',
    name: 'Testamentist',
    client: 'Startup',
    kicker: 'AI trenažér rozhovorů pro krizové intervenienty',
    category: 'Startup Support',
    status: 'V přípravě',
    art: 'lifebuoy',
    summary:
      'Webová aplikace, ve které si krizoví intervenienti trénují podpůrné rozhovory s AI figurantem. Na konci dostanou vyhodnocení a zpětnou vazbu. Projekt už prošel testováním s HZS Plzeňského kraje a Českým červeným křížem.',
    tags: ['AI', 'Webová aplikace', 'Vzdělávání'],
  },
  {
    slug: 'inkluem',
    name: 'INKLUEM',
    client: 'Startup',
    kicker: 'Trenažér situací pro inkluzivní školu',
    category: 'Startup Support',
    status: 'V přípravě',
    art: 'schoolDesk',
    summary:
      'Trenažér krizových i každodenních situací pro učitele, asistenty pedagoga, rodiče a děti. Krátký scénář, volba reakce a okamžitá zpětná vazba s vysvětlením. Bezpečné místo, kde si člověk rozhodování vyzkouší dřív, než ho potká ve třídě.',
    tags: ['EdTech', 'Webová aplikace', 'Inkluze'],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}

export const detailedCaseStudies = caseStudies.filter((c) => c.detail);
