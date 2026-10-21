import { Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';

const promises = ['Úvodní konzultace zdarma', 'Pevná cena za každou etapu', 'Podpora i po spuštění'];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_70%_30%,black,transparent)]"
      />
      <div className="container-page relative grid items-center gap-14 pb-20 pt-12 md:pt-20 lg:grid-cols-[1.2fr_0.8fr] lg:pb-28">
        <div>
          <Eyebrow className="rise">Softwarové studio z Plzně</Eyebrow>
          <h1 className="mt-6 text-[40px] leading-[1.04] text-ink sm:text-6xl lg:text-[60px] xl:text-[68px]">
            <span className="block text-balance">Firma vám roste.</span>
            <span className="block text-balance text-accent">Procesy by měly taky.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2">
            Automatizujeme ruční práci, propojujeme systémy a stavíme interní aplikace pro firmy, kterým
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

        <ExampleCard />
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
    <figure className="rise rise-3 relative rounded-3xl border border-line bg-card p-6 shadow-[0_1px_0_rgb(17_19_30/0.04),0_24px_48px_-24px_rgb(17_19_30/0.18)] sm:p-8">
      <figcaption className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <span>Příklad: objednávka → faktura</span>
        <span>na 1 objednávku</span>
      </figcaption>

      <div className="mt-6">
        <div className="text-sm font-medium text-ink">Dnes, ručně</div>
        <ol className="mt-3 divide-y divide-line border-y border-line">
          {manual.map((r, i) => (
            <li key={r.step} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
              <span className="flex gap-3 text-ink-2">
                <span className="font-mono text-xs text-muted">{i + 1}</span>
                {r.step}
              </span>
              <span className="shrink-0 font-mono text-xs text-ink-2">{r.min} min</span>
            </li>
          ))}
        </ol>
        <div className="mt-3 flex justify-between text-sm">
          <span className="text-muted">Celkem</span>
          <span className="font-mono text-ink">≈ {total} min</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-accent-soft p-5">
        <div className="flex items-baseline justify-between gap-4">
          <div className="text-sm font-medium text-ink">S automatizací</div>
          <div className="font-display text-3xl font-semibold tracking-tight text-accent">≈ 2 min</div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Objednávka se načte, faktura vystaví a odešle, platba se spáruje sama. Vy jen zkontrolujete výjimky.
        </p>
      </div>
      <p className="mt-4 text-xs text-muted">Ilustrativní příklad. Skutečné časy změříme u vás.</p>
    </figure>
  );
}
