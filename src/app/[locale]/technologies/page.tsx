import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const BASE = 'https://zephyron.tech';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isCs = locale === 'cs';
  return {
    title: isCs ? 'Technologie' : 'Technologies',
    description: isCs
      ? 'Přehled technologií, které Zephyron Tech používá při vývoji — TypeScript, Python, FastAPI, Next.js, PostgreSQL, Docker, CI/CD a GIS.'
      : 'An overview of the technologies Zephyron Tech uses in development — TypeScript, Python, FastAPI, Next.js, PostgreSQL, Docker, CI/CD and GIS.',
    alternates: {
      canonical: isCs ? `${BASE}/cs/technologies` : `${BASE}/technologies`,
      languages: {
        'en':        `${BASE}/technologies`,
        'cs':        `${BASE}/cs/technologies`,
        'x-default': `${BASE}/technologies`,
      },
    },
  };
}

// ── Content ────────────────────────────────────────────────────────────────

interface TechEntry {
  name: string;
  group: string;
  what: string;
  why: string;
  when: string;
}

const en: { title: string; lead: string; back: string; cta: string; items: TechEntry[] } = {
  title:  'Our tech stack',
  lead:   'These are the tools we reach for first — proven in production, chosen for reason. We adapt to what you already have, but below is where we start.',
  back:   '← Back to home',
  cta:    'Discuss a project',
  items: [
    {
      name:  'TypeScript',
      group: 'Language',
      what:  'TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. It adds optional type annotations, interfaces, and compile-time checks to JavaScript code.',
      why:   'We use TypeScript across the full stack — from Next.js front-ends to Node.js tooling. Strict typing catches entire classes of bugs before they reach production and makes large codebases significantly easier to navigate and refactor.',
      when:  'Any project with a JavaScript front-end or Node.js back-end. Especially valuable when the team grows or when the codebase needs to be maintained for years.',
    },
    {
      name:  'Python',
      group: 'Language',
      what:  'Python is a high-level, general-purpose programming language known for its readability and vast ecosystem of libraries — particularly in data science, machine learning, and automation.',
      why:   'Python is our language of choice for back-end services, data pipelines, and scientific computing. The ecosystem (NumPy, Pandas, Shapely, GDAL) is unmatched for geospatial and data-heavy work.',
      when:  'Data pipelines, REST APIs, geospatial processing, automation scripts, and any project that interfaces with scientific or ML libraries.',
    },
    {
      name:  'FastAPI',
      group: 'Framework',
      what:  'FastAPI is a modern Python web framework for building APIs. It is based on standard Python type hints, delivers automatic OpenAPI documentation, and is one of the fastest Python frameworks available thanks to its async architecture.',
      why:   'FastAPI gives us a highly productive API development experience with automatic validation, serialisation, and documentation — without sacrificing performance. Async support means it handles concurrent workloads efficiently.',
      when:  'Any Python-based REST or WebSocket API. Particularly effective for data-heavy services that need to expose clean, documented interfaces.',
    },
    {
      name:  'Next.js',
      group: 'Framework',
      what:  'Next.js is a React framework from Vercel that supports server-side rendering, static site generation, and React Server Components out of the box. It handles routing, bundling, and deployment optimisation automatically.',
      why:   'Next.js lets us ship production-grade web applications with excellent performance characteristics — edge rendering, automatic image optimisation, and zero-config deployment to Vercel. It is the foundation of this very website.',
      when:  'Marketing sites, web applications, dashboards, and any project where web performance and developer experience both matter.',
    },
    {
      name:  'GIS / GeoData',
      group: 'Domain',
      what:  'Geographic Information Systems (GIS) encompass software, data formats, and algorithms for capturing, storing, analysing, and visualising spatial data. Key technologies include PostGIS, OpenStreetMap, vector tiles, and WebGL-based map renderers.',
      why:   'Geospatial capability is a core differentiator for us. We have built production systems that process raw sensor telemetry (IMU, GNSS, LiDAR) into map-matched road surface assessments rendered as WebGL tile layers.',
      when:  'Infrastructure inspection, logistics, urban planning, asset tracking, environmental monitoring, and any domain where "where" is as important as "what".',
    },
    {
      name:  'PostgreSQL',
      group: 'Datastore',
      what:  'PostgreSQL is a powerful open-source relational database system. With the PostGIS extension it becomes a fully-featured spatial database. It also supports full-text search, JSON documents, and time-series data natively.',
      why:   'A single PostgreSQL instance can replace three or four specialised databases in many projects. OLTP workloads, geospatial queries, full-text search, and JSON storage all in one engine — with strong transactional guarantees.',
      when:  'Almost every persistent data layer. We default to PostgreSQL unless the project has very specific requirements that justify a different engine (e.g. pure document storage or vector search at scale).',
    },
    {
      name:  'Docker',
      group: 'Infrastructure',
      what:  'Docker is a platform for building, shipping, and running applications in isolated containers. Containers package code and dependencies together, ensuring consistent behaviour across development, staging, and production environments.',
      why:   'Docker eliminates "works on my machine" problems entirely. Multi-stage builds produce minimal production images, and container orchestration (Docker Compose, Kubernetes) makes scaling predictable.',
      when:  'Every back-end service we ship. Front-ends deployed to Vercel do not need Docker, but any Python service, data pipeline, or self-hosted tool is containerised from day one.',
    },
    {
      name:  'CI/CD',
      group: 'Infrastructure',
      what:  'Continuous Integration and Continuous Delivery (CI/CD) are practices and tooling that automate testing, building, and deploying software. We use GitHub Actions as the primary platform, with support for ephemeral preview environments and signed build artefacts.',
      why:   'Automated pipelines mean every commit is tested and every merge to main can be deployed in minutes. Ephemeral previews let stakeholders review changes before they go live. Signed builds provide a verifiable chain of custody from code to production.',
      when:  'Every project. CI/CD is not optional — it is the baseline for any software that needs to be maintained, updated, and trusted in production.',
    },
  ],
};

