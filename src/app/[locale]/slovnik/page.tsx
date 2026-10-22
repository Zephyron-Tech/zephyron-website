import { setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/navigation';
import { glossary, glossaryByLetter } from '@/content/glossary';
import { PageHero } from '@/components/PageHero';
import { FinalCta } from '@/components/FinalCta';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, definedTermSetSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Slovník pojmů z IT a automatizace',
  description:
    'API, CRM, GIS, MVP nebo datová pipeline: pojmy z našich služeb a referencí vysvětlené lidsky, s příklady z praxe a odkazy na projekty.',
  path: '/slovnik',
});

const letterId = (l: string) => `pismeno-${l.toLowerCase()}`;

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  const groups = glossaryByLetter();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Slovník pojmů', path: '/slovnik' }])} />
      <JsonLd data={definedTermSetSchema(glossary)} />
      <PageHero
        art="typewriter"
        crumbs={[{ name: 'Slovník pojmů' }]}
        title="Slovník pojmů"
        lead="Pojmy, na které narazíte u nás na webu i v nabídkách dodavatelů. Vysvětlené tak, aby jim rozuměl i ten, kdo software nepíše, ale platí."
      />

      <section className="section-y">
        <div className="container-page">
          {/* The alphabet rides under the header while the list scrolls; on a
              phone it is a swipe row, so all letters stay on one line. */}
          <nav
            aria-label="Písmena"
            className="sticky top-[calc(72px+env(safe-area-inset-top))] z-20 -mt-4 bg-paper py-3"
          >
            <ul className="bleed-x flex gap-1.5 overflow-x-auto [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
              {groups.map(({ letter }) => (
                <li key={letter} className="shrink-0">
                  <a
                    href={`#${letterId(letter)}`}
                    className="inline-flex size-10 items-center justify-center rounded-full bg-card font-display text-[15px] font-semibold text-ink transition-colors duration-200 hover:bg-accent hover:text-white pointer-coarse:size-11"
                  >
                    {letter}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Letter groups flow in columns, so short groups share a row instead of
              each taking a full-width band. */}
          <div className="mt-6 gap-x-3 sm:mt-10 md:columns-2 xl:columns-3">
            {groups.map(({ letter, terms }) => (
              <section
                key={letter}
                id={letterId(letter)}
                aria-labelledby={`${letterId(letter)}-h`}
                className="mb-6 break-inside-avoid scroll-mt-36 sm:mb-8 sm:scroll-mt-40"
              >
                <h2 id={`${letterId(letter)}-h`} className="mb-2 pl-1 font-display text-2xl font-semibold text-accent sm:mb-3 sm:text-3xl">
                  {letter}
                </h2>
                <ul className="grid gap-2 sm:gap-3">
                  {terms.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/slovnik/${t.slug}`}
                        className="group flex h-full flex-col rounded-2xl bg-card px-5 py-4 transition-colors duration-200 hover:bg-accent-soft sm:p-6"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-lg text-ink sm:text-xl">{t.term}</h3>
                          <ArrowRight
                            size={18}
                            aria-hidden
                            className="shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </div>
                        <p className="mt-1 text-[15px] leading-normal text-ink-2 sm:mt-2 sm:leading-relaxed">{t.short}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        title="Nevíte, který z těch pojmů se týká vás?"
        lead="Popište nám, co ve firmě řešíte. Na úvodní konzultaci zdarma řekneme, co by pomohlo, a vysvětlíme to bez žargonu."
      />
    </>
  );
}
