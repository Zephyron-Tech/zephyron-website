import { ogContentType, ogImage, ogSize } from '@/lib/og';

export const alt = 'Kontakt a nezávazná konzultace se Zephyron Tech';
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = 'force-static';

export default function Image() {
  return ogImage({ label: 'Kontakt', title: 'Pojďme to probrat', accent: 'Konzultace je zdarma', art: 'phone' });
}
