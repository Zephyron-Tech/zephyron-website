import { solutions } from '@/content/solutions';
import { SectionHeader } from '../ui/SectionHeader';
import { SolutionLinkTile } from '../SolutionLinkTile';

// The concrete problems we solve, each with its own page. The pain points
// above say what hurts; these tiles say where to read what changes.
export function Solutions() {
  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeader
          title="Co konkrétně řešíme"
          lead="Šest problémů, se kterými za námi firmy chodí nejčastěji. U každého popisujeme, jak to funguje dnes a jak se systémem."
        />
        <div className="mt-10 grid gap-3 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => (
            <SolutionLinkTile key={s.slug} solution={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
