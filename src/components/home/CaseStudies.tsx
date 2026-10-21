import { caseStudies } from '@/content/case-studies';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { CaseCards } from '../CaseCards';

const homeSlugs = ['clearway', 'autoskola-falar', 'gridtime'];

export function CaseStudies() {
  const items = homeSlugs.map((s) => caseStudies.find((c) => c.slug === s)!);
  return (
    <section className="section-y border-t border-line">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader
            num={5}
            eyebrow="Reference"
            title="Co už běží"
            lead="Od městské GIS platformy po web autoškoly. Celé od návrhu po provoz."
          />
          <Button href="/reference" variant="secondary" arrow className="shrink-0 self-start md:self-auto">
            Všechny reference
          </Button>
        </div>
        <div className="mt-14">
          <CaseCards items={items} featuredFirst />
        </div>
      </div>
    </section>
  );
}
