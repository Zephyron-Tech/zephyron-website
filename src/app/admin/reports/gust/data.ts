// Content of the Gust spec. Projects and domains are ours; commits, people and
// times in the demo are sample data.

export type Mark = 'yes' | 'later' | 'no' | 'cf';

export const vercelMap: { feature: string; mark: Mark; label: string; how: string }[] = [
  { feature: 'Deploy po pushi', mark: 'yes', label: 'ano', how: 'GitHub Actions postaví image a zavolají /api/deploy s GitHub OIDC tokenem.' },
  { feature: 'Preview pro pull request', mark: 'yes', label: 'ano, M4', how: 'pr-42.smart-targets.preview.zephyron.tech, wildcard certifikát přes DNS-01, úklid po zavření PR.' },
  { feature: 'Okamžitý rollback', mark: 'yes', label: 'ano', how: 'Předchozí image zůstává na serveru (posledních 5), start bez stahování.' },
  { feature: 'Domény a TLS', mark: 'yes', label: 'ano', how: 'Traefik a Let’s Encrypt. HTTP-01 pro běžné domény, DNS-01 pro wildcard.' },
  { feature: 'Env proměnné', mark: 'yes', label: 'ano', how: 'Production a preview zvlášť, šifrované AES-256-GCM.' },
  { feature: 'Logy', mark: 'yes', label: 'živě', how: 'Stream z Docker API přes SSE. Historie přes Loki v další fázi.' },
  { feature: 'Databáze', mark: 'yes', label: 'ano', how: 'Služba typu stateful a noční záloha restic mimo server.' },
  { feature: 'CDN a ochrana', mark: 'cf', label: 'Cloudflare', how: 'Proxy před Traefikem, statika s s-maxage.' },
  { feature: 'Edge funkce', mark: 'no', label: 'ne', how: 'Next.js middleware běží v Node na serveru a funguje stejně.' },
  { feature: 'Autoscaling, regiony', mark: 'no', label: 'ne', how: 'Jeden server. Engine jde později rozdělit na agenty pro další stroje.' },
  { feature: 'Analytika', mark: 'later', label: 'později', how: 'Umami jako sledovaný stack místo @vercel/analytics.' },
  { feature: 'Cron joby', mark: 'later', label: 'později', how: 'Naplánovaný job nad image služby, spouští ho worker.' },
  { feature: 'Build ze zdrojáků', mark: 'later', label: 'později', how: 'Railpack nebo Dockerfile přes BuildKit, s frontou a limity.' },
];

export const pillars = [
  {
    title: 'Build dělá GitHub',
    text: 'GitHub Actions postaví image a pushnou ho do naší registry Zot. Gust nic nekompiluje, jen stáhne hotový image podle digestu a nasadí ho.',
  },
  {
    title: 'Dva typy služeb',
    text: 'App je bez stavu a nasazuje se bez výpadku (blue/green). Stateful je jedna instance s volume, jako Postgres nebo Redis, aktualizuje se restartem a má zálohy.',
  },
  {
    title: 'Cizí stacky jen sledujeme',
    text: 'Authentik, Nextcloud, Outline a Uptime Kuma běží dál jako Compose v /opt/docker. Gust ukáže jejich stav a logy a umí je restartovat.',
  },
];

/* ── Demo ─────────────────────────────────────────────────────────────── */

export type DeployState = 'queued' | 'pulling' | 'starting' | 'healthy' | 'live' | 'failed' | 'superseded';

export interface Deployment {
  id: string;
  sha: string;
  msg: string;
  who: string;
  trigger: 'push' | 'rollback';
  state: DeployState;
  age: string;
  dur: string;
  logs: [string, string, string][];
  err?: string;
}

export const demoProjects = [
  { id: 'zephyron-web', domain: 'zephyron.tech', health: 'live', last: '12 min ago', services: [['web', 'app']] },
  { id: 'smart-targets', domain: 'api.targets.zephyron.tech', health: 'live', last: '2 h ago', services: [['api', 'app'], ['admin', 'app'], ['db', 'stateful']] },
  { id: 'gridtime', domain: 'gridtime.eu', health: 'live', last: 'yesterday', services: [['frontend', 'app'], ['backend', 'app'], ['db', 'stateful']] },
  { id: 'moodtracker', domain: 'api.moodtracker.zephyron.tech', health: 'failed', last: '3 days ago', services: [['api', 'app'], ['db', 'stateful']] },
  { id: 'converter', domain: 'converter.zephyron.tech', health: 'live', last: '5 days ago', services: [['frontend', 'app'], ['backend', 'app'], ['redis', 'stateful']] },
  { id: 'clearway', domain: 'api-mobile.zephyron.tech', health: 'stopped', last: 'stopped', services: [['api', 'app'], ['worker', 'app'], ['db', 'stateful']] },
] as const;

