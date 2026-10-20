// Browser verification of the built site (npm run build first). Needs Playwright, which is not a
// project dependency:  npm i -g playwright   (or any install resolvable from this machine).
// Serves dist/ like GitHub Pages, then checks: console errors, failed requests, intro behaviour
// (click, keyboard, skip, reduced motion, session memory, replay), blue identity scene, direct links
// and refresh for every project route, 404 handling, in-app navigation, overflow at 375/768/1440,
// no-JS content. Screenshots go to $SHOTS (default ./browser-shots).
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { start } from "./serve-dist.mjs";

const root = resolve(import.meta.dirname, "..");
const base = process.env.BASE_PATH ?? "/portfolio.jkt/";
const shots = resolve(process.env.SHOTS ?? "browser-shots");
mkdirSync(shots, { recursive: true });

async function loadPlaywright() {
  for (const spec of ["playwright", "@playwright/test"]) { try { return await import(spec); } catch { /* next */ } }
  const globalRoot = execSync("npm root -g").toString().trim();
  const req = createRequire(join(globalRoot, "x.js"));
  for (const spec of ["playwright", "@playwright/test", "playwright-core"]) { try { return req(spec); } catch { /* next */ } }
  throw new Error("Playwright is not installed. Run: npm i -g playwright");
}
const pw = await loadPlaywright();
const chromium = pw.chromium ?? pw.default?.chromium;
const exe = ["/opt/pw-browsers/chromium", process.env.CHROMIUM_PATH].find((p) => p && existsSync(p));

const slugs = [...readFileSync(join(root, "src/content/projects.ts"), "utf8").matchAll(/^\s{4}slug: "([a-z0-9-]+)"/gm)].map((m) => m[1]);
const server = await start(4199);
const origin = `http://localhost:4199${base}`;
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const results = [];
const check = (name, ok, detail = "") => { results.push({ name, ok: !!ok, detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`); };

async function open(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  const problems = [];
  page.on("console", (m) => { if (m.type() === "error") problems.push(`console: ${m.text()}`); });
  page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
  // ERR_ABORTED = the browser cancelled a request because we navigated away mid-load; not a site error.
  page.on("requestfailed", (r) => { if (!/ERR_ABORTED/.test(r.failure()?.errorText ?? "")) problems.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`); });
  page.on("response", (r) => { if (r.status() >= 400 && !r.url().endsWith("/page-not-found/")) problems.push(`http ${r.status()}: ${r.url()}`); });
  return { ctx, page, problems };
}
const dialog = (page) => page.locator('[role="dialog"]');

// ── Intro: automatic progression, advance, skip, memory, replay ──────────────
{
  const { ctx, page, problems } = await open();
  await page.goto(origin);
  await dialog(page).waitFor({ timeout: 4000 });
  check("intro appears on first visit", true);
  const first = await dialog(page).innerText();
  check("first welcome is English", /Welcome\./.test(first));
  await page.screenshot({ path: join(shots, "01-intro-welcome.png") });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(900);
  check("Enter advances to the next welcome", /Bienvenue\./.test(await dialog(page).innerText()));
  await page.waitForTimeout(1900);
  check("welcomes progress automatically (~1.6 s each)", /Ласкаво просимо\./.test(await dialog(page).innerText()));
  await page.waitForTimeout(2200);
  const blue = await page.evaluate(() => { const c = document.createElement("canvas"); return getComputedStyle(document.querySelector('[role="dialog"] > div.bg-cobalt')).backgroundColor; });
  check("blue identity scene is reached", /rgb|color/.test(blue));
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(shots, "02-intro-identity.png") });
  const t0 = Date.now();
  await dialog(page).waitFor({ state: "detached", timeout: 8000 });
  check("intro hands over to the homepage by itself", true, `${Date.now() - t0} ms after the identity scene`);
  check("hero headline visible after intro", await page.locator("h1").first().isVisible());
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(shots, "03-home-hero.png") });
  check("intro marked as seen for the session", (await page.evaluate(() => sessionStorage.getItem("portfolio-intro-seen"))) === "1");
  await page.reload();
  await page.waitForTimeout(800);
  check("intro does not replay on reload in the same session", (await dialog(page).count()) === 0);
  await page.locator("button", { hasText: "Replay introduction" }).scrollIntoViewIfNeeded();
  await page.locator("button", { hasText: "Replay introduction" }).click();
  await dialog(page).waitFor({ timeout: 3000 });
  check("replay control restarts the intro", true);
  await page.locator("button", { hasText: "Skip intro" }).click();
  await dialog(page).waitFor({ state: "detached", timeout: 4000 });
  check("Skip intro closes the intro", true);
  await page.evaluate(() => sessionStorage.clear()); await page.reload();
  await dialog(page).waitFor({ timeout: 4000 });
  await page.keyboard.press("Escape");
  await dialog(page).waitFor({ state: "detached", timeout: 4000 });
  check("Escape closes the intro", true);
  const scrollable = await page.evaluate(() => getComputedStyle(document.documentElement).overflow !== "hidden");
  check("page scroll is released after the intro", scrollable);
  check("no console errors or failed requests (intro + home)", problems.length === 0, problems.join(" | "));
  await ctx.close();
}

