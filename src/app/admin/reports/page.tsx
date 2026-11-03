import { ReportTile } from './ReportTile';
import { reports } from './registry';
import { AdminOnly, SignInPrompt, adminSession } from '../session';

export const metadata = { title: 'Přehledy' };

export default async function ReportsPage() {
  const session = await adminSession();
  if (!session) return <SignInPrompt callbackUrl="/admin/reports" what="Pro zobrazení přehledů" />;
  if (session.role !== 'admin') return <AdminOnly />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-ink">Přehledy</h1>
        <p className="mt-1 text-ink-2">Interní rozbory a srovnání. Každý má datum, ke kterému jsou údaje ověřené.</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <li key={r.slug}>
            <ReportTile report={r} />
          </li>
        ))}
      </ul>
    </div>
  );
}