export const observedStacks = [
  { id: 'authentik', domain: 'auth.zephyron.tech', mem: '752 MB', containers: ['server', 'worker', 'postgresql', 'redis'] },
  { id: 'outline', domain: 'wiki.zephyron.tech', mem: '410 MB', containers: ['outline', 'postgres', 'redis', 'minio'] },
  { id: 'nextcloud', domain: 'cloud.zephyron.tech', mem: '205 MB', containers: ['app', 'db', 'redis'] },
  { id: 'uptime-kuma', domain: 'status.zephyron.tech', mem: '123 MB', containers: ['uptime-kuma'] },
];

export const sampleCommits: [string, string, string][] = [
  ['b7e21d0', 'Add bulk import for quarterly targets', 'jan'],
  ['c3f9a12', 'Cache plan lookups per request', 'petr'],
  ['d41a7e9', 'Tighten admin CSV validation', 'jan'],
  ['e92b0c4', 'Upgrade Prisma to 7.1', 'petr'],
];

function cannedLogs(id: string, sha: string, dur: string, failed: boolean): [string, string, string][] {
  const base: [string, string, string][] = [
    ['14:02:01', 'queue', `${id} queued by GitHub Actions (zephyron/smart-targets@main)`],
    ['14:02:02', 'pull', `registry.gust.zephyron.tech/smart-targets/api:${sha}`],
    ['14:02:07', 'pull', '5 layers, 3 cached · 41.2 MB'],
    ['14:02:08', 'start', `gust-smart-targets-api-${id.replace('_', '')} on gust_edge`],
    ['14:02:11', 'health', 'GET /healthz → 503 (attempt 1)'],
  ];
  return failed
    ? [...base, ['14:03:11', 'health', 'no healthy response in 60 s'], ['14:03:12', 'fail', 'Container removed. dpl_7d2mxa stays live.']]
    : [
        ...base,
        ['14:02:13', 'health', 'GET /healthz → 200 (attempt 2)'],
        ['14:02:13', 'route', 'Traefik: smart-targets-api has 2 servers'],
        ['14:02:14', 'drain', 'SIGTERM to previous, 10 s grace'],
        ['14:02:24', 'live', `Live on api.targets.zephyron.tech in ${dur}`],
      ];
}

export const seedDeployments: Deployment[] = [
  { id: 'dpl_8f3k2q', sha: 'a1c9e3f', msg: 'Fix target sync on empty plan', who: 'jan', trigger: 'push', state: 'live', age: '2 h ago', dur: '41 s', logs: cannedLogs('dpl_8f3k2q', 'a1c9e3f', '41 s', false) },
  { id: 'dpl_7d2mxa', sha: '9be41c7', msg: 'Add audit export to admin', who: 'petr', trigger: 'push', state: 'superseded', age: 'yesterday', dur: '44 s', logs: cannedLogs('dpl_7d2mxa', '9be41c7', '44 s', false) },
  { id: 'dpl_6hq8wr', sha: '77f0d2b', msg: 'Switch healthz to readiness probe', who: 'jan', trigger: 'push', state: 'failed', age: 'yesterday', dur: '1 min 2 s', err: 'Health check timed out after 60 s', logs: cannedLogs('dpl_6hq8wr', '77f0d2b', '', true) },
  { id: 'dpl_5t9pbc', sha: '41aa0e8', msg: 'Rate limit public API', who: 'jan', trigger: 'push', state: 'superseded', age: '3 days ago', dur: '39 s', logs: cannedLogs('dpl_5t9pbc', '41aa0e8', '39 s', false) },
];

/* ── Architecture ─────────────────────────────────────────────────────── */

export interface ArchNode {
  x: number;
  y: number;
  w?: number;
  title: string;
  sub: string;
  ext?: boolean;
  role: string;
  image?: string;
  net: string;
  auth: string;
  trust: string;
}

