'use client';

import { useState } from 'react';
import { Icon } from './Icon';
import type { icons } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'link';
  icon?: keyof typeof icons;
  iconRight?: keyof typeof icons;
  href?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  icon,
  iconRight,
  href,
  onClick,
  size = 'md',
  style: styleProp,
  className,
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  const sz =
    size === 'lg'
      ? { padding: '16px 26px', fontSize: 15 }
      : size === 'sm'
      ? { padding: '8px 14px', fontSize: 13 }
      : { padding: '12px 20px', fontSize: 14 };

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--dur-fast) var(--ease-out)',
    border: '1px solid transparent',
    transform: press ? 'scale(0.98)' : 'scale(1)',
    cursor: 'pointer',
    textDecoration: 'none',
    ...sz,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: hover ? 'var(--accent-hover)' : 'var(--accent)',
      color: '#fff',
      boxShadow: hover
        ? '0 6px 24px rgba(88,63,255,0.35)'
        : '0 2px 10px rgba(88,63,255,0.18)',
    },
    ghost: {
      background: hover ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
      color: hover ? 'var(--accent-bright)' : 'var(--fg)',
      borderColor: hover ? 'var(--accent)' : 'rgba(255,255,255,0.22)',
    },
    link: {
      padding: '6px 0',
      borderRadius: 0,
      color: hover ? 'var(--accent-hover)' : 'var(--fg)',
      borderBottom: `1px solid ${hover ? 'var(--accent)' : 'var(--fg)'}`,
      background: 'transparent',
    },
  };

  const style = { ...base, ...variantStyles[variant], ...styleProp };

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
  };

  if (href) {
    return (
      <a href={href} style={style} className={className} {...handlers}>
        {icon && <Icon name={icon} size={16} />}
        <span>{children}</span>
        {iconRight && (
          <span
            style={{
              display: 'inline-flex',
              transition: 'transform var(--dur-base) var(--ease-out)',
              transform: hover ? 'translateX(4px)' : 'none',
            }}
          >
            <Icon name={iconRight} size={16} />
          </span>
        )}
      </a>
    );
  }

  return (
    <button type="button" style={style} className={className} onClick={onClick} {...handlers}>
      {icon && <Icon name={icon} size={16} />}
      <span>{children}</span>
      {iconRight && (
        <span
          style={{
            display: 'inline-flex',
            transition: 'transform var(--dur-base) var(--ease-out)',
            transform: hover ? 'translateX(4px)' : 'none',
          }}
        >
          <Icon name={iconRight} size={16} />
        </span>
      )}
    </button>
  );
}
