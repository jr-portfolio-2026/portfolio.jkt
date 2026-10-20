import { site } from "@/content/site";

/**
 * The brand mark. Until a logo is approved this is the typographic mark from site.ts;
 * setting `site.logo.src` swaps in the image everywhere at once.
 */
export function Mark({ className = "" }: { className?: string }) {
  if (site.logo.src) {
    return <img src={`${import.meta.env.BASE_URL}${site.logo.src}`} alt={site.logo.alt} className={`h-7 w-auto ${className}`} />;
  }
  return <span className={`font-serif ${className}`}>{site.initials}</span>;
}
