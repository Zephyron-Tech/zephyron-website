import { saveMember } from './actions';

interface Props {
  isAdmin: boolean;
  member?: {
    id: string; slug: string; name: string; titles: string | null; role: string;
    phone: string | null; email: string; linkedinUrl: string | null; bookingUrl: string | null;
    mode: 'DEFAULT' | 'EVENT'; redirectUrl: string | null; active: boolean;
  };
}

const input = 'w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-white/60">{label}</span>
      {children}
    </label>
  );
}

export default function MemberForm({ member, isAdmin }: Props) {
  return (
    <form action={saveMember} className="max-w-xl space-y-4">
      {member && <input type="hidden" name="id" value={member.id} />}
      <Field label="Name"><input className={input} name="name" required defaultValue={member?.name} /></Field>
      <Field label="Titles"><input className={input} name="titles" defaultValue={member?.titles ?? ''} /></Field>
      <Field label="Role"><input className={input} name="role" required defaultValue={member?.role} /></Field>
      <Field label="Phone"><input className={input} name="phone" defaultValue={member?.phone ?? ''} /></Field>
      <Field label="LinkedIn URL"><input className={input} name="linkedinUrl" defaultValue={member?.linkedinUrl ?? ''} /></Field>
      <Field label="Booking URL (Cal.com / Calendly)"><input className={input} name="bookingUrl" defaultValue={member?.bookingUrl ?? ''} /></Field>
      {isAdmin && (
        <>
          <Field label="Email"><input className={input} type="email" name="email" required defaultValue={member?.email} /></Field>
          <Field label="Slug (blank = auto)"><input className={input} name="slug" defaultValue={member?.slug ?? ''} /></Field>
          {member && (
            <>
              <Field label="Mode">
                <select className={input} name="mode" defaultValue={member.mode}>
                  <option value="DEFAULT">Default (card + vCard)</option>
                  <option value="EVENT">Event / Pitch (redirect)</option>
                </select>
              </Field>
              <Field label="Event redirect URL"><input className={input} name="redirectUrl" defaultValue={member.redirectUrl ?? ''} /></Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="active" defaultChecked={member.active} /> Active
              </label>
            </>
          )}
        </>
      )}
      <button className="rounded-lg bg-[#583FFF] px-4 py-2 text-sm font-medium">Save</button>
    </form>
  );
}
