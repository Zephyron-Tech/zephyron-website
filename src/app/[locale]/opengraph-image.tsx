import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';

export const alt = 'Zephyron Tech — Custom software engineering';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const HEADLINE: Record<string, [string, string]> = {
  en: ['We build software.', 'Properly.'],
  cs: ['Tvoříme software.', 'Jak má být.'],
};

const TAGLINE: Record<string, string> = {
  en: 'Custom software engineering — web platforms, data systems, GIS, internal tools.',
  cs: 'Zakázkový software — webové platformy, datové systémy, GIS, interní nástroje.',
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [line1, line2] = HEADLINE[locale] ?? HEADLINE.en;
  const tagline = TAGLINE[locale] ?? TAGLINE.en;

  // Load local Surgena font — import.meta.url lets Next.js trace this at build time
  const surgena = readFileSync(
    new URL('../../../public/fonts/surgenapersonaluseonlysembd-q2qwd.ttf', import.meta.url),
  );

  // Load logo mark
  const markRaw = readFileSync(new URL('../../../public/mark-color.png', import.meta.url));
  const markSrc  = `data:image/png;base64,${markRaw.toString('base64')}`;

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={markSrc} width={40} height={40} alt="" style={{ display: 'flex' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: '#F0F4FF',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  display: 'flex',
                }}
              >
                ZEPHYRON
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'rgba(160,180,220,0.7)',
                  letterSpacing: '0.14em',
                  display: 'flex',
                }}
              >
                TECH
              </span>
            </div>
          </div>

          <span
            style={{
              fontSize: 14,
              color: 'rgba(160,180,220,0.55)',
              letterSpacing: '0.04em',
              display: 'flex',
            }}
          >
            Plzeň, Czech Republic
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
            {tagline}
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
