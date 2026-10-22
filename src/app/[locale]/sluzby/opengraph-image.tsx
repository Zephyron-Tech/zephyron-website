import { ogContentType, ogImage, ogSize } from '@/lib/og';

export const alt = 'Služby Zephyron Tech: automatizace, interní systémy, IT podpora a weby';
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = 'force-static';

export default function Image() {
  return ogImage({ label: 'Služby', title: 'Méně ruční práce,', accent: 'víc času na firmu', art: 'abacus' });
}
