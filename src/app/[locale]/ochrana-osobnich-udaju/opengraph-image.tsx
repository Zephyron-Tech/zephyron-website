import { ogContentType, ogImage, ogSize } from '@/lib/og';

export const alt = 'Ochrana osobních údajů | Zephyron Tech';
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = 'force-static';

export default function Image() {
  return ogImage({ label: 'Právní informace', title: 'Ochrana osobních údajů' });
}