export const archNodes: Record<string, ArchNode> = {
  gh: { x: 20, y: 130, title: 'GitHub', sub: 'repo + Gust App', ext: true, role: 'Zdroj kódu a událostí. GitHub App posílá webhooky (PR opened, synchronize, closed) a Gust přes ni zapisuje stav deploye ke commitu.', net: 'internet', auth: 'HMAC podpis webhooku, privátní klíč App', trust: 'externí, podepsané' },
  gha: { x: 20, y: 260, title: 'GitHub Actions', sub: 'build, push, deploy', ext: true, role: 'Staví image, pushují ho do Zotu a volají /api/deploy s OIDC tokenem. V GitHubu není žádný dlouhodobý deploy secret.', net: 'internet', auth: 'robot účet pro push, OIDC JWT pro deploy', trust: 'externí, ověřené OIDC' },
  team: { x: 20, y: 430, title: 'Tým', sub: 'prohlížeč, iPhone', ext: true, role: 'Lidé v UI Gustu. Přihlášení přes Authentik, role admin nebo member.', net: 'internet přes Cloudflare', auth: 'OIDC session', trust: 'uživatel' },
  cf: { x: 300, y: 20, title: 'Cloudflare', sub: 'DNS, proxy, CDN', ext: true, role: 'DNS zóna zephyron.tech, volitelná proxy a cache před Traefikem. API token pro DNS-01 kvůli wildcard certifikátu preview prostředí.', net: 'internet', auth: 'token Zone:DNS:Edit', trust: 'externí' },
  le: { x: 560, y: 20, title: 'Let’s Encrypt', sub: 'ACME', ext: true, role: 'Vydává certifikáty. HTTP-01 pro běžné domény, DNS-01 přes Cloudflare pro *.preview.', net: 'internet', auth: 'ACME účet v acme.json', trust: 'externí' },
  traefik: { x: 270, y: 160, title: 'Traefik v3', sub: ':80 :443', role: 'Jediný vstup z internetu. Routuje podle Docker labelů, vydává certifikáty a pomocí health checku rozhoduje, kdy dostane provoz nový kontejner.', image: 'traefik:v3', net: 'gust_edge, porty 80 a 443', auth: 'forward auth na Authentik pro interní nástroje', trust: 'hranice' },
  zot: { x: 270, y: 300, title: 'Zot registry', sub: 'registry.gust…', role: 'OCI registry. Přijímá push z GitHub Actions, engine z ní stahuje lokálně. Drží posledních 20 tagů, úklid běží za provozu.', image: 'ghcr.io/project-zot/zot', net: 'gust_edge', auth: 'robot účty po projektech', trust: 'interní, za Traefikem' },
  backup: { x: 270, y: 520, title: 'Záloha', sub: 'restic, noční', role: 'Worker ji spouští ve 3:00: pg_dump Gustu a stateful služeb, /opt/gust, šifrovaný snapshot mimo server.', image: 'restic/restic', net: 'gust_internal a projektové sítě', auth: 'heslo restic v .env', trust: 'interní' },
  kuma: { x: 270, y: 640, title: 'Uptime Kuma', sub: 'sledovaný stack', role: 'Hlídá /api/health Gustu a domény služeb. Běží jako sledovaný Compose stack.', image: 'louislam/uptime-kuma', net: 'gust_edge', auth: 'vlastní login', trust: 'interní' },
  ui: { x: 520, y: 160, title: 'Gust UI', sub: 'Next.js', role: 'Webové rozhraní a veřejné API (/api/deploy, /api/webhooks/github). Zapisuje do databáze a fronty, logy čte z enginu. K Dockeru přístup nemá.', image: 'gust/ui', net: 'gust_edge, gust_internal', auth: 'Authentik OIDC, role, audit', trust: 'veřejná část' },
  worker: { x: 520, y: 280, title: 'Gust worker', sub: 'pg-boss', role: 'Bere joby z fronty v Postgresu: deploy, rollback, úklid preview, prune, zálohy. Jako jediný mění stav deploye.', image: 'gust/worker', net: 'gust_internal', auth: 'role gust_worker', trust: 'interní' },
  engine: { x: 520, y: 400, title: 'Gust Engine', sub: 'dockerode', role: 'Překládá popis služby na kontejnery, labely a sítě. Pull, create, start, health, drain, stop, logy, statistiky, prune a kontrola driftu.', image: 'gust/engine', net: 'gust_internal', auth: 'Bearer ENGINE_TOKEN', trust: 'privilegovaný' },
  proxy: { x: 520, y: 520, title: 'socket-proxy', sub: 'povolené API', role: 'Jediný kontejner s /var/run/docker.sock. Pouští jen containers, images, networks, volumes a events. Exec, swarm a plugins jsou zakázané.', image: 'tecnativa/docker-socket-proxy', net: 'gust_internal', auth: 'síťová izolace', trust: 'nejcitlivější' },
  docker: { x: 520, y: 640, title: 'Docker Engine', sub: 'host', role: 'Spouští všechny kontejnery. Gust ho nikdy nevolá přímo, jen přes socket-proxy.', net: 'host', auth: 'root', trust: 'host' },
  pg: { x: 790, y: 160, title: 'Postgres Gustu', sub: 'stav + fronta', role: 'Projekty, služby, deploye, šifrované env, audit a fronta pg-boss. Zdroj pravdy o tom, co má běžet.', image: 'postgres:17', net: 'gust_internal', auth: 'role gust_ui a gust_worker', trust: 'interní' },
  authentik: { x: 790, y: 280, title: 'Authentik', sub: 'OIDC, sledovaný', role: 'Přihlášení do Gustu. Běží jako sledovaný stack, proto má Gust i lokální nouzový účet.', image: 'goauthentik/server', net: 'gust_edge', auth: 'OIDC klient gust', trust: 'interní, kritický' },
  apps: { x: 790, y: 400, title: 'App kontejnery', sub: 'blue/green', role: 'Bezstavové služby projektů (web, api, admin). Dvě verze současně jen během deploye.', net: 'gust_edge a gust_proj_<name>', auth: 'env z Gustu', trust: 'kód projektů' },
  stateful: { x: 790, y: 520, title: 'Stateful služby', sub: 'Postgres, Redis', role: 'Jedna instance s volume, jen v projektové síti. Aktualizace restartem, před ní záloha.', net: 'gust_proj_<name>', auth: 'hesla v env', trust: 'data projektů' },
  observed: { x: 790, y: 640, title: 'Sledované stacky', sub: 'Nextcloud, Outline', role: 'Compose projekty v /opt/docker. Gust ukazuje stav a logy a umí restart, nic jiného nemění.', net: 'vlastní sítě a gust_edge', auth: 'vlastní', trust: 'třetí strany' },
  vm: { x: 270, y: 410, title: 'VictoriaMetrics', sub: 'metriky, 30 dní', role: 'Časová databáze metrik serveru. Každých 15 s si načte data z node_exporteru a drží je 30 dní. Z ní kreslí UI grafy a worker vyhodnocuje pravidla.', image: 'victoriametrics/victoria-metrics', net: 'gust_internal', auth: 'jen vnitřní síť', trust: 'interní' },
  exporter: { x: 520, y: 760, title: 'node_exporter', sub: 'metriky hostu', role: 'Čte CPU, RAM, load, disk, síť, swap a CPU steal z /proc a /sys hostitele. Jen pro čtení, žádný port ven.', image: 'prom/node-exporter', net: 'gust_internal, pid host', auth: 'jen vnitřní síť', trust: 'čte host' },
  discord: { x: 1020, y: 160, w: 150, title: 'Discord', sub: 'webhook kanálu', ext: true, role: 'Upozornění do týmového kanálu: hoří, vyřešeno a hlášení z healthchecks.io.', net: 'internet', auth: 'URL webhooku v secrets', trust: 'externí' },
  push: { x: 1020, y: 280, w: 150, title: 'Web Push', sub: 'Apple, iPhone', ext: true, role: 'Push notifikace do Gustu přidaného na plochu iPhonu (iOS 16.4+). Server podepisuje zprávy klíči VAPID.', net: 'internet', auth: 'VAPID klíče, odběr po zařízení', trust: 'externí' },
  hc: { x: 1020, y: 400, w: 150, title: 'healthchecks.io', sub: 'hlídač zvenku', ext: true, role: 'Gust sem každou minutu pošle signál, že žije. Když signál přestane chodit, protože spadl celý server, healthchecks.io pošle zprávu na Discord samo.', net: 'internet', auth: 'tajná URL kontroly', trust: 'externí' },
  offsite: { x: 1020, y: 520, w: 150, title: 'Úložiště', sub: 'Storage Box, B2', ext: true, role: 'Šifrované snapshoty restic mimo server. Obnova na čistý server přes install.sh --restore.', net: 'internet', auth: 'klíče úložiště', trust: 'externí' },
  smtp: { x: 1020, y: 640, w: 150, title: 'SMTP', sub: 'upozornění', ext: true, role: 'E-mail při selhání deploye nebo zálohy.', net: 'internet', auth: 'heslo SMTP', trust: 'externí' },
};

