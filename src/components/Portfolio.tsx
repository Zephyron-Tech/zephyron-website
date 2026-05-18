'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eyebrow } from './ui/Eyebrow';
import { Tag } from './ui/Tag';

// Pass src="/screenshots/project.jpg" once ready — shows gradient until then
function PlaceholderVisual({ src, alt }: { src?: string; alt?: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? ''}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
        }}
      />
    );
  }
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #060F22 0%, #0C1A38 100%)',
      }}
    />
  );
}

function SectionHead({
  num,
  eyebrow,
  title,
  lead,
}: {
  num: number;
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <div style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
      <Eyebrow num={num} style={{ marginBottom: 24 }}>
        {eyebrow}
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
            textWrap: 'balance',
          }}
        >
          {title}
        </h2>
        {lead && (
          <p
            style={{
              fontSize: 'clamp(15px, 1.6vw, 17px)',
              color: 'var(--fg-muted)',
              lineHeight: 1.55,
              maxWidth: '50ch',
              margin: 0,
            }}
          >
            {lead}
          </p>
        )}
      </div>
      <style>{`
        @media (max-width: 880px) {
          .zt-sechead-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </div>
  );
}

function FlagshipCard() {
  const t = useTranslations('portfolio.flagship');
  const [hover, setHover] = useState(false);

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: 'var(--surface)',
        border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-2xl)',
        padding: 'clamp(28px, 3.6vw, 52px)',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 360px) minmax(0, 1fr)',
        gap: 'clamp(28px, 4vw, 56px)',
        alignItems: 'start',
        transition: 'border-color 200ms var(--ease-out)',
      }}
      className="zt-flagship"
    >
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 'clamp(32px, 3.4vw, 44px)',
            letterSpacing: '-0.025em',
            lineHeight: 1.0,
            margin: '0 0 10px',
            color: 'var(--fg)',
          }}
        >
          {t('name')}
        </h3>

        <p
          style={{
            fontSize: 14,
            fontStyle: 'italic',
            color: 'var(--violet-300)',
            margin: '0 0 24px',
            lineHeight: 1.4,
          }}
        >
          {t('kicker')}
        </p>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: 'var(--fg-muted)',
            margin: '0 0 28px',
          }}
        >
          {t('description')}
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(t.raw('tags') as string[]).map((tag: string, i: number) => (
            <Tag key={i}>{tag}</Tag>
          ))}
        </div>
      </div>

      {/* Placeholder — same as other cards */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 9',
          background: 'var(--bg-muted)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <PlaceholderVisual />
      </div>

      <style>{`
        @media (max-width: 920px) {
          .zt-flagship { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </article>
  );
}

interface ProjectData {
  name: string;
  kicker: string;
  description: string;
  tags: string[];
}

function ProjectCard({ project }: { project: ProjectData }) {
  const [hover, setHover] = useState(false);

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(28px, 3vw, 36px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        transition: 'border-color 200ms var(--ease-out)',
        minHeight: 'clamp(260px, 35vw, 360px)',
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 9',
          background: 'var(--bg-muted)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <PlaceholderVisual />
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 'clamp(20px, 2.4vw, 26px)',
          letterSpacing: '-0.02em',
          margin: 0,
          color: 'var(--fg)',
        }}
      >
        {project.name}
      </h3>

      <p
        style={{
          fontSize: 14,
          fontStyle: 'italic',
          color: 'var(--violet-300)',
          margin: '-8px 0 0',
          lineHeight: 1.4,
        }}
      >
        {project.kicker}
      </p>

      <p
        style={{
          fontSize: 16,
          lineHeight: 1.55,
          color: 'var(--fg-muted)',
          margin: 0,
          flex: 1,
        }}
      >
        {project.description}
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {project.tags.map((tag, i) => (
          <Tag key={i}>{tag}</Tag>
        ))}
      </div>
    </article>
  );
}

export function Portfolio() {
  const t = useTranslations('portfolio');

  const gridtime: ProjectData = {
    name: t('gridtime.name'),
    kicker: t('gridtime.kicker'),
    description: t('gridtime.description'),
    tags: t.raw('gridtime.tags') as string[],
  };

  const b2b: ProjectData = {
    name: t('b2b.name'),
    kicker: t('b2b.kicker'),
    description: t('b2b.description'),
    tags: t.raw('b2b.tags') as string[],
  };

  return (
    <section
      id="projects"
      style={{
        padding: 'clamp(80px, 11vw, 140px) 0',
        position: 'relative',
      }}
    >
      <div className="container">
        <SectionHead
          num={1}
          eyebrow={t('eyebrow')}
          title={t('title')}
          lead={t('lead')}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <FlagshipCard />

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}
            className="zt-projects-row"
          >
            <ProjectCard project={gridtime} />
            <ProjectCard project={b2b} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .zt-projects-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
