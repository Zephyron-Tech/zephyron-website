'use client';

import { type LucideProps, icons } from 'lucide-react';

interface IconProps extends LucideProps {
  name: keyof typeof icons;
}

export function Icon({ name, size = 18, strokeWidth = 1.5, ...rest }: IconProps) {
  const LucideIcon = icons[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} strokeWidth={strokeWidth} {...rest} />;
}
