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
| `1zu1/fliege-dunkel{,-192,-96}.png` | knapp geschnitten, Farbe-zu-Alpha: **für dunklen Grund**; das Leuchten kommt per CSS (`drop-shadow` im `--brand`) |
| `1zu1/fliege-hell{,-192,-96}.png` | knapp geschnitten, deckende Silhouette **ohne Leuchten**: **für hellen Grund** |

`1zu1/freistellen.py` erzeugt die beiden knapp geschnittenen Varianten neu (`python freistellen.py ../omnivore-glitzerfliege-app-icon.jpg .`).
Die quadratischen Dateien haben viel Luft um die Fliege; in kleinen Größen (Leiste, Kopfzeile) wirkt sie darin gestaucht, dort die knappen nehmen.

Grenzen: Die Fliege ist im Original etwa 420 × 625 px groß. Bis etwa 512 px bleibt sie scharf, größer wird sie
weicher. Für Druck oder Großformat braucht es eine höher aufgelöste Vorlage.

Verwendet als Avatar von `@hermes` auf `matrix.omnivore-recycling.com` (Human Tasks, omnivore-meta).

## Offizielles Logo (flach, Vektor)

`flach/` enthält die Abgabe „Omnivore_V6a“ (ausgewählte Version, Quelle: OneDrive Hermetia Tech → `6 Medien/06 Logos/Logo Omnivore recycling`).
Laut `Omnivore_Informationen_V6a.pdf`: Grün **#95C11F** (CMYK 50/0/100/0), Dunkelgrau **#3C3C3B** (CMYK 0/0/0/90), Schrift **Montserrat** Medium & Regular.
Später entstand eine Fassung mit **grasgrün RAL 6018** (#57A639): `Omnivore_V6a_RAL6018*.png`.

| Datei | Wofür |
|---|---|
| `flach/Omnivore_V6a{,_white}.{eps,png}` | Original-Wortbildmarke, Vektor (EPS) und PNG |
| `flach/fliege-koerper.png` + `flach/fliege-fluegel.png` | flache Fliege in zwei Ebenen (aus `zerlegen.py`): Körper grau, Flügel als Maske, die per CSS `--brand` trägt. **Für hellen Grund.** |
| `flach/fliege-weiss.png` | flache Fliege einfarbig weiß |

Regel in der Gallery: hell = flache Fliege (Flügel in `--brand`), dunkel = Glitzer-Fliege `1zu1/fliege-dunkel-*.png` ohne zusätzliches Leuchten.
