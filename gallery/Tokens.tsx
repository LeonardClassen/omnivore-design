import { useEffect, useState, type ReactNode, type CSSProperties } from "react";
import type { Theme } from "./App";

/* =========================================================================
   Tokens page — the framework-neutral design truth. Every printed value is
   read LIVE from tokens.css via getComputedStyle (per active [data-theme]),
   so this page can never drift from the token source. Only token NAMES and
   swatch labels live here; VALUES are never hand-transcribed.
   ========================================================================= */

const COLOR_GROUPS: { label: string; tokens: [string, string][] }[] = [
  {
    label: "Brand — interactive only",
    tokens: [
      ["--brand", "brand"],
      ["--brand-hover", "brand-hover"],
      ["--brand-active", "brand-active"],
      ["--brand-soft", "brand-soft"],
      ["--brand-contrast", "brand-contrast"],
    ],
  },
  {
    label: "State — reserved for status meaning",
    tokens: [
      ["--ok", "ok"],
      ["--warn", "warn"],
      ["--err", "err"],
      ["--info", "info"],
      ["--ok-soft", "ok-soft"],
      ["--warn-soft", "warn-soft"],
      ["--err-soft", "err-soft"],
      ["--info-soft", "info-soft"],
    ],
  },
  {
    label: "Surfaces & text",
    tokens: [
      ["--bg", "bg (canvas)"],
      ["--surface", "surface"],
      ["--surface-raised", "surface-raised"],
      ["--text", "text"],
      ["--text-secondary", "text-secondary"],
      ["--text-tertiary", "text-tertiary"],
    ],
  },
  {
    label: "Borders",
    tokens: [
      ["--border", "border"],
      ["--border-light", "border-light"],
      ["--border-strong", "border-strong"],
    ],
  },
];

const SPACES: [string, string][] = [
  ["--space-1", "1"], ["--space-2", "2"], ["--space-3", "3"], ["--space-4", "4"],
  ["--space-6", "6"], ["--space-8", "8"], ["--space-12", "12"], ["--space-16", "16"],
];
const RADII: [string, string][] = [
  ["--radius-sm", "sm"], ["--radius-md", "md"], ["--radius-lg", "lg"],
  ["--radius-xl", "xl"], ["--radius-2xl", "2xl"],
];
const SHADOWS: [string, string][] = [
  ["--shadow-sm", "sm"], ["--shadow-md", "md"], ["--shadow-lg", "lg"], ["--shadow-xl", "xl"],
];
const DURATIONS: [string, string][] = [
  ["--dur-fast", "fast"], ["--dur-base", "base"], ["--dur-slow", "slow"],
];
const TYPE_ROWS: { tag: string; cls: string; text: string }[] = [
  { tag: "h1 · 30", cls: "omv-h1", text: "Feedlot overview" },
  { tag: "h2 · 24", cls: "omv-h2", text: "Container lifecycle" },
  { tag: "h3 · 18", cls: "omv-h3", text: "Commissioning wizard" },
  { tag: "body · 14", cls: "omv-body", text: "The quick brown fox feeds the larvae over the lazy dog." },
  { tag: "meta · 13", cls: "omv-meta", text: "Last sync 2 minutes ago · node PFC300" },
  { tag: "caption · 12", cls: "omv-caption", text: "Read-only telemetry, updated at 1 Hz" },
  { tag: "eyebrow", cls: "omv-eyebrow", text: "Section label" },
  { tag: "mono", cls: "omv-mono", text: "SN-OMV-000241 · %IW9 · 42.7 kg" },
];

// Every token whose live value we print — stable module-level reference so the
// read effect only re-runs on theme change.
const READ_NAMES: string[] = [
  ...COLOR_GROUPS.flatMap((g) => g.tokens.map((t) => t[0])),
  ...SPACES.map((s) => s[0]),
  ...RADII.map((r) => r[0]),
  ...DURATIONS.map((d) => d[0]),
];

function useLiveTokenValues(theme: Theme): Record<string, string> {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    // rAF: read AFTER the browser has applied the new [data-theme] styles.
    const raf = requestAnimationFrame(() => {
      const cs = getComputedStyle(document.documentElement);
      const next: Record<string, string> = {};
      for (const name of READ_NAMES) next[name] = cs.getPropertyValue(name).trim();
      setValues(next);
    });
    return () => cancelAnimationFrame(raf);
  }, [theme]);
  return values;
}

