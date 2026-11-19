// Accessibility gate: runs axe-core (WCAG 2.0/2.1/2.2 A + AA) against every
// gallery page in both themes, including the example screens and an open modal.
// Usage: npm run a11y        (exit 1 on any violation)
import { createServer } from "vite";
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const AXE = readFileSync(fileURLToPath(new URL("../node_modules/axe-core/axe.min.js", import.meta.url)), "utf8");
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const server = await createServer({
  configFile: fileURLToPath(new URL("../vite.config.ts", import.meta.url)),
  server: { port: 5199, strictPort: true },
  logLevel: "silent",
});
await server.listen();
const base = "http://localhost:5199/omnivore-design/";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
// The HMI panel is offline: every font must come from this repo, never a CDN.
const external = [];
await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => { external.push(r.request().url()); return r.abort(); });

// Each case: [name, setup(page)] — setup navigates and brings the screen into the state to check.
const theme = (label) => async (p) => p.getByRole("button", { name: label, exact: true }).click();
const CASES = [];
for (const [themeName, themeBtn] of [["dark", "Dark · Industrial"], ["light", "Light · Cloud"]]) {
  CASES.push([`${themeName} tokens`, async (p) => { await p.goto(base + "#/tokens"); await theme(themeBtn)(p); }]);
  CASES.push([`${themeName} components`, async (p) => { await p.goto(base + "#/components"); await theme(themeBtn)(p); }]);
}
CASES.push(["hmi cockpit", async (p) => { await p.goto(base + "#/examples"); await theme("Dark · Industrial")(p); }]);
for (const tab of ["Regal", "Klima", "Wartung"]) {
  CASES.push([`hmi ${tab.toLowerCase()}`, async (p) => { await p.getByRole("button", { name: tab, exact: true }).click(); }]);
}
CASES.push(["cloud plants", async (p) => { await theme("Light · Cloud")(p); }]);
CASES.push(["cloud order modal", async (p) => {
  await p.getByRole("button", { name: "Neuer Auftrag" }).first().click();
}]);

let total = 0;
for (const [name, setup] of CASES) {
  await setup(page);
  await page.waitForTimeout(250);
  await page.addScriptTag({ content: AXE });
  const result = await page.evaluate(async (tags) => {
    // eslint-disable-next-line no-undef
    const r = await axe.run(document, { runOnly: { type: "tag", values: tags } });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes[0]?.failureSummary?.split("\n")[1]?.trim() ?? "" }));
  }, TAGS);
  total += result.reduce((s, v) => s + v.n, 0);
  console.log(`${result.length ? "FAIL" : "ok  "} ${name}`);
  for (const v of result) console.log(`     ${v.id} (${v.impact}) x${v.n}  ${v.sample}`);
}

// ---- Contract checks axe cannot see (WAI-ARIA APG patterns) ----------------
const fails = [];
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "FAIL"} ${msg}`); if (!ok) fails.push(msg); };
await page.goto(base + "#/examples");
await page.reload(); // a hash change alone keeps the open modal from the last case
await theme("Light · Cloud")(page);
await page.waitForTimeout(250);

const bars = await page.locator(".omv-progress").count();
const barsOk = await page.locator('.omv-progress[role="progressbar"][aria-valuenow][aria-valuemin="0"][aria-valuemax="100"]').count();
check(bars > 0 && bars === barsOk, `Progress exposes role=progressbar + value (${barsOk}/${bars})`);

const tables = await page.locator(".omv-table").count();
const tablesOk = await page.locator('.omv-table[role="table"]').count();
const headers = await page.locator('.omv-table [role="columnheader"]').count();
const cells = await page.locator('.omv-table [role="cell"]').count();
check(tables > 0 && tables === tablesOk && headers > 0 && cells > 0, `Table exposes table/row/columnheader/cell roles (${tablesOk}/${tables}, ${headers} headers, ${cells} cells)`);

const clickRows = page.locator('.omv-trow[tabindex="0"]');
check((await clickRows.count()) > 0, `clickable table rows are keyboard-focusable (${await clickRows.count()})`);
if (await clickRows.count()) {
  await clickRows.nth(2).focus();
  await page.keyboard.press("Enter");
  const title = await page.locator(".omv-card-title").nth(1).textContent();
  check(title?.includes("SN-000243") ?? false, `Enter on a focused row selects it (detail shows "${title}")`);
}

const firstTab = page.locator('.ex-cloud-tabs [role="tab"]').first();
await firstTab.focus();
await page.keyboard.press("ArrowRight");
const focusedTab = await page.evaluate(() => document.activeElement?.textContent ?? "");
check(focusedTab.startsWith("Aufträge"), `ArrowRight moves focus to the next tab (focused: "${focusedTab}")`);
const tabStops = await page.locator('.ex-cloud-tabs [role="tab"][tabindex="0"]').count();
check(tabStops === 1, `tablist has exactly one tab stop (roving tabindex: ${tabStops})`);

await page.getByRole("tab", { name: "Anlagen" }).click();
const opener = page.getByRole("button", { name: "Neuer Auftrag" }).first();
await opener.focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(100);
const inDialog = await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'));
check(inDialog, "opening the modal moves focus into the dialog");
await page.keyboard.press("Escape");
await page.waitForTimeout(100);
const back = await page.evaluate(() => document.activeElement?.textContent ?? "");
check(back.includes("Neuer Auftrag"), `closing the modal returns focus to its opener (focused: "${back}")`);

// Fonts load from the repo (offline panel).
const fonts = await page.evaluate(async () => {
  await document.fonts.ready;
  return ["600 16px Montserrat", "400 14px Inter", "400 14px \"JetBrains Mono\""].map((f) => [f, document.fonts.check(f) && [...document.fonts].some((ff) => f.includes(ff.family.replace(/"/g, "")) && ff.status === "loaded")]);
});
for (const [f, ok] of fonts) check(ok, `font loaded locally: ${f}`);
check(external.length === 0, `no font requests to Google (${external.length})`);

// Reduced motion: transitions and the skeleton shimmer stop.
await page.emulateMedia({ reducedMotion: "reduce" });
const motion = await page.evaluate(() => {
  const btn = document.querySelector(".omv-btn");
  return btn ? getComputedStyle(btn).transitionDuration : "none";
});
check(motion.split(",").every((d) => parseFloat(d) <= 0.01), `prefers-reduced-motion stops transitions (button: ${motion})`);
await page.emulateMedia({ reducedMotion: "no-preference" });

// Forced colors (Windows high contrast): focus rings drawn with box-shadow vanish,
// so focusable controls need a real outline there.
await page.emulateMedia({ forcedColors: "active" });
await page.getByRole("tab", { name: "Anlagen" }).focus();
await page.keyboard.press("ArrowRight");
const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
check(outline !== "none", `forced-colors: focused tab keeps a visible outline (${outline})`);
await page.emulateMedia({ forcedColors: "none" });

await browser.close();
await server.close();
console.log(`\n${total} violating node(s) across ${CASES.length} screens; ${fails.length} contract check(s) failed`);
process.exit(total || fails.length ? 1 : 0);
