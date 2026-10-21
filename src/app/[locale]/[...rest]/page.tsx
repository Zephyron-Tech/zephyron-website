import { notFound } from 'next/navigation';

// Unknown paths under the locale render [locale]/not-found.tsx inside the
// locale layout (header, footer, translations).
export default function CatchAll() {
  notFound();
}
