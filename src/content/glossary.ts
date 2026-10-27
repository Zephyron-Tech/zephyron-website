// Slovník pojmů: každý pojem má vlastní stránku /slovnik/[slug].
// Píšeme pro majitele a vedoucí firem, ne pro programátory: co to je, k čemu
// je to firmě dobré a na co si dát pozor. Žádná vymyšlená čísla ani klienti.

export interface Term {
  slug: string;
  term: string;
  /** Other names people search for (shown under the heading). */
  aka?: string[];
  /** One sentence; the meta description and the card text. Up to ~155 chars. */
  short: string;
  /** Two to four short paragraphs. */
  body: string[];
  /** Where it shows up in our work, with a link to the page. */
  example?: { text: string; href: string; label: string };
  related: { services?: string[]; cases?: string[]; terms?: string[] };
  /** Last content change, for the sitemap. */
  updated: string;
}

const UPDATED = '2026-10-22';

export const glossary: Term[] = [
  {
    slug: 'api',
    term: 'API',
    aka: ['aplikační rozhraní', 'Application Programming Interface'],
    short:
      'API je domluvený způsob, jak si dva programy předávají data bez člověka uprostřed. Díky němu se systémy dají propojit.',
    body: [
      'API (aplikační programové rozhraní) je vstup do programu určený jiným programům. Člověk používá obrazovky a tlačítka, jiný systém používá API: pošle dotaz v přesně daném tvaru a dostane odpověď, třeba seznam nových objednávek nebo potvrzení, že se faktura uložila.',
      'Pro firmu je API důvod, proč nemusí data přepisovat ručně. Když má účetní program, e-shop nebo CRM veřejné API, dá se na něj napojit a údaje mezi systémy tečou samy. Většina moderních nástrojů API má, u starších programů bývá omezené nebo placené.',
      'Než si vyberete nový software, vyplatí se zeptat, jestli má API a co přes něj jde. Rozhoduje to, jestli ho později propojíte s ostatními nástroji, nebo zůstane ostrovem.',
    ],
    example: {
      text: 'V automatizacích napojujeme přes API účetnictví, CRM, e-shopy i bankovní výpisy.',
      href: '/sluzby/automatizace-procesu',
      label: 'Automatizace procesů',
    },
    related: {
      services: ['automatizace-procesu', 'interni-systemy'],
      terms: ['integrace-systemu', 'webhook', 'fastapi'],
    },
    updated: UPDATED,
  },
  {
    slug: 'integrace-systemu',
    term: 'Integrace systémů',
    aka: ['propojení systémů', 'napojení aplikací'],
    short:
      'Integrace systémů znamená propojit programy, které firma používá, aby si data předávaly samy a nikdo je nemusel opisovat.',
    body: [
      'Ve většině firem běží vedle sebe účetnictví, e-shop, sklad, CRM, e-mail a pár tabulek. Každý z nich ví něco, co ostatní potřebují. Integrace je propojení, díky kterému se údaj zadá jednou a objeví se všude, kde je potřeba.',
      'Technicky se systémy nejčastěji propojují přes API. Kde API chybí, dá se pracovat s exporty, sdílenou složkou, e-mailem nebo databází. Důležité je, aby propojení hlídalo chyby: když se něco nepovede, má o tom někdo vědět dřív, než si toho všimne zákazník.',
      'Dobrá integrace je skoro neviditelná. Lidé dál pracují ve svých nástrojích, jen zmizí opisování a kontrolování, jestli čísla sedí.',
    ],
    example: {
      text: 'Objednávka z e-mailu se zapíše do systému, vystaví se faktura a odejde zákazníkovi. Bez ručního kroku.',
      href: '/sluzby/automatizace-procesu',
      label: 'Automatizace procesů',
    },
    related: {
      services: ['automatizace-procesu', 'interni-systemy'],
      terms: ['api', 'webhook', 'crm', 'erp'],
    },
    updated: UPDATED,
  },
  {
    slug: 'webhook',
    term: 'Webhook',
    short:
      'Webhook je automatická zpráva, kterou jeden systém pošle druhému ve chvíli, kdy se něco stane, třeba přijde platba nebo objednávka.',
    body: [
      'Běžné API funguje tak, že se jeden program ptá druhého: „Je něco nového?“ Webhook to obrací. Systém, ve kterém se něco stalo, sám pošle zprávu na domluvenou adresu. Například platební brána oznámí, že zákazník zaplatil, nebo e-shop, že vznikla nová objednávka.',
      'Výhodou je rychlost a menší zátěž. Navazující krok, jako vystavení faktury nebo zpráva skladníkovi, proběhne hned, ne až při další pravidelné kontrole.',
      'Webhooky je potřeba zabezpečit a počítat s tím, že zpráva občas nedorazí. Proto se k nim přidává ověření odesílatele a záložní kontrola, která zachytí, co by jinak propadlo.',
    ],
    related: {
      services: ['automatizace-procesu'],
      terms: ['api', 'integrace-systemu'],
    },
    updated: UPDATED,
  },
  {
    slug: 'crm',
    term: 'CRM',
    aka: ['Customer Relationship Management', 'správa vztahů se zákazníky'],
    short:
      'CRM je systém pro evidenci zákazníků, obchodních příležitostí a komunikace s nimi. Celá firma v něm vidí, kde který obchod je.',
    body: [
      'CRM (Customer Relationship Management) shromažďuje na jednom místě kontakty, poptávky, nabídky, schůzky a e-maily se zákazníky. Obchodník v něm vidí, co je potřeba udělat, a vedení vidí, kolik obchodů je rozjednaných a v jaké fázi.',
      'Hotových CRM je spousta a pro běžný obchod obvykle stačí některé z nich. Vlastní řešení dává smysl, když se prodej hodně prolíná s výrobou nebo servisem a hotové CRM by se muselo obcházet.',
      'Největší přínos přichází s napojením: poptávka z webu se v CRM objeví sama, a když se obchod uzavře, data přejdou do fakturace nebo plánování bez opisování.',
    ],
    related: {
      services: ['automatizace-procesu', 'interni-systemy', 'weby-a-aplikace'],
      terms: ['erp', 'integrace-systemu', 'interni-system'],
    },
    updated: UPDATED,
  },
  {
    slug: 'erp',
    term: 'ERP',
    aka: ['Enterprise Resource Planning', 'podnikový informační systém'],
    short:
      'ERP je velký podnikový systém, který v jednom propojuje účetnictví, sklad, nákup, výrobu a personalistiku. Pro menší firmy bývá zbytečně těžký.',
    body: [
      'ERP (Enterprise Resource Planning) je podnikový informační systém, který pokrývá většinu provozu: účetnictví, sklad, nákup, prodej, výrobu i mzdy. Všechna oddělení pracují nad stejnými daty.',
      'Zavedení ERP je velký projekt. Trvá měsíce, stojí hodně peněz a firma se často musí přizpůsobit tomu, jak systém funguje. Pro velké podniky to dává smysl, menší a střední firmy z něj ale často využijí jen zlomek.',
      'Alternativou je ponechat si účetní program, který funguje, a dostavět k němu menší interní systém přesně na to, co firma dělá jinak než ostatní. Propojení obou pak zajistí, že se data zadávají jen jednou.',
    ],
    example: {
      text: 'Stavíme interní systémy pro firmy, které přerostly tabulky, ale nepotřebují ERP za miliony.',
      href: '/sluzby/interni-systemy',
      label: 'Interní systémy a aplikace',
    },
    related: {
      services: ['interni-systemy'],
      terms: ['interni-system', 'crm', 'integrace-systemu'],
    },
    updated: UPDATED,
  },
  {
    slug: 'interni-system',
    term: 'Interní systém',
    aka: ['firemní aplikace', 'software na zakázku', 'informační systém na míru'],
    short:
      'Interní systém je aplikace postavená pro jednu firmu a její způsob práce: evidence zakázek, plánování, sklad nebo přehledy pro vedení.',
    body: [
      'Interní systém je software, který používají zaměstnanci jedné firmy a který vznikl podle toho, jak tahle firma opravdu pracuje. Typicky nahrazuje sdílené tabulky: evidenci zakázek, plánování směn, sklad, servisní požadavky nebo přehled pro vedení.',
      'Od krabicového softwaru se liší tím, že se nepřizpůsobujete vy jemu. Obsahuje jen to, co potřebujete, a dá se rozšiřovat, jak firma roste. Běží v prohlížeči, takže funguje na počítači, tabletu i telefonu.',
      'Rozumné je stavět ho po etapách. Nejdřív část, která ušetří nejvíc času, a pak další podle toho, co se v provozu ukáže. Tak se riziko i rozpočet drží pod kontrolou.',
    ],
    example: {
      text: 'Evidence zakázek od poptávky po fakturu, plánování kapacit nebo klientský portál.',
      href: '/sluzby/interni-systemy',
      label: 'Interní systémy a aplikace',
    },
    related: {
      services: ['interni-systemy'],
      cases: ['clearway'],
      terms: ['erp', 'webova-aplikace', 'klientsky-portal'],
    },
    updated: UPDATED,
  },
  {
    slug: 'klientsky-portal',
    term: 'Klientský portál',
    aka: ['zákaznický portál', 'zákaznická zóna'],
    short:
      'Klientský portál je zabezpečená část webu, kde zákazník po přihlášení vidí stav svých objednávek, dokumenty a faktury.',
    body: [
      'Klientský portál je místo, kam se zákazník přihlásí a najde všechno, co se ho týká: stav zakázky, smlouvy, předávací protokoly, faktury nebo historii požadavků. Může v něm i něco zadat, třeba novou objednávku nebo servisní požadavek.',
      'Firmě portál ušetří telefonáty a e-maily typu „v jakém stavu je moje objednávka?“. Zákazník informaci najde sám a kdykoliv.',
      'Portál bývá napojený na interní systém, takže ukazuje stejná data, se kterými pracují vaši lidé. Nic se nepřepisuje a zákazník vidí vždy aktuální stav.',
    ],
    related: {
      services: ['interni-systemy', 'weby-a-aplikace'],
      terms: ['interni-system', 'webova-aplikace'],
    },
    updated: UPDATED,
  },
  {
    slug: 'webova-aplikace',
    term: 'Webová aplikace',
    aka: ['web app', 'aplikace v prohlížeči'],
    short:
      'Webová aplikace je program, který běží v internetovém prohlížeči. Nic se neinstaluje a funguje na počítači, tabletu i mobilu.',
    body: [
      'Webová aplikace vypadá jako web, ale slouží k práci: něco se v ní eviduje, plánuje, počítá nebo schvaluje. Otevře se v prohlížeči na adrese, uživatel se přihlásí a pracuje. Na počítače se nic neinstaluje a nové verze dostanou všichni najednou.',
      'Na rozdíl od firemní prezentace má webová aplikace uživatele, oprávnění, databázi a často napojení na další systémy. Právě proto se z ní dá postavit interní systém nebo klientský portál.',
      'Když je potřeba práce v terénu bez signálu nebo přístup k funkcím telefonu, doplňuje se webová aplikace o nativní mobilní aplikaci.',
    ],
    related: {
      services: ['weby-a-aplikace', 'interni-systemy'],
      cases: ['testamentist'],
      terms: ['interni-system', 'mobilni-aplikace', 'nextjs'],
    },
    updated: UPDATED,
  },
  {
    slug: 'mobilni-aplikace',
    term: 'Mobilní aplikace',
    aka: ['nativní aplikace', 'aplikace pro iOS a Android', 'Expo', 'React Native'],
    short:
      'Mobilní aplikace se instaluje z App Store nebo Google Play. Hodí se, když je potřeba fotoaparát, GPS, senzory nebo práce bez signálu.',
    body: [
      'Nativní mobilní aplikace se stahuje z obchodu s aplikacemi a běží přímo v telefonu. Má přístup k funkcím, které web používat nemůže nebo jen omezeně: senzory, poloha na pozadí, fotoaparát, oznámení nebo práce bez připojení.',
      'Pro iOS i Android lze dnes psát jednu aplikaci. My používáme Expo (nad React Native), takže jeden kód běží na obou platformách a vývoj i údržba stojí méně.',
      'Ne každá firma mobilní aplikaci potřebuje. Často stačí webová aplikace, která se na telefonu chová podobně. Aplikaci z obchodu doporučíme tam, kde to vyžadují funkce telefonu nebo práce v terénu.',
    ],
    example: {
      text: 'V projektu ClearWay mobilní aplikace sbírá data ze senzorů na vozidle a odesílá je ke zpracování.',
      href: '/reference/clearway',
      label: 'ClearWay',
    },
    related: {
      services: ['interni-systemy', 'weby-a-aplikace'],
      cases: ['clearway', 'gridtime', 'inkluem'],
      terms: ['webova-aplikace'],
    },
    updated: UPDATED,
  },
  {
    slug: 'mvp',
    term: 'MVP',
    aka: ['Minimum Viable Product', 'minimální životaschopný produkt', 'první verze produktu'],
    short:
      'MVP je nejmenší verze produktu, se kterou už mohou pracovat skuteční uživatelé. Ověří nápad dřív, než se do něj investuje víc.',
    body: [
      'MVP (Minimum Viable Product) je první verze produktu, která obsahuje jen to nejdůležitější, ale funguje naostro. Cílem není hotový produkt, ale co nejdřív zjistit, jestli ho lidé opravdu použijí a za co jsou ochotni zaplatit.',
      'Dobré MVP je malé, ne odbyté. Musí být spolehlivé a příjemné na používání, jinak se z něj nedá nic poznat. Šetří se na rozsahu, ne na kvalitě.',
      'Po spuštění přichází data a zpětná vazba. Podle nich se rozhoduje, co stavět dál, co změnit a co vynechat.',
    ],
    example: {
      text: 'Se startupy stavíme první verzi produktu jako dlouhodobý technický partner.',
      href: '/startup-support',
      label: 'Startup Support',
    },
    related: {
      cases: ['testamentist', 'inkluem'],
      terms: ['webova-aplikace', 'edtech'],
    },
    updated: UPDATED,
  },
  {
    slug: 'cms',
    term: 'CMS',
    aka: ['redakční systém', 'Content Management System', 'správa obsahu'],
    short: 'CMS je redakční systém, ve kterém si texty, fotky, ceny a aktuality na webu upravujete sami. Programátora potřebujete jen na nové funkce.',
    body: [
      'CMS (Content Management System) je administrace webu. Přihlásíte se, upravíte text, vyměníte fotku nebo přidáte aktualitu a změna je hned na webu. Programátora potřebujete jen na nové funkce, ne na každou opravu překlepu.',
      'CMS se dá postavit dvěma způsoby. Buď je web i administrace jeden celek (třeba WordPress), nebo je administrace oddělená a web si z ní obsah jen načítá. Druhý přístup dává rychlejší a bezpečnější web a víc volnosti v designu.',
      'U CMS je důležité, aby odpovídalo tomu, co budete upravovat. Méně polí a jasné názvy jsou lepší než univerzální editor, ve kterém se dá omylem rozbít celá stránka.',
    ],
    example: {
      text: 'Autoškola Falář si texty a ceny kurzů upravuje sama přes CMS.',
      href: '/reference/autoskola-falar',
      label: 'Autoškola Falář',
    },
    related: {
      services: ['weby-a-aplikace'],
      cases: ['autoskola-falar', 'esn-uwb'],
      terms: ['nextjs', 'technicke-seo'],
    },
    updated: UPDATED,
  },
  {
    slug: 'technicke-seo',
    term: 'Technické SEO',
    aka: ['SEO', 'optimalizace pro vyhledávače'],
    short:
      'Technické SEO je péče o to, aby vyhledávače web snadno prošly a pochopily: rychlost, struktura, metadata a strukturovaná data.',
    body: [
      'SEO (optimalizace pro vyhledávače) má dvě poloviny: obsah, který lidé hledají, a technický základ, bez kterého ani dobrý obsah nemusí být vidět. Technické SEO řeší právě ten základ.',
      'Patří sem rychlé načítání a dobré zobrazení na mobilu, srozumitelné adresy stránek, titulky a popisy pro výsledky vyhledávání, mapa webu, kanonické adresy a strukturovaná data, ze kterých Google pozná, co je služba, firma nebo otázka a odpověď.',
      'Technické SEO se nejlépe dělá od začátku, při stavbě webu. Dodatečné opravy bývají dražší a často narazí na omezení šablony.',
    ],
    related: {
      services: ['weby-a-aplikace'],
      terms: ['nextjs', 'cms'],
    },
    updated: UPDATED,
  },
  {
    slug: 'datova-pipeline',
    term: 'Datová pipeline',
    aka: ['datový tok', 'zpracování dat', 'ETL'],
    short:
      'Datová pipeline je řetězec kroků, který data automaticky sebere, vyčistí, zpracuje a doručí tam, kde se s nimi pracuje.',
    body: [
      'Data málokdy přicházejí v podobě, ve které se dají rovnou použít. Datová pipeline je proces, který je provede několika kroky: sběr ze zdroje, kontrola a čištění, sjednocení formátu, výpočty a nakonec uložení do databáze, reportu nebo aplikace.',
      'Každý krok běží automaticky a zapisuje, co udělal. Když něco selže, pipeline to oznámí a chybná data nepustí dál. Díky tomu se dá výstupům věřit.',
      'Pipeline se hodí všude, kde se pravidelně zpracovává větší množství dat: měření ze senzorů, exporty z několika systémů nebo rozpisy z mnoha webů.',
    ],
    example: {
      text: 'V ClearWay vede pipeline data ze senzorů na vozidle až na mapu stavu silnic, bez ručního zásahu.',
      href: '/reference/clearway',
      label: 'ClearWay',
    },
    related: {
      services: ['automatizace-procesu'],
      cases: ['clearway', 'gridtime'],
      terms: ['sber-dat', 'postgresql', 'gis'],
    },
    updated: UPDATED,
  },
  {
    slug: 'sber-dat',
    term: 'Sběr dat',
    aka: ['scraping', 'web scraping', 'scraper'],
    short:
      'Sběr dat (scraping) je automatické získávání údajů z webů nebo dokumentů tam, kde zdroj nenabízí API ani export.',
    body: [
      'Ne každý zdroj informací nabízí API. Ceny dodavatelů, rozpisy, veřejné registry nebo tabulky na webu jsou často jen ke čtení. Scraper je program, který takovou stránku pravidelně projde a potřebné údaje si vypíše do strukturované podoby.',
      'Sběr dat musí být ohleduplný a v souladu s podmínkami zdroje: nezatěžovat cizí web, respektovat pravidla a nebrat osobní údaje, na které nemáme nárok. Kde je k dispozici API, dáváme mu přednost.',
      'Weby se mění, a scraper proto potřebuje dohled. Hlídáme, jestli data chodí v očekávané podobě, a při změně zdroje ho upravíme.',
    ],
    example: {
      text: 'GridTime sbírá rozpisy závodů ze scraperů a API jednotlivých sérií a sjednocuje je do jednoho kalendáře.',
      href: '/reference/gridtime',
      label: 'GridTime',
    },
    related: {
      services: ['automatizace-procesu'],
      cases: ['gridtime'],
      terms: ['datova-pipeline', 'api'],
    },
    updated: UPDATED,
  },
  {
    slug: 'vytezovani-dokumentu',
    term: 'Vytěžování dokumentů',
    aka: ['OCR', 'vytěžování faktur', 'rozpoznávání textu'],
    short:
      'Vytěžování dokumentů je automatické čtení údajů z faktur, objednávek a e-mailů, aby je nikdo nemusel přepisovat.',
    body: [
      'Faktury, dodací listy nebo objednávky chodí jako PDF, sken nebo text v e-mailu. Vytěžování z nich automaticky přečte potřebné údaje: dodavatele, částku, splatnost, položky. Dříve to zvládalo hlavně OCR (rozpoznávání textu), dnes k němu pomáhá i umělá inteligence, která si poradí s různými formáty.',
      'Vytěžené údaje se pak samy zapíšou do účetnictví nebo interního systému. Odpadá opisování, které je pomalé a plné překlepů.',
      'Výsledek by měl vždy zkontrolovat člověk, alespoň u nejistých případů. Dobře nastavené vytěžování samo upozorní, kde si není jisté.',
    ],
    related: {
      services: ['automatizace-procesu'],
      terms: ['umela-inteligence', 'integrace-systemu'],
    },
    updated: UPDATED,
  },
  {
    slug: 'umela-inteligence',
    term: 'Umělá inteligence ve firemních procesech',
    aka: ['AI', 'umělá inteligence', 'jazykové modely'],
    short:
      'Umělá inteligence ve firmě pomáhá třídit poptávky, číst faktury a e-maily a navrhovat odpovědi. Výsledek má vždy kontrolovat člověk.',
    body: [
      'Umělá inteligence, hlavně jazykové modely, umí dobře pracovat s textem: shrnout e-mail, roztřídit poptávky, vytáhnout údaje z faktury nebo navrhnout odpověď zákazníkovi. Ve firemních procesech šetří čas tam, kde se dřív muselo všechno číst a přepisovat.',
      'AI ale dělá chyby a umí je podat přesvědčivě. Proto ji nasazujeme tak, aby výsledek zkontroloval člověk nebo aby chyba neměla vážné následky. A pečlivě hlídáme, jaká data se do AI posílají.',
      'Nejlepší výsledky přináší AI jako jeden krok v automatizaci, ne jako samostatný chatbot. Například: e-mail přijde, AI z něj vytáhne objednávku, systém ji založí a člověk ji jen schválí.',
    ],
    example: {
      text: 'Testamentist je AI trenažér, ve kterém si krizoví intervenienti zkoušejí náročné rozhovory.',
      href: '/reference',
      label: 'Reference',
    },
    related: {
      services: ['automatizace-procesu'],
      cases: ['testamentist'],
      terms: ['vytezovani-dokumentu', 'datova-pipeline'],
    },
    updated: UPDATED,
  },
  {
    slug: 'gis',
    term: 'GIS',
    aka: ['geografický informační systém', 'mapová aplikace'],
    short:
      'GIS je systém pro práci s daty, která mají polohu. Zobrazuje je na mapě, kde se dají filtrovat, měřit a vyhodnocovat.',
    body: [
      'GIS (geografický informační systém) spojuje data s místem. Každý záznam má souřadnice nebo tvar, třeba bod, úsek silnice nebo pozemek, a systém s ním umí počítat: najít, co je poblíž, sečíst délky nebo obarvit mapu podle hodnot.',
      'Pro města, správce sítí, logistiku nebo stavebnictví je GIS přirozený způsob, jak vidět stav věcí v prostoru. Místo tabulky s tisíci řádky stačí pohled na mapu.',
      'Webová GIS aplikace běží v prohlížeči a mapové podklady i data si načítá ze serveru. Pro velké objemy dat se mapa skládá z dlaždic, aby zůstala rychlá.',
    ],
    example: {
      text: 'ClearWay ukazuje správci stav povrchu silnic jako barevnou mapu úseků.',
      href: '/reference/clearway',
      label: 'ClearWay',
    },
    related: {
      services: ['interni-systemy'],
      cases: ['clearway'],
      terms: ['postgis', 'openstreetmap', 'datova-pipeline'],
    },
    updated: UPDATED,
  },
  {
    slug: 'postgis',
    term: 'PostGIS',
    short:
      'PostGIS je rozšíření databáze PostgreSQL pro mapová data. Ukládá body, linie a plochy a umí s nimi počítat, třeba hledat nejbližší úsek silnice.',
    body: [
      'PostGIS přidává do databáze PostgreSQL práci s polohou. Kromě běžných údajů v ní můžete ukládat body, linie a plochy a ptát se třeba na to, který úsek silnice je nejblíž naměřenému bodu nebo co leží uvnitř daného území.',
      'Je to otevřený software, takže se za něj neplatí licence. Patří mezi nejpoužívanější nástroje pro mapová data a používá ho řada měst, státních institucí i firem.',
      'V praxi PostGIS tvoří jádro GIS aplikací: data do něj přitékají z pipeline a mapa si z něj bere, co má zobrazit.',
    ],
    example: {
      text: 'V ClearWay se v PostGIS páruje průběh jízdy se silniční sítí z OpenStreetMap.',
      href: '/reference/clearway',
      label: 'ClearWay',
    },
    related: {
      cases: ['clearway'],
      terms: ['postgresql', 'gis', 'openstreetmap'],
    },
    updated: UPDATED,
  },
  {
    slug: 'openstreetmap',
    term: 'OpenStreetMap',
    aka: ['OSM'],
    short:
      'OpenStreetMap je otevřená mapa světa, kterou tvoří komunita. Její data se dají volně použít i ve firemních aplikacích.',
    body: [
      'OpenStreetMap (OSM) je mapa, kterou podobně jako Wikipedii doplňují dobrovolníci po celém světě. Obsahuje silnice, budovy, adresy, cesty i obchody a její data jsou volně dostupná pod otevřenou licencí. Stačí uvést zdroj.',
      'Pro aplikace je OSM cenný hlavně jako data, ne jen jako obrázek mapy. Silniční síť se dá stáhnout, uložit do databáze a počítat nad ní, třeba přiřadit naměřené hodnoty ke konkrétním úsekům.',
      'Výhodou je, že se neplatí za každé zobrazení mapy jako u některých komerčních služeb. Nevýhodou, že kvalita dat se místy liší a je dobré ji ověřit.',
    ],
    example: {
      text: 'ClearWay páruje záznamy jízd se silniční sítí z OpenStreetMap.',
      href: '/reference/clearway',
      label: 'ClearWay',
    },
    related: {
      cases: ['clearway'],
      terms: ['gis', 'postgis'],
    },
    updated: UPDATED,
  },
  {
    slug: 'postgresql',
    term: 'PostgreSQL',
    aka: ['Postgres', 'databáze'],
    short:
      'PostgreSQL je spolehlivá otevřená databáze, ve které aplikace ukládají svá data. Bez licenčních poplatků a s dlouhou historií.',
    body: [
      'PostgreSQL (zkráceně Postgres) je relační databáze: data ukládá do tabulek se vztahy mezi nimi a hlídá, aby zůstala v pořádku, i když s nimi pracuje víc lidí najednou. Vyvíjí se desítky let a je otevřená, takže za ni neplatíte licence.',
      'Pro firmu je volba databáze důležitá hlavně z dlouhodobého pohledu. Postgres zvládne malou aplikaci i miliony záznamů, běží u všech velkých cloudových poskytovatelů a data se z něj dají kdykoliv přenést jinam.',
      'Díky rozšířením umí i speciální úlohy, třeba mapová data přes PostGIS nebo fulltextové vyhledávání.',
    ],
    related: {
      services: ['interni-systemy'],
      cases: ['clearway', 'gridtime'],
      terms: ['postgis', 'fastapi'],
    },
    updated: UPDATED,
  },
  {
    slug: 'fastapi',
    term: 'FastAPI',
    short:
      'FastAPI je nástroj v jazyce Python pro stavbu rychlých a dobře zdokumentovaných API. Používáme ho pro serverovou část aplikací.',
    body: [
      'FastAPI je framework pro jazyk Python, ve kterém se píše serverová část aplikace: API, přes které si s ní povídají webové a mobilní aplikace nebo jiné systémy. Je rychlý a z kódu sám vytvoří dokumentaci API.',
      'Python je silný v práci s daty, výpočtech a umělé inteligenci. FastAPI proto dobře sedí tam, kde se data zpracovávají, vyhodnocují nebo kde se volá AI.',
      'Pro zadavatele to znamená hlavně srozumitelné a dobře popsané rozhraní, na které se dají později napojit i další nástroje.',
    ],
    related: {
      cases: ['clearway', 'gridtime'],
      terms: ['api', 'postgresql', 'datova-pipeline'],
    },
    updated: UPDATED,
  },
  {
    slug: 'nextjs',
    term: 'Next.js',
    aka: ['React'],
    short:
      'Next.js je moderní nástroj pro stavbu webů a webových aplikací. Stránky se načítají rychle a vyhledávače jim dobře rozumí.',
    body: [
      'Next.js je framework nad knihovnou React, na kterém dnes běží velká část moderních webů. Stránky umí připravit dopředu na serveru, takže se u návštěvníka zobrazí hned a vyhledávač vidí celý obsah.',
      'Na jednom základu se dá postavit firemní prezentace i složitá webová aplikace s přihlášením a databází. Web se pak může postupně rozrůstat, aniž by se musel přepisovat.',
      'Weby v Next.js obvykle běží na platformách jako Vercel, které se postarají o rychlé doručení po celém světě, certifikáty a zálohy verzí.',
    ],
    example: {
      text: 'Na Next.js stojí i tento web a weby, které jsme postavili pro klienty.',
      href: '/sluzby/weby-a-aplikace',
      label: 'Weby a webové aplikace',
    },
    related: {
      services: ['weby-a-aplikace'],
      cases: ['autoskola-falar', 'esn-uwb', 'gridtime'],
      terms: ['webova-aplikace', 'hosting', 'technicke-seo'],
    },
    updated: UPDATED,
  },
  {
    slug: 'hosting',
    term: 'Hosting a cloud',
    aka: ['webhosting', 'cloudová infrastruktura', 'Vercel'],
    short:
      'Hosting je místo, kde web nebo aplikace běží. V cloudu se o servery stará poskytovatel a výkon roste podle potřeby.',
    body: [
      'Každý web a každá aplikace musí někde běžet. Klasický hosting je pronajatý prostor na serveru. Cloud jde dál: aplikace běží na infrastruktuře velkého poskytovatele, výkon se přidává podle zátěže a platí se podle skutečného využití.',
      'Pro weby používáme platformy jako Vercel, které stránky doručují z míst blízko návštěvníka, samy obnovují certifikáty a každou verzi si pamatují, takže se dá vrátit zpět.',
      'U firemních systémů je důležité vědět, kde data leží, kdo k nim má přístup a jak se zálohují. To by mělo být sepsané a ne jen v hlavě jednoho člověka.',
    ],
    related: {
      services: ['weby-a-aplikace', 'it-podpora'],
      terms: ['nextjs', 'zalohovani', 'dns'],
    },
    updated: UPDATED,
  },
  {
    slug: 'dns',
    term: 'DNS a doména',
    aka: ['doména', 'DNS záznamy'],
    short:
      'DNS je systém, který překládá doménu jako firma.cz na adresu serveru. Řídí, kde běží web, kam chodí e-maily a kdo smí posílat poštu za vás.',
    body: [
      'Doména je jméno, pod kterým vás lidé najdou. DNS (Domain Name System) je seznam záznamů, který říká, na jakém serveru běží web, kam se doručují e-maily a které služby smí jménem domény posílat poštu.',
      'Chyba v DNS umí shodit web i e-mail najednou. Špatně nastavené záznamy pro poštu zase způsobují, že vaše e-maily končí ve spamu nebo že se za vás někdo může vydávat.',
      'Je dobré vědět, kde je doména registrovaná, kdo k ní má přístup a kdy se platí prodloužení. Zapomenutá platba za doménu je překvapivě častá příčina výpadků.',
    ],
    related: {
      services: ['it-podpora', 'weby-a-aplikace'],
      terms: ['hosting', 'microsoft-365-google-workspace'],
    },
    updated: UPDATED,
  },
  {
    slug: 'microsoft-365-google-workspace',
    term: 'Microsoft 365 a Google Workspace',
    aka: ['Office 365', 'G Suite', 'firemní e-mail'],
    short:
      'Microsoft 365 a Google Workspace jsou kancelářské balíky v cloudu: firemní e-mail, kalendář, dokumenty, sdílené disky a schůzky.',
    body: [
      'Oba balíky nabízejí totéž jádro: firemní e-mail na vlastní doméně, kalendáře, dokumenty a tabulky, sdílené disky a videohovory. Microsoft 365 je bližší firmám zvyklým na Word a Excel, Google Workspace je jednodušší a celý běží v prohlížeči.',
      'Rozdíl mezi „máme to“ a „máme to dobře nastavené“ je velký. Patří sem dvoufázové ověření, rozumná oprávnění ke sdíleným složkám, správa licencí a pořádek při nástupu a odchodu zaměstnanců.',
      'Oba balíky mají API, takže se na ně dají napojit automatizace: třeba přílohy z e-mailu do systému nebo události z interní aplikace do kalendáře.',
    ],
    example: {
      text: 'Nastavení, uživatelé, sdílené disky a přechod e-mailů patří do naší IT podpory.',
      href: '/sluzby/it-podpora',
      label: 'IT podpora a správa',
    },
    related: {
      services: ['it-podpora', 'automatizace-procesu'],
      terms: ['dvoufazove-overeni', 'zalohovani', 'dns'],
    },
    updated: UPDATED,
  },
  {
    slug: 'zalohovani',
    term: 'Zálohování a obnova',
    aka: ['záloha dat', 'backup', 'obnova po havárii'],
    short:
      'Záloha je kopie dat, ze které se dá obnovit po chybě, útoku nebo výpadku. Bez vyzkoušené obnovy je to jen naděje.',
    body: [
      'Zálohování znamená pravidelně kopírovat data a systémy na jiné místo, aby se daly obnovit, když se něco pokazí: smazaný soubor, porouchaný disk, ransomware nebo chyba v aplikaci.',
      'Dobrá záloha je pravidelná, automatická, uložená mimo hlavní systém a aspoň jedna kopie je oddělená tak, aby ji útočník nemohl smazat spolu s originálem. Hlavně ale musí jít obnovit, a to se ověří jen tím, že se obnova skutečně vyzkouší.',
      'Pro firmu je dobré znát dvě čísla: kolik dat si může dovolit ztratit (třeba poslední den) a jak dlouho může být bez systému. Podle nich se nastaví, jak často a kam se zálohuje.',
    ],
    example: {
      text: 'Zálohy dat i systémů a pravidelnou zkoušku obnovy zajišťujeme v rámci IT podpory.',
      href: '/sluzby/it-podpora',
      label: 'IT podpora a správa',
    },
    related: {
      services: ['it-podpora'],
      terms: ['dvoufazove-overeni', 'hosting', 'microsoft-365-google-workspace'],
    },
    updated: UPDATED,
  },
  {
    slug: 'dvoufazove-overeni',
    term: 'Dvoufázové ověření',
    aka: ['2FA', 'MFA', 'vícefaktorové ověření'],
    short:
      'Dvoufázové ověření chrání účet druhým krokem po hesle, třeba kódem v telefonu. Zastaví většinu útoků s ukradeným heslem.',
    body: [
      'Hesla unikají: z napadených webů, přes podvodné e-maily nebo proto, že se jedno heslo používá všude. Dvoufázové ověření (2FA nebo MFA) přidává po hesle druhý krok, například potvrzení v aplikaci v telefonu nebo bezpečnostní klíč.',
      'Útočník, který zná heslo, se bez druhého kroku do účtu nedostane. Proto je 2FA na firemním e-mailu a v cloudových službách jedna z nejúčinnějších a nejlevnějších ochran vůbec.',
      'Zapnout ho je potřeba všem, nejen vedení. A je dobré mít připravený postup pro případ, že někdo telefon ztratí.',
    ],
    related: {
      services: ['it-podpora'],
      terms: ['microsoft-365-google-workspace', 'zalohovani'],
    },
    updated: UPDATED,
  },
  {
    slug: 'edtech',
    term: 'EdTech',
    aka: ['vzdělávací technologie', 'e-learning'],
    short:
      'EdTech jsou technologie pro vzdělávání: aplikace, trenažéry a platformy, které pomáhají učit se a trénovat dovednosti.',
    body: [
      'EdTech (z anglického education technology) zahrnuje software pro výuku a trénink: od kurzů a testů po simulace, ve kterých si člověk vyzkouší situaci dřív, než ho potká naostro.',
      'Největší hodnotu mají nástroje, které nenahrazují učitele, ale dávají prostor k procvičení a okamžitou zpětnou vazbu. Krátký scénář, rozhodnutí a vysvětlení, proč bylo dobré nebo špatné.',
      'U vzdělávacích aplikací rozhoduje přístupnost a srozumitelnost. Musí fungovat pro lidi s různými schopnostmi a na zařízeních, která mají ve škole nebo doma.',
    ],
    example: {
      text: 'INKLUEM je trenažér situací pro inkluzivní školu, pro učitele, asistenty, rodiče i děti.',
      href: '/reference',
      label: 'Reference',
    },
    related: {
      cases: ['inkluem', 'testamentist'],
      terms: ['webova-aplikace', 'mvp'],
    },
    updated: UPDATED,
  },
];

