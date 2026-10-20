// Verifies the static output without a browser: expected files and routes, asset references,
// base path, per-page metadata, and that no forbidden framework is in the dependency list.
// Usage: npm run check:dist   (after `npm run build`; BASE_PATH must match the build, default /portfolio.jkt/)
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const base = process.env.BASE_PATH ?? "/portfolio.jkt/";
const failures = [];
const fail = (m) => failures.push(m);
const read = (f) => readFileSync(join(dist, f), "utf8");

// 1. Project slugs come from the content file, so adding a project adds a required route.
const slugs = [...readFileSync(join(root, "src/content/projects.ts"), "utf8").matchAll(/^\s{4}slug: "([a-z0-9-]+)"/gm)].map((m) => m[1]);
if (slugs.length === 0) fail("no project slugs found in src/content/projects.ts");
const pages = ["index.html", "404.html", ...slugs.map((s) => `work/${s}/index.html`)];
for (const f of [...pages, "sitemap.xml", "robots.txt", "favicon.svg", ".nojekyll"]) if (!existsSync(join(dist, f))) fail(`missing dist/${f}`);

// 2. Per-page checks.
const siteUrl = readFileSync(join(root, "src/content/site.ts"), "utf8").match(/url: "([^"]+)"/)?.[1]?.replace(/\/$/, "");
const titles = new Map();
for (const f of pages.filter((p) => existsSync(join(dist, p)))) {
  const html = read(f);
  const isNotFound = f === "404.html";
  if (html.includes("<!--app-")) fail(`${f}: template marker left in output`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  if (!title) fail(`${f}: no <title>`);
  else if (titles.has(title) && !isNotFound) fail(`${f}: title duplicates ${titles.get(title)}`);
  else titles.set(title, f);
  if (isNotFound) continue;
  if (!/<meta name="description" content="[^"]{20,}"/.test(html)) fail(`${f}: missing or short meta description`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical || !canonical.startsWith(`${siteUrl}/`)) fail(`${f}: canonical is not absolute under ${siteUrl}: ${canonical}`);
  const og = html.match(/property="og:url" content="([^"]+)"/)?.[1];
  if (og !== canonical) fail(`${f}: og:url (${og}) differs from canonical (${canonical})`);
  const img = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  if (!img) fail(`${f}: no og:image`);
  else if (!img.startsWith(`${siteUrl}/`)) fail(`${f}: og:image not absolute: ${img}`);
  else if (!existsSync(join(dist, img.slice(siteUrl.length + 1)))) fail(`${f}: og:image file missing in dist (${img})`);
  if (!/<h1[ >]/.test(html)) fail(`${f}: no <h1> in prerendered content`);
}

// 3. Every site-internal asset reference resolves to a file, and nothing points at the domain root.
const allHtml = pages.filter((p) => existsSync(join(dist, p)));
for (const f of allHtml) {
  const html = read(f);
  for (const m of html.matchAll(/(?:href|src)="([^"#?]+)"/g)) {
    const ref = m[1];
    if (/^(https?:|mailto:|data:|tel:)/.test(ref)) continue;
    if (!ref.startsWith(base)) { fail(`${f}: reference outside base ${base}: ${ref}`); continue; }
    const rel = ref.slice(base.length);
    const target = join(dist, rel);
    const ok = rel === "" || (existsSync(target) && (statSync(target).isFile() || existsSync(join(target, "index.html"))));
    if (!ok) fail(`${f}: broken reference ${ref}`);
  }
}

// 4. Fonts and css referenced from the stylesheet live under the base too.
for (const css of readdirSync(join(dist, "assets")).filter((n) => n.endsWith(".css"))) {
  for (const m of readFileSync(join(dist, "assets", css), "utf8").matchAll(/url\(([^)]+)\)/g)) {
    const u = m[1].replace(/["']/g, "");
    if (u.startsWith("data:")) continue;
    const target = u.startsWith("/") ? join(dist, u.slice(base.length)) : join(dist, "assets", u);
    if (!existsSync(target)) fail(`assets/${css}: broken url(${u})`);
  }
}

// 5. Sitemap lists exactly the indexable pages.
if (existsSync(join(dist, "sitemap.xml"))) {
  const locs = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const expected = ["/", ...slugs.map((s) => `/work/${s}/`)].map((p) => `${siteUrl}${p}`);
  for (const e of expected) if (!locs.includes(e)) fail(`sitemap.xml lacks ${e}`);
  if (locs.length !== expected.length) fail(`sitemap.xml has ${locs.length} URLs, expected ${expected.length}`);
}

// 6. Architecture guard: the agreed stack only.
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
for (const banned of ["next", "astro", "@tanstack/react-start", "nitro", "nitropack", "@lovable.dev/vite-tanstack-config"]) if (deps.includes(banned)) fail(`forbidden dependency: ${banned}`);
if (existsSync(join(root, "src/routes/__root.tsx")) && !existsSync(join(root, "src/main.tsx"))) fail("src/main.tsx missing");

if (failures.length) {
  console.error(`check:dist FAILED (${failures.length})\n` + failures.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log(`check:dist passed: ${allHtml.length} pages, base ${base}, ${slugs.length} projects.`);