export const archEdges: [string, string][] = [
  ['gh', 'gha'], ['gha', 'traefik'], ['traefik', 'zot'], ['traefik', 'ui'], ['gh', 'traefik'], ['ui', 'gh'],
  ['ui', 'pg'], ['worker', 'pg'], ['worker', 'engine'], ['ui', 'engine'], ['engine', 'proxy'], ['proxy', 'docker'], ['docker', 'zot'],
  ['traefik', 'apps'], ['docker', 'apps'], ['docker', 'stateful'], ['docker', 'observed'], ['apps', 'stateful'],
  ['team', 'cf'], ['cf', 'traefik'], ['traefik', 'le'], ['traefik', 'authentik'], ['ui', 'authentik'],
  ['worker', 'backup'], ['backup', 'pg'], ['backup', 'stateful'], ['backup', 'offsite'], ['worker', 'smtp'], ['kuma', 'traefik'],
  ['vm', 'exporter'], ['worker', 'vm'], ['ui', 'vm'], ['exporter', 'docker'], ['worker', 'discord'], ['worker', 'push'], ['worker', 'hc'], ['hc', 'discord'],
];

export const archFlows: Record<string, { name: string; steps: [string, string, string][] }> = {
  deploy: {
    name: 'Deploy po pushi',
    steps: [
      ['gh', 'gha', 'Push do main spustí workflow v GitHub Actions.'],
      ['gha', 'traefik', 'Actions pushnou image na registry.gust.zephyron.tech.'],
      ['traefik', 'zot', 'Traefik předá push do Zotu.'],
      ['gha', 'traefik', 'Actions zavolají POST /api/deploy s GitHub OIDC tokenem.'],
      ['traefik', 'ui', 'UI ověří token a podle repa a větve najde službu.'],
      ['ui', 'pg', 'Vznikne Deployment ve stavu queued a job ve frontě.'],
      ['worker', 'pg', 'Worker si job vezme.'],
      ['worker', 'engine', 'Worker pošle enginu popis služby a digest image.'],
      ['engine', 'proxy', 'Engine volá Docker API přes socket-proxy.'],
      ['docker', 'zot', 'Docker stáhne image ze Zotu na stejném serveru.'],
      ['docker', 'apps', 'Vedle běžícího kontejneru vznikne nový.'],
      ['traefik', 'apps', 'Po úspěšném health checku jde provoz i na nový, starý dostane SIGTERM.'],
      ['ui', 'gh', 'UI zapíše stav deploye ke commitu na GitHubu.'],
    ],
  },
  preview: {
    name: 'Preview pro pull request',
    steps: [
      ['gh', 'traefik', 'GitHub App pošle webhook pull_request opened.'],
      ['traefik', 'ui', 'UI ověří podpis a založí preview pro PR #42.'],
      ['gh', 'gha', 'Workflow postaví image s tagem pr-42.'],
      ['gha', 'traefik', 'Push do Zotu a /api/deploy s ref refs/pull/42.'],
      ['worker', 'engine', 'Engine spustí kontejner s routerem smart-targets-api-pr42.'],
      ['traefik', 'le', 'Wildcard certifikát pro *.smart-targets.preview už existuje.'],
      ['cf', 'traefik', 'Adresa pr-42.smart-targets.preview.zephyron.tech funguje.'],
      ['ui', 'gh', 'UI napíše do PR odkaz. Po zavření PR worker vše uklidí.'],
    ],
  },
  login: {
    name: 'Přihlášení',
    steps: [
      ['team', 'cf', 'Uživatel otevře gust.zephyron.tech.'],
      ['cf', 'traefik', 'Cloudflare předá požadavek Traefiku.'],
      ['traefik', 'ui', 'UI nenajde session a přesměruje na Authentik.'],
      ['traefik', 'authentik', 'Authentik ověří heslo a druhý faktor.'],
      ['ui', 'authentik', 'UI vymění kód za tokeny a načte skupiny uživatele.'],
      ['ui', 'pg', 'Session a role se uloží, přihlášení jde do auditu.'],
    ],
  },
  rollback: {
    name: 'Rollback',
    steps: [
      ['team', 'cf', 'Uživatel klikne na Roll back u staršího deploye.'],
      ['traefik', 'ui', 'UI ověří roli a založí nový deploy typu rollback.'],
      ['worker', 'pg', 'Worker si vezme job.'],
      ['worker', 'engine', 'Engine dostane digest staršího image.'],
      ['proxy', 'docker', 'Image je na serveru, stahování se přeskočí.'],
      ['traefik', 'apps', 'Health check projde, provoz přejde, aktuální verze se zastaví.'],
    ],
  },
  alert: {
    name: 'Upozornění',
    steps: [
      ['vm', 'exporter', 'VictoriaMetrics každých 15 s načte metriky z node_exporteru.'],
      ['worker', 'vm', 'Worker každých 30 s vyhodnotí pravidla: disk, RAM, load, swap, steal.'],
      ['worker', 'pg', 'Disk je přes 90 %, pravidlo přejde do stavu hoří a zapíše se Alert.'],
      ['worker', 'push', 'Push notifikace do iPhonů adminů.'],
      ['worker', 'discord', 'Zpráva do kanálu na Discordu. Znovu nejdřív za 4 hodiny, pak zpráva vyřešeno.'],
      ['ui', 'vm', 'V Gustu je upozornění vidět v přehledu Server i s grafem.'],
      ['worker', 'hc', 'Nezávisle na tom jde každou minutu signál „žiju“ na healthchecks.io.'],
      ['hc', 'discord', 'Když signál přestane chodit, healthchecks.io ohlásí výpadek celého serveru samo.'],
    ],
  },
  backup: {
    name: 'Noční záloha',
    steps: [
      ['worker', 'backup', 'Ve 3:00 worker spustí zálohu.'],
      ['backup', 'pg', 'pg_dump databáze Gustu.'],
      ['backup', 'stateful', 'Dumpy stateful služeb (pg_dump, Redis BGSAVE).'],
      ['backup', 'offsite', 'Šifrovaný snapshot mimo server. Drží 7 denních, 4 týdenní a 6 měsíčních.'],
      ['worker', 'smtp', 'Při chybě odejde e-mail. Úspěch hlásí Uptime Kuma jako push monitor.'],
    ],
  },
};

