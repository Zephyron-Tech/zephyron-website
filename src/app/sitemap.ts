import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';
import { services } from '@/content/services';
import { detailedCaseStudies } from '@/content/case-studies';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: 'monthly' | 'yearly' = 'monthly') => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
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
    entry('/ochrana-osobnich-udaju', 0.2, 'yearly'),
    entry('/obchodni-podminky', 0.2, 'yearly'),
  ];
}
