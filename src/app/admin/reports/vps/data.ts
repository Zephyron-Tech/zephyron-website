// Figures from the providers' own pages, checked 3 Nov 2026. Prices are per month
// without VAT (we buy as a company, reverse charge); CZK offers at ≈ 24.5 Kč/€.

export type Fit = 'pick' | 'ok' | 'edge' | 'out';

export interface Plan {
  provider: string;
  plan: string;
  vcpu: string;
  ram: string;
  storage: string;
  storageNote?: string;
  price: string;
  priceNote: string;
  location: string;
  fit: Fit;
  status: string;
  /** Which spec misses the requirement, shown in red. */
  miss?: 'ram' | 'storage' | 'price';
  inBudget: boolean;
}

export const plans: Plan[] = [
  { provider: 'Contabo', plan: 'Cloud VPS 4 (Core)', vcpu: '4', ram: '8 GB', storage: '100 GB SSD', storageNote: 'bez NVMe', price: '4,40 €', priceNote: '5,24 € s DPH', location: 'DE (Norimberk, Düsseldorf)', fit: 'edge', status: 'Splňuje, slabší disk', inBudget: true },
  { provider: 'Contabo', plan: 'Cloud VPS 6 (Core)', vcpu: '6', ram: '12 GB', storage: '100 GB NVMe', storageNote: 'nebo 200 GB SSD', price: '6,00 €', priceNote: '7,14 € s DPH', location: 'DE (Norimberk, Düsseldorf)', fit: 'pick', status: 'Doporučení', inBudget: true },
  { provider: 'OVHcloud', plan: 'VPS-2 (řada 2027)', vcpu: '4', ram: '8 GB', storage: '75 GB NVMe', storageNote: 'denní záloha v ceně', price: '7,21 €', priceNote: '8,58 € s DPH, „od“', location: 'DE (Frankfurt), FR, PL', fit: 'edge', status: 'Těsně pod 80 GB', miss: 'storage', inBudget: true },
  { provider: 'Netcup', plan: 'VPS 1000 G12.5, 24 měs.', vcpu: '4', ram: '8 GB ECC', storage: '128 GB SSD', storageNote: 'port 2,5 Gbit/s', price: '10,35 €', priceNote: '12,32 € s DPH', location: 'EU (AT, DE, NL), Norimberk +1,86 €', fit: 'edge', status: 'Na hraně, závazek 24 měs.', inBudget: true },
  { provider: 'OVHcloud', plan: 'VPS-3 (řada 2027)', vcpu: '6', ram: '12 GB', storage: '100 GB NVMe', storageNote: 'denní záloha v ceně', price: '10,40 €', priceNote: '12,38 € s DPH, „od“', location: 'DE (Frankfurt), FR, PL', fit: 'edge', status: 'Na hraně rozpočtu', inBudget: true },
  { provider: 'Contabo', plan: 'Cloud VPS Plus 4 (Performance)', vcpu: '4 EPYC', ram: '8 GB', storage: '150 GB NVMe', price: '10,80 €', priceNote: '12,85 € s DPH', location: 'DE (Norimberk, Düsseldorf)', fit: 'out', status: 'Nad rozpočtem', miss: 'price', inBudget: false },
  { provider: 'Hostinger', plan: 'KVM 4, předplatné 24 měs.', vcpu: '4', ram: '16 GB', storage: '200 GB NVMe', price: '9,24 €', priceNote: '10,99 € s DPH, obnova 27,99 €', location: 'EU (výběr DC při objednávce)', fit: 'out', status: 'Po 2 letech 3× dráž', inBudget: false },
  { provider: 'IONOS', plan: 'VPS L+', vcpu: '4', ram: '8 GB', storage: '240 GB NVMe', price: '18,49 €', priceNote: '22 € s DPH, první 3 měs. 7 €', location: 'DE', fit: 'out', status: 'Nad rozpočtem', miss: 'price', inBudget: false },
  { provider: 'VEDOS (dříve Wedos)', plan: 'VPS ON: 4 sdílená CPU, 8 GB, 80 GB', vcpu: '4', ram: '8 GB', storage: '80 GB SSD', price: '≈ 35,70 €', priceNote: '873,60 Kč bez DPH', location: 'CZ (vlastní DC)', fit: 'out', status: 'Nad rozpočtem', miss: 'price', inBudget: false },
  { provider: 'Websupport', plan: 'VPS Standard, roční platba', vcpu: '4', ram: '4 GB', storage: '80 GB SSD', price: '≈ 51,40 €', priceNote: '1 260 Kč bez DPH', location: 'SK (Bratislava)', fit: 'out', status: 'Nad rozpočtem', miss: 'ram', inBudget: false },
  { provider: 'Webglobe', plan: 'VPS Ultra', vcpu: '4', ram: '8 GB', storage: '80 GB NVMe', price: '≈ 52,20 €', priceNote: '1 278 Kč bez DPH, 1. rok 639 Kč', location: 'CZ/SK', fit: 'out', status: 'Nad rozpočtem', miss: 'price', inBudget: false },
];

