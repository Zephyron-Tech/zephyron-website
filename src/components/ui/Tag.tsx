export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line px-2.5 py-1 text-xs text-ink-2">
      {children}
    </span>
  );
}
