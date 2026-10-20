# Portfolio II

A static portfolio template: **React 19 · TypeScript · Vite · TanStack Router · Motion · Tailwind CSS 4**,
built to plain HTML/JS/CSS in `dist/` and published with GitHub Actions to GitHub Pages.
There is no application server, no TanStack Start, no Next.js/Astro/Nitro and no Lovable build wrapper.

## How it is built

```
index.html ─ src/main.tsx ─ src/App.tsx ─ RouterProvider ─ src/routes/*
```

| Step | What it does |
|---|---|
| `vite build` | Client bundle into `dist/`. The TanStack Router plugin regenerates `src/routeTree.gen.ts` (never edit it). |
| `vite build --ssr src/entry-server.tsx` | Renders the same routes to HTML in Node. |
| `scripts/prerender.mjs` | Writes one real HTML file per public URL (`dist/index.html`, `dist/work/<slug>/index.html`) with its own title, description, canonical and Open Graph tags, plus `404.html`, `sitemap.xml`, `robots.txt`. Crawlers and link previews therefore see content without running JavaScript. The browser app replaces that markup on load (it does not hydrate it). |

Public URLs are `prerenderPaths` in `src/entry-server.tsx`, derived from `src/content/projects.ts`.

## Make it yours: nothing personal lives outside `src/content/`

| What | File |
|---|---|
| Name, initials, email, links, logo, portrait, SEO and preview image | `src/content/site.ts` |
| Every sentence of the homepage | `src/content/home.ts` |
| Introduction wording and timings (about 1.6 s per welcome) | `src/content/intro.ts` |
| Projects and case studies (one object each) | `src/content/projects.ts` |
| Colours (one palette block), fonts, textures | `src/styles.css` |
| Section order | `src/components/home/PortfolioHome.tsx` |

**Add a project:** add one object to `projects` in `src/content/projects.ts`. The homepage list, its keyboard selector,
the case-study page, previous/next navigation, the prerendered URL and the sitemap entry all follow.
Add `cover` only for a real image; without one a typographic plate is drawn.
`kind` must say what the work actually is (working application, guided demonstration, prototype, concept, academic exercise).

## Commands

```
npm ci
npm run dev             # local development server (base path /portfolio.jkt/)
npm run typecheck
npm run build           # client + SSR + prerender  ->  dist/
npm run check:dist      # static output: routes, assets, base path, metadata, forbidden dependencies
npm run check:content   # TEMPLATE PREVIEW mode: lists open items, exits 0
npm run build:release   # CLIENT RELEASE mode: refuses to build while any open item remains
npm run preview         # serve dist/ locally
node scripts/serve-dist.mjs   # serve dist/ like GitHub Pages (404.html, directory index)
npm run test:browser    # Playwright checks against dist/ (needs: npm i -g playwright)
```

Base path: `BASE_PATH` (the workflow sets it from the repository name; default `/portfolio.jkt/`).

## Template and client modes

*Template preview* builds with placeholders so a generic demo always works. *Client release* (`build:release`)
fails while the email is `example.com`, any project is `reviewed: false`, the preview image or links are missing, and so on.
Identity values written into components fail **both** modes.
Before distributing the template, remove client history and any licensed or confidential assets (logo, portrait, covers).

## Deploy

Settings → Pages → **Source: GitHub Actions** (not "Deploy from a branch"). The workflow in `.github/workflows/deploy.yml`
runs `npm ci`, typecheck, content check, build, `check:dist`, then publishes `dist/`.
If the build is run for a different repository name, `site.url` in `src/content/site.ts` must match the final address.

## Introduction

Ivory welcomes (EN, FR, UK) → saturated blue identity scene → the page lifts into view. Automatic progression,
click / tap / Enter advances, **Skip intro** and Escape always close it, a fail-safe timer closes it after 20 s,
once per browser session, and **Replay introduction** in the footer restarts it.
With `prefers-reduced-motion` there is no timed cycling: one static scene and an explicit **Enter the portfolio** button.
