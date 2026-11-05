import type { MetadataRoute } from 'next';

// Crawlers that put pages into AI answers (ChatGPT Search, Claude, Perplexity,
// Bing/Copilot) are named so the intent is explicit; they get the same rules
// as everyone else. Training crawlers (GPTBot, ClaudeBot, Google-Extended...)
// fall under "*" and stay allowed on purpose.
const AI_SEARCH_BOTS = ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Bingbot'];

export default function robots(): MetadataRoute.Robots {
  return {
    // /v/ (business cards) stays crawlable so LinkedIn, WhatsApp and Facebook can
    // fetch their link previews; the cards carry noindex, so they stay out of search.
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/'] },
      { userAgent: AI_SEARCH_BOTS, allow: '/', disallow: ['/admin/'] },
    ],
    sitemap: 'https://zephyron.tech/sitemap.xml',
  };
}
