import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zephyron.tech';
export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { role, email } = await requireRole().catch(() => ({ role: null, email: null }));
  if (!role) return new Response('Unauthorized', { status: 401 });

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member || (role !== 'admin' && member.email !== email)) return new Response('Not found', { status: 404 });

  // Vector QR: draw each dark module as a rect so the PDF stays resolution-independent.
  const qr = QRCode.create(`${SITE_URL}/v/${member.slug}`, { errorCorrectionLevel: 'M' });
  const size = qr.modules.size;
  const quiet = 2;
  const target = 200; // pt
  const cell = target / (size + quiet * 2);

  const doc = new PDFDocument({ size: [target, target], margin: 0 });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  doc.rect(0, 0, target, target).fill('#FFFFFF');
  doc.fillColor('#000000');
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (qr.modules.get(y, x)) doc.rect((x + quiet) * cell, (y + quiet) * cell, cell, cell).fill();
    }
  }
  doc.end();

  return new Response(new Uint8Array(await done), {
    headers: { 'Content-Type': 'application/pdf', 'Cache-Control': 'no-store' },
  });
}