/* ── Data model ───────────────────────────────────────────────────────── */

export const entities: { name: string; prefix: string; fields: [string, string, boolean?][] }[] = [
  { name: 'Project', prefix: 'prj_', fields: [['id', 'text pk'], ['slug', 'text unique'], ['repo', 'text'], ['createdAt', 'timestamptz']] },
  { name: 'Service', prefix: 'svc_', fields: [['projectId', '→ Project', true], ['name', 'text'], ['type', 'app | stateful'], ['imageRepo', 'text'], ['port', 'int'], ['healthPath', 'text'], ['cpu, memoryMb', 'numeric, int'], ['volumes', 'jsonb'], ['keepImages', 'int = 5']] },
  { name: 'Deployment', prefix: 'dpl_', fields: [['serviceId', '→ Service', true], ['previewId', '→ PreviewEnv?', true], ['state', 'enum'], ['trigger', 'push | rollback | manual | preview'], ['imageDigest', 'sha256'], ['commitSha', 'text'], ['createdBy', '→ User?', true], ['error', 'text?'], ['liveAt', 'timestamptz?']] },
  { name: 'DeploymentLog', prefix: '', fields: [['deploymentId', '→ Deployment', true], ['ts', 'timestamptz'], ['phase', 'text'], ['line', 'text']] },
  { name: 'Domain', prefix: 'dom_', fields: [['serviceId', '→ Service', true], ['host', 'text unique'], ['tls', 'http01 | dns01'], ['certExpiresAt', 'timestamptz?'], ['redirectTo', 'text?']] },
  { name: 'EnvVar', prefix: 'env_', fields: [['serviceId', '→ Service', true], ['key', 'text'], ['scope', 'production | preview'], ['isSecret', 'bool'], ['valueEnc', 'bytea']] },
  { name: 'PreviewEnv', prefix: 'pre_', fields: [['projectId', '→ Project', true], ['prNumber', 'int'], ['branch', 'text'], ['host', 'text'], ['closedAt', 'timestamptz?']] },
  { name: 'ObservedStack', prefix: 'obs_', fields: [['composeProject', 'text unique'], ['path', 'text'], ['lastSeenAt', 'timestamptz']] },
  { name: 'RegistryCredential', prefix: 'reg_', fields: [['projectId', '→ Project', true], ['username', 'text'], ['secretHash', 'text'], ['lastUsedAt', 'timestamptz?']] },
  { name: 'User', prefix: 'usr_', fields: [['sub', 'text (OIDC)'], ['email', 'text'], ['role', 'admin | member'], ['breakGlass', 'bool']] },
  { name: 'AuditEvent', prefix: 'aud_', fields: [['userId', '→ User?', true], ['action', 'text'], ['target', 'text'], ['diff', 'jsonb'], ['ip', 'inet'], ['at', 'timestamptz']] },
  { name: 'AlertRule', prefix: 'rul_', fields: [['name', 'text'], ['expr', 'PromQL'], ['threshold', 'numeric'], ['for', 'interval'], ['severity', 'warning | critical'], ['enabled', 'bool']] },
  { name: 'Alert', prefix: 'alr_', fields: [['ruleId', '→ AlertRule', true], ['state', 'pending | firing | resolved'], ['value', 'numeric'], ['startedAt', 'timestamptz'], ['resolvedAt', 'timestamptz?'], ['lastNotifiedAt', 'timestamptz?']] },
  { name: 'PushSubscription', prefix: 'psh_', fields: [['userId', '→ User', true], ['endpoint', 'text'], ['keys', 'jsonb'], ['device', 'text']] },
  { name: 'WebhookDelivery', prefix: '', fields: [['deliveryId', 'text pk'], ['event', 'text'], ['status', 'ok | ignored | failed'], ['receivedAt', 'timestamptz']] },
];

