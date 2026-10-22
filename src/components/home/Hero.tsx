import { Check } from 'lucide-react';
import { Link } from '@/navigation';
import { Button } from '../ui/Button';
import { PrintObject } from '../PrintObject';
import { HeroHourglass } from './HeroHourglass';
import { TimeCalculator } from './TimeCalculator';

const promises = ['Úvodní konzultace zdarma', 'Pevná cena za každou etapu', 'Mluvíte přímo s vývojáři', 'Podpora i po spuštění'];

export function Hero() {
  return (
    <section data-hero className="relative overflow-hidden">
      <div className="container-page relative grid items-center gap-10 pb-14 pt-8 sm:gap-14 sm:pt-12 md:pb-20 md:pt-20 [@media(max-height:500px)]:pt-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12 lg:pb-28 xl:grid-cols-[1.4fr_0.85fr] xl:gap-14">
        <div>
          {/* Below xl the big hourglass beside the card is gone; a small one stands by the headline instead. */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-[clamp(32px,min(8.4vw,11svh),60px)] leading-[1.04] text-ink lg:text-[clamp(44px,4.4vw,64px)]">
              <span className="block text-balance">Firma vám roste.</span>
              <span className="block text-balance text-accent">Procesy by měly taky.</span>
            </h1>
            <PrintObject
              name="hourglass"
              sizes="64px"
              priority
              className="-mr-1 mt-1 h-28 w-auto shrink-0 sm:h-36 xl:hidden [@media(max-height:500px)]:hidden"
            />
          </div>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2 sm:mt-7 sm:text-lg">
            Jsme softwarové studio z Plzně. Automatizujeme ruční práci, propojujeme systémy a stavíme interní aplikace pro firmy, kterým
            přestal stačit Excel. Za zlomek ceny velkých dodavatelů a bez ročního čekání.
          </p>
          <div className="rise rise-3 mt-7 flex flex-col items-stretch gap-4 sm:mt-9 sm:flex-row sm:items-center sm:gap-7">
            <Button href="/kontakt" size="lg" arrow track="cta_hero" className="w-full sm:w-auto">
              Domluvit konzultaci zdarma
            </Button>
            <Link
              href="/reference"
              className="tap self-center text-[15px] sm:self-auto font-medium text-ink underline decoration-line-strong decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-ink"
            >
              Podívat se na reference
            </Link>
          </div>
          <ul className="rise rise-4 mt-8 grid max-w-xl grid-cols-2 gap-x-4 gap-y-2.5 text-[13px] text-ink-2 sm:mt-10 sm:gap-x-6 sm:text-sm">
            {promises.map((p) => (
              <li key={p} className="flex items-start gap-2 leading-snug">
                <Check size={16} strokeWidth={2} className="mt-px shrink-0 text-accent" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* The hourglass stands behind the card, out in the page margin: the time the card says you get back. */}
        <div className="relative">
          <HeroHourglass />
          <div className="relative z-20 w-full max-w-xl lg:max-w-none">
            <TimeCalculator />
          </div>
        </div>
      </div>
    </section>
  );
}
