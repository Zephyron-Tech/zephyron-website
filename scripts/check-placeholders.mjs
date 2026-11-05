#!/usr/bin/env node
// Fails the build when unfinished copy is left in the content: write
// "[doplnit: …]" where a real number or quote is still missing, and this
// check keeps it from reaching production.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['src/content', 'src/messages'];
const PATTERN = /\[doplnit\b[^\]]*\]/gi;

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(ts|tsx|json|md|mdx)$/.test(name)) yield p;
  }
}

const hits = [];
for (const root of ROOTS) {
  for (const file of files(root)) {
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        for (const m of line.matchAll(PATTERN)) hits.push(`${file}:${i + 1}  ${m[0]}`);
      });
  }
}

if (hits.length) {
  console.error(`Unfinished content (${hits.length}):\n${hits.join('\n')}`);
  process.exit(1);
}
console.log('check-placeholders: ok');
