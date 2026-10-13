export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto min-h-screen max-w-4xl p-6 text-white">{children}</div>;
}
