'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from './ui/Icon';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const t = useTranslations('modal');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState('');
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Escape key + body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    firstInputRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Project inquiry${name ? ` — ${name}` : ''}`,
    );
    const body = encodeURIComponent(
      [
        name ? `Name: ${name}` : '',
        `Email: ${email}`,
        '',
        'Project:',
        project || '(no description provided)',
      ]
        .filter((l) => l !== undefined)
        .join('\n'),
    );
    window.open(`mailto:hello@zephyron.tech?subject=${subject}&body=${body}`);
    onClose();
    setName('');
    setEmail('');
    setProject('');
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes zt-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes zt-modal-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .zt-modal-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          font-size: 15px;
          font-family: var(--font-sans);
          color: var(--fg);
          outline: none;
          box-sizing: border-box;
          transition: border-color 150ms;
          resize: vertical;
        }
        .zt-modal-input::placeholder {
          color: var(--fg-subtle);
        }
        .zt-modal-input:focus {
          border-color: var(--violet-500);
          box-shadow: 0 0 0 3px rgba(88,63,255,0.15);
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(1,15,34,0.72)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          animation: 'zt-backdrop-in 200ms var(--ease-out) both',
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 201,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          pointerEvents: 'none',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 520,
            background: 'var(--surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'clamp(28px, 4vw, 48px)',
            position: 'relative',
            pointerEvents: 'auto',
            animation: 'zt-modal-in 220ms var(--ease-out) both',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--fg-muted)',
              cursor: 'pointer',
              transition: 'all 120ms',
            }}
          >
            <Icon name="X" size={16} strokeWidth={1.5} />
          </button>

          {/* Heading */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(24px, 3vw, 32px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: '0 0 8px',
              color: 'var(--fg)',
              paddingRight: 40,
            }}
          >
            {t('title')}
          </h2>
          <p
            style={{
              fontSize: 15,
              color: 'var(--fg-muted)',
              margin: '0 0 32px',
              lineHeight: 1.5,
            }}
          >
            {t('subtitle')}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Name */}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.02em' }}>
                {t('name')}
              </span>
              <input
                ref={firstInputRef}
                className="zt-modal-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                autoComplete="name"
              />
            </label>

            {/* Email */}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.02em' }}>
                {t('email')} <span style={{ color: 'var(--violet-400)' }}>*</span>
              </span>
              <input
                className="zt-modal-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
              />
            </label>

            {/* Project */}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.02em' }}>
                {t('project')}
              </span>
              <textarea
                className="zt-modal-input"
                rows={4}
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder={t('projectPlaceholder')}
                style={{ minHeight: 100 }}
              />
            </label>

            {/* Submit */}
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '14px 24px',
                background: 'var(--accent)',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                marginTop: 4,
                transition: 'background 150ms',
              }}
            >
              {t('submit')}
              <Icon name="ArrowUpRight" size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