export function getTerm(slug: string) {
  return glossary.find((t) => t.slug === slug);
}

/** Terms sorted the Czech way (Ch after H), grouped by first letter. */
export function glossaryByLetter() {
  const collator = new Intl.Collator('cs');
  const sorted = [...glossary].sort((a, b) => collator.compare(a.term, b.term));
  const groups = new Map<string, Term[]>();
  for (const t of sorted) {
    const letter = t.term.toLocaleUpperCase('cs').startsWith('CH') ? 'Ch' : t.term[0].toLocaleUpperCase('cs');
    groups.set(letter, [...(groups.get(letter) ?? []), t]);
  }
  return [...groups.entries()].map(([letter, terms]) => ({ letter, terms }));
}

/** Matches a stack or tag label from case studies to a term, if one exists. */
const LABEL_TO_TERM: Record<string, string> = {
  GIS: 'gis',
  'Datová pipeline': 'datova-pipeline',
  'Mobilní aplikace': 'mobilni-aplikace',
  'Sběr dat': 'sber-dat',
  CMS: 'cms',
  AI: 'umela-inteligence',
  'Webová aplikace': 'webova-aplikace',
  EdTech: 'edtech',
  FastAPI: 'fastapi',
  'PostgreSQL + PostGIS': 'postgis',
  PostgreSQL: 'postgresql',
  OpenStreetMap: 'openstreetmap',
  'Expo (iOS, Android)': 'mobilni-aplikace',
  Expo: 'mobilni-aplikace',
  'Next.js': 'nextjs',
  Vercel: 'hosting',
};

export function termForLabel(label: string) {
  const slug = LABEL_TO_TERM[label];
  return slug ? getTerm(slug) : undefined;
}

/** Terms that name a given service among their related services. */
export function termsForService(serviceSlug: string) {
  return glossary.filter((t) => t.related.services?.includes(serviceSlug));
}

/** "Co je API", "Co je integrace systémů": a common noun starts lower-case
 * mid-sentence, a name or abbreviation keeps its capitals. */
export function termQuestion(t: Term) {
  const first = t.term.split(' ')[0];
  const isName = /[A-Z]/.test(first.slice(1)) || first.includes('.') || /^(Microsoft|Google)/.test(t.term);
  const subject = isName ? t.term : t.term.charAt(0).toLocaleLowerCase('cs') + t.term.slice(1);
  return `Co je ${subject}`;
}