/* ── API ──────────────────────────────────────────────────────────────── */

export const publicApi = [
  ['POST /api/deploy', 'GitHub Actions', 'GitHub OIDC JWT, aud=gust.zephyron.tech', 'Podle repository a ref z tokenu najde službu a založí deploy.'],
  ['POST /api/webhooks/github', 'GitHub App', 'HMAC X-Hub-Signature-256, dedupe podle X-GitHub-Delivery', 'PR opened, synchronize a closed pro preview, události instalace.'],
  ['GET /api/auth/callback/authentik', 'Prohlížeč', 'OIDC code flow s PKCE', 'Přihlášení do UI.'],
  ['GET /api/health', 'Uptime Kuma', 'bez ověření', 'Dostupnost databáze, enginu a Zotu.'],
  ['registry.gust.zephyron.tech', 'GitHub Actions', 'robot účet, push jen do <project>/*', 'Docker push do Zotu.'],
];

export const engineApi = [
  ['POST /v1/deployments', 'Popis služby a digest image. Vrací stream událostí pulling, starting, healthy, live nebo failed.'],
  ['POST /v1/containers/:id/stop', 'Zastavení s časem na dokončení požadavků, volitelně smazání.'],
  ['GET /v1/containers/:id/logs?follow=1', 'Logy přes SSE, UI je přeposílá do prohlížeče.'],
  ['GET /v1/stats', 'CPU, RAM a síť spravovaných kontejnerů a sledovaných stacků.'],
  ['GET /v1/observed', 'Compose stacky a jejich kontejnery.'],
  ['POST /v1/observed/:container/restart', 'Jediná zápisová akce nad sledovanými stacky.'],
  ['POST /v1/prune', 'Úklid image podle pravidla keep: 5, vrací uvolněné místo.'],
  ['GET /v1/reconcile', 'Porovná labely s očekávaným stavem a vrátí rozdíly.'],
];