export interface Verdict {
  name: string;
  where: string;
  /** 1–5, an estimate from public benchmarks, not our own measurement. */
  scores: [label: string, value: number][];
  plus: string[];
  minus: string[];
}

export const verdicts: Verdict[] = [
  {
    name: 'Contabo',
    where: 'Cloud VPS 6, Norimberk',
    scores: [['Stabilita', 3], ['IOPS (NVMe)', 3], ['Síť', 2], ['Cena / výkon', 5]],
    plus: [
      '12 GB RAM a 6 vCPU za 6 € je trojnásobek naší dnešní spotřeby, tedy místo i pro parkované projekty.',
      'NVMe varianta výrazně předčí SATA SSD tarif Cloud VPS 4 pro souběžné zápisy z více PostgreSQL.',
      'Měsíční platba bez dlouhého závazku, takže se dá snadno odejít, když výkon nesedí.',
    ],
    minus: [
      'Sdílené jádro je hodně naplněné: výkon kolísá podle sousedů, sledujte CPU steal.',
      'Port 300 Mbit/s a v minulosti delší výpadky i pomalá podpora. Bez SLA nad 99,9 %.',
      'Automatická záloha se platí zvlášť, v ceně jsou jen jeden až dva snapshoty.',
    ],
  },
  {
    name: 'OVHcloud',
    where: 'VPS-2 / VPS-3, Frankfurt',
    scores: [['Stabilita', 4], ['IOPS (NVMe)', 4], ['Síť', 4], ['Cena / výkon', 3]],
    plus: [
      'Velká evropská firma s vlastní sítí, silnou anti-DDoS ochranou a porty 1 až 2 Gbit/s.',
      'Denní záloha celého VPS je v ceně. U Contaba ani Netcupu ne.',
      'Konzistentní NVMe, vhodné pro více databází najednou.',
    ],
    minus: [
      'VPS-2 má jen 75 GB, pod požadavkem 80 GB. VPS-3 je s 10,40 € těsně nad rozpočtem.',
      'Ceny „od“ platí při závazku. V březnu 2026 OVH ceny VPS zvedalo.',
      'Podpora a zákaznický panel bývají těžkopádné.',
    ],
  },
  {
    name: 'Netcup',
    where: 'VPS 1000 G12.5, Norimberk/Vídeň',
    scores: [['Stabilita', 4], ['IOPS', 4], ['Síť', 4], ['Cena / výkon', 2]],
    plus: [
      'Pověst stabilního provozu, ECC paměť, rozhraní 2,5 Gbit/s a 128 GB disku.',
      'Datacentra v Norimberku a Vídni mají k Praze kratší latenci než Frankfurt.',
    ],
    minus: [
      'Ceny v roce 2026 vyletěly: 10,35 € bez DPH platí jen při 24měsíčním závazku, měsíčně je to dvojnásobek.',
      'Pouze 8 GB RAM, rezerva pro parkované projekty bude malá.',
      'Při průměru přes 2 TB provozu za 24 h se port škrtí na 200 Mbit/s.',
    ],
  },
  {
    name: 'Hostinger a IONOS',
    where: 'KVM 4, VPS L+',
    scores: [['Stabilita', 3], ['IOPS (NVMe)', 4], ['Síť', 3], ['Cena / výkon', 2]],
    plus: ['Velkorysé parametry: Hostinger 16 GB a 200 GB NVMe, IONOS 240 GB NVMe.'],
    minus: [
      'Úvodní ceny jsou návnada. Hostinger po dvou letech 27,99 €, IONOS po třech měsících 22 € s DPH.',
      'Hostinger chce celé předplatné předem (263,76 €).',
      'Dlouhodobě nad rozpočtem, a proto se nehodí pro trvalý produkční server.',
    ],
  },
  {
    name: 'VEDOS, Webglobe, Websupport',
    where: 'CZ a SK datacentra',
    scores: [['Stabilita', 4], ['IOPS', 3], ['Síť do CZ', 5], ['Cena / výkon', 1]],
    plus: [
      'Nejnižší latence k českým zákazníkům, česká fakturace v Kč a podpora v češtině.',
      'Data fyzicky v ČR nebo SR, což může být argument u klientů z veřejné správy.',
    ],
    minus: [
      'Pro 4 vCPU a 8 GB stojí 870 až 1 280 Kč měsíčně, tedy 3,5× až 5× víc než rozpočet.',
      'Websupport má v doporučeném tarifu jen 4 GB RAM, 8 GB je možné jen v individuální konfiguraci za vyšší cenu.',
      'VEDOS účtuje každý GB disku zvlášť (3,99 Kč), růst dat je u něj nejdražší.',
    ],
  },
];

