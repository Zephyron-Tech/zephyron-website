import { getService } from '@/content/services';
import { ogContentType, ogImage, ogSize } from '@/lib/og';

type Params = { slug: string };

export const dynamic = 'force-static';

export async function generateImageMetadata({ params }: { params: Params | Promise<Params> }) {
  const s = getService((await params).slug);
  return [
    { id: 'og', alt: s ? `${s.metaTitle} | Zephyron Tech` : 'Zephyron Tech', size: ogSize, contentType: ogContentType },
  ];
}

export default async function Image({ params }: { params: Params | Promise<Params> }) {
  const s = getService((await params).slug)!;
  return ogImage({ label: s.title, title: s.heroTitle, art: s.art });
}
