'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';

const SIZE = 400;

// Centre-crops the chosen image to a square and redraws it at 400×400 JPEG, so
// the server only ever stores a small, uniform portrait.
async function toSquareJpeg(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.85);
}

export function PhotoInput({
  current,
  initials,
  error,
}: {
  /** URL of the saved photo, if any. */
  current: string | null;
  initials: string;
  error?: string;
}) {
  const [preview, setPreview] = useState<string | null>(current);
  const [data, setData] = useState('');
  const [removed, setRemoved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [readError, setReadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setReadError('');
    try {
      const url = await toSquareJpeg(file);
      setData(url);
      setPreview(url);
      setRemoved(false);
    } catch {
      setReadError('Tenhle soubor se nepodařilo načíst jako obrázek.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  function remove() {
    setData('');
    setPreview(null);
    setRemoved(true);
  }

  const message = readError || error;

  return (
    <div>
      <span className="block text-sm font-medium text-ink">Fotka</span>
      <div className="mt-2 flex items-center gap-4">
        <div className="relative size-24 shrink-0">
          <span
            aria-hidden
            className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-xl bg-[url('/print/dots.png')] bg-cover"
          />
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="relative size-24 rounded-xl object-cover" />
          ) : (
            <span className="relative flex size-24 items-center justify-center rounded-xl bg-paper font-display text-2xl font-semibold text-ink-2">
              {initials}
            </span>
          )}
        </div>
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-paper-2 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-line disabled:opacity-60"
          >
            <ImagePlus size={16} aria-hidden />
            {busy ? 'Zpracovávám…' : preview ? 'Vyměnit fotku' : 'Nahrát fotku'}
          </button>
          {preview && (
            <button
              type="button"
              onClick={remove}
              className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-2 hover:text-err"
            >
              <Trash2 size={14} aria-hidden />
              Odebrat
            </button>
          )}
          <span className="text-[13px] text-muted">Ořízne se na čtverec 400 × 400 px.</span>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={onFile} />
      <input type="hidden" name="photo" value={data} />
      <input type="hidden" name="photoRemove" value={removed ? '1' : ''} />
      {message && <span className="mt-1.5 block text-[13px] text-err">{message}</span>}
    </div>
  );
}
