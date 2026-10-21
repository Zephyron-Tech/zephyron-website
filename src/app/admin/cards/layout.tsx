export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-night">
      <div className="mx-auto max-w-4xl p-6 text-white">{children}</div>
    </div>
  );
}
