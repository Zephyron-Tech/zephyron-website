import { ogContentType, ogImage, ogSize } from '@/lib/og';

export const alt = 'Zephyron Tech: automatizace a interní systémy pro firmy';
export const size = ogSize;
export const contentType = ogContentType;
// Prerender at build so the font and picture files don't need to ship with a function.
export const dynamic = 'force-static';

export default function Image() {
  return ogImage({
    label: 'Softwarové studio z Plzně',
    title: 'Firma vám roste.',
    accent: 'Procesy by měly taky.',
    art: 'hourglass',
  });
}
