// The public business card at /v/:slug. Plain server-rendered HTML (no React,
// no script) so it opens instantly from an NFC tap or QR scan. It wears the
// website's look: paper ground, one white card, violet accent, Poppins and Sora.

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export type CardLang = 'cs' | 'en';

export interface CardPageData {
  slug: string;
  name: string;
  titles?: string | null;
  role: string;
  phone?: string | null;
  email: string;
  linkedinUrl?: string | null;
  bookingUrl?: string | null;
  /** Set when the member has a photo; versions the photo URL. */
  photoUpdatedAt?: Date | null;
}

const copy = {
  cs: {
    save: 'Uložit kontakt',
    phone: 'Telefon',
    email: 'E-mail',
    linkedin: 'LinkedIn',
    book: 'Domluvit schůzku',
    cases: 'Reference',
    title: 'digitální vizitka',
  },
  en: {
    save: 'Save contact',
    phone: 'Phone',
    email: 'E-mail',
    linkedin: 'LinkedIn',
    book: 'Book a meeting',
    cases: 'Case studies',
    title: 'digital business card',
  },
} as const;

/** Czech for Czech and Slovak phones and when the header is missing, English otherwise. */
export function pickLang(acceptLanguage: string | undefined | null): CardLang {
  const first = (acceptLanguage ?? '').split(',')[0]?.trim().toLowerCase() ?? '';
  return !first || first.startsWith('cs') || first.startsWith('sk') ? 'cs' : 'en';
}

