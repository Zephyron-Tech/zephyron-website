import { Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { LitBulb } from './LitBulb';

const offers = [
  'Navrhneme a postavíme první verzi produktu',
  'Vybereme technologie, které s vámi porostou',
  'Postaráme se o provoz i další vývoj',
];

// The heading and the bulb share the first row at every width: on a phone the
// bulb stands small beside the heading, from lg it fills the right column.
// Below them one sentence, what a founder gets as one card of points, one action.
export function StartupTeaser() {
  return (
    <section className="overflow-x-clip bg-night text-white">
      <div className="container-page section-y grid grid-cols-[1fr_auto] items-end gap-x-4 gap-y-8 sm:gap-x-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-x-12">
        <h2 className="col-start-1 row-start-1 max-w-3xl self-center text-[clamp(28px,4.6vw,44px)] text-white">
          Máte nápad, ale ne technický tým?
        </h2>

        <LitBulb className="col-start-2 row-start-1 -mb-2 h-[150px] sm:h-[220px] lg:row-span-2 lg:mx-auto lg:mb-0 lg:h-[460px]" />

        <div className="col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="max-w-2xl text-lg leading-relaxed text-white/75">
            Vybraným startupům děláme dlouhodobého technického partnera. Podmínky přizpůsobujeme fázi projektu.
          </p>

          <ul className="mt-8 max-w-xl space-y-4 rounded-2xl bg-night-2 p-6 sm:p-7">
            {offers.map((o) => (
              <li key={o} className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-white"
                >
                  <Check size={16} strokeWidth={2.25} />
                </span>
                <span className="text-pretty pt-1">{o}</span>
              </li>
            ))}
          </ul>

          <Button
            href="/startup-support"
            variant="onDark"
            size="lg"
            arrow
            track="cta_startup_teaser"
            className="mt-8 w-full sm:w-auto"
          >
            Jak Startup Support funguje
          </Button>
        </div>
      </div>
    </section>
  );
}
