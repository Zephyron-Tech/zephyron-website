const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export interface CardPageData {
  slug: string;
  name: string;
  titles?: string | null;
  role: string;
  phone?: string | null;
  email: string;
  linkedinUrl?: string | null;
  bookingUrl?: string | null;
}

export function renderCardPage(m: CardPageData, opts: { wallet: boolean; siteUrl: string }): string {
  const btn = (href: string, label: string, primary = false) =>
    `<a class="btn${primary ? ' primary' : ''}" href="${esc(href)}">${esc(label)}</a>`;

  const actions = [
    btn(`/v/${m.slug}/vcf`, 'Save contact', true),
    opts.wallet ? btn(`/v/${m.slug}/wallet`, 'Add to Wallet') : '',
    m.bookingUrl ? btn(m.bookingUrl, 'Book a 30 min call') : '',
    btn(`${opts.siteUrl}/#portfolio`, 'View case studies'),
  ].join('');

  const rows = [
    m.phone ? `<a href="tel:${esc(m.phone)}">${esc(m.phone)}</a>` : '',
    `<a href="mailto:${esc(m.email)}">${esc(m.email)}</a>`,
    m.linkedinUrl ? `<a href="${esc(m.linkedinUrl)}" rel="noopener">LinkedIn</a>` : '',
  ].join('');

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(m.name)} — Zephyron Tech</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
<style>
@font-face{font-family:Surgena;src:url(/fonts/surgenapersonaluseonlysembd-q2qwd.ttf) format('truetype');font-weight:600;font-display:swap}
*{box-sizing:border-box}
body{margin:0;min-height:100dvh;display:grid;place-items:center;padding:24px;background:#010F22;color:#fff;font-family:Poppins,system-ui,sans-serif;
background-image:radial-gradient(circle at 90% 0,rgba(88,63,255,.25),transparent 45%),radial-gradient(circle at 0 0,rgba(66,53,229,.18),transparent 40%)}
main{width:100%;max-width:420px}
.brand{font-family:Surgena,Poppins,sans-serif;font-weight:600;letter-spacing:.08em;color:#9A8CFF;font-size:14px;text-transform:uppercase}
h1{font-family:Surgena,Poppins,sans-serif;font-weight:600;font-size:32px;margin:12px 0 4px;line-height:1.15}
.role{color:#A8B6CF;margin:0 0 24px}
.info{display:flex;flex-direction:column;gap:6px;margin-bottom:28px}
.info a{color:#DDD8FF;text-decoration:none}
.actions{display:flex;flex-direction:column;gap:10px}
.btn{display:block;text-align:center;padding:14px 18px;border-radius:12px;border:1px solid #20396B;color:#fff;text-decoration:none;font-weight:500;background:rgba(255,255,255,.03)}
.btn.primary{background:#583FFF;border-color:#583FFF}
</style></head>
<body><main>
<div class="brand">Zephyron Tech</div>
<h1>${esc(m.name)}${m.titles ? `<span style="font-size:16px;color:#A8B6CF">, ${esc(m.titles)}</span>` : ''}</h1>
<p class="role">${esc(m.role)}</p>
<div class="info">${rows}</div>
<div class="actions">${actions}</div>
</main></body></html>`;
}
