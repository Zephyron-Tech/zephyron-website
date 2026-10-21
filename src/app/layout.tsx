import type { ReactNode } from 'react';
import { Sora, Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import '@/app/globals.css';

const sora = Sora({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
});


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs" className={`${sora.variable} ${poppins.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
