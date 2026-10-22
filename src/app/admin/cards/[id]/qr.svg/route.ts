import QRCode from 'qrcode';

import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zephyron.tech';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { role, email } = await requireRole().catch(() => ({ role: null, email: null }));
  if (!role) return new Response('Unauthorized', { status: 401 });

  const member = await prisma.member.findUnique({ where: { id }, omit: { photo: true } });
  if (!member || (role !== 'admin' && member.email !== email)) return new Response('Not found', { status: 404 });

  // Ink by default, the brand violet with ?color=accent; always on white for scanners.
  const dark = new URL(req.url).searchParams.get('color') === 'accent' ? '#4235E5' : '#11131E';
  const svg = await QRCode.toString(`${SITE_URL}/v/${member.slug}`, {
    type: 'svg', errorCorrectionLevel: 'M', margin: 2, color: { dark, light: '#FFFFFF' },
  });
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' } });
}
