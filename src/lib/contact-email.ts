// The enquiry e-mail from the contact form, in the website's look: paper
// ground, one white card, violet accent. Mail clients ignore most CSS, so it is
// built from tables with inline styles; Poppins where the client loads web
// fonts, Arial everywhere else.

const SITE = 'https://zephyron.tech';
const PAPER = '#EEEDEA';
const CARD = '#FFFFFF';
const INK = '#11131E';
const INK_2 = '#3A3D4A';
const MUTED = '#6B6E7B';
const ACCENT = '#4235E5';
const ACCENT_SOFT = '#EEEBFF';
const FONT = "Poppins, 'Segoe UI', Arial, sans-serif";

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface EnquiryEmail {
  subject: string;
  topic: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  companySize?: string;
  message: string;
  /** When the form was sent. */
  sentAt: Date;
}

export function enquiryEmailHtml(e: EnquiryEmail): string {
  const when = e.sentAt.toLocaleString('cs-CZ', {
    timeZone: 'Europe/Prague',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const row = (label: string, value: string) => `
          <tr>
            <td style="padding:10px 0;border-top:1px solid ${PAPER};width:130px;vertical-align:top;font:400 13px/20px ${FONT};color:${MUTED};">${label}</td><!-- taste-skill-ignore: rules between rows of a real data table -->
            <td style="padding:10px 0;border-top:1px solid ${PAPER};vertical-align:top;font:500 15px/22px ${FONT};color:${INK};">${value}</td><!-- taste-skill-ignore: rules between rows of a real data table -->
          </tr>`;
  const link = (href: string, text: string) =>
    `<a href="${esc(href)}" style="color:${ACCENT};text-decoration:none;">${esc(text)}</a>`;

  const rows = [
    row('Jméno', esc(e.name)),
    row('E-mail', link(`mailto:${e.email}`, e.email)),
    e.phone ? row('Telefon', link(`tel:${e.phone.replace(/\s/g, '')}`, e.phone)) : '',
    e.company ? row('Firma', esc(e.company)) : '',
    e.companySize
      ? row('Velikost firmy', esc(e.companySize === 'startup' ? 'Startup' : `${e.companySize.replace('-', '–')} lidí`))
      : '',
  ].join('');

  const reply = `mailto:${e.email}?subject=${encodeURIComponent(`Re: ${e.subject}`)}`;

  return `<!doctype html>
<html lang="cs"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${esc(e.subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${PAPER};">
<div style="display:none;max-height:0;overflow:hidden;">${esc(`${e.topic} · ${e.name}: ${e.message.slice(0, 120)}`)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

      <tr><td style="padding:0 4px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;"><img src="${SITE}/mark-256.png" width="34" height="26" alt="" style="display:block;border:0;"></td>
          <td style="vertical-align:middle;padding-left:10px;font:600 17px/1 ${FONT};color:${INK};letter-spacing:-0.01em;">Zephyron Tech</td>
        </tr></table>
      </td></tr>

      <tr><td style="background:${CARD};border-radius:20px;padding:32px 28px;">
        <span style="display:inline-block;padding:5px 12px;border-radius:999px;background:${ACCENT_SOFT};font:500 13px/18px ${FONT};color:${ACCENT};">${esc(e.topic)}</span>
        <h1 style="margin:16px 0 4px;font:600 26px/32px ${FONT};color:${INK};letter-spacing:-0.02em;">Nová poptávka z webu</h1>
        <p style="margin:0 0 20px;font:400 14px/20px ${FONT};color:${MUTED};">${esc(when)}</p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
        </table>

        <div style="margin-top:20px;padding:18px 20px;border-radius:14px;background:${PAPER};font:400 15px/24px ${FONT};color:${INK_2};white-space:pre-wrap;">${esc(e.message)}</div>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr>
          <td style="border-radius:999px;background:${ACCENT};">
            <a href="${esc(reply)}" style="display:inline-block;padding:13px 24px;font:500 15px/20px ${FONT};color:#FFFFFF;text-decoration:none;">Odpovědět &rarr;</a>
          </td>
        </tr></table>
      </td></tr>

      <tr><td style="padding:20px 4px 0;font:400 12px/18px ${FONT};color:${MUTED};">
        Odesláno z formuláře na <a href="${SITE}/kontakt" style="color:${MUTED};">zephyron.tech/kontakt</a>. Odpověď půjde přímo na ${esc(e.email)}.
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}
