import { Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { PrintObject } from '../PrintObject';

const promises = ['Úvodní konzultace zdarma', 'Pevná cena za každou etapu', 'Podpora i po spuštění'];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-page relative grid items-center gap-14 pb-20 pt-12 md:pt-20 lg:grid-cols-[1.3fr_0.9fr] lg:pb-28">
        <div>
          <h1 className="text-[32px] leading-[1.04] text-ink sm:text-6xl lg:text-[52px] xl:text-[58px]">
            <span className="block text-balance">Firma vám roste.</span>
            <span className="block text-balance text-accent">Procesy by měly taky.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2">
            Jsme softwarové studio z Plzně. Automatizujeme ruční práci, propojujeme systémy a stavíme interní aplikace pro firmy, kterým
            přestal stačit Excel. Za zlomek ceny velkých dodavatelů a bez ročního čekání.
          </p>
          <div className="rise rise-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/kontakt" size="lg" arrow track="cta_hero">
              Domluvit konzultaci zdarma
            </Button>
            <Button href="/reference" size="lg" variant="secondary">
              Podívat se na reference
            </Button>
          </div>
          <ul className="rise rise-4 mt-10 flex flex-col gap-x-6 gap-y-2 text-sm text-ink-2 sm:flex-row sm:flex-wrap">
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
          <PrintObject
            name="hourglass"
            sizes="180px"
            priority
            className="pointer-events-none absolute -bottom-10 -right-36 hidden h-[540px] w-auto xl:block"
          />
          <div className="relative">
            <ExampleCard />
          </div>
        </div>
      </div>
    </section>
  );
}

const manual = [
  { step: 'Přepsat objednávku z e-mailu do tabulky', min: 12 },
  { step: 'Vystavit fakturu v účetnictví', min: 8 },
  { step: 'Poslat fakturu a potvrzení zákazníkovi', min: 5 },
  { step: 'Hlídat platbu, případně upomenout', min: 10 },
];

function ExampleCard() {
  const total = manual.reduce((sum, r) => sum + r.min, 0);
  return (
    <figure className="rise rise-3 relative rounded-2xl bg-card p-6 sm:p-8">
      <figcaption className="flex items-center justify-between text-[13px] text-muted">
        <span>Příklad: objednávka → faktura</span>
        <span>na 1 objednávku</span>
      </figcaption>

      <div className="mt-6">
        <div className="text-sm font-medium text-ink">Dnes, ručně</div>
        <ol className="mt-3 flex flex-col gap-1">
          {manual.map((r) => (
            <li key={r.step} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
              <span className="flex gap-3 text-ink-2">
                {r.step}
              </span>
              <span className="shrink-0 text-[13px] tabular-nums text-ink-2">{r.min} min</span>
            </li>
          ))}
        </ol>
        <div className="mt-3 flex justify-between text-sm">
          <span className="text-muted">Celkem</span>
          <span className="tabular-nums text-ink">≈ {total} min</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-accent-soft p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <div className="text-sm font-medium text-ink">S automatizací</div>
          <div className="whitespace-nowrap font-display text-3xl font-semibold tracking-tight text-accent">≈ 2 min</div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Objednávka se načte, faktura vystaví a odešle, platba se spáruje sama. Vy jen zkontrolujete výjimky.
        </p>
      </div>
      <p className="mt-4 text-[13px] text-muted">Ilustrativní příklad. Skutečné časy změříme u vás.</p>
    </figure>
  );
}