export const steps: { tag: string; title: string; text: string }[] = [
  { tag: 'Den 1', title: 'Změřit, než se stěhuje', text: 'Spusťte fio s náhodným zápisem 4K (iodepth 32), pgbench a 30 minut sledujte CPU steal přes vmstat 5. Steal trvale nad 5 % nebo latence zápisu v desítkách ms znamenají zrušit tarif a jít na OVH.' },
  { tag: 'PostgreSQL', title: 'Pět clusterů sloučit na dva', text: 'Authentik, Outline, Nextcloud a Orbit mohou běžet v jednom clusteru PostgreSQL 17 s oddělenými databázemi a rolemi. Zephyron Cards nechte zvlášť kvůli TLS přístupu zvenku. Ušetříte RAM za sdílené buffery i souběžné checkpointy na disku.' },
  { tag: 'Redis', title: 'Jedna instance místo pěti', text: 'Outline, Nextcloud a MCP Weather mohou sdílet jeden Redis 7 s ACL uživateli a vlastními prefixy. Authentik od verze 2025.10 Redis nepotřebuje, ověřte to u vaší verze 2026.5 a jeho Redis vypněte.' },
  { tag: 'Limity', title: 'Paměť a logy pod kontrolou', text: 'Každému kontejneru dejte mem_limit, aby ClearWay s Celery nevyhladověl Authentik. Logy Dockeru omezte na max-size 10m, jinak sníží rezervu disku rychleji než data.' },
  { tag: 'Zálohy', title: 'Zálohy mimo server', text: 'Snapshot u téhož poskytovatele není záloha. orbit-backup a noční pg_dump ostatních databází posílejte šifrovaně (restic) k jinému poskytovateli v EU a jednou za měsíc zkuste obnovu.' },
  { tag: 'Monitoring', title: 'Hlídat zvenku', text: 'Uptime Kuma na stejném stroji výpadek celého serveru nenahlásí. Druhou instanci provozujte jinde, třeba na nejmenším VPS u jiného poskytovatele.' },
  { tag: 'Přesun', title: 'Cutover bez výpadku certifikátů', text: 'Den předem snižte TTL DNS na 300 s. Přeneste acme.json z Traefiku, ať se nenarazí na limity Let’s Encrypt. Databáze přeneste přes pg_dump a obnovu, ne kopírováním volume mezi verzemi.' },
];

export const sources: { label: string; href: string }[] = [
  { label: 'Contabo Core VPS', href: 'https://contabo.com/en/vps/' },
  { label: 'Contabo Performance VPS', href: 'https://contabo.com/en/vps-performance/' },
  { label: 'OVHcloud VPS 2027', href: 'https://www.ovhcloud.com/de/vps/' },
  { label: 'Netcup vServer', href: 'https://www.netcup.com/en/server/vps' },
  { label: 'Netcup VPS 1000 G12.5 (24 měs.)', href: 'https://www.netcup.com/en/server/vps/vps-1000-g12.5-iv-24m-eu' },
  { label: 'Hostinger KVM', href: 'https://www.hostinger.com/de/vps-hosting' },
  { label: 'IONOS VPS+', href: 'https://www.ionos.de/server/vps' },
  { label: 'VEDOS VPS ON', href: 'https://vedos.cz/vps-on/' },
  { label: 'Webglobe VPS', href: 'https://www.webglobe.cz/servery/vps' },
  { label: 'Websupport VPS', href: 'https://www.websupport.cz/servery/vps/' },
];
