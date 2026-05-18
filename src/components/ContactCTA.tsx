'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eyebrow } from './ui/Eyebrow';
import { Icon } from './ui/Icon';

export function ContactCTA() {
  const t = useTranslations('contact');
  const [hover, setHover] = useState(false);
  const [sweeping, setSweeping] = useState(false);
  const [iconState, setIconState] = useState<'idle' | 'out' | 'checked'>('idle');

  const handleCopy = async () => {
    if (sweeping) return;

    try {
      await navigator.clipboard.writeText(t('email'));
    } catch {
      // clipboard not available — silently skip
    }

    // Start sweep
    setSweeping(true);

    // Icon: scale out → switch to check → scale in
    setIconState('out');
    setTimeout(() => setIconState('checked'), 160);

    // Reset after 2.4s
    setTimeout(() => {
      setIconState('out');
      setTimeout(() => setIconState('idle'), 160);
    }, 2400);
  };

  return (
    <section
      id="contact"
      style={{
        padding: 'clamp(100px, 14vw, 180px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes zt-sweep-slide {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(160%); }
        }
      `}</style>

      {/* radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(800px 500px at 50% 40%, rgba(88,63,255,0.14), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="container"
        style={{
          position: 'relative',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Eyebrow num={3} style={{ marginBottom: 32 }}>
          {t('eyebrow')}
        </Eyebrow>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 'clamp(40px, 7vw, 96px)',
            lineHeight: 1.0,
            letterSpacing: '-0.035em',
            margin: '0 0 28px',
            color: 'var(--fg)',
            maxWidth: '18ch',
            textWrap: 'balance',
          }}
        >
          {t('title')}{' '}
          <span
            style={{
              backgroundImage: 'linear-gradient(120deg, var(--violet-300), var(--violet-500))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('titleAccent')}
          </span>
        </h2>

        <p
          style={{
            fontSize: 18,
            color: 'var(--fg-muted)',
            maxWidth: '52ch',
            margin: '0 0 44px',
            lineHeight: 1.55,
          }}
        >
          {t('body')}
        </p>

        <button
          onClick={handleCopy}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.4vw, 30px)',
            fontWeight: 600,
            letterSpacing: '-0.015em',
            color: hover ? 'var(--accent-bright)' : 'var(--fg)',
            padding: '4px 0 10px',
            background: 'none',
            border: 'none',
            borderBottom: `1.5px solid ${hover ? 'var(--accent-bright)' : 'rgba(255,255,255,0.2)'}`,
            transition: 'color 200ms var(--ease-out), border-color 200ms var(--ease-out)',
            cursor: 'pointer',
          }}
        >
          {/* Email text with sweep overlay */}
          <span style={{ position: 'relative', display: 'inline-flex', overflow: 'hidden' }}>
            {t('email')}
            {sweeping && (
              <span
                onAnimationEnd={() => setSweeping(false)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.28) 50%, transparent 95%)',
                  animation: 'zt-sweep-slide 1100ms cubic-bezier(0.33, 1, 0.68, 1) forwards',
                  pointerEvents: 'none',
                }}
              />
            )}
          </span>

          {/* Clipboard icon — animates to check on copy */}
          <span
            style={{
              display: 'inline-flex',
              transform: iconState === 'out' ? 'scale(0)' : 'scale(1)',
              opacity: iconState === 'out' ? 0 : 1,
              transition: 'transform 150ms var(--ease-out), opacity 150ms var(--ease-out)',
            }}
          >
            <Icon
              name={iconState === 'checked' ? 'ClipboardCheck' : 'ClipboardCopy'}
              size={22}
              strokeWidth={1.5}
            />
          </span>
        </button>

        {/* Copy hint */}
        <p
          style={{
            marginTop: 12,
            fontSize: 13,
            color: 'var(--fg-subtle)',
            letterSpacing: '0.01em',
          }}
        >
          {t('copyHint')}
        </p>
      </div>
    </section>
  );
}
