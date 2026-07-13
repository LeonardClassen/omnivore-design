# Omnivore Design System

**One design language, two surfaces.** The single source of truth for the venture's visual
language — shared **CSS tokens** plus a **React primitive library** — consumed by both the
customer-ops **cloud dashboard** (light) and the industrial **HMI** on the WAGO panel (dark).

> **Look first:** open the live gallery at
> **<https://leonardclassen.github.io/omnivore-design/>** and flip the
> **Light · Cloud / Dark · Industrial** switch. Two pages — **Tokens** (the design truth, read
> live from `tokens.css`) and **Components** (the real `ui/` React primitives) — both re-theme
> from the same tokens; nothing is hard-coded. Run it locally with `npm install && npm run dev`.

---

## What's in here

| Path | Role |
|---|---|
| [`tokens.css`](tokens.css) | **The token API.** Framework-neutral CSS custom properties: colors (2 theme maps), type, spacing, radii, shadows, motion. Consumable by *any* surface, even build-less via `<link>`. |
| [`components.css`](components.css) | Component stylesheet — token-driven, theme-aware. The same class renders surface-appropriately per `[data-theme]`. |
| [`ui/`](ui/) | **The React primitive library** — thin `.tsx` wrappers over the `components.css` classes: HMI/layout (`Card` · `Stat` · `Led` · `Empty`), controls (`Btn` · `Modal` · `Select` · `Field` · `Input`), status (`Badge` · `Banner` · `Progress`), structure/data (`Table` · `Tabs` · `Stepper` · `KV` · `Avatar` · `Skeleton` · `RadioCard`). `Card`/`Stat`/`Btn`/`Led`/`Empty` are extracted 1:1 from the HMI. |
| [`gallery/`](gallery/) | The Vite site published to GitHub Pages — a **Tokens** page (design truth, read live from `tokens.css`) + a **Components** page (the real `ui/` primitives), both themes. The living reference; show it to teammates. |

**Scope: shared tokens + a React primitive library.** `tokens.css` is framework-neutral and
consumable by any surface. The `ui/` components are consumed by build-based surfaces — the
**HMI is the first consumer**; the cloud app consumes `tokens.css` now and the components once
it is a real React/Vite build. Where the two surfaces genuinely diverge (button emphasis, card
titles, touch targets), the component adapts per theme via `[data-theme]` rules in
`components.css` — one component, surface-appropriate treatment.

## How to consume — git submodule

Neither app owns the design; both pin this repo as a submodule.

```bash
git submodule add <this-repo-url> vendor/omnivore-design
git submodule update --init --recursive   # after clone; the classic gotcha
```

**Tokens only** (any surface, incl. build-less):

```html
<link rel="stylesheet" href="vendor/omnivore-design/tokens.css" />
<link rel="stylesheet" href="vendor/omnivore-design/components.css" />
<html data-theme="light-cloud">      <!-- default; may be omitted -->
<html data-theme="dark-industrial">  <!-- the HMI -->
```

**React components** (build-based surfaces — HMI, future cloud). Add a bundler alias to
`vendor/omnivore-design/ui/src`, load the two stylesheets once, then:

```tsx
import { Btn, Card, Stat, Led, Empty } from "@omnivore/design/ui";
// e.g. in the HMI, ui.tsx becomes a thin re-export shim so no screen import changes.
```

`react` is a peer dependency (the consumer provides it). The lib is dependency-free otherwise.

## Interactive primitives — hand-rolled, zero-dependency

`Modal` and `Select` are hand-rolled, **not** pulled from a headless UI kit (Radix et al.). The
HMI is a **keyboard-less touch kiosk**: the `omv-modal-scrim` already blocks background touches, so
a heavy focus-trap buys nothing here — the honest wins (consistent Escape / scrim-close, an
accessible native select) are only a few lines each. `Modal` renders inline (a `position: fixed`
scrim, no `react-dom` portal) and `Select` is a styled **native** `<select>` (the OS picker is the
best touch affordance). So the lib's only peer dependency stays `react`. If a heavier a11y need
ever appears (e.g. a permanent maintenance keyboard), swapping in a headless kit is a lib-local
change no consumer import sees.

## The two-green rule (read before touching greens)

Green is the one company accent, but a green button must never read as an "OK" status on the
dark panel. So there are **two green tokens, split by role**:

- `--brand` — **interactive only**: primary CTAs, focus rings, selected/active, links, brand marks.
- `--ok` — **operational status only**: "running / healthy / present" LEDs and status pills.

Different hues (warm brand vs cool status-emerald); on dark the gap widens (`--brand #4caf50`
vs `--ok #34d399`). Don't use `--brand` for status or `--ok` for interaction.

## Themes

| Theme | Surface | Basis |
|---|---|---|
| `light-cloud` (default) | customer-ops cloud dashboard | Material-green brand on a slate light canvas; solid primary buttons |
| `dark-industrial` | HMI on the WAGO Web Panel 400 | GitHub-dark "Industrial Glass"; calm soft-accent primary, touch targets, mono-uppercase card titles; teal demoted to `--info` |

Token **names** are theme-invariant; only their **values** (and a few ergonomic treatments)
change per theme. Add a role once in `tokens.css` and both surfaces inherit it.

## Provenance

A blend: the token architecture, type/spacing/radii/shadow ramps, and the customer-ops
component vocabulary come from the Omnivore customer-ops design bundle; the `dark-industrial`
theme values and the primitives (`Card`/`Stat`/`Btn`/`Led`/`Empty`, LED status, touch targets,
tabular-mono numerics) come from the `AutomatisierteMastanlage` HMI's "Industrial Glass"
language (ADR-013).

## Versioning

`v0.2.0` — adds the `ui/` React primitive library. `tokens.css` + `components.css` + the `ui/`
public exports are the API; treat changes to token *names* or component *props* as breaking.