/* ---- gallery chrome (not part of the library) ---------------------------- */
function Block({ num, title, sub, children }: { num: string; title: string; sub: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 56 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
        <span className="omv-mono" style={{ fontSize: 12, color: "var(--brand)" }}>{num}</span>
        <h2 className="omv-h3">{title}</h2>
      </div>
      <p className="omv-meta" style={{ margin: "0 0 22px", maxWidth: "68ch" }}>{sub}</p>
      {children}
    </section>
  );
}

function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: 24,
        boxShadow: "var(--shadow-sm)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Label({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="omv-eyebrow" style={{ color: "var(--text-tertiary)", marginBottom: 10, ...style }}>
      {children}
    </div>
  );
}

function Swatch({ token, name, value }: { token: string; name: string; value?: string }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--surface)" }}>
      <div style={{ height: 62, background: `var(${token})` }} />
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{name}</div>
        <div className="omv-mono" style={{ fontSize: 11, color: "var(--text-secondary)" }}>var({token})</div>
        <div className="omv-mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{value || "—"}</div>
      </div>
    </div>
  );
}

function MotionSwatch({ token, name, value }: { token: string; name: string; value?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ width: 150, cursor: "pointer" }}
    >
      <div
        style={{
          height: 54,
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          background: hover ? "var(--brand)" : "var(--surface-raised)",
          transition: `background var(${token}) var(--ease-out)`,
        }}
      />
      <div className="omv-mono" style={{ fontSize: 12, marginTop: 6, color: "var(--text-secondary)" }}>{name} · {token.replace("--", "")}</div>
      <div className="omv-mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{value || "—"}</div>
    </div>
  );
}

const SWATCH_GRID: CSSProperties = { display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" };
const TG_CARD: CSSProperties = { border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 18 };
const TG_ROLE: CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: "var(--tracking-caps)", textTransform: "uppercase" };
const DD_TAG: CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 10 };

