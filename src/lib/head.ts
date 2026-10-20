type Tag = Record<string, string>;

/** Applies a route's title, meta and canonical to the live document (client side). */
export function applyHead(meta: Tag[], links: Tag[]) {
  if (typeof document === "undefined") return;
  for (const tag of meta) {
    if ("title" in tag && tag["title"]) {
      document.title = tag["title"];
      continue;
    }
    const key = tag["name"] ? "name" : tag["property"] ? "property" : "";
    if (!key) continue;
    const id = tag[key] as string;
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${key}="${id}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(key, id);
      document.head.appendChild(el);
    }
    el.setAttribute("content", tag["content"] ?? "");
  }
  for (const tag of links) {
    const rel = tag["rel"];
    if (!rel) continue;
    let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      document.head.appendChild(el);
    }
    el.setAttribute("href", tag["href"] ?? "");
  }
}
