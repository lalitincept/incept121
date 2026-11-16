# Combines review stills into 2x2 contact sheets: python3 scripts/sheet.py out/stills/t*.jpg
import sys
from PIL import Image, ImageDraw
files = sys.argv[1:]
for k in range(0, len(files), 4):
    sheet = Image.new('RGB', (1920, 1080), 'black')
    for i, f in enumerate(files[k:k+4]):
        im = Image.open(f).convert('RGB').resize((960, 540), Image.LANCZOS)
        x, y = (i % 2) * 960, (i // 2) * 540
        sheet.paste(im, (x, y))
        ImageDraw.Draw(sheet).text((x + 8, y + 8), f.split('/')[-1], fill=(255, 255, 0))
    sheet.save(f'out/stills/sheet_{k//4:02d}.png')
    print(f'out/stills/sheet_{k//4:02d}.png')
