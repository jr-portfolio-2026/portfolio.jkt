// Minimal static server that behaves like GitHub Pages: serves dist/ under the base path,
// resolves directory index.html (301 to the trailing slash), and answers unknown URLs with 404.html + status 404.
// Usage: node scripts/serve-dist.mjs [port]   (BASE_PATH must match the build; default /portfolio.jkt/)
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const dist = resolve(import.meta.dirname, "..", "dist");
const base = process.env.BASE_PATH ?? "/portfolio.jkt/";
const port = Number(process.argv[2] ?? 4173);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff", ".xml": "application/xml", ".txt": "text/plain" };

export function start(p = port) {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://x");
    const send = (status, file) => {
      res.writeHead(status, { "content-type": types[extname(file)] ?? "application/octet-stream" });
      res.end(readFileSync(file));
    };
    if (!url.pathname.startsWith(base)) return send(404, join(dist, "404.html"));
    const rel = normalize(decodeURIComponent(url.pathname.slice(base.length))).replace(/^(\.\.[/\\])+/, "");
    const target = join(dist, rel);
    if (existsSync(target) && statSync(target).isDirectory()) {
      if (!url.pathname.endsWith("/")) { res.writeHead(301, { location: `${url.pathname}/` }); return res.end(); }
      if (existsSync(join(target, "index.html"))) return send(200, join(target, "index.html"));
    } else if (existsSync(target)) return send(200, target);
    else if (existsSync(`${target}.html`)) return send(200, `${target}.html`);
    return send(404, join(dist, "404.html"));
  });
  return new Promise((ok) => server.listen(p, () => ok(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await start();
  console.log(`serving dist at http://localhost:${port}${base}`);
}
