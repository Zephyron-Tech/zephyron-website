'use client';

import { useEffect, useRef, useState } from 'react';

// Touch has no hover, so on a phone an element is "hovered" while it crosses
// the middle of the screen: it carries data-active, and its children style that
// state with the same values as their hover. With a mouse it never activates.
export function ScrollActive({
  as: Tag = 'div',
  className,
  children,
}: {
  as?: 'div' | 'article';
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: hover)').matches) return;
    // A band through the middle third of the viewport.
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      rootMargin: '-35% 0px -35% 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as React.Ref<never>} data-active={active || undefined} className={className}>
      {children}
    </Tag>
  );
}
