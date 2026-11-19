import { useEffect, useLayoutEffect, useState } from "react";
import { Gallery, type Surface } from "./Gallery";
import { Tokens } from "./Tokens";
import { Examples } from "./Examples";
import { BRAND_CHOICES, applyBrand, contrastText } from "./brand";
import { Fly } from "./Fly";

export type Theme = "light-cloud" | "dark-industrial";
type Route = "tokens" | "components" | "examples";

function routeFromHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, "");
  return h === "components" || h === "examples" ? h : "tokens";
}

// Shell: sticky topbar (brand · page nav · global theme toggle) + a hash router
// over the two pages. Theme lives here so BOTH pages re-theme from one switch.
export function App() {
  const [theme, setTheme] = useState<Theme>("dark-industrial");
  const [route, setRoute] = useState<Route>(routeFromHash());
  const [brandKey, setBrandKey] = useState<string>(() => {
    try {
      return localStorage.getItem("omv-brand-pick") ?? "Z";
    } catch {
      return "Z";
    }
  });

  // Set [data-theme] in a LAYOUT effect (parent). React runs child passive
  // effects before parent ones, so this guarantees the attribute is in place
  // before the Tokens page's passive effect reads getComputedStyle.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Candidate brand green (gallery-only override; "Z" = tokens.css as is).
  useLayoutEffect(() => {
    const pick = BRAND_CHOICES.find((c) => c.key === brandKey);
    applyBrand(pick && pick.key !== "Z" ? pick.hex : null, theme);
    try {
      localStorage.setItem("omv-brand-pick", brandKey);
    } catch {
      /* storage blocked: pick just isn't remembered */
    }
  }, [brandKey, theme]);

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const surface: Surface = theme === "dark-industrial" ? "hmi" : "cloud";

  return (
    <>
      <header className="gal-topbar">
        <div className="gal-brand">
          <Fly height={36} dark={theme === "dark-industrial"} />
          <div>
            <div className="gal-brand-name">Omnivore Design System</div>
            <div className="gal-brand-sub">one token layer · two surfaces</div>
          </div>
        </div>

        <nav className="omv-tabs gal-nav">
          <a
            className={"omv-tab" + (route === "tokens" ? " is-active" : "")}
            href="#/tokens"
            style={{ textDecoration: "none" }}
          >
            Tokens
          </a>
          <a
            className={"omv-tab" + (route === "components" ? " is-active" : "")}
            href="#/components"
            style={{ textDecoration: "none" }}
          >
            Components
          </a>
          <a
            className={"omv-tab" + (route === "examples" ? " is-active" : "")}
            href="#/examples"
            style={{ textDecoration: "none" }}
          >
            Beispiele
          </a>
        </nav>

        <div className="omv-tabs gal-theme">
          <button
            className={"omv-tab" + (theme === "light-cloud" ? " is-active" : "")}
            onClick={() => setTheme("light-cloud")}
          >
            Light · Cloud
          </button>
          <button
            className={"omv-tab" + (theme === "dark-industrial" ? " is-active" : "")}
            onClick={() => setTheme("dark-industrial")}
          >
            Dark · Industrial
          </button>
        </div>
      </header>

      <div className="gal-greenbar">
        <span className="gal-greenbar-label">Brand-Grün</span>
        {BRAND_CHOICES.map((c) => (
          <button
            key={c.key}
            className={"gal-chip" + (brandKey === c.key ? " is-active" : "")}
            onClick={() => setBrandKey(c.key)}
            title={`${c.hex} · ${c.label}`}
          >
            <span className="gal-chip-sw" style={{ background: c.hex, color: contrastText(c.hex) }}>
              {c.key}
            </span>
            <span className="gal-chip-txt">
              {c.label}
              <small>{c.hex}</small>
            </span>
          </button>
        ))}
      </div>

      {route === "components" ? (
        <Gallery surface={surface} />
      ) : route === "examples" ? (
        <Examples theme={theme} setTheme={setTheme} />
      ) : (
        <Tokens theme={theme} />
      )}
    </>
  );
}
