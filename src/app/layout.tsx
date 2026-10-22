import type { ReactNode } from 'react';
import { Sora, Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import '@/app/globals.css';

const sora = Sora({
  subsets: ['latin', 'latin-ext'],
  // Headings are all 600; one weight means half the font requests on a slow phone.
  weight: ['600'],
  variable: '--font-sora',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

// The wordmark face, cut down to the letters of "Zephyron TECH" (3.6 kB woff2
// instead of a 37 kB TTF), so the header logo renders in it straight away.
const surgena = localFont({
  src: '../fonts/surgena-logo.woff2',
  weight: '600',
  variable: '--font-surgena',
  display: 'swap',
  fallback: ['sans-serif'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs" className={`${sora.variable} ${poppins.variable} ${surgena.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
