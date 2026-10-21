export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-paper-2 px-3 py-1 text-[13px] text-ink-2">
      {children}
    </span>
  );
}
