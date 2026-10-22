import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';
import { services } from '@/content/services';
import { detailedCaseStudies } from '@/content/case-studies';
import { glossary } from '@/content/glossary';

// When the page content last changed. A fixed date, not the build time: a
// sitemap that claims every page changed on every deploy teaches Google to
// ignore lastmod. Bump it when the copy of these pages changes.
const CONTENT_UPDATED = '2026-10-22';

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    priority: number,
    changeFrequency: 'monthly' | 'yearly' = 'monthly',
    updated: string = CONTENT_UPDATED,
  ) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(updated),
    changeFrequency,
    priority,
  });

  return [
    entry('/', 1),
    entry('/sluzby', 0.9),
    ...services.map((s) => entry(`/sluzby/${s.slug}`, 0.9)),
    entry('/reference', 0.8),
    ...detailedCaseStudies.map((c) => entry(`/reference/${c.slug}`, 0.7)),
    entry('/startup-support', 0.8),
    entry('/o-nas', 0.6),
    entry('/kontakt', 0.7),
    entry('/slovnik', 0.6),
    ...glossary.map((t) => entry(`/slovnik/${t.slug}`, 0.5, 'yearly', t.updated)),
    entry('/ochrana-osobnich-udaju', 0.2, 'yearly'),
    entry('/obchodni-podminky', 0.2, 'yearly'),
  ];
}
