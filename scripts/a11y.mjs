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

await browser.close();
await server.close();
console.log(`\n${total} violating node(s) across ${CASES.length} screens`);
process.exit(total ? 1 : 0);
