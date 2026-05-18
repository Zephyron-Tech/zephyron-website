import { useTranslations } from 'next-intl';
import { Button } from './ui/Button';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section
      id="top"
      style={{
        position: 'relative',
        paddingTop: 'clamp(96px, 14vw, 180px)',
        paddingBottom: 'clamp(96px, 14vw, 180px)',
      }}
    >
      <div className="container">
        {/* Headline */}
        <h1
          className="rise rise-1"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 'clamp(44px, 8vw, 112px)',
            lineHeight: 1.0,
            letterSpacing: '-0.035em',
            margin: '0 0 clamp(28px, 3vw, 48px)',
            color: 'var(--fg)',
            textWrap: 'balance',
          }}
        >
          {t('headline')}
          <br />
          <span
            style={{
              backgroundImage: 'linear-gradient(120deg, var(--violet-300), var(--violet-500))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('headlineAccent')}
          </span>
        </h1>

        {/* Sub-headline */}
        <p
          className="rise rise-2"
          style={{
            fontSize: 'clamp(17px, 1.55vw, 21px)',
            lineHeight: 1.55,
            color: 'var(--fg-muted)',
            margin: '0 0 clamp(36px, 4vw, 56px)',
            maxWidth: '58ch',
            textWrap: 'pretty',
          }}
        >
          {t('subheadline')}
        </p>

        {/* CTAs — inline, auto-width */}
        <div
          className="rise rise-3"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <Button href="#projects" variant="primary" size="lg" iconRight="ArrowRight">
            {t('cta.primary')}
          </Button>
          <Button href="#contact" variant="ghost" size="lg">
            {t('cta.secondary')}
          </Button>
        </div>
      </div>
    </section>
  );
}
