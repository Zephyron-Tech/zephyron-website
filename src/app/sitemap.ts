import type { MetadataRoute } from 'next';

const BASE = 'https://zephyron.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return [
    {
      url:             `${BASE}/`,
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        1.0,
    },
    {
      url:             `${BASE}/technologies`,
      lastModified:    now,
      changeFrequency: 'yearly',
      priority:        0.6,
    },
    {
      url:             `${BASE}/privacy`,
      lastModified:    now,
      changeFrequency: 'yearly',
      priority:        0.3,
    },
    {
      url:             `${BASE}/terms`,
      lastModified:    now,
      changeFrequency: 'yearly',
      priority:        0.3,
    },
  ];
}
