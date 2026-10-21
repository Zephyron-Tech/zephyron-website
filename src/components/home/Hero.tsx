import { Check } from 'lucide-react';
import { Link } from '@/navigation';
import { Button } from '../ui/Button';
import { HeroHourglass } from './HeroHourglass';
import { TimeCalculator } from './TimeCalculator';

const promises = ['Úvodní konzultace zdarma', 'Pevná cena za každou etapu', 'Mluvíte přímo s vývojáři', 'Podpora i po spuštění'];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-page relative grid items-center gap-14 pb-20 pt-12 md:pt-20 lg:grid-cols-[1.4fr_0.85fr] lg:pb-28">
        <div>
          <h1 className="text-[32px] leading-[1.04] text-ink sm:text-6xl lg:text-[54px] xl:text-[64px]">
            <span className="block text-balance">Firma vám roste.</span>
            <span className="block text-balance text-accent">Procesy by měly taky.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2">
            Jsme softwarové studio z Plzně. Automatizujeme ruční práci, propojujeme systémy a stavíme interní aplikace pro firmy, kterým
            přestal stačit Excel. Za zlomek ceny velkých dodavatelů a bez ročního čekání.
          </p>
          <div className="rise rise-3 mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
            <Button href="/kontakt" size="lg" arrow track="cta_hero">
              Domluvit konzultaci zdarma
            </Button>
            <Link
              href="/reference"
              className="text-[15px] font-medium text-ink underline decoration-line-strong decoration-[1.5px] underline-offset-[6px] transition-colors hover:decoration-ink"
            >
              Podívat se na reference
            </Link>
          </div>
          <ul className="rise rise-4 mt-10 grid max-w-xl grid-cols-1 gap-x-6 gap-y-2.5 text-sm text-ink-2 sm:grid-cols-2">
            {promises.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Check size={16} strokeWidth={2} className="text-accent" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* The hourglass stands behind the card, out in the page margin: the time the card says you get back. */}
        <div className="relative">
          <HeroHourglass />
          <div className="relative z-20">
            <TimeCalculator />
          </div>
        </div>
      </div>
    </section>
  );
}
