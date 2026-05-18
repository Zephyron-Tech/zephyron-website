import type { MetadataRoute } from 'next';

const BASE = 'https://zephyron.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return [
    // ── Homepage ─────────────────────────────────────────────────────────
    {
      url:              `${BASE}/`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         1.0,
      alternates: {
        languages: {
          en: `${BASE}/`,
          cs: `${BASE}/cs/`,
        },
      },
    },
    {
      url:              `${BASE}/cs/`,
      lastModified:     now,
      changeFrequency:  'monthly',
      priority:         1.0,
      alternates: {
        languages: {
          en: `${BASE}/`,
          cs: `${BASE}/cs/`,
        },
      },
    },

    // ── Technologies ─────────────────────────────────────────────────────
    {
      url:              `${BASE}/technologies`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.6,
      alternates: {
        languages: {
          en: `${BASE}/technologies`,
          cs: `${BASE}/cs/technologies`,
        },
      },
    },
    {
      url:              `${BASE}/cs/technologies`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.6,
      alternates: {
        languages: {
          en: `${BASE}/technologies`,
          cs: `${BASE}/cs/technologies`,
        },
      },
    },

    // ── Legal ─────────────────────────────────────────────────────────────
    {
      url:              `${BASE}/privacy`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.3,
      alternates: {
        languages: {
          en: `${BASE}/privacy`,
          cs: `${BASE}/cs/privacy`,
        },
      },
    },
    {
      url:              `${BASE}/cs/privacy`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.3,
      alternates: {
        languages: {
          en: `${BASE}/privacy`,
          cs: `${BASE}/cs/privacy`,
        },
      },
    },
    {
      url:              `${BASE}/terms`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.3,
      alternates: {
        languages: {
          en: `${BASE}/terms`,
          cs: `${BASE}/cs/terms`,
        },
      },
    },
    {
      url:              `${BASE}/cs/terms`,
      lastModified:     now,
      changeFrequency:  'yearly',
      priority:         0.3,
      alternates: {
        languages: {
          en: `${BASE}/terms`,
          cs: `${BASE}/cs/terms`,
        },
      },
    },
  ];
}
