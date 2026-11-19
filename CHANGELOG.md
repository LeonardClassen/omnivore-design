# Changelog

All notable changes to the Omnivore Design System. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [SemVer](https://semver.org/) — while `0.x`, a minor bump may break token names or component props
(called out under **Breaking**). Consumers pin the submodule to a `vX.Y.Z` tag.

## [0.4.1] — 2026-11-19

### Fixed
- HMI salience budget (plant ADR-013, HMI-INV-130): on `dark-industrial`, `<Stat tone="ok">` keeps the
  measured value neutral; only warn/err colour a value. `npm run a11y` measures it.

## [0.4.0] — 2026-11-19

Brand from the official logo, WCAG 2.2 AA, offline fonts.

### Breaking
- `--brand` is the logo's grass green **RAL 6018 `#57a639`** (was Material Green `#4caf50`), and
  `--brand-contrast` is dark ink `#0d1117` (white on the new green is only 3.0:1).
- `--info` is **blue** (light `#2563eb`, dark `#58a6ff`); the HMI teal is retired.
- `<Progress>` requires a `label` (its accessible name).
- Text tiers changed: light `--text-tertiary` `#5f6c80`; dark `--text-secondary` `#9ea7b3`,
  `--text-tertiary` `#848d97` — all ≥ 4.5:1 on every surface.

### Added
- `--{ok,warn,err,info,brand}-text`: role colours used as text, ≥ 4.5:1 on their soft fill.
- `--err-fill` / `--err-contrast` for the solid danger button.
- `--border-control` for input, select and option-card edges (≥ 3:1, WCAG 1.4.11).
- `--font-display` = Montserrat (the logo's typeface) for headings and light card titles.
- `fonts/`: self-hosted Inter, Montserrat, JetBrains Mono (variable woff2, OFL) + `fonts/fonts.css`;
  `npm run fonts` regenerates them.
- `npm run a11y`: axe-core WCAG 2.2 A/AA over every gallery screen in both themes, plus keyboard/ARIA
  contract checks, reduced motion, forced colors and offline fonts.
- Logo assets: the official flat **V6a** mark (`assets/logo/flach/`, EPS + brand sheet) and the
  tightly cropped Glitzer-Fliege for dark ground (`assets/logo/1zu1/fliege-dunkel*`).
- Gallery **Beispiele** page: clickable HMI and cloud screens built only from the primitives.

### Changed
- `Table` exposes table/row/columnheader/cell roles; clickable rows are focusable and act on Enter/Space.
- `Tabs` uses a roving tabindex with Left/Right/Home/End (WAI-ARIA APG, automatic activation).
- `Modal` is named by its title, moves focus in on open, keeps Tab inside, returns focus on close.
- Role colours used as text (badge, banner, field error, active tab, stat value) switched to `-text` tokens.
- `prefers-reduced-motion` stops transitions/animations; `forced-colors` gets real outlines.
- Stepper check mark uses `--brand-contrast` instead of a fixed white.

## [0.3.0] — 2026-07-13

- React primitive library extended to 19 primitives; gallery with Tokens + Components pages,
  per-surface component catalog.

## [0.2.0]

- First `ui/` React primitive library (`Btn`, `Card`, `Stat`, `Led`, `Empty`) extracted from the HMI.
