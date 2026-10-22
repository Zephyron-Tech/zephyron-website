import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { printArt } from '@/content/print-art';
import { PageHero } from '@/components/PageHero';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Zdroje obrázků',
  description: 'Odkud pocházejí fotografie předmětů, které na webu Zephyron Tech tiskneme jednou barvou, a pod jakou licencí je používáme.',
  path: '/zdroje-obrazku',
  noindex: true,
});

export default async function ImageCreditsPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  // bulbLight is the same photo as bulb in light ink.
  const items = Object.entries(printArt).filter(([key]) => key !== 'bulbLight');

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Zdroje obrázků' }]}
        title="Odkud jsou obrázky"
        lead="Předměty na webu jsou fotografie volných děl z muzejních a otevřených sbírek, převedené do jedné tiskové barvy. Všechny jsou volně použitelné (CC0 nebo public domain)."
      />
      <div className="container-page section-y">
        <ul className="max-w-3xl flex flex-col gap-1">
          {items.map(([key, a]) => (
            <li key={key} className="grid gap-1 py-5 sm:grid-cols-[0.45fr_0.55fr] sm:gap-6">
              <span className="font-medium text-ink">{a.title}</span>
              <a href={a.page} target="_blank" rel="noopener noreferrer" className="text-ink-2 underline-offset-4 hover:text-accent hover:underline">
                {a.credit}
              </a>
              {'page2' in a && a.page2 && (
                <a
                  href={a.page2.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-2 underline-offset-4 hover:text-accent hover:underline sm:col-start-2"
                >
                  {a.page2.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
