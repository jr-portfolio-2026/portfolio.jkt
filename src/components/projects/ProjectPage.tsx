import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Mark } from "@/components/ui/Mark";
import { kinds, sortedProjects, type Project } from "@/content/projects";
import { site } from "@/content/site";
import { navState } from "@/lib/navigation";
import { ProjectPlate } from "./ProjectPlate";

const ease = [0.22, 1, 0.36, 1] as const;

const List = ({ items }: { items: string[] }) => (
  <ul className="grid border-l border-t border-navy/10 sm:grid-cols-2">
    {items.map((item, i) => (
      <li key={item} className="border-b border-r border-navy/10 bg-ivory p-6">
        <span className="font-serif text-xl text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
        <p className="mt-8 font-serif text-xl leading-snug text-navy-deep md:text-2xl">{item}</p>
      </li>
    ))}
  </ul>
);

function Section({ n, title, children, dark = false }: { n: string; title: string; children: ReactNode; dark?: boolean }) {
  return (
    <section className={`px-6 py-16 md:px-10 md:py-28 ${dark ? "bg-cobalt text-cobalt-foreground" : ""}`} aria-labelledby={`s-${n}`}>
      <div className="mx-auto grid max-w-[90rem] gap-8 lg:grid-cols-[.55fr_1.45fr] lg:gap-16">
        <div>
          <span className={`meta-label ${dark ? "!text-gold-soft" : "text-gold-ink"}`}>{n}</span>
          <h2 id={`s-${n}`} className="mt-4 font-serif text-4xl font-light md:text-5xl">{title}</h2>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

const Prose = ({ children }: { children: ReactNode }) => (
  <p className="max-w-2xl font-serif text-2xl leading-snug md:text-3xl">{children}</p>
);

export function ProjectPage({ project }: { project: Project }) {
  const index = sortedProjects.findIndex((p) => p.slug === project.slug);
  const total = sortedProjects.length;
  const previous = sortedProjects[(index - 1 + total) % total] ?? project;
  const next = sortedProjects[(index + 1) % total] ?? project;
  const kind = kinds[project.kind];
  // The blue wipe plays only when arriving from inside the app, never on a direct load or refresh.
  const wipe = navState.navigated;
  const links = [
    project.links.demo && { label: "Open the application", href: project.links.demo },
    project.links.repository && { label: "View the source", href: project.links.repository },
  ].filter(Boolean) as { label: string; href: string }[];

  const sections: { title: string; node: ReactNode; dark?: boolean }[] = [
    { title: "Context", node: <Prose>{project.context}</Prose> },
    { title: "Problem", node: <Prose>{project.problem}</Prose> },
    { title: "Constraints", node: <List items={project.constraints} /> },
    { title: "Contribution", node: <Prose>{project.contribution}</Prose> },
    { title: "Process", node: <List items={project.process} /> },
    { title: "Output", dark: true, node: (
      <ul className="grid border-l border-t border-cobalt-foreground/15 sm:grid-cols-2">
        {project.output.map((item, i) => (
          <li key={item} className="border-b border-r border-cobalt-foreground/15 p-6">
            <span className="font-serif text-xl text-gold-soft">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-8 font-serif text-2xl leading-snug">{item}</p>
          </li>
        ))}
      </ul>
    ) },
    { title: "Evidence", node: project.evidence.length ? (
      <ul className="divide-y divide-navy/10 border-y border-navy/10">
        {project.evidence.map((e) => (
          <li key={e.label} className="flex flex-wrap items-baseline justify-between gap-3 py-5">
            <span className="meta-soft">{e.label}</span>
            {e.href ? (
              <a href={e.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 border-b border-gold font-serif text-xl text-navy-deep">
                {e.text} <ArrowUpRight className="size-4" aria-hidden />
              </a>
            ) : <span className="font-serif text-xl text-navy-deep">{e.text}</span>}
          </li>
        ))}
      </ul>
    ) : <p className="max-w-xl text-sm leading-7 text-muted-foreground">No public evidence is linked to this study yet. Nothing is implied beyond what is described above.</p> },
    { title: "Limitations", node: <List items={project.limitations} /> },
    { title: "Further development", node: <List items={project.next} /> },
  ];

  return (
    <div className="paper-surface relative min-h-screen overflow-x-clip">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="grain-overlay fixed" aria-hidden />
      {wipe && (
        <div aria-hidden className="route-wipe page-transition pointer-events-none fixed inset-0 z-[90] grid place-items-center">
          <Mark className="text-6xl font-light text-cobalt-foreground" />
        </div>
      )}

      <header className="fixed inset-x-0 top-0 z-40 border-b border-navy/10 bg-ivory/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-6 md:px-10">
          <Link to="/" hash="work" className="meta-label inline-flex min-h-11 items-center gap-2"><ArrowLeft className="size-4" aria-hidden /> Portfolio</Link>
          <span className="font-serif text-xl text-relief">{project.name}</span>
          <span className="meta-soft hidden sm:block">Case study</span>
        </div>
      </header>

      <main id="main" tabIndex={-1} className="outline-none">
        <section className="px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
          <div className="mx-auto max-w-[90rem]">
            <div className="flex items-center justify-between border-b border-navy/10 pb-4">
              <span className="meta-label">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
              <span className="meta-soft">{project.status}</span>
            </div>
            <div className="mt-12 grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
              <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: wipe ? 0.5 : 0 }}>
                <p className="meta-label text-gold-ink">{project.category}</p>
                <h1 className="mt-6 font-serif text-[clamp(3.5rem,10vw,9rem)] leading-none font-light text-relief">{project.name}</h1>
                <p className="mt-8 max-w-xl text-base leading-8 text-navy-deep/80">{project.summary}</p>
                <p className="mt-6 inline-block border border-navy/20 px-3 py-2 text-xs text-navy-deep"><strong className="font-semibold">{kind.label}.</strong> {kind.note}</p>
                {project.disclosure && <p className="mt-5 max-w-xl border-l-2 border-gold pl-4 text-sm leading-6 text-navy-deep">{project.disclosure}</p>}
                {links.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                    {links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="meta-label inline-flex min-h-11 items-center gap-2 border-b border-gold">{l.label} <ArrowUpRight className="size-3.5" aria-hidden /></a>
                    ))}
                  </div>
                )}
              </motion.div>
              <ProjectPlate project={project} index={index} className="blue-portrait-frame aspect-[4/3] w-full" />
            </div>
            {(project.domains.length > 0 || project.technologies.length > 0) && (
              <dl className="mt-12 grid gap-6 border-t border-navy/10 pt-6 sm:grid-cols-3">
                {project.domains.length > 0 && <div><dt className="meta-soft">Fields</dt><dd className="mt-2 text-sm text-navy-deep">{project.domains.join(" · ")}</dd></div>}
                {project.technologies.length > 0 && <div><dt className="meta-soft">Built with</dt><dd className="mt-2 text-sm text-navy-deep">{project.technologies.join(" · ")}</dd></div>}
                <div><dt className="meta-soft">Year</dt><dd className="mt-2 text-sm text-navy-deep">{project.year}</dd></div>
              </dl>
            )}
          </div>
        </section>

        {sections.map((s, i) => (
          <Section key={s.title} n={String(i + 1).padStart(2, "0")} title={s.title} dark={s.dark}>{s.node}</Section>
        ))}

        <nav aria-label="Other case studies" className="border-t border-navy/10 px-6 py-12 md:px-10 md:py-16">
          <div className="mx-auto grid max-w-[90rem] gap-6 sm:grid-cols-2">
            <Link to="/work/$slug/" params={{ slug: previous.slug }} className="group flex min-h-24 flex-col justify-between border border-navy/10 p-6 hover:bg-mist/20">
              <span className="meta-soft inline-flex items-center gap-2"><ArrowLeft className="size-3.5" aria-hidden /> Previous study</span>
              <span className="mt-6 font-serif text-3xl text-navy-deep">{previous.name}</span>
            </Link>
            <Link to="/work/$slug/" params={{ slug: next.slug }} className="group flex min-h-24 flex-col justify-between border border-navy/10 p-6 text-right hover:bg-mist/20">
              <span className="meta-soft inline-flex items-center justify-end gap-2">Next study <ArrowRight className="size-3.5" aria-hidden /></span>
              <span className="mt-6 font-serif text-3xl text-navy-deep">{next.name}</span>
            </Link>
          </div>
          <p className="mx-auto mt-10 flex max-w-[90rem] items-center justify-between"><Mark className="text-xl" /><span className="meta-soft">© {site.year}</span></p>
        </nav>
      </main>
    </div>
  );
}
