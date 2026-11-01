import { caseStudies } from '@/content/case-studies';
import { PartnerLogos, PartnerMarquee, type Partner } from '../PartnerLogos';

// Partner organisations from case studies, then clients and startups we build with.
// One logo per organisation, even when it partners on several projects. Too many
// to share a row with the label, so the label sits above and on wide screens the
// logos spread across the full width.
const partners: Partner[] = [
  ...new Map(caseStudies.flatMap((c) => c.partners ?? []).map((p) => [p.name, p])).values(),
  { name: 'ESN UWB Pilsen', logo: '/logos/esn-uwb.png', height: 40 },
  { name: 'INKLUEM', logo: '/logos/inkluem.svg', height: 34 },
  { name: 'Testamentist', logo: '/logos/testamentist.svg', height: 30 },
  { name: 'Autoškola Falář' },
];

export function TrustStrip() {
  return (
    <section aria-label="Spolupracujeme" className="">
      <div className="container-page flex flex-col gap-4 py-6 sm:gap-5 sm:py-10">
        <div className="shrink-0 text-sm font-medium text-ink-2">Spolupracujeme s</div>
        <PartnerMarquee partners={partners} className="sm:hidden" />
        <PartnerLogos partners={partners} className="max-sm:hidden xl:flex-nowrap xl:justify-between" />
      </div>
    </section>
  );
}
