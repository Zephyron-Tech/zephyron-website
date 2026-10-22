import type { Metadata } from 'next';
import { SITE } from '@/content/site';

interface PageSeo {
  /** What the page is, up to ~45 characters; the layout appends " | Zephyron Tech". */
  title: string;
  /** 140–160 characters, a concrete benefit, unique on the site. */
  description: string;
  /** Path from the site root, e.g. "/sluzby/it-podpora". */
  path: string;
  /** Use the title as written, without the " | Zephyron Tech" suffix (home page). */
  absoluteTitle?: boolean;
  noindex?: boolean;
  type?: 'website' | 'article';
}

// One shape for every page's metadata: the tab title, the search snippet, the
// canonical address and the social preview all come from the same three values.
// The preview picture comes from the route's opengraph-image file.
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
  noindex,
  type = 'website',
}: PageSeo): Metadata {
  const url = `${SITE.url}${path === '/' ? '/' : path}`;
  const full = absoluteTitle ? title : `${title} | Zephyron Tech`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: full,
      description,
      url,
      siteName: 'Zephyron Tech',
      locale: 'cs_CZ',
      type,
    },
    twitter: { card: 'summary_large_image', title: full, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
