import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { printArt, type PrintArtKey } from '@/content/print-art';

// Social preview pictures (1200 × 630) in the site's look: paper ground, the
// page's heading in Sora, the page's printed object on the right, one violet
// band along the bottom. Every route's opengraph-image.tsx calls ogImage();
// they are rendered once at build (force-static), reading files from disk.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const INK = '#11131E';
const MUTED = '#6B6E7B';
const ACCENT = '#4235E5';
const PAPER = '#EEEDEA';

const root = process.cwd();
// Whole Sora faces (latin + Czech accents in one file), made from the Google
// Fonts variable font; the @fontsource subsets mixed accents from the wrong face.
const font = (file: string) => readFile(join(root, 'assets/fonts', file));
const dataUri = async (path: string, type: string) =>
  `data:${type};base64,${(await readFile(join(root, path))).toString('base64')}`;

interface OgInput {
  /** What kind of page this is; printed in the footer line beside the domain. */
  label: string;
  title: string;
  /** Optional second line of the heading, in the accent colour. */
  accent?: string;
  /** Printed object from public/print, set on the right. */
  art?: PrintArtKey;
  /** A screenshot (JPEG in assets/og) shown as a framed window instead of art. */
  shot?: string;
}

export async function ogImage({ label, title, accent, art, shot }: OgInput) {
  const [sora400, sora600, mark] = await Promise.all([
    font('Sora-Regular.ttf'),
    font('Sora-SemiBold.ttf'),
    dataUri('public/mark-256.png', 'image/png'),
  ]);
  const picture = shot
    ? await dataUri(`assets/og/${shot}.jpg`, 'image/jpeg')
    : art
      ? await dataUri(`public${printArt[art].src}`, 'image/png')
      : null;

  // The heading shrinks with its length so it never needs more than three lines.
  const chars = title.length + (accent?.length ?? 0);
  const size = chars <= 34 ? 76 : chars <= 56 ? 64 : 54;

  // Fit the printed object into the right-hand box, keeping its proportions.
  let artBox = { width: 0, height: 0 };
  if (art && !shot) {
    const { width, height } = printArt[art];
    const scale = Math.min(380 / width, 440 / height);
    artBox = { width: Math.round(width * scale), height: Math.round(height * scale) };
  }

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        background: PAPER,
        fontFamily: 'Sora',
        color: INK,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: shot ? 600 : art ? 740 : 1080,
          padding: '64px 0 72px 72px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={58} height={44} alt="" />
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}>Zephyron Tech</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: size,
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: '-0.035em',
            }}
          >
            <div>{title}</div>
            {accent && <div style={{ color: ACCENT }}>{accent}</div>}
          </div>
        </div>

        <div style={{ fontSize: 24, fontWeight: 400, color: MUTED }}>{`${label} · zephyron.tech`}</div>
      </div>

      {picture && shot && (
        <div
          style={{
            position: 'absolute',
            right: -40,
            top: 96,
            display: 'flex',
            padding: 12,
            background: '#FFFFFF',
            borderRadius: 28,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={picture}
            width={600}
            height={400}
            alt=""
            style={{ borderRadius: 18, objectFit: 'cover', objectPosition: 'top' }}
          />
        </div>
      )}
      {picture && !shot && (
        <div
          style={{
            position: 'absolute',
            right: 72,
            bottom: 72,
            width: 380,
            height: 440,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={picture} width={artBox.width} height={artBox.height} alt="" />
        </div>
      )}

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, background: ACCENT }} />
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: 'Sora', data: sora600, weight: 600, style: 'normal' },
        { name: 'Sora', data: sora400, weight: 400, style: 'normal' },
      ],
    },
  );
}
