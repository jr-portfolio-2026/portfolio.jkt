# Portfolio

Homepage base. React 19 · TypeScript · TanStack Start · Tailwind 4 · motion — the same stack and
design system as the original reference, without the Lovable build wrapper.
Builds to plain static HTML (prerendered), so it is fast, readable without JavaScript, and
deployable anywhere.

## Make it yours (nothing personal lives anywhere else)

| What | File |
|---|---|
| Name, initials, email, links, SEO, link-preview image | `src/content/site.ts` |
| Every sentence on the homepage, all section lists | `src/content/home.ts` |
| Colours, fonts, glass, paper textures | `src/styles.css` |
| One component per section | `src/components/home/*.tsx` |
| Section order | `src/components/home/PortfolioHome.tsx` |

## Commands

```
npm install
npm run dev             # local dev server
npm run build           # static site -> dist/client
npm run typecheck
npm run check:content   # lists every placeholder still to fill
npm run build:release   # refuses to build while placeholders remain
```

## Deploy (GitHub Pages)

1. Replace the repo contents with this project (keep `.github/`).
2. Repo → Settings → Pages → Source → **GitHub Actions**.
3. Push to `main`.

The workflow builds with npm into `dist/client`. It sets `BASE_PATH` automatically
(`/<repo>/` for project sites, `/` for `<user>.github.io`). The old Bun/`.output/public`
workflow must not be kept: it would fail and the site would 404.

## Verified

No overflow or clipped content at 360 / 390 / 768 / 1024 / 1440 px · mobile menu · anchors land below
the header · all text ≥ WCAG AA contrast · fully readable with JavaScript off · honours reduced
motion · 44 px tap targets · works from a sub-path.

## Not in this base (on purpose)

Welcome/intro sequence, project pages, demos, `og:image`. Project slots are in `home.ts`
(`live: true` + a `/work/<slug>` route turns a slot into a real link).
