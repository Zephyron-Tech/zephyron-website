#!/usr/bin/env node
// Tells Bing (and through it ChatGPT Search and Copilot), Seznam and other
// IndexNow engines that pages changed. Run after a deploy that changed content:
//   npm run indexnow            (every URL in the live sitemap)
//   npm run indexnow -- /reseni/evidence-zakazek /sluzby   (just these paths)
import { readdirSync } from 'node:fs';

const HOST = 'zephyron.tech';
const SITE = `https://${HOST}`;
const key = readdirSync('public')
  .map((f) => f.match(/^([a-f0-9]{32})\.txt$/)?.[1])
  .find(Boolean);
if (!key) {
  console.error('No IndexNow key file (public/<32 hex>.txt).');
  process.exit(1);
}

let urls = process.argv.slice(2).map((p) => (p.startsWith('http') ? p : `${SITE}${p}`));
if (urls.length === 0) {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `${SITE}/${key}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URL(s)`);
if (!res.ok && res.status !== 202) process.exit(1);
