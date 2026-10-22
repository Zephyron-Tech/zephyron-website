import { getCaseStudy } from '@/content/case-studies';
import { ogContentType, ogImage, ogSize } from '@/lib/og';

type Params = { slug: string };

export const dynamic = 'force-static';

// Screenshots converted for the renderer (it reads JPEG and PNG, not WebP).
const SHOTS: Record<string, string> = {
  clearway: 'clearway',
  gridtime: 'gridtime',
  'autoskola-falar': 'autoskola',
  'esn-uwb': 'esnuwb',
};

export async function generateImageMetadata({ params }: { params: Params | Promise<Params> }) {
  const c = getCaseStudy((await params).slug);
  return [{ id: 'og', alt: c ? `${c.name}: ${c.kicker}` : 'Zephyron Tech', size: ogSize, contentType: ogContentType }];
}

export default async function Image({ params }: { params: Params | Promise<Params> }) {
  const c = getCaseStudy((await params).slug)!;
  return ogImage({
    label: `Reference · ${c.client}`,
    title: c.name,
    accent: c.kicker, // taste-skill-ignore: the second line of the heading, not a label above it
    shot: SHOTS[c.slug],
    art: c.art,
  });
}
