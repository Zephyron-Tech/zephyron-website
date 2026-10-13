export interface VCardData {
  name: string;
  titles?: string | null;
  role: string;
  phone?: string | null;
  email: string;
  linkedinUrl?: string | null;
  url: string;
}

const escape = (v: string) =>
  v.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\;').replace(/,/g, '\\,');

// RFC 6350 line folding: max 75 octets, continuation lines start with a space.
function fold(line: string): string {
  const bytes = Buffer.from(line, 'utf8');
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // don't split inside a multi-byte UTF-8 sequence
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    parts.push(bytes.subarray(start, end).toString('utf8'));
    start = end;
    limit = 74;
  }
  return parts.join('\r\n ');
}

export function buildVCard(d: VCardData): string {
  const nameParts = d.name.trim().split(/\s+/);
  const family = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  const given = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : d.name.trim();

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escape(family)};${escape(given)};;${d.titles ? escape(d.titles) : ''};`,
    `FN:${escape(d.name)}`,
    'ORG:Zephyron Tech',
    `TITLE:${escape(d.role)}`,
    d.phone ? `TEL;TYPE=CELL:${escape(d.phone)}` : null,
    `EMAIL;TYPE=WORK:${escape(d.email)}`,
    `URL:${d.url}`,
    d.linkedinUrl ? `URL;TYPE=LinkedIn:${d.linkedinUrl}` : null,
    'END:VCARD',
  ].filter((l): l is string => l !== null);

  return lines.map(fold).join('\r\n') + '\r\n';
}
