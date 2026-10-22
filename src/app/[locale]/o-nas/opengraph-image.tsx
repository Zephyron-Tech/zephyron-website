import { ogContentType, ogImage, ogSize } from '@/lib/og';

export const alt = 'O nás: Zephyron Tech, softwarové studio z Plzně';
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = 'force-static';

export default function Image() {
  return ogImage({ label: 'O nás', title: 'Softwarové studio', accent: 'z Plzně', art: 'draftingTools' });
}
