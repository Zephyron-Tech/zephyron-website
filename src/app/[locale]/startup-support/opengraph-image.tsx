import { ogContentType, ogImage, ogSize } from '@/lib/og';

export const alt = 'Startup Support: technický partner pro startupy';
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = 'force-static';

export default function Image() {
  return ogImage({ label: 'Startup Support', title: 'Technický partner', accent: 'pro zakladatele', art: 'bulb' });
}
