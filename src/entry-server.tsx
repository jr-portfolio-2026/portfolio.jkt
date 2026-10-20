import { createMemoryHistory } from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import App from "./App";
import { projects } from "./content/projects";
import { BASEPATH, createAppRouter } from "./router";

export type HeadTag = Record<string, string>;

/** Every public URL that must exist as static HTML (paths are relative to the site base). */
export const prerenderPaths = ["/", ...projects.map((p) => `/work/${p.slug}/`)];

/** Renders one URL to HTML plus the head tags its route declared. */
export async function render(path: string, notFound = false) {
  const router = createAppRouter(createMemoryHistory({ initialEntries: [`${BASEPATH}${path}`] }));
  await router.load();
  const html = renderToString(<App router={router} />);
  const matches = router.state.matches;
  const meta: HeadTag[] = matches.flatMap((m) => (m.meta ?? []).filter(Boolean) as HeadTag[]);
  const links: HeadTag[] = matches.flatMap((m) => (m.links ?? []).filter(Boolean) as HeadTag[]);
  const isNotFound = matches.some((m) => m.status === "notFound") || notFound;
  return { html, meta, links, isNotFound };
}

export { site } from "./content/site";
