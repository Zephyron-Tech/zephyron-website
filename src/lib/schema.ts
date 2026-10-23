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
