"""Fliege 1:1 aus dem Original-App-Icon schneiden (ohne Schriftzug) und Logo-Varianten erzeugen.

Quelle: ../omnivore-glitzerfliege-app-icon.jpg (1024 px). Der Ausschnitt BOX enthaelt nur die Fliege; rechts davon
beginnt der Schriftzug. Der Rand des Ausschnitts wird weich in einen dunklen Verlauf wie im Original geblendet.
Aufruf: python crop.py   (schreibt die PNGs in diesen Ordner)
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageChops

HERE = Path(__file__).parent
SRC = HERE.parent / "omnivore-glitzerfliege-app-icon.jpg"
BOX = (70, 165, 488, 790)          # x0, y0, x1, y1 im Original
FEATHER = 28                        # px weicher Rand des Ausschnitts
CANVAS = 780                        # Quadrat in Originalpixeln (Fliege + Luft)
BG_CENTER, BG_EDGE = (30, 34, 36), (12, 14, 16)


def radial_bg(size):
    """Dunkler radialer Verlauf wie der Hintergrund des Originals."""
    grad = Image.radial_gradient("L").resize((size, size))   # 0 Mitte .. 255 Rand
    c = Image.new("RGB", (size, size), BG_CENTER)
    e = Image.new("RGB", (size, size), BG_EDGE)
    return Image.composite(e, c, grad)


def feather_mask(w, h, f):
    m = Image.new("L", (w, h), 0)
    ImageDraw.Draw(m).rectangle((f, f, w - f, h - f), fill=255)
    return m.filter(ImageFilter.GaussianBlur(f / 2))


def rounded(im, radius_frac=0.22):
    s = im.size[0]
    m = Image.new("L", (s * 4, s * 4), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, s * 4 - 1, s * 4 - 1), radius=int(s * 4 * radius_frac), fill=255)
    out = im.convert("RGBA")
    out.putalpha(m.resize((s, s), Image.LANCZOS))
    return out


src = Image.open(SRC).convert("RGB")
fly = src.crop(BOX)
w, h = fly.size
square = radial_bg(CANVAS)
ox, oy = (CANVAS - w) // 2, (CANVAS - h) // 2
square.paste(fly, (ox, oy), feather_mask(w, h, FEATHER))

# Transparente Variante fuer dunkle Oberflaechen: Helligkeit ueber dem Hintergrund wird Deckkraft.
bg_level = 30
lum = square.convert("L").point(lambda v: max(0, min(255, (v - bg_level) * 3)))
transparent = square.convert("RGBA")
transparent.putalpha(lum)

for size in (1024, 512, 256, 128, 64, 32):
    big = square.resize((size, size), Image.LANCZOS)
    big.save(HERE / f"fliege-{size}.png")
    rounded(big).save(HERE / f"fliege-app-icon-{size}.png")
transparent.resize((1024, 1024), Image.LANCZOS).save(HERE / "fliege-transparent-1024.png")
transparent.resize((256, 256), Image.LANCZOS).save(HERE / "fliege-transparent-256.png")
print("ok", fly.size)
