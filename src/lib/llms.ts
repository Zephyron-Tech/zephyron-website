import { SITE } from '@/content/site';
import { services } from '@/content/services';
import { caseStudies } from '@/content/case-studies';
import { glossary, termQuestion } from '@/content/glossary';
import { homeFaq } from '@/content/faq';
import { team } from '@/content/team';
import { startupCriteria, startupFaq, startupOffer, startupSteps } from '@/content/startup-support';

// /llms.txt and /llms-full.txt (llmstxt.org): the site described in Markdown
// for language models and AI agents. Built from the same content modules as
// the pages, so a new service, case study or glossary term shows up here on
// the next deploy. Nothing here is written only for machines: every fact is on
// the website too.

const url = (path: string) => `${SITE.url}${path}`;
const oneLine = (s: string) => s.replace(/\s+/g, ' ').trim();
const address = `${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}`;

const SUMMARY =
  'Zephyron Tech je softwarové studio z Plzně. Automatizujeme ruční práci, stavíme interní systémy na zakázku, staráme se o firemní IT a děláme weby a webové aplikace pro malé a střední firmy, které přerostly Excel, ale nepotřebují ERP za miliony. Startupům bez technického týmu děláme dlouhodobého technického partnera.';

const FACTS = [
  `- Firma: ${SITE.legalName}, IČO ${SITE.ico}, ${address}, Česko`,
  `- Kontakt: ${SITE.email}, ${SITE.phone}, ${url('/kontakt')}`,
  '- Působnost: celá Česká republika',
  '- Jak pracujeme: úvodní konzultace zdarma, dodávka po etapách s cenou každé etapy známou předem, podpora i po spuštění',
  `- Tým: ${team.map((p) => `${p.name} (${p.role})`).join(', ')}`,
];

const detailed = caseStudies.filter((c) => c.detail);
const caseLink = (c: (typeof caseStudies)[number]) => (c.detail ? url(`/reference/${c.slug}`) : url('/reference'));

export function llmsTxt(): string {
  return [
    `# ${SITE.name}`,
    '',
    `> ${SUMMARY}`,
    '',
    ...FACTS,
    '',
    '## Služby',
    '',
    ...services.map((s) => `- [${s.title}](${url(`/sluzby/${s.slug}`)}): ${oneLine(s.short)}`),
    `- [Přehled služeb](${url('/sluzby')}): všechny služby na jedné stránce`,
    '',
    '## Startup Support',
    '',
    `- [Startup Support](${url('/startup-support')}): technický partner pro zakladatele bez vlastního technického týmu, od návrhu přes první verzi produktu po provoz`,
    '',
    '## Reference',
    '',
    ...caseStudies.map((c) => `- [${c.name}: ${c.kicker}](${caseLink(c)}): ${oneLine(c.summary)}`),
    '',
    '## Firma a kontakt',
    '',
    `- [O nás](${url('/o-nas')}): kdo jsme, jak pracujeme a s kým budete mluvit`,
    `- [Kontakt](${url('/kontakt')}): formulář, e-mail, telefon a sídlo; úvodní konzultace je zdarma`,
    '',
    '## Slovník pojmů',
    '',
    `- [Slovník pojmů](${url('/slovnik')}): pojmy z IT a automatizace vysvětlené pro majitele a vedoucí firem`,
    ...glossary.map((t) => `- [${termQuestion(t)}](${url(`/slovnik/${t.slug}`)}): ${oneLine(t.short)}`),
    '',
    '## Optional',
    '',
    `- [Úplný obsah webu v jednom souboru](${url('/llms-full.txt')}): texty služeb, referencí, častých otázek a slovníku`,
    `- [Ochrana osobních údajů](${url('/ochrana-osobnich-udaju')})`,
    `- [Obchodní podmínky](${url('/obchodni-podminky')})`,
    `- [Mapa webu](${url('/sitemap.xml')})`,
    '',
  ].join('\n');
}

export function llmsFullTxt(): string {
  const out: string[] = [`# ${SITE.name}`, '', `> ${SUMMARY}`, '', ...FACTS, ''];
  const faq = (items: { q: string; a: string }[]) => items.flatMap((f) => [`**${f.q}**`, '', f.a, '']);

  out.push('## Časté otázky', '', ...faq(homeFaq));

  out.push('## Služby', '');
  for (const s of services) {
    out.push(
      `### ${s.title}`,
      '',
      `Stránka: ${url(`/sluzby/${s.slug}`)}`,
      '',
      oneLine(s.heroLead),
      '',
      'Kdy dává smysl se ozvat:',
      '',
      ...s.pains.map((p) => `- ${p}`),
      '',
      'Co od nás dostanete:',
      '',
      ...s.deliverables.map((d) => `- **${d.title}:** ${d.text}`),
      '',
      'Typické zakázky:',
      '',
      ...s.examples.map((e) => `- ${e}`),
      '',
      ...faq(s.faq),
    );
  }

  out.push(
    '## Startup Support',
    '',
    `Stránka: ${url('/startup-support')}`,
    '',
    'Co zakladatel dostane:',
    '',
    ...startupOffer.map((o) => `- **${o.title}:** ${o.text}`),
    '',
    'Jaké projekty vybíráme:',
    '',
    ...startupCriteria.map((c) => `- ${c}`),
    '',
    'Jak spolupráce začíná:',
    '',
    ...startupSteps.map((s, i) => `${i + 1}. **${s.title}:** ${s.text}`),
    '',
    ...faq(startupFaq),
  );

  out.push('## Reference', '');
  for (const c of caseStudies) {
    out.push(`### ${c.name}: ${c.kicker}`, '', `Stránka: ${caseLink(c)}`, `Klient: ${c.client} · Stav: ${c.status}`);
    if (c.url) out.push(`Web: ${c.url}`);
    out.push('', oneLine(c.summary), '');
    if (c.detail) {
      out.push(
        'Výchozí situace:',
        '',
        ...c.detail.problem.map((p) => oneLine(p)),
        '',
        'Co jsme postavili:',
        '',
        ...c.detail.solution.map((p) => oneLine(p)),
        '',
        ...(c.detail.result ? ['Výsledek:', '', ...c.detail.result.map((p) => oneLine(p)), ''] : []),
        `Technologie: ${c.detail.stack.join(', ')}`,
        '',
      );
    }
  }

  out.push('## Slovník pojmů', '');
  for (const t of glossary) {
    out.push(`### ${termQuestion(t)}?`, '', `Stránka: ${url(`/slovnik/${t.slug}`)}`);
    if (t.aka?.length) out.push(`Také: ${t.aka.join(', ')}`);
    out.push('', ...t.body.flatMap((p) => [p, '']));
    if (t.example) out.push(`V praxi: ${t.example.text} (${url(t.example.href)})`, '');
  }

  out.push(
    '## Kontakt',
    '',
    `${SITE.legalName}, ${address}`,
    `E-mail: ${SITE.email}`,
    `Telefon: ${SITE.phone}`,
    `Formulář: ${url('/kontakt')}`,
    '',
  );
  return out.join('\n');
}