const cs: typeof en = {
  title: 'Náš tech stack',
  lead:  'Tyto nástroje sáhneme po nich jako první — prověřené v produkci, vybrané s rozmyslem. Přizpůsobíme se tomu, co už máte, ale níže je náš výchozí bod.',
  back:  '← Zpět na hlavní stránku',
  cta:   'Probrat projekt',
  items: [
    {
      name:  'TypeScript',
      group: 'Jazyk',
      what:  'TypeScript je staticky typovaná nadmnožina JavaScriptu, která se kompiluje do čistého JS. Přidává volitelné typové anotace, rozhraní a kontroly v čase kompilace.',
      why:   'TypeScript používáme napříč celým stackem — od Next.js front-endů po Node.js nástroje. Striktní typování zachytí celé třídy chyb ještě před nasazením a velké kódové základny jsou výrazně snazší na navigaci a refactoring.',
      when:  'Každý projekt s JS front-endem nebo Node.js back-endem. Zvláště hodnotný když tým roste nebo kdy kód musí být udržován léta.',
    },
    {
      name:  'Python',
      group: 'Jazyk',
      what:  'Python je vysokoúrovňový jazyk pro obecné použití, známý čitelností a rozsáhlým ekosystémem — zejména v datové vědě, strojovém učení a automatizaci.',
      why:   'Python je naším jazykem volby pro back-endové služby, datové pipeline a vědecké výpočty. Ekosystém (NumPy, Pandas, Shapely, GDAL) je v oblasti geoprostorových a datově náročných prací nesrovnatelný.',
      when:  'Datové pipeline, REST API, geoprostorové zpracování, automatizační skripty a každý projekt napojený na vědecké nebo ML knihovny.',
    },
    {
      name:  'FastAPI',
      group: 'Framework',
      what:  'FastAPI je moderní Python framework pro tvorbu API. Zakládá se na standardních Python typových nápovědách, generuje automatickou OpenAPI dokumentaci a díky asynchronní architektuře patří mezi nejrychlejší Python frameworky.',
      why:   'FastAPI nabízí velmi produktivní vývojářský zážitek s automatickou validací, serializací a dokumentací — bez ztráty výkonu. Async podpora znamená efektivní zpracování souběžných úloh.',
      when:  'Každé Python-based REST nebo WebSocket API. Zvláště efektivní pro datově náročné služby, které potřebují vystavit čistá, zdokumentovaná rozhraní.',
    },
    {
      name:  'Next.js',
      group: 'Framework',
      what:  'Next.js je React framework od Vercelu, který podporuje server-side rendering, statické generování stránek a React Server Components. Routing, bundling a optimalizace nasazení řeší automaticky.',
      why:   'Next.js nám umožňuje vydat produkční webové aplikace s vynikající výkonností — edge rendering, automatická optimalizace obrázků, nasazení na Vercel bez konfigurace. Je to základ i tohoto webu.',
      when:  'Marketingové weby, webové aplikace, dashboardy a každý projekt kde záleží na výkonu i developer experience.',
    },
    {
      name:  'GIS / GeoData',
      group: 'Doména',
      what:  'Geografické informační systémy (GIS) zahrnují software, datové formáty a algoritmy pro sběr, ukládání, analýzu a vizualizaci prostorových dat. Klíčové technologie: PostGIS, OpenStreetMap, vektorové dlaždice a WebGL renderery map.',
      why:   'Geoprostorové schopnosti jsou naší klíčovou odlišností. Postavili jsme produkční systémy, které zpracovávají surovou telemetrii senzorů (IMU, GNSS, LiDAR) do map-matchovaných hodnocení povrchu vozovky renderovaných jako WebGL vrstvy.',
      when:  'Inspekce infrastruktury, logistika, urban planning, sledování majetku, environmentální monitoring a každá doména kde "kde" je stejně důležité jako "co".',
    },
    {
      name:  'PostgreSQL',
      group: 'Úložiště',
      what:  'PostgreSQL je výkonný open-source relační databázový systém. S rozšířením PostGIS se stává plnohodnotnou prostorovou databází. Nativně podporuje také fulltextové vyhledávání, JSON dokumenty a časové řady.',
      why:   'Jedna instance PostgreSQL v mnoha projektech nahradí tři nebo čtyři specializované databáze. OLTP workloady, geoprostorové dotazy, fulltextové vyhledávání i JSON ukládání — v jednom enginu, se silnými transakčními zárukami.',
      when:  'Téměř každá vrstva perzistentních dat. Defaultně volíme PostgreSQL, pokud projekt nemá specifické požadavky ospravedlňující jiný engine (např. čistě dokumentové úložiště nebo vektorové vyhledávání ve velkém měřítku).',
    },
    {
      name:  'Docker',
      group: 'Infrastruktura',
      what:  'Docker je platforma pro sestavování, distribuci a spouštění aplikací v izolovaných kontejnerech. Kontejnery balí kód a závislosti dohromady a zajišťují konzistentní chování ve vývojovém, testovacím i produkčním prostředí.',
      why:   'Docker zcela eliminuje problém "funguje na mém stroji". Multi-stage buildy produkují minimální produkční image a orchestrace kontejnerů (Docker Compose, Kubernetes) dělá škálování předvídatelným.',
      when:  'Každá back-endová služba, kterou nasazujeme. Front-endy nasazované na Vercel Docker nepotřebují, ale každá Python služba, datový pipeline nebo self-hosted nástroj je kontejnerizovaný od prvního dne.',
    },
    {
      name:  'CI/CD',
      group: 'Infrastruktura',
      what:  'Continuous Integration a Continuous Delivery (CI/CD) jsou postupy a nástroje pro automatizaci testování, sestavení a nasazování softwaru. Jako primární platformu používáme GitHub Actions s podporou dočasných preview prostředí a podepsaných artefaktů.',
      why:   'Automatizované pipeline znamenají, že každý commit je otestován a každý merge do main lze nasadit v minutách. Dočasná preview prostředí umožňují zainteresovaným stranám zkontrolovat změny před spuštěním. Podepsané buildy poskytují ověřitelný řetězec důvěry od kódu po produkci.',
      when:  'Každý projekt. CI/CD není volitelné — je to základ pro každý software, který musí být udržován, aktualizován a v produkci důvěryhodný.',
    },
  ],
};

