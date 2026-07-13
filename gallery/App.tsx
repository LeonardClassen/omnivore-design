import { useEffect, useLayoutEffect, useState } from "react";
import { Gallery } from "./Gallery";
import { Tokens } from "./Tokens";

export type Theme = "light-cloud" | "dark-industrial";
type Route = "tokens" | "components";

function routeFromHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, "");
  return h === "components" ? "components" : "tokens";
}

// Shell: sticky topbar (brand · page nav · global theme toggle) + a hash router
// over the two pages. Theme lives here so BOTH pages re-theme from one switch.
export function App() {
  const [theme, setTheme] = useState<Theme>("dark-industrial");
  const [route, setRoute] = useState<Route>(routeFromHash());

  // Set [data-theme] in a LAYOUT effect (parent). React runs child passive
  // effects before parent ones, so this guarantees the attribute is in place
  // before the Tokens page's passive effect reads getComputedStyle.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <>
      <header className="gal-topbar">
        <div className="gal-brand">
          <div className="gal-brand-dot">O</div>
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

      {route === "components" ? <Gallery /> : <Tokens theme={theme} />}
    </>
  );
}
