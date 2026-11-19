"""Fliege freistellen (knapp geschnitten): fliege-dunkel.png (Farbe-zu-Alpha, fuer dunklen Grund) und fliege-hell.png (deckende Silhouette ohne Leuchten, fuer hellen Grund). Aufruf: python freistellen.py ../omnivore-glitzerfliege-app-icon.jpg ."""
import sys
from PIL import Image, ImageFilter, ImageDraw
import numpy as np
SRC, OUT = sys.argv[1], sys.argv[2]
src = np.asarray(Image.open(SRC).convert("RGB")).astype(float)
x0, y0, x1, y1 = 40, 140, 520, 810          # generous box around the fly
CUT = 498 - x0                              # lettering starts right of x=498
TH = 75                                     # luminance threshold for the fly's shape
crop = src[y0:y1, x0:x1]; lum = crop.mean(axis=2); H, W = lum.shape
l = lum.copy(); l[:, CUT:] = 0
b = Image.fromarray(((l > TH) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
bb_ = np.asarray(b)
ys, xs = np.nonzero(bb_[360 - y0:620 - y0, 140 - x0:260 - x0] == 255)   # a bright tile in the left wing
seed = (int(xs[0]) + 140 - x0, int(ys[0]) + 360 - y0)
ImageDraw.floodfill(b, seed, 128)
comp = np.asarray(b) == 128
inv = Image.fromarray(((~comp) * 255).astype(np.uint8)).copy(); ImageDraw.floodfill(inv, (0, 0), 128)
sil = np.asarray(inv) != 128                # component with inner holes (dark tiles) filled
print("hole fill added", int(sil.sum() - comp.sum()), "px of", int(sil.sum()))
mk = Image.fromarray((sil * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
light = Image.fromarray(crop.astype(np.uint8)).convert("RGBA"); light.putalpha(mk)
grown = np.asarray(Image.fromarray((sil * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(11)).filter(ImageFilter.GaussianBlur(3))).astype(float) / 255
bg = np.array([15, 19, 20.0])
d = np.clip((crop - bg) / (255 - bg), 0, 1).max(axis=2)
a = np.clip((d - 0.05) / 0.6, 0, 1) * grown
safe = np.where(a > 0, a, 1)[..., None]; col = np.clip(bg + (crop - bg) / safe, 0, 255)
dark = Image.fromarray(np.dstack([col, a * 255]).astype(np.uint8), "RGBA")
bb = Image.fromarray((sil * 255).astype(np.uint8)).getbbox(); pad = 8
box = (max(bb[0] - pad, 0), max(bb[1] - pad, 0), min(bb[2] + pad, W), min(bb[3] + pad, H))
print("fly bbox (orig px)", bb[0] + x0, bb[1] + y0, bb[2] + x0, bb[3] + y0)
for name, im in (("light", light), ("dark", dark)):
    c = im.crop(box)
    tag = {"light": "hell", "dark": "dunkel"}[name]
    c.save(f"{OUT}/fliege-{tag}.png")
    for h in (192, 96):                     # web sizes (2x for 96 / 48 px display height)
        c.resize((round(c.width * h / c.height), h), Image.LANCZOS).save(f"{OUT}/fliege-{tag}-{h}.png")