/** "Ing." before the name, "Ph.D." after it, as Czech business cards set them. */
export function displayName(name: string, titles?: string | null): string {
  if (!titles) return name;
  const after = /^(ph\.?d|csc|mba|dis|dba|llm)\.?/i;
  const parts = titles.split(/[,\s]+/).filter(Boolean);
  const pre = parts.filter((t) => !after.test(t)).join(' ');
  const post = parts.filter((t) => after.test(t)).join(', ');
  return [pre, name].filter(Boolean).join(' ') + (post ? `, ${post}` : '');
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

// Lucide icons, inlined so the page needs nothing but its own HTML.
const icon = (paths: string) =>
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const icons = {
  phone: icon(
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  ),
  mail: icon('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
  linkedin: icon(
    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
  ),
  calendar: icon('<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>'),
  save: icon(
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  ),
  out: icon('<path d="M7 7h10v10"/><path d="M7 17 17 7"/>'),
};

export function renderCardPage(m: CardPageData, opts: { siteUrl: string; lang: CardLang }): string {
  const t = copy[opts.lang];
  const full = displayName(m.name, m.titles);
  const photoUrl = m.photoUpdatedAt ? `/v/${m.slug}/photo?v=${m.photoUpdatedAt.getTime()}` : null;
  const absPhoto = photoUrl ? `${opts.siteUrl}${photoUrl}` : `${opts.siteUrl}/web-app-manifest-512x512.png`;

  const tile = (href: string, svg: string, label: string, value: string, external = false) =>
    `<a class="tile" href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>
      <span class="bubble">${svg}</span>
      <span class="tile-text"><span class="tile-label">${esc(label)}</span><span class="tile-value">${esc(value)}</span></span>
    </a>`;

  const tiles = [
    m.phone ? tile(`tel:${m.phone.replace(/\s/g, '')}`, icons.phone, t.phone, m.phone) : '',
    tile(`mailto:${m.email}`, icons.mail, t.email, m.email),
    m.linkedinUrl ? tile(m.linkedinUrl, icons.linkedin, t.linkedin, linkedinHandle(m.linkedinUrl), true) : '',
  ].join('');

  const portrait = photoUrl
    ? `<div class="photo"><span class="dots" aria-hidden="true"></span><img src="${esc(photoUrl)}" alt="${esc(m.name)}" width="112" height="112"></div>`
    : `<div class="photo"><span class="dots" aria-hidden="true"></span><span class="initials" aria-hidden="true">${esc(initials(m.name))}</span></div>`;

  return `<!doctype html>
<html lang="${opts.lang}"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,interactive-widget=resizes-content">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#EEEDEA">
<title>${esc(full)} · Zephyron Tech</title>
<meta name="description" content="${esc(`${m.role}, Zephyron Tech: ${t.title}`)}">
<meta property="og:title" content="${esc(`${full} · Zephyron Tech`)}">
<meta property="og:description" content="${esc(m.role)}">
<meta property="og:image" content="${esc(absPhoto)}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&family=Sora:wght@600&display=swap" rel="stylesheet">
<style>
@font-face{font-family:Surgena;src:url(/fonts/surgenapersonaluseonlysembd-q2qwd.ttf) format('truetype');font-weight:600;font-display:swap}
:root{--paper:#EEEDEA;--card:#FFFFFF;--ink:#11131E;--ink-2:#3A3D4A;--muted:#5F6270;--accent:#4235E5;--accent-hover:#583FFF;--accent-soft:#EEEBFF;--ease-out:cubic-bezier(0.23,1,0.32,1)}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent}
a,button{touch-action:manipulation}
body{margin:0;min-height:100dvh;background:var(--paper);color:var(--ink);font-family:Poppins,ui-sans-serif,system-ui,sans-serif;-webkit-font-smoothing:antialiased;
  display:flex;justify-content:center;padding:max(24px,env(safe-area-inset-top)) 16px max(32px,env(safe-area-inset-bottom))}
main{width:100%;max-width:420px}
a{color:inherit;-webkit-tap-highlight-color:transparent}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.brand{display:inline-flex;align-items:center;gap:8px;min-height:44px;text-decoration:none;margin:-6px 0 10px}
.brand img{height:22px;width:auto}
.brand span{font-family:Surgena,Sora,sans-serif;font-weight:600;font-size:17px;letter-spacing:-.01em}
.card{background:var(--card);border-radius:24px;padding:24px}
.photo{position:relative;width:112px;height:112px}
.dots{position:absolute;inset:0;transform:translate(8px,8px);border-radius:16px;background:url(/print/dots.png) center/cover}
.photo img,.initials{position:relative;display:block;width:112px;height:112px;border-radius:16px;object-fit:cover;background:var(--paper)}
.initials{display:flex;align-items:center;justify-content:center;font-family:Sora,sans-serif;font-weight:600;font-size:34px;color:var(--ink-2)}
h1{font-family:Sora,Poppins,sans-serif;font-weight:600;font-size:27px;line-height:1.15;letter-spacing:-.02em;margin:28px 0 6px;text-wrap:balance}
.role{margin:0;color:var(--accent);font-weight:500;font-size:15px}
.org{margin:2px 0 0;color:var(--muted);font-size:14px}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;border-radius:999px;padding:15px 20px;font-size:15px;font-weight:500;text-decoration:none;
  transition:background-color 200ms var(--ease-out),transform 150ms var(--ease-out)}
.btn:active{transform:scale(.97)}
.btn.primary{margin-top:24px;background:var(--accent);color:#fff}
.btn.secondary{margin-top:10px;background:var(--paper);color:var(--ink)}
.tiles{display:grid;gap:8px;margin-top:20px}
.tile{display:flex;align-items:center;gap:12px;min-width:0;border-radius:14px;background:var(--paper);padding:10px 12px;text-decoration:none;transition:background-color 300ms var(--ease-out)}
.bubble{display:inline-flex;flex-shrink:0;align-items:center;justify-content:center;width:36px;height:36px;border-radius:999px;background:var(--card);color:var(--accent);transition:background-color 300ms var(--ease-out),color 300ms var(--ease-out)}
.tile-text{min-width:0}
.tile-label{display:block;font-size:12px;color:var(--muted)}
.tile-value{display:block;font-size:14px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.more{display:flex;justify-content:center;gap:24px;margin-top:20px;font-size:14px;font-weight:500}
.more a{display:inline-flex;align-items:center;gap:4px;min-height:44px;text-decoration:none;color:var(--ink-2)}
@media (hover:hover) and (pointer:fine){
  .btn.primary:hover{background:var(--accent-hover)}
  .btn.secondary:hover{background:var(--accent-soft)}
  .tile:hover{background:var(--accent-soft)}
  .tile:hover .bubble{background:var(--accent);color:#fff}
  .more a:hover{color:var(--accent)}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}.btn:active{transform:none}}
</style></head>
<body><main>
<a class="brand" href="${esc(opts.siteUrl)}"><img src="/mark-256.png" alt="" width="256" height="196"><span>Zephyron</span></a>
<div class="card">
  ${portrait}
  <h1>${esc(full)}</h1>
  <p class="role">${esc(m.role)}</p>
  <p class="org">Zephyron Tech</p>
  <a class="btn primary" href="/v/${esc(m.slug)}/vcf">${icons.save}${esc(t.save)}</a>
  ${m.bookingUrl ? `<a class="btn secondary" href="${esc(m.bookingUrl)}" target="_blank" rel="noopener">${icons.calendar}${esc(t.book)}</a>` : ''}
  <div class="tiles">${tiles}</div>
</div>
<nav class="more">
  <a href="${esc(opts.siteUrl)}/reference">${esc(t.cases)}${icons.out}</a>
  <a href="${esc(opts.siteUrl)}">zephyron.tech${icons.out}</a>
</nav>
</main></body></html>`;
}

/** "linkedin.com/in/jan-vandlicek/" → "jan-vandlicek". */
function linkedinHandle(url: string): string {
  const m = url.match(/linkedin\.com\/(?:in|company)\/([^/?#]+)/i);
  return m ? decodeURIComponent(m[1]) : 'LinkedIn';
}
