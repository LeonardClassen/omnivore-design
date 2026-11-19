// Brand-green candidates: the official logo greens (V, R) and tones measured from the Glitzer-Fliege logo
// (assets/logo/omnivore-glitzerfliege-app-icon.jpg, wing tiles, median per
// lightness x hue band). Gallery-only: lets the operator pick the brand green
// live on real screens before tokens.css is changed.
import type { Theme } from "./App";

export type BrandChoice = { key: string; hex: string; label: string };

/** The choice that equals tokens.css (no override applied). */
export const TOKEN_BRAND_KEY = "R";

export type FontChoice = { key: string; label: string; display: string | null; sans: string | null };
const MONTSERRAT = '"Montserrat", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
export const FONT_CHOICES: FontChoice[] = [
  { key: "inter", label: "Inter", display: null, sans: null },
  { key: "mont-head", label: "Montserrat Überschriften", display: MONTSERRAT, sans: null },
  { key: "mont-all", label: "Montserrat überall", display: MONTSERRAT, sans: MONTSERRAT },
];

/** Override the font tokens on <html>; null keeps tokens.css. */
export function applyFont(f: FontChoice) {
  const s = document.documentElement.style;
  f.display ? s.setProperty("--font-display", f.display) : s.removeProperty("--font-display");
  f.sans ? s.setProperty("--font-sans", f.sans) : s.removeProperty("--font-sans");
}

export const BRAND_CHOICES: BrandChoice[] = [
  // Official logo greens (assets/logo/flach): V6a delivery spec, later grass-green version.
  { key: "V", hex: "#95c11f", label: "Logo V6a (Abgabe)" },
  { key: "R", hex: "#57a639", label: "Logo RAL 6018" },
  { key: "A", hex: "#6fa66c", label: "Blattgrün mittel" },
  { key: "B", hex: "#88c580", label: "Blattgrün hell" },
  { key: "C", hex: "#aeea9b", label: "Blattgrün Glanz" },
  { key: "D", hex: "#46a674", label: "Leucht-Kachel" },
  { key: "E", hex: "#66a57c", label: "Minze mittel" },
  { key: "F", hex: "#7ac79d", label: "Minze hell" },
  { key: "G", hex: "#92e0b7", label: "Minze Glanz" },
  { key: "Z", hex: "#4caf50", label: "alt (Material)" },
];

const BRAND_VARS = [
  "--brand",
  "--brand-hover",
  "--brand-active",
  "--brand-soft",
  "--brand-contrast",
  "--brand-ring",
] as const;

function luminance(hex: string): number {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = c.map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Text colour on a solid brand fill: whichever of white / ink reads better. */
export function contrastText(hex: string): string {
  return contrast(hex, "#ffffff") >= contrast(hex, "#0d1117") ? "#ffffff" : "#0d1117";
}

/** Override the brand tokens on <html>; null restores tokens.css values. */
export function applyBrand(hex: string | null, theme: Theme) {
  const s = document.documentElement.style;
  if (hex === null) {
    BRAND_VARS.forEach((v) => s.removeProperty(v));
    return;
  }
  const dark = theme === "dark-industrial";
  s.setProperty("--brand", hex);
  s.setProperty(
    "--brand-hover",
    dark ? `color-mix(in srgb, ${hex} 82%, white)` : `color-mix(in srgb, ${hex} 85%, black)`,
  );
  s.setProperty(
    "--brand-active",
    dark ? `color-mix(in srgb, ${hex} 90%, black)` : `color-mix(in srgb, ${hex} 72%, black)`,
  );
  s.setProperty(
    "--brand-soft",
    dark ? `color-mix(in srgb, ${hex} 15%, transparent)` : `color-mix(in srgb, ${hex} 12%, white)`,
  );
  s.setProperty("--brand-contrast", contrastText(hex));
  s.setProperty("--brand-ring", `0 0 0 3px color-mix(in srgb, ${hex} ${dark ? 35 : 28}%, transparent)`);
}
