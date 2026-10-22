import { caseStudies } from '@/content/case-studies';
import { PartnerLogos, type Partner } from '../PartnerLogos';

// Partner organisations from case studies, then clients of finished projects.
// One logo per organisation, even when it partners on several projects.
const partners: Partner[] = [
  ...new Map(caseStudies.flatMap((c) => c.partners ?? []).map((p) => [p.name, p])).values(),
  { name: 'ESN UWB Pilsen', logo: '/logos/esn-uwb.png', height: 40 },
  { name: 'Autoškola Falář' },
];

export function TrustStrip() {
  return (
    <section aria-label="Spolupracujeme" className="">
      <div className="container-page flex flex-col gap-5 py-10 md:flex-row md:items-center md:gap-12">
        <div className="shrink-0 text-sm font-medium text-ink-2">Spolupracujeme s</div>
        <PartnerLogos partners={partners} />
      </div>
    </section>
  );
}
