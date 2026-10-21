import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';

export function StartupTeaser() {
  return (
    <section className="bg-night text-white">
      <div className="container-page section-y grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <SectionHeader
            dark
            num={6}
            eyebrow="Startup Support"
            title="Máte nápad, ale ne technický tým?"
            lead="Vybraným startupům děláme dlouhodobého technického partnera. Navrhneme a postavíme první verzi produktu, vybereme technologie a postaráme se o provoz. Podmínky přizpůsobujeme fázi projektu."
          />
          <div className="mt-9">
            <Button href="/startup-support" variant="onDark" size="lg" arrow track="cta_startup_teaser">
              Jak Startup Support funguje
            </Button>
          </div>
        </div>
        <div className="rounded-3xl border border-night-line bg-night-2 p-7">
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-white/50">Aktuálně rozjíždíme</div>
          <ul className="mt-5 divide-y divide-night-line">
            {['Testamentist', 'INKLUEM'].map((name) => (
              <li key={name} className="flex items-center justify-between py-4">
                <span className="font-display text-xl font-semibold tracking-tight">{name}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">V přípravě</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
