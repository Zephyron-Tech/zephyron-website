#!/usr/bin/env python3
"""Retro print effect: turns a photo into one-colour ink on transparent paper.

Recreates the Photoshop recipe the site's look is based on:
  1. grain over the photo (Grain: amount 100, size 25, roughness 50)
  2. a 50 % grey layer run through Halftone Pattern (dot) + Craquelure
  3. that texture blended "Lighter Color" at 60 % opacity
  4. Threshold
The ink pixels get the brand colour, everything else becomes transparent so
the image sits directly on the page background.

Usage:
  python scripts/retro-print.py IN OUT [--width 1400] [--cutout] [--ink 3A2FC8]
                                 [--threshold 0.62] [--cell 4] [--contrast 1.3] [--seed 7]

  --cutout     remove a plain studio background (flood fill from the edges)
  --threshold  higher = more ink (darker), lower = lighter print
  --cell       halftone cell size in output pixels
  --contrast   S-curve strength before printing (1 = none)
  --invert     print highlights instead of shadows (light ink on a dark page)

Needs numpy, Pillow and scipy (not project dependencies; run from any venv).
"""

import argparse

import numpy as np
from PIL import Image, ImageOps
from scipy import ndimage


def hex_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip('#')
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def cutout_mask(rgb: np.ndarray, tolerance: float) -> np.ndarray:
    """True where the subject is. Background = region connected to the image
    border whose colour is close to the median border colour."""
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    bg = np.median(border, axis=0)
    dist = np.linalg.norm(rgb.astype(np.float32) - bg, axis=2) / 441.7
    near_bg = dist < tolerance
    labels, _ = ndimage.label(near_bg)
    edge_labels = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    background = np.isin(labels, edge_labels[edge_labels > 0])
    subject = ~background
    subject = ndimage.binary_opening(subject, iterations=2)
    subject = ndimage.binary_fill_holes(subject)
    # keep the largest blobs only (drops specks and shadows at the edge)
    labels, n = ndimage.label(subject)
    if n > 1:
        sizes = ndimage.sum(subject, labels, range(1, n + 1))
        keep = np.isin(labels, np.flatnonzero(sizes >= sizes.max() * 0.05) + 1)
        subject = keep
    return subject


def texture(h: int, w: int, cell: float, rng: np.random.Generator) -> np.ndarray:
    """Halftone dots of a 50 % grey (a checker of dots) roughened by a
    craquelure-like maze. 0 = black, 1 = white."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    angle = np.deg2rad(45)
    u = (xx * np.cos(angle) + yy * np.sin(angle)) * (np.pi / cell)
    v = (-xx * np.sin(angle) + yy * np.cos(angle)) * (np.pi / cell)
    dots = (np.sin(u) * np.sin(v) > 0).astype(np.float32)

    maze = ndimage.gaussian_filter(rng.standard_normal((h, w)).astype(np.float32), sigma=cell * 0.45)
    maze = (maze > 0).astype(np.float32)

    return np.clip(0.55 * dots + 0.45 * maze, 0, 1)


def retro_print(img: Image.Image, args: argparse.Namespace) -> Image.Image:
    rng = np.random.default_rng(args.seed)

    img = img.convert('RGBA')
    if args.width and img.width != args.width:
        img = img.resize((args.width, round(img.height * args.width / img.width)), Image.LANCZOS)

    rgba = np.asarray(img)
    rgb, alpha = rgba[..., :3], rgba[..., 3] > 127

    mask = alpha & cutout_mask(rgb, args.tolerance) if args.cutout else alpha

    gray = np.asarray(ImageOps.grayscale(Image.fromarray(rgb))).astype(np.float32) / 255
    # stretch contrast inside the subject so dark and light both survive the threshold
    if mask.any():
        lo, hi = np.percentile(gray[mask], [2, 98])
        gray = np.clip((gray - lo) / max(hi - lo, 1e-3), 0, 1)
    # Light ink on a dark page prints the highlights instead of the shadows.
    if args.invert:
        gray = 1 - gray
    # S-curve: keeps highlights white and shadows solid, like an over-inked print
    gray = np.clip(0.5 + (gray - 0.5) * args.contrast, 0, 1)

    # 1. grain
    grain = ndimage.gaussian_filter(rng.standard_normal(gray.shape).astype(np.float32), sigma=0.6)
    gray = np.clip(gray + grain * 0.18, 0, 1)

    # 2-3. texture blended "Lighter Color" at 60 %
    tex = texture(*gray.shape, args.cell, rng)
    blended = gray + (np.maximum(gray, tex) - gray) * 0.6

    # 4. threshold
    ink = (blended < args.threshold) & mask

    out = np.zeros((*gray.shape, 4), dtype=np.uint8)
    out[ink] = (*hex_rgb(args.ink), 255)
    return Image.fromarray(out, 'RGBA')


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('src')
    p.add_argument('dst')
    p.add_argument('--width', type=int, default=1400)
    p.add_argument('--cutout', action='store_true')
    p.add_argument('--tolerance', type=float, default=0.12)
    p.add_argument('--ink', default='3A2FC8')
    p.add_argument('--threshold', type=float, default=0.62)
    p.add_argument('--cell', type=float, default=4)
    p.add_argument('--contrast', type=float, default=1.3)
    p.add_argument('--invert', action='store_true')
    p.add_argument('--seed', type=int, default=7)
    args = p.parse_args()

    result = retro_print(Image.open(args.src), args)
    bbox = result.getbbox()
    if bbox:
        pad = 8
        result = result.crop((max(bbox[0] - pad, 0), max(bbox[1] - pad, 0),
                              min(bbox[2] + pad, result.width), min(bbox[3] + pad, result.height)))
    result.save(args.dst, optimize=True)
    print(f'{args.dst}: {result.width}x{result.height}')


if __name__ == '__main__':
    main()
