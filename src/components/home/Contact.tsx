import { home } from "@/content/home";
import { site } from "@/content/site";

export function Contact() {
  const c = home.contact;
  const links = [
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "GitHub", href: site.links.github },
  ].filter((l) => l.href);

  return (
    <section id="contact" className="px-6 pb-8 pt-16 md:px-10 md:pt-36">
      <div className="mx-auto max-w-[90rem] border-t border-navy/10 pt-14 md:pt-16">
        <span className="meta-label text-[oklch(0.5_0.09_80)]">{c.index} / {c.label}</span>
        <div className="mt-8 grid gap-12 md:mt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-14">
          <div>
            <h2 className="max-w-4xl font-serif text-4xl leading-tight text-relief md:text-6xl">{c.title}</h2>
            <a href={`mailto:${site.email}`} className="mt-9 inline-block min-h-11 break-all border-b border-gold py-2 font-serif text-2xl text-navy-deep transition-colors hover:text-navy md:mt-10">
              {site.email}
            </a>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            {links.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="meta-label inline-flex min-h-11 items-center opacity-80 hover:opacity-100">{l.label}</a>
            ))}
            <span className="max-w-64 text-xs leading-5 text-muted-foreground lg:text-right">{c.note}</span>
          </div>
        </div>
        <footer className="mt-20 flex flex-col gap-4 border-t border-navy/10 pt-7 md:mt-24 md:flex-row md:items-center md:justify-between">
          <span className="font-serif text-xl">{site.initials}</span>
          <span className="meta-soft">{c.footerLine}</span>
          <span className="meta-soft">© {site.year}</span>
        </footer>
      </div>
    </section>
  );
}
