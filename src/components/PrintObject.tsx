import { printArt, type PrintArtKey } from '@/content/print-art';

interface PrintObjectProps {
  name: PrintArtKey;
  /** Rendered width hint, e.g. "(min-width: 1024px) 360px, 60vw". */
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Decorative next to a heading that already says it; the alt is dropped. */
  decorative?: boolean;
}

// The bulb's full file doubles as a CSS mask for its glow, so it has no small copy.
const NO_SMALL: PrintArtKey[] = ['bulb', 'bulbLight'];
const SMALL_WIDTH = 360;

// One object printed in the site's ink. The PNG is already transparent, so it
// sits straight on the page. Not run through the image optimizer: resampling to
// WebP would blur the halftone dots into grey. Instead a 360 px one-bit copy
// (scripts/print-small.py) serves phones and small slots through srcset.
export function PrintObject({ name, sizes, className = '', priority, decorative = true }: PrintObjectProps) {
  const art = printArt[name];
  const small = NO_SMALL.includes(name) ? null : art.src.replace(/\.png$/, '-sm.png');
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={art.src}
      srcSet={small ? `${small} ${SMALL_WIDTH}w, ${art.src} ${art.width}w` : undefined}
      sizes={small ? sizes : undefined}
      alt={decorative ? '' : art.alt}
      width={art.width}
      height={art.height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      className={`select-none ${className}`}
      draggable={false}
    />
  );
}
