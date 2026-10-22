import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import { pickLang, renderCardPage } from '@/lib/card-page';
import { detectDevice } from '@/lib/device';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slug';
import { buildVCard } from '@/lib/vcard';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zephyron.tech';

const app = new Hono().basePath('/v');

// The photo bytes stay out of every query that does not need them.
const findMember = (slug: string) =>
  prisma.member.findFirst({ where: { slug: slug.toLowerCase(), active: true }, omit: { photo: true } });

app.get('/:slug', async (c) => {
  const member = await findMember(c.req.param('slug'));
  if (!member) return c.text('Not found', 404, { 'Cache-Control': 'no-store' });

  // Analytics must never break the card: swallow DB errors. The admin's live
  // preview (?preview=1) is not a scan.
  if (c.req.query('preview') !== '1') prisma.scan
    .create({ data: { memberId: member.id, device: detectDevice(c.req.header('user-agent')) } })
    .catch((err) => console.error('[cards] scan log failed:', err));

  // Event / Pitch mode: temporary remote redirect (302 so it stays reversible).
  if (member.mode === 'EVENT' && member.redirectUrl) {
    return c.redirect(member.redirectUrl, 302);
  }

  const lang = pickLang(c.req.header('accept-language'));
  return c.html(renderCardPage(member, { siteUrl: SITE_URL, lang }), 200, {
    'Cache-Control': 'no-store',
    'Content-Language': lang,
    Vary: 'Accept-Language',
  });
});

app.get('/:slug/photo', async (c) => {
  const m = await prisma.member.findFirst({
    where: { slug: c.req.param('slug').toLowerCase(), active: true },
    select: { photo: true, photoType: true },
  });
  if (!m?.photo) return c.text('Not found', 404);
  // The URL carries ?v=<photoUpdatedAt>, so a new upload is a new URL.
  return c.body(new Uint8Array(m.photo), 200, {
    'Content-Type': m.photoType ?? 'image/jpeg',
    'Cache-Control': 'public, max-age=31536000, immutable',
  });
});

app.get('/:slug/vcf', async (c) => {
  const member = await prisma.member.findFirst({
    where: { slug: c.req.param('slug').toLowerCase(), active: true },
  });
  if (!member) return c.text('Not found', 404);

  const body = buildVCard({ ...member, url: `${SITE_URL}/v/${member.slug}` });
  return c.body(body, 200, {
    'Content-Type': 'text/vcard; charset=utf-8',
    'Content-Disposition': `attachment; filename="${slugify(member.name) || member.slug}.vcf"`,
    'Cache-Control': 'no-store',
  });
});

export const GET = handle(app);
