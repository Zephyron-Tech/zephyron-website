import { SectionHeader } from '../ui/SectionHeader';
import { ServiceCards } from '../ServiceCards';

export function Services() {
  return (
    <section className="section-y border-t border-line">
      <div className="container-page">
        <SectionHeader
          num={2}
          eyebrow="Co děláme"
          title="Čtyři způsoby, jak vám vrátit čas"
          lead="Začínáme tam, kde vás to stojí nejvíc hodin. Často to není nový systém, ale propojení těch, které už máte."
        />
        <div className="mt-14">
          <ServiceCards />
        </div>
      </div>
    </section>
  );
}
