"""Flache Fliege aus Omnivore_V6a.png in zwei Ebenen zerlegen, damit die Fluegel per CSS-Maske das Brand-Gruen tragen.

fliege-koerper.png  = alles ausser den Fluegeln (Fuehler, Kopf, Beine; Dunkelgrau #3C3C3B), transparent
fliege-fluegel.png  = Maske der Fluegel (weiss, Deckkraft = Fluegel)
fliege-weiss.png    = ganze Fliege einfarbig weiss (aus Omnivore_V6a_white.png), fuer dunklen Grund
Aufruf: python zerlegen.py
"""
from pathlib import Path
from PIL import Image
import numpy as np

HERE = Path(__file__).parent
FLY_RIGHT = 439                     # erste leere Spalte zwischen Fliege und Schriftzug


def fly(name):
    im = np.asarray(Image.open(HERE / name).convert("RGBA"))[:, :FLY_RIGHT]
    ys, xs = np.nonzero(im[..., 3] > 0)
    return im[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


color = fly("Omnivore_V6a.png").astype(int)
r, g, b, a = (color[..., i] for i in range(4))
green = (g - r) > 30                # Fluegel sind gruen, der Rest grau
body = color.copy(); body[..., 3] = np.where(green, 0, a)
wings = np.zeros_like(color); wings[..., :3] = 255; wings[..., 3] = np.where(green, a, 0)
Image.fromarray(body.astype(np.uint8)).save(HERE / "fliege-koerper.png")
Image.fromarray(wings.astype(np.uint8)).save(HERE / "fliege-fluegel.png")
Image.fromarray(fly("Omnivore_V6a_white.png").astype(np.uint8)).save(HERE / "fliege-weiss.png")
print("ok", color.shape[1], "x", color.shape[0])
