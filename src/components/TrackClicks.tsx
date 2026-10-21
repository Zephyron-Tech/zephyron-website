'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

// Sends a Vercel Analytics event for every click on an element with
// data-track="event-name". Keeps CTA components server-rendered.
export function TrackClicks() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
      if (!el?.dataset.track) return;
      track(el.dataset.track, { path: window.location.pathname });
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
