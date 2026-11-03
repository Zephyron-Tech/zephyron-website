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
    plus: ['6 vCPU a 12 GB za 6 €, místo i pro parkované projekty.', 'Měsíční platba, snadný odchod.'],
    minus: ['Přeplněné sdílené jádro, výkon kolísá.', 'Port 300 Mbit/s, automatická záloha za příplatek.'],
  },
  {
    name: 'OVHcloud',
    where: 'VPS-2 / VPS-3, Frankfurt',
    scores: [['Stabilita', 4], ['IOPS (NVMe)', 4], ['Síť', 4], ['Cena / výkon', 3]],
    plus: ['Silná síť a anti-DDoS, port 1–2 Gbit/s.', 'Denní záloha v ceně.'],
    minus: ['VPS-2 má jen 75 GB, VPS-3 je nad rozpočtem.', 'Ceny „od“ platí jen se závazkem.'],
  },
  {
    name: 'Netcup',
    where: 'VPS 1000 G12.5, Norimberk/Vídeň',
    scores: [['Stabilita', 4], ['IOPS', 4], ['Síť', 4], ['Cena / výkon', 2]],
    plus: ['Stabilní provoz, ECC RAM, port 2,5 Gbit/s.', 'Nízká latence do Prahy.'],
    minus: ['10,35 € jen se závazkem 24 měsíců.', 'Jen 8 GB RAM.'],
  },
  {
    name: 'Hostinger a IONOS',
    where: 'KVM 4, VPS L+',
    scores: [['Stabilita', 3], ['IOPS (NVMe)', 4], ['Síť', 3], ['Cena / výkon', 2]],
    plus: ['Hodně RAM a disku za úvodní cenu.'],
    minus: ['Po akci 22–28 € měsíčně.', 'Hostinger chce 2 roky předem.'],
  },
  {
    name: 'VEDOS, Webglobe, Websupport',
    where: 'CZ a SK datacentra',
    scores: [['Stabilita', 4], ['IOPS', 3], ['Síť do CZ', 5], ['Cena / výkon', 1]],
    plus: ['Nejnižší latence, data v ČR/SR, fakturace v Kč.'],
    minus: ['870–1 280 Kč měsíčně, 3,5–5× nad rozpočtem.'],
  },
];

export const steps: { tag: string; title: string; text: string }[] = [
  { tag: 'Den 1', title: 'Změřit disk a CPU', text: 'fio 4K random write, pgbench a 30 min vmstat. Steal nad 5 % znamená přejít na OVH.' },
  { tag: 'PostgreSQL', title: 'Pět clusterů na dva', text: 'Authentik, Outline, Nextcloud a Orbit do jednoho PG 17. Cards zvlášť kvůli TLS zvenku.' },
  { tag: 'Redis', title: 'Jedna instance', text: 'Sdílený Redis 7 s ACL. Authentik od 2025.10 Redis nepotřebuje.' },
  { tag: 'Limity', title: 'mem_limit a rotace logů', text: 'Limit paměti na kontejner, logy Dockeru max-size 10m.' },
  { tag: 'Zálohy', title: 'Mimo server', text: 'pg_dump a orbit-backup šifrovaně (restic) k jinému poskytovateli, měsíčně test obnovy.' },
  { tag: 'Přesun', title: 'Cutover', text: 'TTL DNS 300 s předem, přenést acme.json, databáze přes pg_dump. Uptime Kuma pustit i mimo server.' },
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
