import Link from 'next/link';

import { describeAttribution } from '@/lib/attribution';
import { TOPIC_LABELS, type Topic } from '@/lib/contact-options';
import { prisma } from '@/lib/prisma';
import { ago, dateTime } from '../format';
import { AdminOnly, SignInPrompt, adminSession } from '../session';
import { EnquiryActions } from './EnquiryActions';

export const metadata = { title: 'Poptávky' };

const sizeLabel = (s: string) => (s === 'startup' ? 'Startup' : `${s.replace('-', '–')} lidí`);

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ stav?: string }> }) {
  const session = await adminSession();
  if (!session) return <SignInPrompt callbackUrl="/admin/enquiries" what="Pro zobrazení poptávek" />;
  if (session.role !== 'admin') return <AdminOnly />;

  const all = (await searchParams).stav === 'vse';
  const [rows, open] = await Promise.all([
    prisma.enquiry.findMany({ where: all ? {} : { handledAt: null }, orderBy: { createdAt: 'desc' }, take: 200 }),
    prisma.enquiry.count({ where: { handledAt: null } }),
  ]);

  const tabs = [
    { href: '/admin/enquiries', label: `Nevyřízené (${open})`, active: !all },
    { href: '/admin/enquiries?stav=vse', label: 'Všechny', active: all },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl text-ink">Poptávky</h1>
          <p className="mt-1 text-ink-2">
            Odeslané formuláře z webu. Každá přišla i e-mailem na hello@zephyron.tech. Uchováváme je nejdéle 2 roky.
          </p>
        </div>
        <div className="flex gap-1 rounded-full bg-paper-2 p-1" role="group" aria-label="Filtr poptávek">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              aria-current={t.active ? 'page' : undefined}
              className={`rounded-full px-4 py-1.5 text-sm font-medium pointer-coarse:py-2.5 ${t.active ? 'bg-card text-ink' : 'text-ink-2 hover:text-ink'}`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      <ul className="space-y-3">
        {rows.map((e) => {
          const topic = TOPIC_LABELS[e.topic as Topic] ?? e.topic;
          const subject = `${e.topic === 'startup' ? 'Startup Support' : 'Poptávka'}: ${e.company || e.name}`;
          const reply = `mailto:${e.email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;
          const rowsInfo = [
            ['E-mail', e.email],
            e.phone && ['Telefon', e.phone],
            e.company && ['Firma', e.company],
            e.companySize && ['Velikost firmy', sizeLabel(e.companySize)],
            // Enquiries from before attribution existed have no landing page; show nothing for them.
            e.landingPage && ['Zdroj', describeAttribution({ source: e.source ?? undefined, medium: e.medium ?? undefined, campaign: e.campaign ?? undefined, referrer: e.referrer ?? undefined })],
            e.landingPage && ['Vstupní stránka', e.landingPage],
            ['Odesláno', dateTime(e.createdAt)],
          ].filter(Boolean) as [string, string][];
          return (
            <li key={e.id} id={e.id} className="scroll-mt-6">
              <details className="group rounded-2xl bg-card" open={rows.length <= 3 || undefined}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-ink">{e.company || e.name}</span>
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">{topic}</span>
                      {!e.handledAt && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">Nová</span>}
                      {!e.emailSent && (
                        <span className="rounded-full bg-err-soft px-2 py-0.5 text-xs font-medium text-err" title="E-mail se nepodařilo odeslat">
                          Bez e-mailu
                        </span>
                      )}
                    </span>
                    <span className="mt-1 line-clamp-1 text-sm text-ink-2 group-open:hidden">
                      {e.company ? `${e.name}: ` : ''}
                      {e.message}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm tabular-nums text-muted">{ago(e.createdAt)}</span>
                </summary>
                <div className="space-y-5 px-5 pb-5">
                  <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[max-content_1fr]">
                    {e.company && (
                      <>
                        <dt className="text-muted">Jméno</dt>
                        <dd className="text-ink">{e.name}</dd>
                      </>
                    )}
                    {rowsInfo.map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-muted">{k}</dt>
                        <dd className="break-words text-ink select-all">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="whitespace-pre-wrap rounded-xl bg-paper p-4 text-[15px] leading-relaxed text-ink-2">{e.message}</p>
                  <EnquiryActions id={e.id} name={e.name} email={e.email} replyHref={reply} handled={!!e.handledAt} />
                </div>
              </details>
            </li>
          );
        })}
        {rows.length === 0 && (
          <li className="rounded-2xl bg-card p-6 text-ink-2">
            {all
              ? 'Zatím žádná poptávka. Nové z formuláře na /kontakt se objeví tady.'
              : 'Všechno vyřízeno. Nové poptávky se objeví tady.'}
          </li>
        )}
      </ul>
    </div>
  );
}
