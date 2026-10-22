import { ogContentType, ogImage, ogSize } from '@/lib/og';

export const alt = 'Reference a případové studie Zephyron Tech';
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = 'force-static';

export default function Image() {
  return ogImage({ label: 'Reference', title: 'Projekty, které už běží', art: 'key' });
}
