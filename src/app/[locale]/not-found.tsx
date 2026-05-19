import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        style={{
          minHeight: '62vh',
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
      <Footer />
    </>
  );
}
