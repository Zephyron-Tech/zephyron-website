import { caseStudies } from '@/content/case-studies';
import { PartnerLogos, type Partner } from '../PartnerLogos';

// Partner organisations from case studies, then clients of finished projects.
const partners: Partner[] = [
  ...caseStudies.flatMap((c) => c.partners ?? []),
  { name: 'Západočeská univerzita v Plzni', logo: '/logos/zcu.svg', height: 52 },
  { name: 'ESN UWB Pilsen', logo: '/logos/esn-uwb.png', height: 40 },
  { name: 'Autoškola Falář' },
];

export function TrustStrip() {
  return (
    <section aria-label="Spolupracujeme" className="border-t border-line">
      <div className="container-page flex flex-col gap-5 py-10 md:flex-row md:items-center md:gap-12">
        <div className="shrink-0 font-mono text-xs uppercase tracking-[0.12em] text-muted">Spolupracujeme s</div>
        <PartnerLogos partners={partners} />
      </div>
    </section>
  );
}
