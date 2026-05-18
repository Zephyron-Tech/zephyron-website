import { ImageResponse } from 'next/og';

export const alt = 'Zephyron Tech — Custom software engineering';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Always English — Surgena doesn't have full Czech glyph coverage
const HEADLINE: [string, string] = ['We build software.', 'Properly.'];
const TAGLINE = 'Custom software engineering — web platforms, data systems, GIS, internal tools.';

export default async function Image({
  params: _params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const [surgena, logoBuf] = await Promise.all([
    fetch(`${base}/fonts/surgenapersonaluseonlysembd-q2qwd.ttf`).then((r) => r.arrayBuffer()),
    fetch(`${base}/logo-horizontal-color.png`).then((r) => r.arrayBuffer()),
  ]);
  // logo-horizontal-color.png: 5693×2713 → ratio ~2.098
  const logoSrc = `data:image/png;base64,${Buffer.from(logoBuf).toString('base64')}`;

  const [line1, line2] = HEADLINE;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#010F22',
          padding: '56px 64px',
          fontFamily: '"Surgena"',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Violet glow — top right */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 640,
            height: 500,
            background:
              'radial-gradient(ellipse at center, rgba(88,63,255,0.35) 0%, transparent 70%)',
            pointerEvents: 'none',
            display: 'flex',
          }}
        />

        {/* Subtle bottom-left glow */}
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: -40,
            width: 400,
            height: 300,
            background:
              'radial-gradient(ellipse at center, rgba(66,53,229,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
            display: 'flex',
          }}
        />

        {/* Top row: logo + location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            width={178}
            height={85}
            alt="Zephyron Tech"
            style={{ display: 'flex' }}
          />

          <span
            style={{
              fontSize: 14,
              color: 'rgba(160,180,220,0.55)',
              letterSpacing: '0.04em',
              display: 'flex',
            }}
          >
            Pilsen, Czech Republic
          </span>
        </div>

        {/* Main headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <span
            style={{
              fontSize: 96,
              fontWeight: 600,
              color: '#F0F4FF',
              letterSpacing: '-0.035em',
              lineHeight: 0.95,
              display: 'flex',
            }}
          >
            {line1}
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: '-0.035em',
              lineHeight: 0.95,
              background: 'linear-gradient(120deg, #A78BFA, #583FFF)',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'flex',
            }}
          >
            {line2}
          </span>
        </div>

        {/* Bottom row: tagline + domain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: 'rgba(160,180,220,0.65)',
              maxWidth: 680,
              lineHeight: 1.5,
              display: 'flex',
            }}
          >
            {TAGLINE}
          </span>
          <span
            style={{
              fontSize: 18,
              color: 'rgba(160,180,220,0.4)',
              letterSpacing: '0.02em',
              display: 'flex',
              flexShrink: 0,
            }}
          >
            zephyron.tech
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Surgena',
          data: surgena,
          style: 'normal',
          weight: 600,
        },
      ],
    },
  );
}
