import Image from 'next/image';

// Minimal header — no next-intl dependency (this page may render without NextIntlClientProvider
// when notFound() is called from [locale]/layout.tsx before the provider is mounted)
function NotFoundHeader() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'transparent',
        borderBottom: '1px solid transparent',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 88,
          padding: '0 clamp(20px, 5vw, 56px)',
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <a href="/" aria-label="Zephyron Tech home" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <Image
              src="/mark-color.png"
              alt="Zephyron Tech mark"
              width={36}
              height={36}
              style={{ width: 'auto', height: 36 }}
              priority
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 3 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 28,
                  letterSpacing: '-0.02em',
                  color: 'var(--fg)',
                }}
              >
                Zephyron
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: '0.32em',
                  color: 'var(--fg-muted)',
                }}
              >
                TECH
              </span>
            </div>
          </div>
        </a>
      </div>
    </header>
  );
}

function NotFoundFooter() {
  return (
    <footer
      style={{
        background: 'var(--navy-950)',
        borderTop: '1px solid var(--border)',
        padding: '24px clamp(20px, 5vw, 56px)',
        textAlign: 'center',
        fontSize: 13,
        color: 'var(--fg-subtle)',
      }}
    >
      © {new Date().getFullYear()} Zephyron Tech s.r.o.
    </footer>
  );
}

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NotFoundHeader />
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(80px, 12vw, 160px) clamp(20px, 5vw, 56px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Violet glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            height: 500,
            background:
              'radial-gradient(ellipse at center, rgba(88,63,255,0.13) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* 404 */}
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(100px, 22vw, 220px)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #9A8CFF 0%, #583FFF 60%, #3729BF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: 'clamp(20px, 3vw, 36px)',
              userSelect: 'none',
            }}
          >
            404
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(24px, 4vw, 42px)',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              color: 'var(--fg)',
              margin: '0 0 16px',
            }}
          >
            Page not found.
          </h1>

          <p
            style={{
              fontSize: 'clamp(15px, 1.6vw, 17px)',
              color: 'var(--fg-muted)',
              lineHeight: 1.6,
              margin: '0 0 clamp(32px, 4vw, 48px)',
              maxWidth: '38ch',
            }}
          >
            This URL doesn&apos;t exist or has been moved.
          </p>

          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 28px',
              background: 'var(--accent)',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              transition: 'background 150ms',
            }}
          >
            ← Back to home
          </a>
        </div>
      </main>
      <NotFoundFooter />
    </div>
  );
}