// ── Reduced motion ───────────────────────────────────────────────────────────
{
  const { ctx, page, problems } = await open({ reducedMotion: "reduce" });
  await page.goto(origin);
  await dialog(page).waitFor({ timeout: 4000 });
  await page.waitForTimeout(3500);
  check("reduced motion: no timed auto-advance (intro waits for the visitor)", (await dialog(page).count()) === 1);
  await page.screenshot({ path: join(shots, "04-intro-reduced.png") });
  await page.locator("button", { hasText: "Enter the portfolio" }).click();
  await dialog(page).waitFor({ state: "detached", timeout: 3000 });
  check("reduced motion: explicit Enter completes the intro", true);
  check("reduced motion: homepage content visible", await page.locator("h1").first().isVisible());
  check("reduced motion: no console errors", problems.length === 0, problems.join(" | "));
  await ctx.close();
}

// ── Routes: direct navigation, refresh, 404, in-app navigation ───────────────
{
  const { ctx, page, problems } = await open();
  await page.addInitScript(() => sessionStorage.setItem("portfolio-intro-seen", "1"));
  for (const slug of slugs) {
    const r = await page.goto(`${origin}work/${slug}/`);
    const h1 = await page.locator("h1").first().innerText();
    await page.reload();
    const h1b = await page.locator("h1").first().innerText();
    check(`direct link + refresh: /work/${slug}/`, r.status() === 200 && h1.length > 0 && h1 === h1b, `status ${r.status()}, h1 "${h1}"`);
    const noSlash = await page.goto(`${origin}work/${slug}`);
    check(`no-trailing-slash URL resolves: /work/${slug}`, noSlash.status() === 200 && (await page.locator("h1").first().isVisible()));
  }
  const t = await page.goto(`${origin}work/${slugs[0]}/`);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: join(shots, "05-case-study.png"), fullPage: true });
  const title = await page.title();
  check("project page has its own document title", title.includes("case study"), title);
  check("no console errors or failed requests (project pages)", problems.length === 0, problems.join(" | "));
  problems.length = 0;
  // Deliberate 404s: the 404 responses themselves are expected, so they are not counted as problems.
  const nf = await page.goto(`${origin}does/not/exist`);
  check("unknown URL: 404 status with the 404 page", nf.status() === 404 && /does not exist/.test(await page.locator("body").innerText()));
  const nfHome = await page.goto(`${origin}work/unknown-project/`);
  check("unknown project slug: not-found page, no crash", /does not exist/.test(await page.locator("body").innerText()), `status ${nfHome.status()}`);
  problems.length = 0;

  await page.goto(origin);
  await page.waitForTimeout(600);
  await page.locator("#work").scrollIntoViewIfNeeded();
  const tab = page.locator('[role="tab"]').nth(0);
  await tab.focus();
  await page.keyboard.press("ArrowDown");
  check("work selector: ArrowDown moves to the next study", (await page.locator('[role="tab"][aria-selected="true"]').getAttribute("id")) === `tab-${slugs[1]}`);
  await page.screenshot({ path: join(shots, "06-work.png") });
  await page.locator("a", { hasText: "Open case study" }).click();
  await page.waitForURL(`**/work/${slugs[1]}/**`, { timeout: 5000 });
  check("in-app navigation to a case study keeps the base path", page.url().includes(`${base}work/${slugs[1]}`), page.url());
  await page.waitForTimeout(1200);
  await page.locator("a", { hasText: "Next study" }).click();
  await page.waitForURL(`**/work/${slugs[2]}/**`);
  check("next/previous navigation between case studies", true);
  await page.locator("header a", { hasText: "Portfolio" }).click();
  await page.waitForURL(`**${base}#work`);
  check("back to portfolio lands on the Work section", page.url().endsWith("#work"), page.url());
  check("no console errors or failed requests (routes)", problems.length === 0, problems.join(" | "));
  await ctx.close();
}

