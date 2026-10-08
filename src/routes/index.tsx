import { createFileRoute } from "@tanstack/react-router";
import { PortfolioHome } from "@/components/home/PortfolioHome";
import { site } from "@/content/site";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: site.meta.title },
      { name: "description", content: site.meta.description },
      { name: "author", content: site.name },
      { name: "theme-color", content: "#f6f3ec" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: site.meta.title },
      { property: "og:description", content: site.meta.description },
      ...(site.meta.ogImage ? [{ property: "og:image", content: `${base}${site.meta.ogImage}` }] : []),
      { name: "twitter:card", content: site.meta.ogImage ? "summary_large_image" : "summary" },
    ],
  }),
  component: PortfolioHome,
});
