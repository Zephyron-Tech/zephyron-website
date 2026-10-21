import { Button } from './ui/Button';
import { CopyEmail } from './CopyEmail';

interface FinalCtaProps {
  title?: string;
  lead?: string;
}

export function FinalCta({
  title = 'Kde vaše firma ztrácí nejvíc času?',
  lead = 'Na úvodní konzultaci zdarma zjistíme, jestli umíme pomoct a kolik by to zhruba stálo. Bez závazků a bez prodejní prezentace.',
}: FinalCtaProps) {
  return (
    <section className="section-y">
      <div className="container-page">
        <div className="grid gap-10 rounded-[32px] bg-accent px-6 py-10 text-white sm:px-12 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <h2 className="text-3xl text-white sm:text-5xl">{title}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{lead}</p>
          </div>
          <div className="flex flex-col items-start gap-7">
            <CopyEmail tone="accent" />
            <Button href="/kontakt" variant="onDark" size="lg" arrow track="cta_final">
              Domluvit konzultaci
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
