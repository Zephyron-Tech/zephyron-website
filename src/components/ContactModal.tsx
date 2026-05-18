'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Icon } from './ui/Icon';
import { sendContact } from '@/app/actions/contact';

type Status = 'idle' | 'sending' | 'success' | 'error';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const t = useTranslations('modal');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Escape key + body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    if (status === 'idle') firstInputRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    // reset after animation completes
    setTimeout(() => {
      setStatus('idle');
      setName('');
      setEmail('');
      setProject('');
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    const result = await sendContact({ name, email, project });
    setStatus(result.success ? 'success' : 'error');
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
        @keyframes zt-success-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
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
          transition: border-color 150ms, opacity 150ms;
          resize: vertical;
        }
        .zt-modal-input::placeholder {
          color: var(--fg-subtle);
        }
        .zt-modal-input:focus {
          border-color: var(--violet-500);
          box-shadow: 0 0 0 3px rgba(88,63,255,0.15);
        }
        .zt-modal-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
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
            onClick={handleClose}
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

          {/* SUCCESS SCREEN */}
          {status === 'success' ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 16,
                padding: '16px 0 8px',
                animation: 'zt-success-in 280ms var(--ease-out) both',
              }}
            >
              {/* Checkmark circle */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(88,63,255,0.12)',
                  border: '1px solid rgba(88,63,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--violet-400)',
                }}
              >
                <Icon name="Check" size={26} strokeWidth={2} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 'clamp(22px, 3vw, 28px)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    margin: 0,
                    color: 'var(--fg)',
                  }}
                >
                  {t('successTitle')}
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    color: 'var(--fg-muted)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {t('successMessage')}
                </p>
              </div>

              <button
                onClick={handleClose}
                style={{
                  marginTop: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 28px',
                  background: 'rgba(88,63,255,0.12)',
                  color: 'var(--violet-400)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(88,63,255,0.25)',
                  cursor: 'pointer',
                  transition: 'background 150ms',
                }}
              >
                {t('successClose')}
              </button>
            </div>
          ) : (
            /* FORM */
            <>
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

              <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                {/* Name */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--fg-muted)',
                      letterSpacing: '0.02em',
                    }}
                  >
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
                    disabled={status === 'sending'}
                  />
                </label>

                {/* Email */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--fg-muted)',
                      letterSpacing: '0.02em',
                    }}
                  >
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
                    disabled={status === 'sending'}
                  />
                </label>

                {/* Project */}
                <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--fg-muted)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {t('project')}
                  </span>
                  <textarea
                    className="zt-modal-input"
                    rows={4}
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder={t('projectPlaceholder')}
                    style={{ minHeight: 100 }}
                    disabled={status === 'sending'}
                  />
                </label>

                {/* Error message */}
                {status === 'error' && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: '#f87171',
                      lineHeight: 1.5,
                    }}
                  >
                    {t('errorMessage')}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: '14px 24px',
                    background: status === 'sending' ? 'rgba(88,63,255,0.5)' : 'var(--accent)',
                    color: '#fff',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 15,
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    marginTop: 4,
                    transition: 'background 150ms',
                  }}
                >
                  {status === 'sending' ? (
                    <>
                      <SpinnerIcon />
                      {t('sending')}
                    </>
                  ) : (
                    <>
                      {t('submit')}
                      <Icon name="ArrowUpRight" size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: 'spin 0.7s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.25"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