/* ── Roadmap ──────────────────────────────────────────────────────────── */

export const milestones = [
  { id: 'M0', time: '~1 týden', title: 'Základ a spiky', text: 'Monorepo (apps/ui, apps/worker, apps/engine, packages/contracts, packages/db), Docker Desktop, Traefik na *.localhost.', done: ['engine spustí hello kontejner za Traefikem', 'všech pět spiků má zapsaný výsledek'] },
  { id: 'M1', time: '~1–2 týdny', title: 'Jádro deploye', text: 'Stavový automat, fronta pg-boss, blue/green, restart stateful služeb, rollback, logy přes SSE, úklid image.', done: ['deploy bez výpadku (smyčka curl bez chyby)', 'failed deploy nechá starou verzi běžet', 'rollback do 5 s'] },
  { id: 'M2', time: '~1 týden', title: 'Administrace', text: 'Projekty, služby, domény, env, sledované stacky, přihlášení přes Authentik, role, audit, nouzový účet.', done: ['projekt jde založit a nasadit jen z UI', 'member nevidí secrets'] },
  { id: 'M3', time: '~1 týden', title: 'GitHub', text: 'GitHub App, /api/deploy s OIDC, stav deploye u commitu, sdílená GitHub Action.', done: ['push do testovacího repa skončí live bez zásahu', 'token z cizího repa je odmítnut'] },
  { id: 'M4', time: '~1 týden', title: 'Preview', text: 'Prostředí pro každé PR, wildcard certifikát přes DNS-01, odkaz v PR, úklid po zavření.', done: ['otevřené PR má do pár minut vlastní adresu', 'zavřené PR nenechá kontejner ani image'] },
  { id: 'M5', time: '~1–1,5 týdne', title: 'Monitoring', text: 'node_exporter a VictoriaMetrics, obrazovka Server s grafy, živé statistiky kontejnerů, pravidla upozornění, web push, Discord a signál pro healthchecks.io. Nezávisí na M3 a M4, jde dělat hned po M2.', done: ['grafy za 30 dní přežijí restart Gustu', 'zaplnění disku testovacím souborem pošle push i zprávu na Discord do minuty', 'zastavený server ohlásí healthchecks.io do 3 minut'] },
  { id: 'M6', time: '~1 týden', title: 'Contabo', text: 'install.sh, zálohy a obnova, Uptime Kuma, přesun prvních projektů (zephyron.tech, smart-targets).', done: ['čistý server má Gust do 15 minut', 'obnova ze zálohy projde nanečisto', 'zephyron.tech běží mimo Vercel'] },
];

