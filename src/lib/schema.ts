import { SITE } from '@/content/site';
import type { FaqItem } from '@/content/faq';

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Úvod', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path === '/' ? '/' : it.path}`,
    })),
  };
}

export const ORG_ID = `${SITE.url}/#organization`;
export const personId = (slug: string) => `${SITE.url}/o-nas#${slug}`;

/** A founder as a schema.org Person, tied to the organisation by @id. */
export function personSchema(p: {
  slug: string;
  name: string;
  role: string;
  photo?: string;
  email?: string;
  linkedin?: string;
  knowsAbout: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId(p.slug),
    name: p.name.replace(/^Ing\.\s*/, ''),
    honorificPrefix: p.name.startsWith('Ing.') ? 'Ing.' : undefined,
    jobTitle: p.role,
    url: `${SITE.url}/o-nas`,
    ...(p.photo ? { image: `${SITE.url}${p.photo}` } : {}),
    ...(p.email ? { email: p.email } : {}),
    ...(p.linkedin ? { sameAs: [p.linkedin] } : {}),
    worksFor: { '@id': ORG_ID },
    knowsAbout: p.knowsAbout,
  };
}

/**
 * The page itself: when it last changed and who answers for its content. Lets
 * search and AI answers show a date and tie the text to a named person.
 */
export function webPageSchema(p: { path: string; name: string; description: string; updated: string; author?: string }) {
  const url = `${SITE.url}${p.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: p.name,
    description: p.description,
    inLanguage: 'cs',
    isPartOf: { '@id': `${SITE.url}/#website` },
    publisher: { '@id': ORG_ID },
    dateModified: p.updated,
    ...(p.author ? { author: { '@id': personId(p.author) } } : {}),
  };
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    alternateName: ['Zephyron', SITE.legalName],
    inLanguage: 'cs',
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

const GLOSSARY_ID = `${SITE.url}/slovnik#glossary`;

export function definedTermSetSchema(terms: { slug: string; term: string; short: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': GLOSSARY_ID,
    name: 'Slovník pojmů z IT a automatizace',
    url: `${SITE.url}/slovnik`,
    inLanguage: 'cs',
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.short,
      url: `${SITE.url}/slovnik/${t.slug}`,
    })),
  };
}

export function definedTermSchema(t: { slug: string; term: string; short: string; aka?: string[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${SITE.url}/slovnik/${t.slug}#term`,
    name: t.term,
    ...(t.aka?.length ? { alternateName: t.aka } : {}),
    description: t.short,
    url: `${SITE.url}/slovnik/${t.slug}`,
    inDefinedTermSet: GLOSSARY_ID,
  };
}

export function caseStudySchema(c: { slug: string; name: string; kicker: string; summary: string; image?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${SITE.url}/reference/${c.slug}#work`,
    name: `${c.name}: ${c.kicker}`,
    description: c.summary,
    url: `${SITE.url}/reference/${c.slug}`,
    inLanguage: 'cs',
    ...(c.image ? { image: `${SITE.url}${c.image}` } : {}),
    creator: { '@id': `${SITE.url}/#organization` },
  };
}
