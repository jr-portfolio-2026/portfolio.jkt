import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { home } from "@/content/home";
import { ease } from "./motion";
import { SectionHeading } from "./SectionHeading";

export function Work() {
  const w = home.work;
  const [index, setIndex] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const total = w.projects.length;
  const project = w.projects[index] ?? w.projects[0];
  if (!project) return null;

  const select = (i: number) => { setIndex(i); setNotesOpen(false); };

  return (
    <section id="work" className="py-16 md:py-36">
      <div className="mx-auto max-w-[90rem] px-6 md:px-10">
        <SectionHeading index={w.index} title={w.title} note={w.note} />
      </div>

      <div className="mx-auto mt-12 max-w-[90rem] border-y border-navy/10 md:mt-14">
        <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[17rem_minmax(0,1fr)]">
          <div className="border-b border-navy/10 p-4 md:p-6 lg:border-b-0 lg:border-r lg:p-8">
            <p className="meta-soft mb-3 hidden lg:block">{w.selectLabel}</p>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-col lg:overflow-visible" role="tablist" aria-label="Studies">
              {w.projects.map((item, i) => (
                <Button
                  key={item.slug} variant="ghost" role="tab" id={`tab-${item.slug}`} aria-selected={i === index} aria-controls="work-panel"
                  onClick={() => select(i)}
                  className={`h-auto min-w-40 justify-start rounded-none border-l px-5 py-4 text-left ${i === index ? "border-gold bg-mist/25" : "border-navy/10 hover:bg-ivory-deep"}`}
                >
                  <span>
                    <span className="meta-soft block">0{i + 1}</span>
                    <span className="mt-2 block font-serif text-2xl font-normal text-navy-deep">{item.name}</span>
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">{item.status}</span>
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={project.slug} id="work-panel" role="tabpanel" aria-labelledby={`tab-${project.slug}`}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease }} className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]"
            >
              <div className="dossier-visual relative !min-h-[18rem] overflow-hidden lg:!min-h-[34rem]">
                <div className="dossier-grid absolute inset-0 opacity-70" aria-hidden />
                <span aria-hidden className="absolute bottom-2 right-5 select-none font-serif text-[9rem] font-light leading-none text-navy/[0.07] md:text-[14rem]">0{index + 1}</span>
                <span className="glass-label absolute left-5 top-5 md:left-6 md:top-6">{project.status}</span>
              </div>

              <div className="flex flex-col justify-between p-6 md:p-12">
                <div>
                  <span className="meta-label text-[oklch(0.5_0.09_80)]">{project.category}</span>
                  <h3 className="mt-5 font-serif text-5xl font-light text-relief md:text-6xl">{project.name}</h3>
                  <p className="meta-soft mt-3">{project.relevance}</p>
                  <p className="mt-8 max-w-lg text-base leading-8 text-navy-deep/85 md:mt-9">{project.problem}</p>
                </div>

                <div className="mt-10 md:mt-12">
                  {project.live ? (
                    <Button asChild variant="outline" className="mb-3 w-full justify-between rounded-none border-cobalt/25 bg-mist/20 py-6 text-navy-deep hover:bg-mist/35">
                      <a href={`${import.meta.env.BASE_URL}work/${project.slug}`}>Open case study <ArrowUpRight /></a>
                    </Button>
                  ) : (
                    <p className="mb-3 border border-dashed border-navy/20 px-5 py-4 text-sm text-muted-foreground">
                      This study is in preparation.
                    </p>
                  )}
                  <Button variant="outline" onClick={() => setNotesOpen((v) => !v)} aria-expanded={notesOpen}
                    className="w-full justify-between rounded-none border-navy/15 bg-ivory/60 py-6 hover:bg-mist/25">
                    Case notes <ChevronDown className={`transition-transform ${notesOpen ? "rotate-180" : ""}`} />
                  </Button>
                  <AnimatePresence initial={false}>
                    {notesOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="grid gap-7 border-x border-b border-navy/10 p-6 text-sm leading-6">
                          <div><span className="meta-soft">Working now</span><p className="mt-2 text-muted-foreground">{project.working}</p></div>
                          <div><span className="meta-soft">Next refinement</span><p className="mt-2 text-muted-foreground">{project.improve}</p></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-navy/10 px-4 py-3 md:px-6 md:py-4">
          <span className="meta-soft tabular-nums">{index + 1} / {total}</span>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="size-11" aria-label="Previous study" onClick={() => select((index - 1 + total) % total)}><ArrowLeft /></Button>
            <Button size="icon" variant="ghost" className="size-11" aria-label="Next study" onClick={() => select((index + 1) % total)}><ArrowRight /></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
