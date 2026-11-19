# Logo: Glitzer-Fliege

`omnivore-glitzerfliege-app-icon.jpg` ist das Original-App-Icon (Fliege + Schriftzug OMNIVORE RECYCLING, 1024 px).

**Für Oberflächen gilt die Fliege ohne Schriftzug, 1:1 aus dem Original** (Betreiber-Entscheid 2026-11-19): Sie ist
ausgeschnitten, nicht nachgebaut, und liegt in `1zu1/`. `1zu1/crop.py` erzeugt alle Dateien neu
(`python crop.py`, braucht Pillow).

| Datei | Wofür |
|---|---|
| `1zu1/fliege-app-icon-{1024,512,256,128,64,32}.png` | abgerundetes dunkles Quadrat: App-Icon, Matrix-Avatar (512), Favicon (32/64) |
| `1zu1/fliege-{…}.png` | dasselbe ohne abgerundete Ecken |
| `1zu1/fliege-transparent-{1024,256}.png` | freigestellt über die Helligkeit, **nur auf dunklem Grund** (auf hellem wirkt das Leuchten blass) |

Grenzen: Die Fliege ist im Original etwa 420 × 625 px groß. Bis etwa 512 px bleibt sie scharf, größer wird sie
weicher. Für Druck oder Großformat braucht es eine höher aufgelöste Vorlage.

Verwendet als Avatar von `@hermes` auf `matrix.omnivore-recycling.com` (Human Tasks, omnivore-meta).