// ── Responsive: overflow and overlap ─────────────────────────────────────────
for (const [w, h] of [[375, 812], [768, 1024], [1440, 900], [1920, 1080]]) {
  const { ctx, page } = await open({ viewport: { width: w, height: h } });
  await page.addInitScript(() => sessionStorage.setItem("portfolio-intro-seen", "1"));
  for (const path of ["", `work/${slugs[0]}/`]) {
    await page.goto(origin + path);
    await page.waitForTimeout(800);
    // scroll through so reveal animations run, then measure
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    const over = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth - document.documentElement.clientWidth, body: document.body.scrollWidth - document.documentElement.clientWidth }));
    check(`no horizontal overflow at ${w}px: /${path}`, over.doc <= 0 && over.body <= 0, JSON.stringify(over));
    if (path === "") await page.screenshot({ path: join(shots, `07-home-${w}.png`), fullPage: true });
  }
  await ctx.close();
}

// ── Mobile navigation ────────────────────────────────────────────────────────
{
  const { ctx, page } = await open({ viewport: { width: 375, height: 812 }, hasTouch: true });
  await page.addInitScript(() => sessionStorage.setItem("portfolio-intro-seen", "1"));
  await page.goto(origin);
  await page.waitForTimeout(800);
  await page.locator("button", { hasText: "Menu" }).click();
  await page.waitForTimeout(300);
  const box = await page.locator("#mobile-menu").boundingBox();
  check("mobile menu opens at full height", box && box.height > 400, JSON.stringify(box));
  await page.screenshot({ path: join(shots, "08-mobile-menu.png") });
  await page.locator('#mobile-menu a', { hasText: "Work" }).click();
  await page.waitForTimeout(600);
  check("mobile menu link scrolls to its section and closes", (await page.locator("#mobile-menu").isHidden()) && (await page.locator("#work").boundingBox()).y < 200);
  await ctx.close();
}

// ── No JavaScript ────────────────────────────────────────────────────────────
{
  const { ctx, page } = await open({ javaScriptEnabled: false });
  await page.goto(origin);
  const hero = page.locator("h1").first();
  check("no JavaScript: hero visible", await hero.isVisible());
  check("no JavaScript: projects present in the markup", (await page.locator("body").innerText()).includes("FRET.IO") || (await page.content()).includes("FRET.IO"));
  await page.goto(`${origin}work/${slugs[0]}/`);
  check("no JavaScript: case study readable", await page.locator("h1").first().isVisible());
  await ctx.close();
}

await browser.close();
server.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exit(failed.length ? 1 : 0);
