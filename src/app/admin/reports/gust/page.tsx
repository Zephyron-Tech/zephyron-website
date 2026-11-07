import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { ShareButton } from '../../ShareButton';
import { AdminOnly, SignInPrompt, adminSession } from '../../session';
import { Architecture } from './Architecture';
import { CopyCommand } from './CopyCommand';
import { GustDemo } from './Demo';
import { ByZephyron, GustLockup, GustMark } from './GustMark';
import {
  type Mark,
  alertRules,
  engineApi,
  entities,
  milestones,
  monitorMetrics,
  nameCheck,
  openDecisions,
  pillars,
  publicApi,
  spikes,
  vercelMap,
} from './data';
import { mono } from './mono';

const TITLE = 'Gust: náhrada Vercelu na vlastním VPS';
export const metadata = { title: 'Gust' };

const INSTALL = 'curl -fsSL https://gust.zephyron.tech/install.sh | sudo bash';

const markChip: Record<Mark, string> = {
  yes: 'bg-ok/10 text-ok',
  later: 'bg-paper-2 text-ink-2',
  no: 'bg-err-soft text-err',
  cf: 'bg-accent-soft text-accent',
};

const toc = [
  ['ukazka', 'Ukázka'],
  ['vercel', 'Místo Vercelu'],
  ['architektura', 'Architektura'],
  ['monitoring', 'Monitoring'],
  ['deploy', 'Deploy'],
  ['data', 'Data'],
  ['konvence', 'Konvence'],
  ['api', 'API'],
  ['bezpecnost', 'Bezpečnost'],
  ['instalace', 'Instalace'],
  ['design', 'Design'],
  ['roadmapa', 'Roadmapa'],
  ['nazev', 'Název'],
];

const delay = (i: number) => ({ animationDelay: `${i * 70}ms` });

