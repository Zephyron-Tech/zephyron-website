import { ogContentType, ogImage, ogSize } from '@/lib/og';

export const alt = 'Slovník pojmů z IT a automatizace';
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = 'force-static';

export default function Image() {
  return ogImage({ label: 'Slovník pojmů', title: 'IT a automatizace', accent: 'bez žargonu', art: 'typewriter' });
}
