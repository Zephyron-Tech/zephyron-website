import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Zephyron Tech: automatizace, interní systémy a IT pro rostoucí firmy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
// Prerender at build so the font and logo files don't need to ship with a function.
export const dynamic = 'force-static';

const font = (file: string) => readFile(join(process.cwd(), 'node_modules/@fontsource/sora/files', file));

export default async function OpengraphImage() {
  const [latin, latinExt, mark] = await Promise.all([
    font('sora-latin-600-normal.woff'),
    font('sora-latin-ext-600-normal.woff'),
    readFile(join(process.cwd(), 'public/mark-256.png')),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#EEEDEA',
          fontFamily: 'Sora',
          color: '#11131E',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/png;base64,${mark.toString('base64')}`} width={68} height={52} alt="" />
          <div style={{ fontSize: 34, letterSpacing: '-0.02em' }}>Zephyron Tech</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 76, lineHeight: 1.05, letterSpacing: '-0.035em' }}>
          <div>Firma vám roste.</div>
          <div style={{ color: '#4235E5' }}>Procesy by měly taky.</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#6B6E7B' }}>
          <div>Automatizace · Interní systémy · IT podpora · Startup Support</div>
          <div>zephyron.tech</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Sora', data: latin, weight: 600, style: 'normal' },
        { name: 'Sora', data: latinExt, weight: 600, style: 'normal' },
      ],
    },
  );
}
