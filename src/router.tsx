import { createRouter, type RouterHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/** Pathname prefix the site is served from, e.g. "/portfolio.jkt" (empty at the domain root). */
export const BASEPATH = import.meta.env.BASE_URL.replace(/\/$/, "");

export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    routeTree,
    history,
    // Must match Vite's `base`, otherwise links and refreshes break on GitHub Pages.
    basepath: BASEPATH || "/",
    // GitHub Pages serves /work/x/ from work/x/index.html, so every URL carries its trailing slash (matches the canonical).
    trailingSlash: "always",
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
