import { getTerm, termQuestion } from '@/content/glossary';
import { ogContentType, ogImage, ogSize } from '@/lib/og';

type Params = { slug: string };

export const dynamic = 'force-static';

export async function generateImageMetadata({ params }: { params: Params | Promise<Params> }) {
  const t = getTerm((await params).slug);
  return [
    {
      id: 'og',
      alt: t ? `${termQuestion(t)}? Slovník pojmů Zephyron Tech` : 'Zephyron Tech',
      size: ogSize,
      contentType: ogContentType,
    },
  ];
}

export default async function Image({ params }: { params: Params | Promise<Params> }) {
  const t = getTerm((await params).slug)!;
  return ogImage({ label: 'Slovník pojmů', title: `${termQuestion(t)}?`, art: 'typewriter' });
}
