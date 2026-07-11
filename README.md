# Omnivore Design System

**One design language, two surfaces.** The single source of truth for the venture's visual
language — shared **CSS tokens** plus a **React primitive library** — consumed by both the
customer-ops **cloud dashboard** (light) and the industrial **HMI** on the WAGO panel (dark).

> Look first: open [`showcase.html`](showcase.html) in a browser and flip the
> **Light · Cloud / Dark · Industrial** switch. Every swatch and component re-themes from the
> same tokens — nothing is hard-coded.

---

## What's in here

| Path | Role |
|---|---|
| [`tokens.css`](tokens.css) | **The token API.** Framework-neutral CSS custom properties: colors (2 theme maps), type, spacing, radii, shadows, motion. Consumable by *any* surface, even build-less via `<link>`. |
| [`components.css`](components.css) | Component stylesheet — token-driven, theme-aware. The same class renders surface-appropriately per `[data-theme]`. |
| [`ui/`](ui/) | **The React primitive library** (`Btn` · `Card` · `Stat` · `Led` · `Empty`, extracted 1:1 from the HMI). Thin `.tsx` wrappers over the `components.css` classes. |
| [`showcase.html`](showcase.html) | Living gallery — tokens + components in both themes. Show this to teammates. |

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
