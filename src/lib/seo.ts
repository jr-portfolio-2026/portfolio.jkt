import { site } from "@/content/site";

/** Absolute URL for a path inside the site, e.g. pageUrl("/work/fretio/"). */
export function pageUrl(path = "/") {
  return `${site.url.replace(/\/$/, "")}${path === "/" ? "/" : path}`;
}

export function assetUrl(path: string) {
  return `${site.url.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

type PageHead = { title: string; description: string; path: string; type?: "website" | "article" };

/** One place that turns page copy into title, description, canonical and Open Graph tags. */
export function pageHead({ title, description, path, type = "website" }: PageHead) {
  const url = pageUrl(path);
  const image = site.meta.ogImage ? assetUrl(site.meta.ogImage) : "";
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:site_name", content: site.name },
      { property: "og:type", content: type },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      ...(image
        ? [
            { property: "og:image", content: image },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
            { property: "og:image:alt", content: site.meta.ogImageAlt },
          ]
        : []),
      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
