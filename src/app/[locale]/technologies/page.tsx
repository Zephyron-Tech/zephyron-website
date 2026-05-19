import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const BASE = 'https://zephyron.tech';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Technologies — Our Engineering Stack',
    description:
      'A deep dive into the technologies Zephyron Tech uses in production: TypeScript, Python, FastAPI, Next.js, Spring Boot, Expo, PostgreSQL, Redis, Apache Kafka, GIS, Docker, and CI/CD.',
    alternates: {
      canonical: `${BASE}/technologies`,
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

const items: TechEntry[] = [
  {
    name:  'TypeScript',
    group: 'Language',
    what:  'TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. It adds optional type annotations, interfaces, and compile-time checks to JavaScript, catching entire categories of bugs before code ever runs.',
    why:   'We use TypeScript across the full stack — from Next.js front-ends to Node.js tooling and Expo mobile apps. Strict typing catches entire classes of bugs before they reach production and makes large codebases significantly easier to navigate and refactor. It is especially valuable in long-lived projects where the team changes over time.',
    when:  'Any project with a JavaScript front-end, Node.js back-end, or React Native mobile app. Particularly effective when the team grows or when the codebase needs to be maintained for years without accumulated technical debt.',
  },
  {
    name:  'Python',
    group: 'Language',
    what:  'Python is a high-level, general-purpose programming language known for its readability and vast ecosystem of libraries — particularly in data science, geospatial processing, machine learning, and automation. Its concise syntax and rich standard library make it exceptionally productive for back-end development.',
    why:   'Python is our language of choice for back-end services, data pipelines, and scientific computing. The geospatial ecosystem (NumPy, Pandas, Shapely, Fiona, GDAL, PyProj, GeoPandas) is unmatched for spatial data processing. Combined with FastAPI, Python delivers performant, maintainable REST and WebSocket services.',
    when:  'Data pipelines, REST APIs, geospatial processing, ETL workflows, automation scripts, and any project that interfaces with scientific, ML, or geographic data libraries.',
  },
  {
    name:  'FastAPI',
    group: 'Framework',
    what:  'FastAPI is a modern Python web framework for building APIs. It is based on standard Python type hints and delivers automatic OpenAPI documentation, request validation, and response serialisation out of the box. Its async architecture — built on Starlette and Pydantic — makes it one of the fastest Python frameworks available.',
    why:   'FastAPI gives us a highly productive API development workflow: write a function with typed parameters and FastAPI generates validation, serialisation, and interactive Swagger docs automatically. Async support means it handles concurrent workloads efficiently without threading complexity. We use it as the primary API layer for our Python-based microservices.',
    when:  'Any Python-based REST or WebSocket API. Particularly effective for data-heavy services and machine learning inference endpoints that need to expose clean, self-documenting interfaces at production scale.',
  },
  {
    name:  'Next.js',
    group: 'Framework',
    what:  'Next.js is a React framework from Vercel that supports server-side rendering (SSR), static site generation (SSG), incremental static regeneration (ISR), and React Server Components. It handles routing, bundling, image optimisation, and deployment to the edge automatically.',
    why:   'Next.js lets us ship production-grade web applications with excellent Core Web Vitals — server rendering for SEO and first paint, client-side navigation for interactivity, and edge rendering for global performance. The App Router and React Server Components let us minimise client-side JavaScript while keeping the development model familiar. This website runs on Next.js 15.',
    when:  'Marketing sites, web applications, customer dashboards, SaaS products, and any project where web performance, SEO, and developer experience all need to be excellent simultaneously.',
  },
  {
    name:  'Spring Boot',
    group: 'Framework',
    what:  'Spring Boot is an opinionated, convention-over-configuration Java framework built on top of the Spring ecosystem. It provides auto-configuration, embedded Tomcat/Jetty servers, and production-ready defaults, enabling developers to build stand-alone, production-grade Java applications with minimal boilerplate. The Spring ecosystem includes Spring Data JPA, Spring Security, Spring Batch, and Spring Cloud.',
    why:   'Spring Boot is the de facto standard for enterprise Java back-ends. It provides a mature, battle-tested foundation for REST APIs, microservices, and data-processing services — with deep support for transactions, security, dependency injection, and database migrations via Liquibase. For clients with existing Java infrastructure, Spring Boot lets us integrate cleanly without requiring a technology rewrite.',
    when:  'Enterprise back-end services, microservice architectures, data processing pipelines, and any project where Java is the primary language or an existing Java codebase needs to be extended with modern practices.',
  },
  {
    name:  'Expo',
    group: 'Framework',
    what:  'Expo is a framework and platform for building cross-platform mobile applications using React and TypeScript. It sits on top of React Native and provides a managed workflow, over-the-air (OTA) updates via EAS Update, and access to device APIs through a unified JavaScript interface. EAS Build compiles native iOS and Android artefacts in the cloud.',
    why:   'Expo lets us ship production iOS and Android apps from a single TypeScript codebase — the same language and component model as the web, with access to native device capabilities. OTA updates mean bug fixes reach users without an App Store review cycle. EAS Build removes the need for dedicated macOS build machines for Android. We use Expo in GridTime, our cross-platform motorsport calendar app.',
    when:  'Mobile applications that need to run on both iOS and Android, where native UI fidelity and access to device APIs are required, but maintaining two separate native codebases would be impractical or cost-prohibitive.',
  },
  {
    name:  'GIS / GeoData',
    group: 'Domain',
    what:  'Geographic Information Systems (GIS) encompass software, data formats, and algorithms for capturing, storing, analysing, and visualising spatial data. Key technologies include PostGIS (spatial SQL), OpenStreetMap, map matching algorithms, vector tiles (MVT/PMTiles), and WebGL-based map renderers such as MapLibre GL and Mapbox GL.',
    why:   'Geospatial capability is a core differentiator for us. We have built production systems that process raw sensor telemetry (IMU, GNSS, LiDAR) into map-matched road surface assessments rendered as WebGL tile layers — the ClearWay platform. Our stack covers the full pipeline: raw coordinate ingestion → PostGIS processing → map matching against OSM road network → vector tile generation → interactive WebGL visualisation.',
    when:  'Infrastructure inspection and asset management, logistics and routing optimisation, urban planning, environmental monitoring, fleet tracking, and any domain where spatial relationships are central to the data model.',
  },
  {
    name:  'PostgreSQL',
    group: 'Datastore',
    what:  'PostgreSQL is a powerful open-source relational database system with over 35 years of active development. With the PostGIS extension it becomes a fully-featured spatial database capable of storing and querying geographic objects. It also supports full-text search, JSONB documents, time-series data via TimescaleDB, and advanced indexing strategies (GIN, GiST, BRIN).',
    why:   'A single PostgreSQL instance can replace three or four specialised databases in many projects. OLTP workloads, geospatial queries with PostGIS, full-text search, and JSON document storage all in one engine — with strong ACID transactional guarantees and excellent query planner performance. We pair it with Liquibase for schema migration management and PgBouncer for connection pooling in high-load deployments.',
    when:  'Almost every persistent data layer. We default to PostgreSQL unless the project has very specific requirements that justify a different engine — such as pure vector search at scale (pgvector), time-series-first workloads (InfluxDB), or a document-primary schema (MongoDB).',
  },
  {
    name:  'Redis',
    group: 'Datastore',
    what:  'Redis is an open-source, in-memory data structure store that functions as a database, cache, message broker, and streaming engine simultaneously. It supports strings, hashes, lists, sets, sorted sets, bitmaps, hyperloglogs, and streams — all with sub-millisecond latency and atomic operations. Redis Cluster and Redis Sentinel provide horizontal scalability and high availability.',
    why:   'Redis is our first choice for caching hot database query results, storing short-lived session tokens, implementing rate limiting with sliding window counters, and powering real-time pub/sub notifications. Its atomic operations (INCR, LPUSH, ZADD) make it ideal for coordination problems — like distributed locks or leaderboards — that would be expensive or race-condition-prone in a relational database.',
    when:  'API response caching, session management, distributed rate limiting, real-time leaderboards, task queues with Celery or BullMQ, pub/sub event distribution, and any workload where microsecond latency or atomic counter operations are required.',
  },
  {
    name:  'Kafka',
    group: 'Infra',
    what:  'Apache Kafka is a distributed event streaming platform designed for high-throughput, fault-tolerant, persistent messaging at scale. It maintains ordered, immutable logs of events (topics) that can be replayed from any offset, and supports both real-time stream processing and batch consumption. Kafka Connect and Kafka Streams extend it with out-of-the-box connectors and a stream processing DSL.',
    why:   'Kafka is the backbone of our data pipeline architecture. In ClearWay, vehicle sensor telemetry flows through Kafka topics before being consumed, map-matched, and written to PostGIS. Its durability guarantees mean no telemetry events are lost even during processing failures, and the replay capability is invaluable for re-running historical data through updated algorithms without re-collecting sensor data. Decoupling producers from consumers also lets us scale ingestion and processing independently.',
    when:  'Real-time IoT telemetry ingestion, event-driven microservice architectures, audit and event logs that require replay, ETL pipelines where producers and consumers need independent scalability, and any system where guaranteed message delivery and ordering at high throughput are non-negotiable.',
  },
  {
    name:  'Docker',
    group: 'Infra',
    what:  'Docker is a platform for building, shipping, and running applications in isolated containers. Containers package application code together with all dependencies into a single artefact, ensuring identical behaviour across development, CI, staging, and production environments. Multi-stage Dockerfiles produce minimal production images by discarding build-time dependencies.',
    why:   'Docker eliminates environment inconsistencies entirely. Multi-stage builds produce slim, auditable production images. Docker Compose provides a reproducible local development environment that mirrors production. In Kubernetes deployments, our container images are the unit of deployment and rollback — built once, promoted through environments without modification.',
    when:  'Every back-end service we ship. Front-ends deployed to Vercel do not require Docker, but every Python service, Java service, data pipeline worker, and self-hosted tool is containerised from day one — ensuring portability regardless of the target infrastructure.',
  },
  {
    name:  'CI/CD',
    group: 'Infra',
    what:  'Continuous Integration and Continuous Delivery (CI/CD) are engineering practices and tooling that automate the testing, building, and deployment of software. We use GitHub Actions as the primary platform, with support for ephemeral preview environments, container image signing with Sigstore/Cosign, and branch protection rules that enforce passing pipelines before merge.',
    why:   'Automated pipelines mean every commit is tested, every pull request gets a live preview environment, and every merge to main can be deployed in minutes with full confidence. Signed build artefacts provide a verifiable chain of custody from source code to the running container in production. We treat CI/CD configuration as code — versioned, reviewed, and audited the same as application code.',
    when:  'Every project, without exception. CI/CD is not an optional enhancement — it is the baseline quality assurance layer for any software that needs to be maintained, updated, and trusted in production over months or years.',
  },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function TechnologiesPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Zephyron Tech Engineering Stack',
    url: `${BASE}/technologies`,
    itemListElement: items.map((item, i) => ({
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
            href="/"
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
            ← Back to home
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
            Our tech stack
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
            These are the tools we reach for first — proven in production, chosen for a reason.
            We adapt to what you already have, but below is where we start.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {items.map((item, i) => (
              <TechItem key={item.name} item={item} index={i} total={items.length} />
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
              Have a project where one of these technologies would be a good fit?
              Or need a different stack — we adapt.
            </p>
            <a
              href="/#contact"
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
              Discuss a project →
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