export default async function GustReport() {
  const session = await adminSession();
  if (!session) return <SignInPrompt callbackUrl="/admin/reports/gust" what="Pro zobrazení podkladu" />;
  if (session.role !== 'admin') return <AdminOnly />;

  return (
    <article className="space-y-20">
      <header className="space-y-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/admin/reports" className="tap inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
            <ArrowLeft size={14} aria-hidden />
            Podklady
          </Link>
          <ShareButton title={TITLE} />
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end">
          <div className="rise space-y-5">
            <GustLockup size={44} byline className="text-ink" />
            <h1 className="max-w-3xl text-[clamp(34px,5.4vw,58px)] leading-[1.04] text-ink">
              Push do repa a za minutu <span className="text-accent">běží na našem serveru</span>
            </h1>
            <p className="max-w-2xl text-lg text-ink-2">
              Gust je naše platforma pro nasazování na jeden VPS. Nahradí Vercel pro všechny projekty: deploy z GitHubu, domény s certifikáty,
              env proměnné, živé logy, rollback a preview pro pull requesty, za jedním přihlášením přes Authentik.
            </p>
            <p className="text-sm text-muted">Specifikace v0.1, ověřeno 7. 11. 2026. Slouží k promýšlení směru i jako příručka pro vývoj.</p>
          </div>
          <div className="rise space-y-3" style={delay(2)}>
            <p className="text-sm font-medium text-ink">Instalace na čistý server</p>
            <CopyCommand command={INSTALL} />
            <p className="text-sm text-muted">Ubuntu 24.04 nebo Debian 12. Skript nainstaluje Docker, nastaví firewall a spustí Gust.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <div key={p.title} className="rise space-y-2 rounded-2xl bg-card p-6" style={delay(i + 3)}>
              <h2 className="text-lg text-ink">{p.title}</h2>
              <p className="text-[15px] leading-relaxed text-ink-2">{p.text}</p>
            </div>
          ))}
        </div>

        <nav aria-label="Obsah podkladu" className="flex flex-wrap gap-2">
          {toc.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="rounded-full bg-paper-2 px-3.5 py-1.5 text-sm text-ink-2 transition-colors duration-150 hover:bg-line hover:text-ink">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <Section id="ukazka" title="Jak bude Gust vypadat" note="Klikací ukázka. Projekty a domény jsou naše, commity a časy jsou vymyšlené.">
        <GustDemo />
      </Section>

      <Section id="vercel" title="Co dostaneme místo Vercelu">
        <div className="overflow-x-auto rounded-2xl bg-card">
          <table className="w-full min-w-[720px] text-[15px]">
            <thead>
              <tr className="bg-paper-2 text-left text-sm font-medium text-muted">
                <th className="px-4 py-3">Funkce</th>
                <th className="px-4 py-3">Gust v1</th>
                <th className="px-4 py-3">Jak</th>
              </tr>
            </thead>
            <tbody>
              {vercelMap.map((r) => (
                // taste-skill-ignore: rules between rows of a real data table
                <tr key={r.feature} className="border-t border-line align-top first:border-t-0">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-ink">{r.feature}</td>
                  <td className="px-4 py-3">
                    <Chip mark={r.mark}>{r.label}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{r.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="architektura"
        title="Co běží kde a kdo s kým mluví"
        note="Klikněte na část schématu pro detail, nebo spusťte tok a projděte ho krok po kroku."
      >
        <Architecture />
        <dl className="grid gap-4 md:grid-cols-3">
          {[
            ['gust_edge', 'Traefik a všechno, co má doménu: UI, Zot, aplikace, Authentik.'],
            ['gust_internal', 'UI, worker, engine a databáze Gustu. Bez portů ven.'],
            ['gust_proj_<name>', 'Služby jednoho projektu. Databáze projektu je jen tady.'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-card p-5">
              <dt className={`${mono} text-sm text-accent`}>{k}</dt>
              <dd className="mt-1 text-[15px] text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="monitoring"
        title="Gust hlídá i samotný server"
        note="Metriky serveru s historií 30 dní, živá spotřeba kontejnerů a upozornění do iPhonu a na Discord. Na Macu i v telefonu v ukázce výše je to obrazovka Server a záložka Status."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title="Sběr dat">
            <Bullets
              items={[
                'node_exporter čte metriky hostitele z /proc a /sys, jen pro čtení.',
                'VictoriaMetrics si je bere každých 15 s a drží 30 dní v plném rozlišení. Při pár stovkách metrik to jsou stovky MB.',
                'Kontejnery jen živě přes Docker API, které engine stejně používá. Bez historie.',
                'Obě nové služby dohromady kolem 150 MB RAM, bez portů ven.',
              ]}
            />
          </Panel>
          <Panel title="Upozornění">
            <Bullets
              items={[
                'Worker vyhodnocuje pravidla každých 30 s přímo nad VictoriaMetrics.',
                'Stavy čeká, hoří a vyřešeno. Stejný problém se znovu ohlásí nejdřív za 4 hodiny.',
                'Push do Gustu přidaného na plochu iPhonu (iOS 16.4+), bez App Store.',
                'Zpráva do kanálu na Discordu přes webhook.',
              ]}
            />
          </Panel>
          <Panel title="Hlídač zvenku">
            <Bullets
              items={[
                'Když spadne celý server, Gust ani Uptime Kuma na stejném stroji nic nepošlou.',
                'Proto Gust každou minutu pošle signál na healthchecks.io (zdarma). Když přestane, healthchecks.io ohlásí výpadek na Discord.',
                'Uptime Kuma dál hlídá domény a certifikáty.',
              ]}
            />
          </Panel>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Panel title="Co se měří">
            <dl className="grid grid-cols-[minmax(0,110px)_1fr] gap-x-4 gap-y-2 text-[15px]">
              {monitorMetrics.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-medium text-ink">{k}</dt>
                  <dd className="text-ink-2">{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>
          <div className="overflow-x-auto rounded-2xl bg-card">
            <table className="w-full min-w-[560px] text-[15px]">
              <thead>
                <tr className="bg-paper-2 text-left text-sm font-medium text-muted">
                  <th className="px-4 py-3">Pravidlo</th>
                  <th className="px-4 py-3">Varování</th>
                  <th className="px-4 py-3">Kritické</th>
                </tr>
              </thead>
              <tbody>
                {alertRules.map((r) => (
                  // taste-skill-ignore: rules between rows of a real data table
                  <tr key={r.rule} className="border-t border-line align-top first:border-t-0">
                    <td className="px-4 py-3 font-medium text-ink">{r.rule}</td>
                    <td className="px-4 py-3 text-ink-2">{r.warn}</td>
                    <td className="px-4 py-3 text-ink-2">{r.crit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 pb-4 pt-1 text-sm text-muted">Prahy jdou v Gustu upravit u každého pravidla. Další servery přes agenta později.</p>
          </div>
        </div>
      </Section>

      <Section id="deploy" title="Životní cyklus deploye" note="Každý deploy je řádek v tabulce Deployment. Stav mění jen worker, UI ho jen čte.">
        <StateMachine />
        <div className="grid gap-4 md:grid-cols-2">
          <Panel title="Bez výpadku (app)">
            <Bullets
              items={[
                'Worker vezme job, engine stáhne image ze Zotu podle digestu.',
                'Nový kontejner dostane stejné jméno služby v Traefiku jako běžící. Traefik na něj pošle provoz až po úspěšném health checku.',
                'Pak starý dostane SIGTERM a 10 s na dokončení požadavků, potom se smaže.',
                'Když image nemá vlastní health check, Gust volá GET na healthPath služby, výchozí je /.',
                'Na službu běží jen jeden deploy. Novější ve frontě nahradí čekající.',
              ]}
            />
          </Panel>
          <Panel title="Restart (stateful) a rollback">
            <Bullets
              items={[
                'Stateful služba se zastaví a spustí s novým image nad stejným volume. Krátký výpadek je očekávaný.',
                'Před aktualizací stateful služby proběhne záloha (pg_dump, Redis BGSAVE).',
                'Rollback je nový deploy se starším image. Stahování se přeskočí, image je na serveru.',
                'Na serveru zůstává posledních 5 image na službu a všechny běžící. Zbytek smaže noční úklid.',
                'Zot drží posledních 20 tagů na repozitář.',
              ]}
            />
          </Panel>
        </div>
      </Section>

      <Section id="data" title="Tabulky v databázi Gustu" note="Databáze říká, co má běžet. Docker labely slouží ke kontrole, jestli to tak opravdu je.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entities.map((e) => (
            <div key={e.name} className="rounded-2xl bg-card p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className={`${mono} text-[15px] font-semibold tracking-normal text-ink`}>{e.name}</h3>
                <span className={`${mono} text-xs text-muted`}>{e.prefix}</span>
              </div>
              <ul className={`mt-3 space-y-1 ${mono} text-[13px]`}>
                {e.fields.map(([f, t, fk]) => (
                  <li key={f} className="flex justify-between gap-3">
                    <span className={fk ? 'text-accent' : 'text-ink'}>{f}</span>
                    <span className="text-right text-muted">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted">Fialově cizí klíče. ID mají krátký prefix (prj_, svc_, dpl_), takže jsou čitelná v logu i v adrese.</p>
      </Section>

      <Section id="konvence" title="Jména, labely, sítě a cesty" note="Kdo se přihlásí přes SSH a spustí docker ps, musí hned poznat, co je co.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Pojmenování">
            <dl className="grid grid-cols-[minmax(0,140px)_1fr] gap-x-4 gap-y-2.5 text-[15px]">
              {[
                ['Kontejner app', 'gust-smart-targets-api-dpl8f3k'],
                ['Kontejner stateful', 'gust-smart-targets-db'],
                ['Image', 'registry.gust.zephyron.tech/smart-targets/api:<sha>'],
                ['Síť projektu', 'gust_proj_smart-targets'],
                ['Volume', 'gust_smart-targets_db_data'],
                ['Router v Traefiku', 'smart-targets-api, preview smart-targets-api-pr42'],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">{k}</dt>
                  <dd className={`min-w-0 break-words ${mono} text-[13px] text-ink`}>{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>
          <Code title="Cesty na serveru">{`/opt/gust/
  compose.yml        # Gust: ui, worker, engine, proxy, db, zot, traefik
  .env               # 0600, secrets z instalace
  traefik/acme.json  # certifikáty
  traefik/dynamic/   # TCP routy a výjimky
/var/lib/gust/
  postgres/  zot/  backups/
/opt/docker/<stack>/ # sledované Compose stacky, beze změny`}</Code>
        </div>
        <Code title="Labely nasazeného kontejneru (app)">{`gust.managed=true
gust.project=smart-targets
gust.service=api
gust.type=app
gust.deployment=dpl_8f3k2q
traefik.enable=true
traefik.docker.network=gust_edge
traefik.http.routers.smart-targets-api.rule=Host(\`api.targets.zephyron.tech\`)
traefik.http.routers.smart-targets-api.tls.certresolver=le
traefik.http.services.smart-targets-api.loadbalancer.server.port=3000
traefik.http.services.smart-targets-api.loadbalancer.healthcheck.path=/healthz
traefik.http.services.smart-targets-api.loadbalancer.healthcheck.interval=2s`}</Code>
        <div className="grid gap-4 md:grid-cols-3">
          <Panel title="Výchozí limity">
            <Bullets items={['app: 1 CPU, 512 MB', 'stateful: 1 CPU, 1 GB', 'logy: json-file, 3 × 10 MB', 'restart: unless-stopped']} />
          </Panel>
          <Panel title="Nasazené služby nesmí">
            <Bullets items={['privileged a cap_add', 'mount /var/run/docker.sock', 'bind mount mimo /var/lib/gust', 'network_mode: host']} />
          </Panel>
          <Panel title="Výjimky">
            <Bullets items={['TCP služby (Postgres vizitek 5433, saltyredis) přes soubor v traefik/dynamic', 'ops-bot zůstává mimo Gust jako vlastní Compose']} />
          </Panel>
        </div>
      </Section>

      <Section id="api" title="Rozhraní ven a dovnitř" note="Z internetu vedou jen dva vstupy pro automatizaci a přihlášení. API enginu je jen ve vnitřní síti.">
        <div className="overflow-x-auto rounded-2xl bg-card">
          <table className="w-full min-w-[860px] text-[15px]">
            <thead>
              <tr className="bg-paper-2 text-left text-sm font-medium text-muted">
                <th className="px-4 py-3">Endpoint</th>
                <th className="px-4 py-3">Volá</th>
                <th className="px-4 py-3">Ověření</th>
                <th className="px-4 py-3">Co dělá</th>
              </tr>
            </thead>
            <tbody>
              {publicApi.map(([e, who, auth, what]) => (
                // taste-skill-ignore: rules between rows of a real data table
                <tr key={e} className="border-t border-line align-top first:border-t-0">
                  <td className={`whitespace-nowrap px-4 py-3 ${mono} text-[13px] text-ink`}>{e}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-2">{who}</td>
                  <td className="px-4 py-3 text-ink-2">{auth}</td>
                  <td className="px-4 py-3 text-ink-2">{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <Panel title="API enginu">
            <dl className="space-y-3">
              {engineApi.map(([e, what]) => (
                <div key={e}>
                  <dt className={`${mono} text-[13px] text-accent`}>{e}</dt>
                  <dd className="text-[15px] text-ink-2">{what}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-muted">
              Ověření hlavičkou Authorization: Bearer ENGINE_TOKEN. Typy požadavků a událostí jsou ve sdíleném balíčku @gust/contracts (zod).
            </p>
          </Panel>
          <Code title=".github/workflows/deploy.yml v repu projektu">{`permissions: { id-token: write, contents: read }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: registry.gust.zephyron.tech
          username: \${{ secrets.GUST_REGISTRY_USER }}
          password: \${{ secrets.GUST_REGISTRY_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: registry.gust.zephyron.tech/smart-targets/api:\${{ github.sha }}
      # později jako zephyron/gust-deploy-action
      - run: |
          TOKEN=$(curl -sH "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \\
            "$ACTIONS_ID_TOKEN_REQUEST_URL&audience=gust.zephyron.tech" | jq -r .value)
          curl -fsS -X POST https://gust.zephyron.tech/api/deploy \\
            -H "Authorization: Bearer $TOKEN" \\
            -d '{"service":"smart-targets/api","tag":"\${{ github.sha }}"}'`}</Code>
        </div>
      </Section>

      <Section id="bezpecnost" title="Kdo smí na Docker" note="Kdo ovládá Docker socket, ovládá celý server. Socket má proto jen jeden kontejner.">
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Zóny">
            <Bullets
              items={[
                'Internet: jen Traefik na 80 a 443, SSH na klíč. Postgres vizitek 5433 jen s TLS a fail2ban.',
                'gust_edge: Traefik, UI, Zot a služby s doménou. Nic z toho socket nevidí.',
                'gust_internal: UI, worker, engine a databáze Gustu, bez portů ven.',
                'Socket: jen docker-socket-proxy. Engine přes něj smí na containers, images, networks, volumes a events. Exec, swarm a plugins ne.',
              ]}
            />
          </Panel>
          <Panel title="Pravidla">
            <Bullets
              items={[
                'Secrets šifrované AES-256-GCM. Hlavní klíč je v /opt/gust/.env, ne v databázi. Odkrytí v UI se zapíše do auditu.',
                'Přihlášení jen přes Authentik s druhým faktorem. Nouzový lokální účet pro chvíli, kdy Authentik neběží.',
                'Role admin smí vše, member deploy a logy, bez secrets a mazání.',
                'Každá změna je AuditEvent s uživatelem, IP a rozdílem.',
                'Webhooky ověřené podpisem, deploy ověřený OIDC. V GitHubu není žádný dlouhodobý deploy token.',
                'Server: ufw, fail2ban, automatické bezpečnostní aktualizace, SSH bez hesla a bez roota.',
              ]}
            />
          </Panel>
        </div>
      </Section>

      <section id="instalace" aria-labelledby="t-install" className="scroll-mt-6 space-y-10 rounded-[28px] bg-night p-6 text-white sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div className="space-y-3">
            <p className="text-sm font-medium text-accent-line">Instalace a provoz</p>
            <h2 id="t-install" className="text-[clamp(28px,4vw,44px)] leading-tight text-white">
              Jeden příkaz na čistém serveru
            </h2>
            <p className="max-w-xl text-white/70">
              Balíček z npm na čistém VPS nepomůže, chybí tam Node. Proto shell skript jako u Coolify a Dokploy. Pro práci z vlastního počítače
              později CLI npx @zephyron/gust.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-white/60">Bez otázek, třeba pro obnovu</p>
            <pre className={`overflow-x-auto rounded-2xl bg-night-2 p-5 ${mono} text-[13px] leading-relaxed text-white/85`}>{`GUST_DOMAIN=gust.zephyron.tech \\
GUST_ACME_EMAIL=hello@zephyron.tech \\
curl -fsSL https://gust.zephyron.tech/install.sh | sudo -E bash`}</pre>
          </div>
        </div>
        <ol className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Kontrola', 'Ubuntu 24.04 nebo Debian 12, root, volné porty 80 a 443.'],
            ['Docker', 'Docker Engine a Compose plugin, pokud chybí.'],
            ['Zabezpečení', 'ufw (22, 80, 443), fail2ban a automatické aktualizace.'],
            ['Secrets', 'Vytvoří /opt/gust a /var/lib/gust, vygeneruje hlavní klíč, heslo k databázi, token enginu a účet do Zotu.'],
            ['Spuštění', 'Zeptá se na doménu a e-mail pro certifikáty, stáhne image Gustu a spustí compose.'],
            ['Další kroky', 'Počká na /api/health a vypíše adresu, jednorázový odkaz pro prvního admina a návod na DNS, Authentik a GitHub App.'],
          ].map(([t, x], i) => (
            <li key={t} className="grid grid-cols-[28px_1fr] gap-3">
              <span className="font-display text-sm font-semibold tabular-nums text-accent-line">{i + 1}</span>
              <div className="space-y-1">
                <h3 className="font-display text-base font-semibold text-white">{t}</h3>
                <p className="text-[15px] leading-relaxed text-white/70">{x}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ['Aktualizace', 'Stejný příkaz znovu, nebo tlačítko v nastavení. Secrets nepřepíše.'],
            ['Záloha', 'Každou noc restic na Storage Box nebo B2.'],
            ['Obnova', 'Čistý server a install.sh --restore <snapshot>.'],
            ['Odinstalace', 'install.sh --uninstall zastaví Gust. Data zůstanou, dokud nepřidáte --purge.'],
          ].map(([t, x]) => (
            <div key={t} className="space-y-1 rounded-2xl bg-night-2 p-5">
              <p className="font-medium text-white">{t}</p>
              <p className="text-sm text-white/70">{x}</p>
            </div>
          ))}
        </div>
        <p className="rounded-2xl bg-night-2 p-5 text-[15px] text-white/80">
          <span className="font-medium text-white">Otevřené rozhodnutí:</span> repo je soukromé, takže i image Gustu jsou soukromé. Installer buď
          dostane GUST_TOKEN pro stažení z GHCR, nebo budou image veřejné (kód zůstane soukromý, image se ale dá rozbalit).
        </p>
      </section>

      <Section id="design" title="Logo, barvy a tón Gustu" note="Gust má vlastní značku příbuznou se Zephyronem: stejné písmo nadpisů Sora, fialová jako akcent a podpis Zephyron v našem logotypovém písmu.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex min-h-56 flex-col justify-between rounded-2xl bg-night p-6 text-white [--gust-echo:#8B80FF]">
            <GustLockup size={56} byline tile={false} className="self-center pt-6" />
            <p className="text-xs text-white/50">Na tmavém</p>
          </div>
          <div className="flex min-h-56 flex-col justify-between rounded-2xl bg-card p-6 text-ink">
            <GustLockup size={56} byline tile={false} className="self-center pt-6" />
            <p className="text-xs text-muted">Na světlém</p>
          </div>
          <div className="flex min-h-56 flex-col justify-between rounded-2xl bg-card p-6">
            <div className="flex items-end justify-center gap-5 pt-6">
              <GustMark size={96} tile title="Ikona Gust 96 px" />
              <GustMark size={48} tile />
              <GustMark size={24} tile />
              <GustMark size={16} tile />
            </div>
            <p className="text-xs text-muted">Ikona aplikace a favicon</p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Značka">
            <p className="text-[15px] leading-relaxed text-ink-2">
              Jeden tah nakreslí G od příčky dokola a nahoře z něj vyletí rovně jako proud vzduchu. Kratší proud nad ním dodává pohyb. Na dlaždici je
              značka bílá na tmavém inkoustu Zephyronu, kratší proud je ve fialové. Bez dlaždice přebírá barvu textu.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
              Slovo gust se píše malými písmeny v Sora 600 s těsným prokladem. Podpis <ByZephyron size={15} className="text-ink" /> jen tam, kde se Gust
              představuje: přihlášení, instalace, patička. Zephyron vždy logotypovým písmem Surgena.
            </p>
          </Panel>
          <Panel title="Pravidla">
            <Bullets
              items={[
                'Minimální velikost ikony 16 px, celého loga 96 px na šířku.',
                'Ochranná zóna kolem loga je výška kratšího proudu.',
                'Neotáčet, nedeformovat, nepřidávat stíny ani přechody.',
                'Barvy jen z palety: inkoust, bílá a fialová.',
                'Gust se nikdy nepíše velkými písmeny ani s tečkou.',
              ]}
            />
          </Panel>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg text-ink">Barvy aplikace</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ['#0D0E16', 'Pozadí', 'g-bg'],
              ['#14151F', 'Panely', 'g-bg2'],
              ['#ECEBF5', 'Text', 'g-fg'],
              ['#8B80FF', 'Akce, výběr', 'g-accent'],
              ['#4FD08F', 'Live', 'g-ok'],
              ['#F0BD55', 'Probíhá', 'g-warn'],
              ['#FF7480', 'Failed', 'g-err'],
              ['#74B0FF', 'Healthy', 'g-info'],
              ['#11131E', 'Dlaždice ikony', 'Zephyron night'],
              ['#4235E5', 'Odkazy mimo app', 'Zephyron accent'],
            ].map(([hex, role, token]) => (
              <div key={hex + token} className="overflow-hidden rounded-2xl bg-card">
                <div className="h-16" style={{ background: hex }} />
                <div className="space-y-0.5 p-3">
                  <p className="text-sm font-medium text-ink">{role}</p>
                  <p className={`${mono} text-xs text-muted`}>
                    {hex} · {token}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted">Aplikace je tmavá, je to nástroj na dlouhé sezení u logů. Stavové barvy patří jen stavům, fialová jen akcím a výběru.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title="Písmo">
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-muted">Nadpisy</dt>
                <dd className="font-display text-2xl font-semibold tracking-tight text-ink">Sora 600</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Rozhraní</dt>
                <dd className="text-lg text-ink" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>
                  Systémové (SF Pro, Segoe UI)
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Logy, hashe, cesty</dt>
                <dd className={`${mono} text-ink`}>SF Mono, JetBrains Mono</dd>{/* taste-skill-ignore: names the code face */}
              </div>
            </dl>
          </Panel>
          <Panel title="Pohyb">
            <Bullets
              items={[
                'Přechody 150–250 ms, křivka cubic-bezier(0.23, 1, 0.32, 1).',
                'Pulzuje jen to, co právě běží.',
                'Logy neskáčou dolů, když uživatel odscrolloval nahoru.',
                'Při omezení pohybu v systému se pulzy vypnou.',
              ]}
            />
          </Panel>
          <Panel title="Tón textů">
            <Bullets
              items={[
                'Rozhraní anglicky, krátce, činným rodem.',
                'Tlačítko říká, co udělá: Redeploy, Roll back to this.',
                'Chyba říká příčinu a co to znamená pro provoz.',
                'Čas relativně, přesný v tooltipu.',
              ]}
            />
          </Panel>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-2xl bg-card p-6">
            <p className="text-sm font-semibold text-ok">Ano</p>
            <p className={`${mono} text-[14px] text-ink`}>Health check timed out after 60 s. The previous deployment is still live.</p>
          </div>
          <div className="space-y-2 rounded-2xl bg-card p-6">
            <p className="text-sm font-semibold text-err">Ne</p>
            <p className={`${mono} text-[14px] text-ink`}>Oops! Something went wrong with your deployment. Please try again later.</p>
          </div>
        </div>
      </Section>

      <Section id="roadmapa" title="Milníky" note="Odhady jsou hrubé, pro jednoho zkušeného vývojáře. Každý milník končí něčím, co jde ukázat na lokálu.">
        <ol className="space-y-3">
          {milestones.map((m) => (
            <li key={m.id} className="grid gap-4 rounded-2xl bg-card p-6 md:grid-cols-[96px_minmax(0,1fr)_minmax(0,1fr)]">
              <div>
                <p className="font-display text-2xl font-semibold text-accent">{m.id}</p>
                <p className="text-xs text-muted">{m.time}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg text-ink">{m.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink-2">{m.text}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted">Hotovo, když</p>
                <Bullets items={m.done} />
              </div>
            </li>
          ))}
        </ol>
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Ověřit v M0">
            <Bullets items={spikes} />
          </Panel>
          <Panel title="Otevřená rozhodnutí">
            <Bullets items={openDecisions} />
          </Panel>
        </div>
      </Section>

      <Section id="nazev" title="Je jméno Gust volné?" note="Ověřeno 7. 11. 2026 v npm, DNS a na webu. Pro interní nástroj ano, distribuce ale musí jít pod naším jménem.">
        <div className="overflow-x-auto rounded-2xl bg-card">
          <table className="w-full min-w-[680px] text-[15px]">
            <thead>
              <tr className="bg-paper-2 text-left text-sm font-medium text-muted">
                <th className="px-4 py-3">Kde</th>
                <th className="px-4 py-3">Stav</th>
                <th className="px-4 py-3">Poznámka</th>
              </tr>
            </thead>
            <tbody>
              {nameCheck.map((r) => (
                // taste-skill-ignore: rules between rows of a real data table
                <tr key={r.where} className="border-t border-line align-top first:border-t-0">
                  <td className={`px-4 py-3 ${mono} text-[13px] text-ink`}>{r.where}</td>
                  <td className="px-4 py-3">
                    <Chip mark={r.mark}>{r.label}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </article>
  );
}

function Section({ id, title, note, children }: { id: string; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`t-${id}`} className="reveal scroll-mt-6 space-y-6">
      <div className="space-y-2">
        <h2 id={`t-${id}`} className="text-[clamp(24px,3vw,32px)] text-ink">
          {title}
        </h2>
        {note && <p className="max-w-3xl text-ink-2">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-2xl bg-card p-6">
      <h3 className="text-lg text-ink">{title}</h3>
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-[15px] leading-snug text-ink-2">
      {items.map((t) => (
        <li key={t} className="grid grid-cols-[14px_1fr] gap-2">
          <span className="mt-[0.55em] size-1.5 rounded-full bg-accent" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  );
}

function Chip({ mark, children }: { mark: Mark; children: React.ReactNode }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${markChip[mark]}`}>{children}</span>;
}

function Code({ title, children }: { title: string; children: string }) {
  return (
    <figure className="min-w-0 space-y-2">
      <figcaption className="text-sm text-muted">{title}</figcaption>
      <pre className={`overflow-x-auto rounded-2xl bg-night p-5 ${mono} text-[13px] leading-relaxed text-white/85`}>{children}</pre>
    </figure>
  );
}

function StateMachine() {
  const box = (x: number, y: number, w: number, label: string, tone?: 'ok' | 'err') => (
    <g key={label}>
      <rect
        x={x}
        y={y}
        width={w}
        height={42}
        rx={21}
        fill={tone === 'ok' ? 'var(--color-ok)' : tone === 'err' ? 'var(--color-err-soft)' : 'var(--color-paper)'}
      />
      <text
        x={x + w / 2}
        y={y + 26}
        textAnchor="middle"
        className={`${mono} text-[13px] font-medium`}
        fill={tone === 'ok' ? '#fff' : tone === 'err' ? 'var(--color-err)' : 'var(--color-ink)'}
      >
        {label}
      </text>
    </g>
  );
  const arrow = 'var(--color-line-strong)';
  return (
    <div className="overflow-x-auto rounded-2xl bg-card p-4">
      <svg viewBox="0 0 1100 300" className="block h-auto w-full min-w-[760px]" role="img" aria-label="Stavy deploye">
        <defs>
          <marker id="gust-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill={arrow} />
          </marker>
        </defs>
        {box(20, 80, 110, 'queued')}
        {box(190, 80, 110, 'pulling')}
        {box(360, 80, 110, 'starting')}
        {box(530, 80, 110, 'healthy')}
        {box(700, 80, 110, 'live', 'ok')}
        {box(870, 80, 140, 'superseded')}
        {box(360, 220, 110, 'failed', 'err')}
        {box(20, 220, 110, 'cancelled')}
        <g stroke={arrow} strokeWidth="1.5" fill="none" markerEnd="url(#gust-ah)">
          <path d="M130 101H186" />
          <path d="M300 101H356" />
          <path d="M470 101H526" />
          <path d="M640 101H696" />
          <path d="M810 101H866" />
          <path d="M75 122V216" />
          <path d="M260 122 400 216" />
          <path d="M415 122V216" />
          <path d="M585 122 450 216" />
          <path d="M940 80V40H415V76" strokeDasharray="4 4" />
        </g>
        <g className="text-[12px]" fill="var(--color-muted)">
          <text x="158" y="72" textAnchor="middle">job</text>
          <text x="328" y="72" textAnchor="middle">image</text>
          <text x="498" y="72" textAnchor="middle">200</text>
          <text x="668" y="72" textAnchor="middle">přepnuto</text>
          <text x="838" y="72" textAnchor="middle">novější</text>
          <text x="84" y="175">nahrazen novějším</text>
          <text x="226" y="185">pull selhal</text>
          <text x="424" y="175">pád</text>
          <text x="520" y="185">60 s bez 200</text>
          <text x="678" y="32" textAnchor="middle">rollback: nový deploy se starším image, bez stahování</text>
          <text x="560" y="250">Při failed běží dál předchozí live. Nový kontejner se smaže, log zůstane 30 dní.</text>
        </g>
      </svg>
    </div>
  );
}
