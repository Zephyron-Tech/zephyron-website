import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    // /v/ (business cards) stays crawlable so LinkedIn, WhatsApp and Facebook can
    // fetch their link previews; the cards carry noindex, so they stay out of search.
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/'] },
    sitemap: 'https://zephyron.tech/sitemap.xml',
  };
}
