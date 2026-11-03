// Shown at once when a tab is clicked, while the server renders the page: the
// rough shape of an admin page in the page tone.
export default function Loading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Načítám">
      <div className="space-y-2">
        <div className="h-9 w-56 animate-pulse rounded-lg bg-paper-2 motion-reduce:animate-none" /> {/* taste-skill-ignore: loading skeleton */}
        <div className="h-5 w-80 max-w-full animate-pulse rounded-md bg-paper-2 motion-reduce:animate-none" /> {/* taste-skill-ignore: loading skeleton */}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[92px] animate-pulse rounded-2xl bg-card motion-reduce:animate-none" /> // taste-skill-ignore: loading skeleton
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-card motion-reduce:animate-none" /> {/* taste-skill-ignore: loading skeleton */}
    </div>
  );
}