export const monitorMetrics = [
  ['CPU', 'využití a load average (1, 5, 15 min)'],
  ['CPU steal', 'kolik času si bere sousední VPS, klíčové u Contaba'],
  ['RAM a swap', 'použitá, cache, dostupná, swap'],
  ['Disk', 'obsazené místo, rychlost čtení a zápisu, IO wait'],
  ['Síť', 'provoz dovnitř a ven, chyby'],
  ['Systém', 'uptime, počet procesů, otevřené soubory'],
];

export const alertRules: { rule: string; warn: string; crit: string }[] = [
  { rule: 'Obsazený disk', warn: 'nad 80 %', crit: 'nad 90 %' },
  { rule: 'Disk se zaplní', warn: 'do 7 dní podle trendu za 24 h', crit: 'do 24 h' },
  { rule: 'RAM', warn: 'není', crit: 'nad 90 % déle než 5 min' },
  { rule: 'Load', warn: 'nad 2× vCPU déle než 10 min', crit: 'není' },
  { rule: 'Swap', warn: 'nad 50 %', crit: 'není' },
  { rule: 'CPU steal', warn: 'nad 10 % déle než 15 min', crit: 'není' },
  { rule: 'Kontejner', warn: 'není', crit: 'víc než 3 restarty za 10 min, nebo OOM kill' },
];

export const spikes = [
  'Dva kontejnery se stejným jménem služby v Traefiku: dostane nový provoz až po health checku a zmizí starý bez chybných požadavků?',
  'Ověření GitHub OIDC tokenu: JWKS, aud, repository a ref.',
  'Zot: robot účty po projektech, retence a úklid za běhu.',
  'Wildcard certifikát přes DNS-01 s Cloudflare tokenem v Traefiku.',
  'Stačí docker-socket-proxy na pull, create, start, logy, events a stats?',
  'Web push z PWA na iOS: přihlášení přes Authentik uvnitř aplikace na ploše a doručení s vypnutou obrazovkou.',
];

export const openDecisions = [
  'Image Gustu: soukromé s GUST_TOKEN při instalaci, nebo veřejné.',
  'Push do Zotu: robot účet po projektech hned, vlastní token server s OIDC později?',
  'Cloudflare proxy pro všechny služby, nebo jen pro web?',
  'Kam zálohovat: Hetzner Storage Box, nebo Backblaze B2.',
  'ORM: Drizzle, nebo Prisma jako na webu.',
];

/* ── Name check ───────────────────────────────────────────────────────── */

export const nameCheck: { where: string; mark: Mark; label: string; note: string }[] = [
  { where: 'npm gust', mark: 'no', label: 'obsazeno', note: 'Knihovna pro JS hry, v0.0.1.' },
  { where: 'npm gust-deploy', mark: 'later', label: 'kolize v oboru', note: 'Jiný deploy engine (flowtrail, duben 2026), repo na GitHubu nedostupné.' },
  { where: 'npm gust-cli, gustctl, getgust', mark: 'yes', label: 'volné', note: '' },
  { where: 'npm @zephyron/gust', mark: 'yes', label: 'doporučeno', note: 'Náš scope, bez kolize.' },
  { where: 'GitHub org gust', mark: 'no', label: 'obsazeno', note: 'Repo bude zephyron/gust.' },
  { where: 'gust.dev, .run, .sh, .cz', mark: 'no', label: 'obsazeno', note: 'gust.cz je registrované do 2027.' },
  { where: 'gust.tech', mark: 'later', label: 'na prodej', note: 'Zaparkované přes Afternic.' },
  { where: 'getgust.dev, usegust.dev', mark: 'yes', label: 'bez DNS', note: 'Nejspíš volné, pro případný open source.' },
  { where: 'gust.zephyron.tech', mark: 'yes', label: 'doporučeno', note: 'UI, installer a registry.gust.zephyron.tech.' },
  { where: 'Gust.com', mark: 'cf', label: 'jiný obor', note: 'Známá platforma pro startupy. Interně nevadí, pro veřejný produkt ověřit ochrannou známku.' },
];
