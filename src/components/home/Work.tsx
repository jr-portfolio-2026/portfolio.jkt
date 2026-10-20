import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { home } from "@/content/home";
import { kinds, sortedProjects } from "@/content/projects";
import { ProjectPlate } from "@/components/projects/ProjectPlate";
import { ease } from "./motion";
import { SectionHeading } from "./SectionHeading";

export function Work() {
  const w = home.work;
  const [index, setIndex] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = sortedProjects.length;
  const project = sortedProjects[index] ?? sortedProjects[0];
  if (!project) return null;

  const select = (i: number, focus = false) => {
    setIndex(i);
    setNotesOpen(false);
    if (focus) tabs.current[i]?.focus();
  };

  // WAI-ARIA tabs: arrows move between studies, Home/End jump, only the selected tab is in the tab order.
  const onTabKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? (i + 1) % total
      : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (i - 1 + total) % total
      : e.key === "Home" ? 0 : e.key === "End" ? total - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    select(next, true);
  };

  const kind = kinds[project.kind];

  return (
    <section id="work" className="py-16 md:py-36" aria-labelledby="work-title">
      <div className="mx-auto max-w-[90rem] px-6 md:px-10">
        <SectionHeading index={w.index} title={w.title} note={w.note} id="work-title" />
      </div>

      <div className="mx-auto mt-12 max-w-[90rem] border-y border-navy/10 md:mt-14">
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[17rem_minmax(0,1fr)]">
          <div className="border-b border-navy/10 p-4 md:p-6 lg:border-b-0 lg:border-r lg:p-8">
            <p className="meta-soft mb-3 hidden lg:block">{w.selectLabel}</p>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-col lg:overflow-visible" role="tablist" aria-label={w.selectLabel}>
              {sortedProjects.map((item, i) => (
                <Button
                  key={item.slug} ref={(el) => { tabs.current[i] = el; }}
                  variant="ghost" role="tab" id={`tab-${item.slug}`} aria-selected={i === index} aria-controls="work-panel"
                  tabIndex={i === index ? 0 : -1}
                  onClick={() => select(i)} onKeyDown={(e) => onTabKey(e, i)}
                  className={`h-auto min-w-40 justify-start rounded-none border-l px-5 py-4 text-left ${i === index ? "border-gold bg-mist/25" : "border-navy/10 hover:bg-ivory-deep"}`}
                >
                  <span>
                    <span className="meta-soft block">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mt-2 block font-serif text-2xl font-normal text-navy-deep">{item.name}</span>
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">{kinds[item.kind].label}</span>
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={project.slug} id="work-panel" role="tabpanel" aria-labelledby={`tab-${project.slug}`} tabIndex={0}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease }} className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]"
            >
              <div className="relative">
                <ProjectPlate project={project} index={index} className="min-h-[18rem] lg:min-h-[34rem] lg:h-full" />
                <span className="glass-label absolute left-5 top-5 md:left-6 md:top-6">{kind.label}</span>
              </div>

              <div className="flex flex-col justify-between p-6 md:p-12">
                <div>
                  <span className="meta-label text-gold-ink">{project.category}</span>
                  <h3 className="mt-5 font-serif text-5xl font-light text-relief md:text-6xl">{project.name}</h3>
                  <p className="meta-soft mt-3">{project.status}</p>
                  <p className="mt-8 max-w-lg text-base leading-8 text-navy-deep/85 md:mt-9">{project.summary}</p>
                  {project.disclosure && <p className="mt-5 max-w-lg border-l border-gold pl-4 text-sm leading-6 text-navy-deep/80">{project.disclosure}</p>}
                </div>

                <div className="mt-10 md:mt-12">
                  <Button asChild variant="outline" className="mb-3 w-full justify-between rounded-none border-cobalt/25 bg-mist/20 py-6 text-navy-deep hover:bg-mist/35">
                    <Link to="/work/$slug/" params={{ slug: project.slug }}>{w.openLabel} <ArrowUpRight /></Link>
                  </Button>
                  <Button variant="outline" onClick={() => setNotesOpen((v) => !v)} aria-expanded={notesOpen} aria-controls="work-notes"
                    className="w-full justify-between rounded-none border-navy/15 bg-ivory/60 py-6 hover:bg-mist/25">
                    {w.notesLabel} <ChevronDown className={`transition-transform ${notesOpen ? "rotate-180" : ""}`} />
                  </Button>
                  <AnimatePresence initial={false}>
                    {notesOpen && (
                      <motion.div id="work-notes" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="grid gap-7 border-x border-b border-navy/10 p-6 text-sm leading-6">
                          <div><span className="meta-soft">{kind.label}</span><p className="mt-2 text-muted-foreground">{kind.note}</p></div>
                          <div><span className="meta-soft">{w.workingNow}</span><p className="mt-2 text-muted-foreground">{project.output[0]}</p></div>
                          <div><span className="meta-soft">{w.nextRefinement}</span><p className="mt-2 text-muted-foreground">{project.next[0]}</p></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-navy/10 px-4 py-3 md:px-6 md:py-4">
          <span className="meta-soft tabular-nums" aria-live="polite">{index + 1} / {total}</span>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="size-11" aria-label="Previous study" onClick={() => select((index - 1 + total) % total)}><ArrowLeft /></Button>
            <Button size="icon" variant="ghost" className="size-11" aria-label="Next study" onClick={() => select((index + 1) % total)}><ArrowRight /></Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[90rem] px-6 md:px-10">
        <p className="meta-soft">{w.legend}</p>
        <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-5">
          {Object.values(kinds).map((k) => (
            <div key={k.label}>
              <dt className="font-serif text-lg text-navy-deep">{k.label}</dt>
              <dd className="text-xs leading-5 text-muted-foreground">{k.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
