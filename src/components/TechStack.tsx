'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eyebrow } from './ui/Eyebrow';
import { Icon } from './ui/Icon';
import {
  SiTypescript,
  SiPython,
  SiFastapi,
  SiNextdotjs,
  SiPostgresql,
  SiDocker,
  SiGithubactions,
  SiSpring,
  SiExpo,
  SiRedis,
  SiApachekafka,
} from 'react-icons/si';

// Brand icon by tech name — returns a React node
function BrandIcon({ name, size = 28 }: { name: string; size?: number }) {
  const style = { width: size, height: size, flexShrink: 0 };
  switch (name) {
    case 'TypeScript':    return <SiTypescript style={style} />;
    case 'Python':        return <SiPython style={style} />;
    case 'FastAPI':       return <SiFastapi style={style} />;
    case 'Next.js':       return <SiNextdotjs style={style} />;
    case 'PostgreSQL':    return <SiPostgresql style={style} />;
    case 'Docker':        return <SiDocker style={style} />;
    case 'CI/CD':         return <SiGithubactions style={style} />;
    case 'Spring Boot':   return <SiSpring style={style} />;
    case 'Expo':          return <SiExpo style={style} />;
    case 'Redis':         return <SiRedis style={style} />;
    case 'Kafka':         return <SiApachekafka style={style} />;
    // GIS has no brand icon — use a Lucide icon
    default:              return <Icon name="Map" size={size} strokeWidth={1.5} />;
  }
}

interface StackItem {
  name: string;
  group: string;
  desc: string;
}

function StackTile({ t: item }: { t: StackItem }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--surface-alt)' : 'var(--surface)',
        padding: 'clamp(20px, 2.5vw, 28px) clamp(16px, 2vw, 24px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        transition: 'background 200ms var(--ease-out)',
        cursor: 'default',
      }}
    >
      {/* Icon + group label on same row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            color: hover ? 'var(--accent-bright)' : 'var(--fg-muted)',
            transition: 'color 200ms var(--ease-out)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <BrandIcon name={item.name} size={28} />
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--fg-subtle)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}
        >
          {item.group}
        </span>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: '-0.015em',
          color: 'var(--fg)',
          lineHeight: 1.1,
        }}
      >
        {item.name}
      </div>

      <div
        style={{
          fontSize: 15,
          lineHeight: 1.5,
          color: 'var(--fg-muted)',
          marginTop: 'auto',
        }}
      >
        {item.desc}
      </div>
    </div>
  );
}

export function TechStack() {
  const t = useTranslations('techstack');
  const items = t.raw('items') as StackItem[];

  return (
    <section
      id="stack"
      style={{
        padding: 'clamp(80px, 11vw, 140px) 0',
        background:
          'linear-gradient(180deg, transparent, rgba(88,63,255,0.04) 50%, transparent),' +
          'var(--bg)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
      }}
    >
      <div className="container">
        <div style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
          <Eyebrow num={2} style={{ marginBottom: 24 }}>
            {t('eyebrow')}
          </Eyebrow>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              gap: 48,
              alignItems: 'end',
            }}
            className="zt-sechead-grid"
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 'clamp(32px, 4.4vw, 60px)',
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
                margin: 0,
                color: 'var(--fg)',
                whiteSpace: 'pre-line',
              }}
            >
              {t('title')}
            </h2>
            <p
              style={{
                fontSize: 'clamp(15px, 1.6vw, 17px)',
                color: 'var(--fg-muted)',
                lineHeight: 1.55,
                maxWidth: '50ch',
                margin: 0,
              }}
            >
              {t('lead')}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 1,
            background: 'var(--border)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
          className="zt-stack-grid"
        >
          {items.map((item, i) => (
            <StackTile key={i} t={item} />
          ))}
        </div>

        {/* Link to full tech glossary */}
        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href="/technologies"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--fg-subtle)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'color 150ms var(--ease-out)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--fg)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--fg-subtle)')}
          >
            Full stack overview →
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .zt-sechead-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
        @media (max-width: 980px) {
          .zt-stack-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px) {
          .zt-stack-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
