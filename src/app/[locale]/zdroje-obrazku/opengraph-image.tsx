import { ogContentType, ogImage, ogSize } from '@/lib/og';

export const alt = 'Odkud pocházejí naše tiskové předměty | Zephyron Tech';
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = 'force-static';

export default function Image() {
  return ogImage({ label: 'Zdroje obrázků', title: 'Odkud pocházejí naše tiskové předměty' });
}
