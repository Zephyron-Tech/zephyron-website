import { PageHero } from './PageHero';

interface LegalPageProps {
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
}

export function LegalPage({ title, updated, sections }: LegalPageProps) {
  return (
    <>
      <PageHero crumbs={[{ name: title }]} eyebrow={updated} title={title} />
      <div className="container-page section-y">
        <div className="prose-z max-w-2xl space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl text-ink">{s.heading}</h2>
              <p className="mt-3">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
