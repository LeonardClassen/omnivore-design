# Omnivore Design System

**One token layer, two surfaces.** The single source of truth for the venture's visual
language — consumed by both the customer-ops **cloud dashboard** (light) and the industrial
**HMI** on the WAGO panel (dark).

> Look first: open [`showcase.html`](showcase.html) in a browser and flip the
> **Light · Cloud / Dark · Industrial** switch. Every swatch and component re-themes from the
> same tokens — nothing is hard-coded.

---

## What's in here

| File | Role |
|---|---|
| [`tokens.css`](tokens.css) | **The API.** Framework-neutral CSS custom properties: colors (2 theme maps), type, spacing, radii, shadows, motion. |
| [`components.css`](components.css) | Reference component layer (the "conventions"). Reads only from `tokens.css`; re-themes automatically. |
| [`showcase.html`](showcase.html) | Living gallery — tokens + components in both themes. Show this to teammates. |

**Scope: tokens + conventions, not a shared component runtime.** The two surfaces don't share a
tech stack (HMI = Tailwind/TypeScript/Vite; cloud = plain CSS/JSX), so they share the *tokens*
and the *visual contract*, and each re-implements the components natively. `components.css` is
the spec they match, not a package they import.

## How to consume — git submodule

Neither app owns the design; both pin this repo as a submodule.

```bash
git submodule add <this-repo-url> vendor/omnivore-design
git submodule update --init --recursive   # after clone; the classic gotcha
```

Then link the tokens and pick a theme:

```html
<link rel="stylesheet" href="vendor/omnivore-design/tokens.css" />
<html data-theme="light-cloud">      <!-- default; may be omitted -->
<html data-theme="dark-industrial">  <!-- the HMI -->
```

**HMI (Tailwind)** — map color keys to the vars in `tailwind.config.js` so existing utilities
(`bg-brand`, `text-ok`, …) resolve from the shared source:

```js
theme: { extend: { colors: {
  brand: "var(--brand)", ok: "var(--ok)", warn: "var(--warn)", err: "var(--err)",
  bg: "var(--bg)", surface: "var(--surface)", /* … */
} } }
```

Bump tokens later with `git submodule update --remote vendor/omnivore-design` — each app
decides *when* to adopt a new version.

## The two-green rule (read this before touching greens)

Green is the one company accent, but a green button must never read as an "OK" status on the
dark panel. So there are **two green tokens, split by role**:

- `--brand` — **interactive only**: primary CTAs, focus rings, selected/active, links, brand marks.
- `--ok` — **operational status only**: "running / healthy / present" LEDs and status pills.

They are deliberately different hues (warm brand vs cool status-emerald); on the dark theme the
gap widens (`--brand #4caf50` vs `--ok #34d399`). Don't use `--brand` for status or `--ok` for
interaction.

## Themes

| Theme | Surface | Basis |
|---|---|---|
| `light-cloud` (default) | customer-ops cloud dashboard | Material-green brand on a slate light canvas |
| `dark-industrial` | HMI on the WAGO Web Panel 400 | GitHub-dark "Industrial Glass"; teal demoted to the `--info` hue |

Token **names** are theme-invariant; only their **values** change. Add a role once in
`tokens.css` and both surfaces inherit it.

## Provenance

A blend: the token architecture, typography/spacing/radii/shadow ramps, and the customer-ops
component vocabulary come from the Omnivore customer-ops design bundle; the dark-industrial
theme values and the HMI primitives (LED, touch targets, tabular-mono numerics) come from the
`AutomatisierteMastanlage` HMI's "Industrial Glass" language (ADR-013).

## Versioning

`v0.1.0` — initial blend. `tokens.css` + `components.css` are the public API; treat changes to
token *names* as breaking.
