// Shown while a cards admin page loads on the server: the shape of the list,
// in the page tone, so the click is acknowledged at once.
export default function Loading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Načítám">
      <div className="h-9 w-64 animate-pulse rounded-lg bg-paper-2 motion-reduce:animate-none" /> {/* taste-skill-ignore: loading skeleton */}
      <div className="grid gap-3 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="h-[88px] animate-pulse rounded-2xl bg-card motion-reduce:animate-none" /> // taste-skill-ignore: loading skeleton
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-card motion-reduce:animate-none" /> {/* taste-skill-ignore: loading skeleton */}
    </div>
  );
}