// ── Page ───────────────────────────────────────────────────────────────────

export default async function TechnologiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = locale === 'cs' ? cs : en;
  const localePath = (path: string) => locale === 'en' ? path : `/${locale}${path}`;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: c.title,
    url: locale === 'en' ? `${BASE}/technologies` : `${BASE}/cs/technologies`,
    itemListElement: c.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      description: item.what,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Header />
      <main>
        <article
          style={{
            maxWidth: 800,
            margin: '0 auto',
            padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 40px)',
          }}
        >
          {/* Back link */}
          <a
            href={localePath('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: 14,
              color: 'var(--fg-subtle)',
              marginBottom: 48,
              textDecoration: 'none',
              transition: 'color 120ms',
            }}
          >
            {c.back}
          </a>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(32px, 5vw, 52px)',
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              color: 'var(--fg)',
              margin: '0 0 20px',
            }}
          >
            {c.title}
          </h1>
          <p
            style={{
              fontSize: 'clamp(15px, 1.6vw, 17px)',
              lineHeight: 1.65,
              color: 'var(--fg-muted)',
              margin: '0 0 clamp(48px, 6vw, 80px)',
              maxWidth: '60ch',
            }}
          >
            {c.lead}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {c.items.map((item, i) => (
              <TechItem key={item.name} item={item} index={i} total={c.items.length} />
            ))}
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: 'clamp(48px, 6vw, 80px)',
              padding: 'clamp(28px, 3vw, 40px)',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <p
              style={{
                fontSize: 16,
                color: 'var(--fg-muted)',
                margin: '0 0 20px',
                lineHeight: 1.6,
              }}
            >
              {locale === 'cs'
                ? 'Máte projekt, kde by některá z těchto technologií přišla vhod? Nebo potřebujete jiný stack — rádi se přizpůsobíme.'
                : 'Have a project where one of these technologies would be a good fit? Or need a different stack — we adapt.'}
            </p>
            <a
              href={localePath('/#contact')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--accent-bright)',
                textDecoration: 'none',
              }}
            >
              {c.cta} →
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function TechItem({
  item,
  index,
  total,
}: {
  item: TechEntry;
  index: number;
  total: number;
}) {
  return (
    <div
      style={{
        padding: 'clamp(28px, 3vw, 40px) 0',
        borderTop: '1px solid var(--border)',
        borderBottom: index === total - 1 ? '1px solid var(--border)' : 'none',
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gap: 'clamp(24px, 3vw, 48px)',
        alignItems: 'start',
      }}
      className="zt-tech-item"
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(18px, 2vw, 22px)',
            fontWeight: 600,
            letterSpacing: '-0.015em',
            color: 'var(--fg)',
            marginBottom: 6,
          }}
        >
          {item.name}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--fg-subtle)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}
        >
          {item.group}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--fg-muted)', margin: 0 }}>
          <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>What it is: </strong>
          {item.what}
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--fg-muted)', margin: 0 }}>
          <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>Why we use it: </strong>
          {item.why}
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--fg-muted)', margin: 0 }}>
          <strong style={{ color: 'var(--fg)', fontWeight: 600 }}>When it fits: </strong>
          {item.when}
        </p>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .zt-tech-item { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
    </div>
  );
}
