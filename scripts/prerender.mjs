// Turns the Vite output into real static pages: one HTML file per public URL with its own
// <title>, description, canonical and Open Graph tags and the page content already in the markup,
// plus 404.html, sitemap.xml and robots.txt. Runs after `vite build` and the SSR build.
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const ssrEntry = join(root, "dist-ssr", "entry-server.js");
if (!existsSync(join(dist, "index.html"))) throw new Error("dist/index.html is missing: run `vite build` first.");
if (!existsSync(ssrEntry)) throw new Error("dist-ssr/entry-server.js is missing: run the SSR build first.");

const { render, prerenderPaths, site } = await import(pathToFileURL(ssrEntry).href);
const template = readFileSync(join(dist, "index.html"), "utf8");
const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function headMarkup(meta, links) {
  const out = [];
  const seen = new Set();
  // later matches (the page) override earlier ones (the layout)
  for (const tag of [...meta].reverse()) {
    if (tag.title) { if (!seen.has("title")) { seen.add("title"); out.push(`<title>${esc(tag.title)}</title>`); } continue; }
    const key = tag.name ? `name:${tag.name}` : tag.property ? `property:${tag.property}` : null;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const attr = tag.name ? `name="${esc(tag.name)}"` : `property="${esc(tag.property)}"`;
    out.push(`<meta ${attr} content="${esc(tag.content ?? "")}" />`);
  }
  for (const l of links) out.push(`<link rel="${esc(l.rel)}" href="${esc(l.href)}" />`);
  return out.reverse().join("\n    ");
}

function page({ html, meta, links }, fallbackTitle) {
  const hasTitle = meta.some((m) => m.title);
  const head = hasTitle ? headMarkup(meta, links) : `<title>${esc(fallbackTitle)}</title>\n    <meta name="robots" content="noindex" />`;
  return template.replace("<!--app-head-->", head).replace("<!--app-html-->", html);
}

function write(file, content) {
  const target = join(dist, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

const urls = [];
for (const path of prerenderPaths) {
  const result = await render(path);
  if (result.isNotFound) throw new Error(`Prerender produced a not-found page for ${path}`);
  write(path === "/" ? "index.html" : `${path.replace(/^\//, "")}index.html`, page(result, site.meta.title));
  urls.push(path);
  console.log(`prerendered ${path}`);
}

// 404.html: GitHub Pages serves it for any unknown URL. Absolute asset paths make it work at any depth.
const nf = await render("/page-not-found/", true);
write("404.html", page(nf, "Page not found"));
console.log("prerendered 404.html");

const base = site.url.replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${base}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
write(".nojekyll", "");
rmSync(join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`done: ${urls.length} pages + 404.html + sitemap.xml`);
