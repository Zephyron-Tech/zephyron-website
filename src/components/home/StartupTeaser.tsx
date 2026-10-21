import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { LitBulb } from './LitBulb';

export function StartupTeaser() {
  return (
    <section className="bg-night text-white">
      <div className="container-page section-y grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <SectionHeader
            dark
            title="Máte nápad, ale ne technický tým?"
            lead="Vybraným startupům děláme dlouhodobého technického partnera. Navrhneme a postavíme první verzi produktu, vybereme technologie a postaráme se o provoz. Podmínky přizpůsobujeme fázi projektu."
          />
          <div className="mt-10 max-w-md">
            <div className="text-sm text-white/60">Aktuálně rozjíždíme</div>
            <ul className="mt-3 flex flex-col gap-1">
              {['Testamentist', 'INKLUEM'].map((name) => (
                <li key={name} className="flex items-center justify-between py-4">
                  <span className="font-display text-xl font-semibold tracking-tight">{name}</span>
                  <span className="text-sm text-white/60">V přípravě</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10">
            <Button href="/startup-support" variant="onDark" size="lg" arrow track="cta_startup_teaser">
              Jak Startup Support funguje
            </Button>
          </div>
        </div>
        <LitBulb />
      </div>
    </section>
  );
}
