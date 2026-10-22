import { caseStudies } from '@/content/case-studies';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { CaseCards } from '../CaseCards';

const homeSlugs = ['clearway', 'autoskola-falar', 'gridtime'];

export function CaseStudies() {
  const items = homeSlugs.map((s) => caseStudies.find((c) => c.slug === s)!);
  return (
    <section className="section-y">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader
            title="Co už běží"
            lead="Od městské GIS platformy po web autoškoly. Celé od návrhu po provoz."
          />
          <Button href="/reference" variant="secondary" arrow className="hidden shrink-0 md:inline-flex">
            Všechny reference
          </Button>
        </div>
        <div className="mt-10 md:mt-14">
          <CaseCards items={items} featuredFirst showMeta={false} />
        </div>
        {/* On a phone the way on comes after the cards, not before them. */}
        <Button href="/reference" variant="secondary" arrow className="mt-6 w-full md:hidden">
          Všechny reference
        </Button>
      </div>
    </section>
  );
}
