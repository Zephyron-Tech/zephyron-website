// First-touch attribution: where a visitor first came from, kept in a
// first-party cookie and stored with their enquiry. No third party sees it.

export const ATTRIBUTION_COOKIE = 'zt_src';
export const ATTRIBUTION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface Attribution {
  source?: string;
  medium?: string;
  campaign?: string;
  landingPage?: string;
  referrer?: string;
}

const clip = (v: string | null | undefined, max: number) => {
  const s = (v ?? '').trim().slice(0, max);
  return s || undefined;
};

/** Built from the first request of a visit. */
export function attributionFrom(url: URL, referer: string | null): Attribution {
  let referrer: string | undefined;
  if (referer) {
    try {
      const host = new URL(referer).hostname.replace(/^www\./, '');
      if (host && host !== url.hostname.replace(/^www\./, '')) referrer = clip(host, 120);
    } catch {
      // Not a URL; ignore.
    }
  }
  return {
    source: clip(url.searchParams.get('utm_source'), 80),
    medium: clip(url.searchParams.get('utm_medium'), 80),
    campaign: clip(url.searchParams.get('utm_campaign'), 120),
    landingPage: clip(url.pathname, 200),
    referrer,
  };
}

/** Parses the cookie value; anything unexpected is dropped. */
export function parseAttribution(raw: string | undefined): Attribution {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw) as Record<string, unknown>;
    const str = (k: string, max: number) => (typeof v[k] === 'string' ? clip(v[k] as string, max) : undefined);
    return {
      source: str('source', 80),
      medium: str('medium', 80),
      campaign: str('campaign', 120),
      landingPage: str('landingPage', 200),
      referrer: str('referrer', 120),
    };
  } catch {
    return {};
  }
}

/** "google / organic", "linkedin.com", "přímý vstup": one line for the admin and e-mail. */
export function describeAttribution(a: Attribution): string {
  if (a.source) return [a.source, a.medium, a.campaign].filter(Boolean).join(' / ');
  if (a.referrer) return a.referrer;
  return 'přímý vstup';
}