export function Tokens({ theme }: { theme: Theme }) {
  const v = useLiveTokenValues(theme);

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 28px 96px" }}>
      <h1 className="omv-h1">One brand, two surfaces.</h1>
      <p className="omv-body" style={{ color: "var(--text-secondary)", maxWidth: "64ch", marginTop: 8 }}>
        A single framework-neutral token layer (<span className="omv-mono">tokens.css</span>) drives both the
        customer-ops <strong>cloud dashboard</strong> (light) and the industrial <strong>HMI</strong> on the WAGO
        panel (dark). Flip the theme switch above — every value below re-reads from the same tokens. Nothing is
        hard-coded: the printed values come straight from <span className="omv-mono">getComputedStyle</span>.
      </p>

      {/* 01 — brand & the two greens */}
      <Block
        num="01"
        title="Brand & the two greens"
        sub="Green is the one company accent — but a green button must never read as an 'OK' status on the dark panel. So brand and status are two different green tokens, split by role."
      >
        <Panel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div style={TG_CARD}>
              <div style={{ height: 54, borderRadius: "var(--radius-md)", marginBottom: 12, background: "var(--brand)" }} />
              <div style={{ ...TG_ROLE, color: "var(--brand-active)" }}>Interactive</div>
              <div style={{ fontWeight: 600, margin: "2px 0 4px", color: "var(--text)" }}><span className="omv-mono">--brand</span></div>
              <div className="omv-meta">Primary CTAs · focus rings · selected/active · links · brand marks. Never status.</div>
            </div>
            <div style={TG_CARD}>
              <div style={{ height: 54, borderRadius: "var(--radius-md)", marginBottom: 12, background: "var(--ok)" }} />
              <div style={{ ...TG_ROLE, color: "var(--ok)" }}>Status</div>
              <div style={{ fontWeight: 600, margin: "2px 0 4px", color: "var(--text)" }}><span className="omv-mono">--ok</span></div>
              <div className="omv-meta">"Running / healthy / present" — LEDs and status pills only. Never interaction.</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 14 }}>
              <div style={{ ...DD_TAG, color: "var(--ok)" }}>✓ Correct</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <button className="omv-btn omv-btn-primary omv-btn-sm">Approve</button>
                <span className="omv-led"><span className="omv-led-dot is-ok" />Operational</span>
              </div>
            </div>
            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: 14 }}>
              <div style={{ ...DD_TAG, color: "var(--err)" }}>✕ Wrong</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <button className="omv-btn omv-btn-sm" style={{ background: "var(--ok)", color: "#062b1e" }}>Approve</button>
                <span className="omv-led">
                  <span className="omv-led-dot" style={{ background: "var(--brand)", boxShadow: "0 0 7px color-mix(in srgb, var(--brand) 65%, transparent)" }} />
                  Operational
                </span>
              </div>
            </div>
          </div>
        </Panel>
      </Block>

      {/* 02 — color tokens */}
      <Block num="02" title="Color tokens" sub="Semantic roles. Values swap per theme; names never do.">
        {COLOR_GROUPS.map((g) => (
          <div key={g.label} style={{ marginBottom: 22 }}>
            <Label>{g.label}</Label>
            <div style={SWATCH_GRID}>
              {g.tokens.map(([tok, nm]) => (
                <Swatch key={tok} token={tok} name={nm} value={v[tok]} />
              ))}
            </div>
          </div>
        ))}
      </Block>

      {/* 03 — typography */}
      <Block num="03" title="Typography" sub="Inter for UI, JetBrains Mono for serials, codes and live numbers.">
        <Panel>
          {TYPE_ROWS.map((r, i) => (
            <div
              key={r.tag}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                padding: "10px 0",
                borderBottom: i < TYPE_ROWS.length - 1 ? "1px solid var(--border-light)" : "0",
              }}
            >
              <span className="omv-mono" style={{ fontSize: 11, color: "var(--text-tertiary)", width: 78, flex: "0 0 auto" }}>{r.tag}</span>
              <span className={r.cls}>{r.text}</span>
            </div>
          ))}
        </Panel>
      </Block>

      {/* 04 — spacing / radii / elevation */}
      <Block num="04" title="Spacing · radii · elevation" sub="A 4px spacing grid, a 6–20px radius ramp, and multi-layer low-opacity shadows.">
        <Panel style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <Label>Spacing — 4px grid</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SPACES.map(([tok]) => (
                <div key={tok} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <span className="omv-mono" style={{ width: 92, color: "var(--text-secondary)", fontSize: 12 }}>{tok.replace("--", "")}</span>
                  <div style={{ height: 14, borderRadius: 3, background: "var(--brand)", width: `var(${tok})` }} />
                  <span className="omv-mono" style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{v[tok] || "—"}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Radii</Label>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {RADII.map(([tok, nm]) => (
                <div
                  key={tok}
                  style={{
                    width: 96,
                    height: 60,
                    background: "var(--brand-soft)",
                    border: "1.5px solid var(--brand)",
                    borderRadius: `var(${tok})`,
                    display: "grid",
                    placeItems: "end center",
                    paddingBottom: 6,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--brand-active)",
                  }}
                >
                  {nm} · {v[tok] || "—"}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Elevation</Label>
            <div style={SWATCH_GRID}>
              {SHADOWS.map(([tok, nm]) => (
                <div
                  key={tok}
                  style={{
                    height: 84,
                    background: "var(--surface)",
                    border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius-lg)",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--text-tertiary)",
                    boxShadow: `var(${tok})`,
                  }}
                >
                  {nm}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </Block>

      {/* 05 — motion */}
      <Block num="05" title="Motion" sub="Refined, never instant — 120 / 180 / 240 ms with an ease-out curve. Hover a swatch to feel the duration.">
        <Panel>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {DURATIONS.map(([tok, nm]) => (
              <MotionSwatch key={tok} token={tok} name={nm} value={v[tok]} />
            ))}
          </div>
        </Panel>
      </Block>

      <footer style={{ marginTop: 72, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        <p className="omv-meta" style={{ margin: 0 }}>
          <strong style={{ color: "var(--text)" }}>tokens.css</strong> + <strong style={{ color: "var(--text)" }}>components.css</strong> are the API — this page is the mirror. Consume the repo as a git submodule, pinned per app.
        </p>
      </footer>
    </div>
  );
}
