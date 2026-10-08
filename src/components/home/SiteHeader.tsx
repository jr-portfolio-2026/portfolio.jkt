import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { home } from "@/content/home";
import { site } from "@/content/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-navy/5 bg-ivory/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-6 md:px-10">
          <a
            href="#top"
            className="inline-flex h-11 items-center font-serif text-2xl text-relief"
            aria-label={`${site.name}, back to top`}
            onClick={() => setOpen(false)}
          >
            {site.initials}
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
            {home.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="meta-label opacity-70 transition-opacity hover:opacity-100"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <span className="meta-soft hidden lg:block">Portfolio / {site.year}</span>

          <button
            type="button"
            className="meta-label -mr-2 inline-flex h-11 items-center gap-2 px-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {/* Sibling of <header>, not a child: backdrop-filter on the header would otherwise
        become the containing block for this fixed panel and collapse it to 64px. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-ivory px-6 pb-10 pt-8 lg:hidden"
      >
        <nav aria-label="Mobile navigation" className="flex flex-col">
          {home.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-navy/10 py-5 font-serif text-4xl font-light text-relief"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a href={`mailto:${site.email}`} className="meta-label mt-10 block break-all">
          {site.email}
        </a>
      </div>
    </>
  );
}
