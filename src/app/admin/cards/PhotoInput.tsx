'use client';

import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, Minus, Plus, Trash2 } from 'lucide-react';

import { btnPrimary, btnSecondary } from './ui';

const OUT = 400; // stored portrait, px
const FRAME = 288; // crop frame on screen, px
const MAX_ZOOM = 4;

interface Crop {
  /** Image top-left relative to the frame's top-left, in screen px (always ≤ 0). */
  x: number;
  y: number;
  zoom: number;
}

// Keeps the image covering the whole frame whatever the pan and zoom.
function clamp(c: Crop, w: number, h: number): Crop {
  const scale = Math.max(FRAME / w, FRAME / h) * c.zoom;
  const minX = FRAME - w * scale;
  const minY = FRAME - h * scale;
  return { zoom: c.zoom, x: Math.min(0, Math.max(minX, c.x)), y: Math.min(0, Math.max(minY, c.y)) };
}

const isHeic = (f: File) => /image\/hei[cf]/i.test(f.type) || /\.hei[cf]$/i.test(f.name);

// True when this browser can decode the file natively (Safari can for HEIC).
function canDraw(file: Blob): Promise<boolean> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img.naturalWidth > 0);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    img.src = url;
  });
}

function render(img: HTMLImageElement, c: Crop): string {
  const scale = Math.max(FRAME / img.naturalWidth, FRAME / img.naturalHeight) * c.zoom;
  const canvas = document.createElement('canvas');
  canvas.width = OUT;
  canvas.height = OUT;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, -c.x / scale, -c.y / scale, FRAME / scale, FRAME / scale, 0, 0, OUT, OUT);
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
  const [readError, setReadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Cropper state: the chosen file as an image, and where it sits in the frame.
  const dialog = useRef<HTMLDialogElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 1, h: 1 });
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0, zoom: 1 });
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  useEffect(() => () => void (src && URL.revokeObjectURL(src)), [src]);

  const [converting, setConverting] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setReadError('');
    let blob: Blob = file;
    // iPhone photos come as HEIC. Safari draws them itself; other browsers get
    // them converted to JPEG first by libheif (loaded only when needed).
    if (isHeic(file) && !(await canDraw(file))) {
      setConverting(true);
      try {
        const { heicTo } = await import('heic-to/next');
        blob = await heicTo({ blob: file, type: 'image/jpeg', quality: 0.92 });
      } catch {
        setReadError('Fotku HEIC se nepodařilo převést. Zkuste ji uložit jako JPEG.');
        return;
      } finally {
        setConverting(false);
      }
    }
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const scale = Math.max(FRAME / w, FRAME / h);
      setSize({ w, h });
      // Start centred, filling the frame.
      setCrop({ zoom: 1, x: (FRAME - w * scale) / 2, y: (FRAME - h * scale) / 2 });
      setSrc(url);
      dialog.current?.showModal();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setReadError('Tenhle soubor se nepodařilo načíst jako obrázek.');
    };
    img.src = url;
  }

  // Zoom around the frame's centre, so the face stays where it was.
  function zoomTo(zoom: number) {
    setCrop((c) => {
      const z = Math.min(MAX_ZOOM, Math.max(1, zoom));
      const k = z / c.zoom;
      const cx = FRAME / 2;
      return clamp({ zoom: z, x: cx - (cx - c.x) * k, y: cx - (cx - c.y) * k }, size.w, size.h);
    });
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { px: e.clientX, py: e.clientY, x: crop.x, y: crop.y };
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    setCrop((c) => clamp({ ...c, x: d.x + e.clientX - d.px, y: d.y + e.clientY - d.py }, size.w, size.h));
  }
  function onPointerUp() {
    drag.current = null;
  }

  function apply() {
    if (!imgRef.current) return;
    const url = render(imgRef.current, crop);
    setData(url);
    setPreview(url);
    setRemoved(false);
    dialog.current?.close();
  }

  function remove() {
    setData('');
    setPreview(null);
    setRemoved(true);
  }

  const scale = Math.max(FRAME / size.w, FRAME / size.h) * crop.zoom;
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
        <div className="flex min-w-0 flex-col items-start gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={converting}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-paper-2 px-4 py-2 text-sm font-medium pointer-coarse:min-h-11 text-ink transition-colors hover:bg-line disabled:cursor-default disabled:opacity-70"
          >
            {converting ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <ImagePlus size={16} aria-hidden />}
            {converting ? 'Převádím HEIC…' : preview ? 'Vyměnit fotku' : 'Nahrát fotku'}
          </button>
          {preview && (
            <button
              type="button"
              onClick={remove}
              className="tap inline-flex cursor-pointer items-center gap-2 text-sm text-ink-2 hover:text-err"
            >
              <Trash2 size={14} aria-hidden />
              Odebrat
            </button>
          )}
          <span className="text-[13px] text-muted">JPEG, PNG i HEIC z iPhonu. Ořez si vyberete po nahrání.</span>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*,.heic,.heif" className="sr-only" tabIndex={-1} onChange={onFile} />
      <input type="hidden" name="photo" value={data} />
      <input type="hidden" name="photoRemove" value={removed ? '1' : ''} />
      {message && <span className="mt-1.5 block text-[13px] text-err">{message}</span>}

      <dialog
        ref={dialog}
        aria-label="Ořez fotky"
        className="m-auto w-[min(380px,calc(100%-32px))] rounded-2xl bg-card p-0 text-ink backdrop:bg-ink/40"
      >
        <div className="p-6">
          <h2 className="text-xl text-ink">Ořez fotky</h2>
          <p className="mt-1 text-sm text-ink-2">Táhnutím posuňte, posuvníkem přibližte.</p>

          {/* The frame is the crop: what shows inside it is what gets saved. */}
          <div
            className="relative mx-auto mt-5 cursor-grab touch-none overflow-hidden rounded-2xl bg-paper active:cursor-grabbing"
            style={{ width: FRAME, height: FRAME }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={(e) => zoomTo(crop.zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08))}
          >
            {src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                draggable={false}
                className="pointer-events-none absolute left-0 top-0 max-w-none select-none"
                style={{
                  width: size.w * scale,
                  height: size.h * scale,
                  transform: `translate(${crop.x}px, ${crop.y}px)`,
                }}
              />
            )}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              aria-label="Oddálit"
              onClick={() => zoomTo(crop.zoom / 1.2)}
              className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-paper text-ink hover:bg-accent-soft pointer-coarse:size-11"
            >
              <Minus size={16} aria-hidden />
            </button>
            <input
              type="range"
              min={1}
              max={MAX_ZOOM}
              step={0.01}
              value={crop.zoom}
              onChange={(e) => zoomTo(Number(e.target.value))}
              aria-label="Přiblížení"
              className="calc-range flex-1"
            />
            <button
              type="button"
              aria-label="Přiblížit"
              onClick={() => zoomTo(crop.zoom * 1.2)}
              className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-paper text-ink hover:bg-accent-soft pointer-coarse:size-11"
            >
              <Plus size={16} aria-hidden />
            </button>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={() => dialog.current?.close()} className={btnSecondary}>
              Zrušit
            </button>
            <button type="button" onClick={apply} className={btnPrimary}>
              Použít ořez
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
