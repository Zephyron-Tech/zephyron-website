'use client';

import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { track } from '@vercel/analytics';

export function CalEmbed({ calLink }: { calLink: string }) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal('ui', {
        theme: 'light',
        cssVarsPerTheme: { light: { 'cal-brand': '#4235E5' }, dark: { 'cal-brand': '#583FFF' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
      cal('on', { action: 'bookingSuccessful', callback: () => track('cal_booking_success') });
    })();
  }, []);

  return (
    <Cal
      calLink={calLink}
      config={{ layout: 'month_view', theme: 'light' }}
      style={{ width: '100%', height: '100%', minHeight: 640, overflow: 'auto' }}
    />
  );
}
