import Image from 'next/image';
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
        <div className="grid gap-10 rounded-[32px] bg-accent px-6 py-12 text-white sm:px-12 sm:py-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <h2 className="text-3xl text-white sm:text-5xl">{title}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{lead}</p>
            <CopyEmail tone="accent" className="mt-9" />
            <div className="mt-9">
              <Button href="/kontakt" variant="onDark" size="lg" arrow track="cta_final">
                Domluvit konzultaci
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:justify-self-end">
            <Image
              src="/assets/vandlicek-pfp.jpg"
              alt="Ing. Jan Vandlíček"
              width={80}
              height={80}
              className="size-16 rounded-full object-cover"
            />
            <div className="text-sm leading-snug">
              <div className="font-medium">Ing. Jan Vandlíček</div>
              <div className="text-white/70">Ozve se vám osobně</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
