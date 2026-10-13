import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import { renderCardPage } from '@/lib/card-page';
import { detectDevice } from '@/lib/device';
import { prisma } from '@/lib/prisma';
import { buildVCard } from '@/lib/vcard';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zephyron.tech';
const WALLET_ENABLED = process.env.NEXT_PUBLIC_WALLET_ENABLED === 'true';

const app = new Hono().basePath('/v');

const findMember = (slug: string) =>
  prisma.member.findFirst({ where: { slug: slug.toLowerCase(), active: true } });

app.get('/:slug', async (c) => {
  const member = await findMember(c.req.param('slug'));
  if (!member) return c.text('Not found', 404, { 'Cache-Control': 'no-store' });

  // Analytics must never break the card: swallow DB errors.
  prisma.scan
    .create({ data: { memberId: member.id, device: detectDevice(c.req.header('user-agent')) } })
    .catch((err) => console.error('[cards] scan log failed:', err));

  // Event / Pitch mode: temporary remote redirect (302 so it stays reversible).
  if (member.mode === 'EVENT' && member.redirectUrl) {
    return c.redirect(member.redirectUrl, 302);
  }

  return c.html(renderCardPage(member, { wallet: WALLET_ENABLED, siteUrl: SITE_URL }), 200, {
    'Cache-Control': 'no-store',
  });
});

app.get('/:slug/vcf', async (c) => {
  const member = await findMember(c.req.param('slug'));
  if (!member) return c.text('Not found', 404);

  const body = buildVCard({ ...member, url: `${SITE_URL}/v/${member.slug}` });
  return c.body(body, 200, {
    'Content-Type': 'text/vcard; charset=utf-8',
    'Content-Disposition': `attachment; filename="${member.slug}.vcf"`,
    'Cache-Control': 'no-store',
  });
});

// Apple/Google Wallet signing needs a Pass Type ID + certificates we don't have yet.
app.get('/:slug/wallet', (c) => c.json({ error: 'Wallet pass not configured' }, 501));

export const GET = handle(app);
