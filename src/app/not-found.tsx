// Root-level 404 for paths outside the locale segment. Renders inside
// src/app/layout.tsx without next-intl, so it stays plain.
export default function RootNotFound() {
  return (
    <main className="container-page flex min-h-svh flex-col items-start justify-center py-24">
      <div className="text-sm text-muted">404</div>
      <h1 className="mt-4 text-4xl text-ink sm:text-6xl">Tahle stránka neexistuje.</h1>
      <p className="mt-5 text-lg text-ink-2">Odkaz je špatně, nebo jsme stránku přesunuli.</p>
      <a href="/" className="mt-9 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover">
        Zpět na úvod
      </a>
    </main>
  );
}
