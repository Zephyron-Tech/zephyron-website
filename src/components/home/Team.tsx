import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { TeamCards } from '../TeamCards';

export function Team() {
  return (
    <section className="section-y">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader
            title="Žádní obchodníci. Mluvíte s námi."
            lead={
              <>
                Jsme malé softwarové studio z Plzně.
                <br className="hidden sm:block" /> Kdo s vámi probírá zadání, ten ho i staví.
              </>
            }
          />
          <Button href="/o-nas" variant="secondary" arrow className="shrink-0 self-start md:self-auto">
            Více o nás
          </Button>
        </div>
        <div className="mt-14">
          <TeamCards />
        </div>
      </div>
    </section>
  );
}
