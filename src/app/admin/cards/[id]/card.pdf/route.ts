import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

import { displayName } from '@/lib/card-page';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zephyron.tech';
export const runtime = 'nodejs';

// A print-ready business card: 85 × 55 mm trim plus 3 mm bleed on every side,
// front and back. Poppins is embedded because the standard PDF fonts have no
// Czech diacritics.
const MM = 72 / 25.4;
const TRIM_W = 85 * MM;
const TRIM_H = 55 * MM;
const BLEED = 3 * MM;
const SAFE = BLEED + 5 * MM; // 5 mm inside the trim edge

const INK = '#11131E';
const INK_2 = '#3A3D4A';
const ACCENT = '#4235E5';
const PAPER = '#EEEDEA';

const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file));

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { role, email } = await requireRole().catch(() => ({ role: null, email: null }));
  if (!role) return new Response('Unauthorized', { status: 401 });

  const member = await prisma.member.findUnique({ where: { id }, omit: { photo: true } });
  if (!member || (role !== 'admin' && member.email !== email)) return new Response('Not found', { status: 404 });

  const [regular, medium, semibold, mark] = await Promise.all([
    font('Poppins-Regular.ttf'),
    font('Poppins-Medium.ttf'),
    font('Poppins-SemiBold.ttf'),
    readFile(join(process.cwd(), 'public/mark-256.png')),
  ]);

  const W = TRIM_W + 2 * BLEED;
  const H = TRIM_H + 2 * BLEED;
  const doc = new PDFDocument({ size: [W, H], margin: 0, info: { Title: `${member.name}: vizitka` } });
  doc.registerFont('regular', regular);
  doc.registerFont('medium', medium);
  doc.registerFont('semibold', semibold);
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  // Front: paper ground, mark, name, role, contacts at the foot.
  doc.rect(0, 0, W, H).fill(PAPER);
  doc.image(mark, SAFE, SAFE, { height: 5 * MM });
  doc.font('semibold').fontSize(8).fillColor(INK).text('Zephyron', SAFE + 7.2 * MM, SAFE + 0.9 * MM, { lineBreak: false });

  const textW = TRIM_W - 10 * MM;
  doc.font('semibold').fontSize(12.5).fillColor(INK).text(displayName(member.name, member.titles), SAFE, SAFE + 15 * MM, { width: textW });
  doc.font('medium').fontSize(7.5).fillColor(ACCENT).text(member.role, { width: textW });

  const contacts = [member.phone, member.email].filter(Boolean) as string[];
  const footY = BLEED + TRIM_H - 5 * MM - contacts.length * 10;
  doc.font('regular').fontSize(7).fillColor(INK_2);
  contacts.forEach((line, i) => doc.text(line, SAFE, footY + i * 10, { lineBreak: false }));

  // Back: accent ground, the QR on a white tile, the address beside it.
  doc.addPage({ size: [W, H], margin: 0 });
  doc.rect(0, 0, W, H).fill(ACCENT);

  const tile = 32 * MM;
  const tileX = SAFE;
  const tileY = (H - tile) / 2;
  doc.roundedRect(tileX, tileY, tile, tile, 2.5 * MM).fill('#FFFFFF');

  const url = `${SITE_URL}/v/${member.slug}`;
  const qr = QRCode.create(url, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size;
  const pad = 2.5 * MM;
  const cell = (tile - 2 * pad) / n;
  // All modules go into one path and are filled once, so no hairline seams
  // show between neighbouring squares when the PDF is rasterised.
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (qr.modules.get(y, x)) doc.rect(tileX + pad + x * cell, tileY + pad + y * cell, cell, cell);
    }
  }
  doc.fill(INK);

  const sideX = tileX + tile + 6 * MM;
  const sideW = W - sideX - SAFE;
  doc.font('semibold').fontSize(11).fillColor('#FFFFFF').text('zephyron.tech', sideX, tileY + 4 * MM, { width: sideW });
  doc.font('regular').fontSize(7).fillColor('#FFFFFF').fillOpacity(0.8)
    .text('Naskenujte a uložte si kontakt do telefonu.', sideX, tileY + 11 * MM, { width: sideW });
  doc.fillOpacity(1);

  doc.end();
  return new Response(new Uint8Array(await done), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${member.slug}-vizitka.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
