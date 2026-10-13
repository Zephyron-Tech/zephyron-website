export type Device = 'ios' | 'android' | 'desktop' | 'other';

export function detectDevice(userAgent: string | undefined | null): Device {
  const ua = userAgent ?? '';
  if (!ua) return 'other';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  if (/Windows|Macintosh|Linux|CrOS/i.test(ua)) return 'desktop';
  return 'other';
}
