import Image from 'next/image';
import { printArt, type PrintArtKey } from '@/content/print-art';

interface PrintObjectProps {
  name: PrintArtKey;
  /** Rendered size hint for next/image, e.g. "(min-width: 1024px) 360px, 60vw". */
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Decorative next to a heading that already says it; the alt is dropped. */
  decorative?: boolean;
}

// One object printed in the site's ink. The PNG is already transparent, so it
// sits straight on the page. Served unoptimized: resampling to WebP would blur
// the halftone dots into grey.
export function PrintObject({ name, sizes, className = '', priority, decorative = true }: PrintObjectProps) {
  const art = printArt[name];
  return (
    <Image
      src={art.src}
      alt={decorative ? '' : art.alt}
      width={art.width}
      height={art.height}
      sizes={sizes}
      priority={priority}
      unoptimized
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}
