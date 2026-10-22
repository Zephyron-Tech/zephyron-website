#!/usr/bin/env python3
"""Small copies of the printed objects for phones and small slots.

For every public/print/<name>.png (except the bulb, whose full file is also a
CSS mask, and the dot texture) writes <name>-sm.png, 360 px wide. The ink
coverage is averaged down and thresholded back to one bit, so the copy is
still a print, not a grey blur, and weighs a fraction of the original.

  python scripts/print-small.py        (needs Pillow)
"""

import os

from PIL import Image

SKIP = {'bulb', 'bulb-light', 'bulb-filament', 'dots', 'hourglass-shade'}
WIDTH = 360

for f in sorted(os.listdir('public/print')):
    name, ext = os.path.splitext(f)
    if ext != '.png' or name in SKIP or name.endswith('-sm'):
        continue
    im = Image.open(f'public/print/{f}').convert('RGBA')
    if im.width <= WIDTH:
        continue
    h = round(im.height * WIDTH / im.width)
    alpha = im.getchannel('A').resize((WIDTH, h), Image.BOX).point(lambda v: 255 if v >= 110 else 0)
    ink = next(p[:3] for p in im.get_flattened_data() if p[3] > 0)
    small = Image.new('RGBA', (WIDTH, h), ink + (0,))
    small.putalpha(alpha)
    small.quantize(colors=2, method=Image.Quantize.FASTOCTREE).save(f'public/print/{name}-sm.png', optimize=True, bits=1)
    print(f'{name}-sm.png', os.path.getsize(f'public/print/{name}-sm.png') // 1024, 'kB')
