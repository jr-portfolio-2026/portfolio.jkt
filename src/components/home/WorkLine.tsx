import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { home } from "@/content/home";
import { kinds, sortedProjects } from "@/content/projects";
import { ease } from "./motion";
import { Art, Field, toneOf } from "./ProjectPreview";

/** How long each card stays open while the cycle runs. */
const DWELL = 9000;
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const GOLD = "#AB894B";

/**
 * THE LINE — four plates side by side on parchment.
 *
 * Every plate is readable at all times: its numeral, category, a small specimen in its own colours,
 * its name, what kind of work it is, and a few lines about it. One plate is open. The open plate
 * floods with its project's own colour, lifts, widens, redraws its specimen and shows its links;
 * a gold line along its foot is the cycle's clock.
 *
 * A slow cycle opens each plate in turn. It starts when the line is in view, pauses while the pointer
 * or focus is inside it, stops for good when the visitor chooses a plate, and does not run with reduced
 * motion. Pointing at a plate only warms it; opening is by click, focus-and-enter, or the cycle, so
 * nothing depends on hover (and phones, which have none, lose nothing). A pause button is always shown.
 *
 * Below the large breakpoint the line becomes a stack, with the same states and no width changes.
 */
export function WorkLine() {
  const w = home.work;
  const reduce = !!useReducedMotion();
  const total = sortedProjects.length;
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  const line = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = line.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cycling = !reduce && inView && !held && !paused;
  useEffect(() => {
    if (!cycling) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % total), DWELL);
    return () => window.clearTimeout(id);
  }, [cycling, active, total]);

  const choose = (i: number) => { setActive(i); setPaused(true); };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease }}
        className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4"
      >
        <p className="meta-label text-gold-ink">{w.selectLabel}</p>
        <nav aria-label={w.selectLabel} className="flex items-center gap-1">
          {sortedProjects.map((p, i) => (
            <button
              key={p.slug} type="button" onClick={() => choose(i)} aria-label={p.name}
              aria-current={i === active ? "true" : undefined}
              className={`group relative inline-flex size-11 items-center justify-center font-serif text-lg tabular-nums transition-colors ${i === active ? "text-navy-deep" : "text-ink-soft/55 hover:text-navy-deep"}`}
            >
              {String(i + 1).padStart(2, "0")}
              <span className={`absolute inset-x-2.5 bottom-1.5 h-px transition-colors ${i === active ? "bg-gold" : "bg-transparent group-hover:bg-navy/25"}`} />
            </button>
          ))}
          {!reduce && (
            <button
              type="button" onClick={() => setPaused((v) => !v)} aria-label={paused ? w.play : w.pause}
              className="ml-2 inline-flex size-11 items-center justify-center border border-navy/15 bg-paper/60 text-navy-deep transition-colors hover:border-gold hover:text-gold-ink"
            >
              {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
            </button>
          )}
        </nav>
        <div className="h-px w-full bg-navy/20" aria-hidden />
      </motion.div>

      <ul
        ref={line}
        onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}
        onFocusCapture={() => setHeld(true)} onBlurCapture={() => setHeld(false)}
        className="m-0 mt-10 flex list-none flex-col gap-4 p-0 md:mt-14 lg:h-[min(37rem,max(31rem,calc(100svh-15rem)))] lg:flex-row lg:items-stretch lg:gap-4 lg:pt-5"
      >
        {sortedProjects.map((p, i) => {
          const open = i === active;
          const tone = toneOf(p.slug);
          const ink = open ? tone.ink : tone.restInk;
          const soft = open ? tone.soft : tone.restSoft;
          return (
            <motion.li
              key={p.slug}
              initial={{ opacity: 0, y: 44 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, ease, delay: reduce ? 0 : i * 0.12 }}
              className="min-w-0 lg:min-h-0 lg:basis-0 lg:transition-[flex-grow] lg:duration-[1400ms] lg:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:lg:duration-0"
              style={{ flexGrow: open ? 1.5 : 1 }}
            >
              <section
                aria-label={p.name}
                className={`group relative flex h-full flex-col overflow-hidden bg-[#FCFAF5] shadow-paper transition-[transform,color,box-shadow] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:min-h-0 ${open ? "lg:-translate-y-5 lg:shadow-[0_44px_90px_-44px_rgba(11,31,55,0.55)]" : "lg:hover:z-10 lg:hover:-translate-y-2 lg:hover:scale-[1.012] lg:hover:shadow-[0_28px_60px_-28px_rgba(11,31,55,0.4)]"}`}
                style={{ color: ink }}
              >
                {/* The project's own material. Open: floods the plate. Resting: a quiet trace is always
                    present, so the row reads as four designed plates, not placeholders. Hover previews
                    the next one richly, without committing to opening it. */}
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-[1100ms] ease-out motion-reduce:transition-none ${open ? "opacity-100" : "opacity-[0.07] group-hover:opacity-[0.42] group-focus-within:opacity-[0.42]"}`}
                >
                  <Field slug={p.slug} />
                </div>
                <span aria-hidden className="pointer-events-none absolute inset-2 border transition-colors duration-[1100ms] md:inset-2.5" style={{ borderColor: ink, opacity: 0.18 }} />
                <span aria-hidden className="pointer-events-none absolute right-5 top-5 size-3 md:right-6 md:top-6">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-gold" />
                  <span className="absolute inset-y-0 left-1/2 w-px bg-gold" />
                </span>

                <button
                  type="button" onClick={() => choose(i)} aria-expanded={open} tabIndex={open ? -1 : 0}
                  className={`absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold ${open ? "pointer-events-none" : ""}`}
                >
                  <span className="sr-only">{p.name}, {kinds[p.kind].label}</span>
                </button>

                {/* Head */}
                <p className="relative flex items-baseline gap-3 px-6 pt-6 pr-14 text-[0.6875rem] leading-4 tracking-[0.16em] uppercase transition-colors duration-[1100ms] md:px-7 md:pt-7">
                  <span className="font-serif text-xl tracking-normal normal-case transition-colors duration-[1100ms]" style={{ color: soft }}>{ROMAN[i]}</span>
                  <span style={{ opacity: 0.8 }}>{p.category}</span>
                </p>

                {/* Specimen window: the drawing, always in the project's own colours. */}
                <div className="relative mx-5 mt-5 h-48 shrink-0 overflow-hidden lg:mx-6 lg:h-auto lg:min-h-0 lg:flex-1">
                  <div className={`absolute inset-0 border transition-opacity duration-[1100ms] ${open ? "opacity-0" : "opacity-100"}`} style={{ borderColor: tone.restInk + "33" }}>
                    <Field slug={p.slug} />
                  </div>
                  <div className="relative size-full px-3 py-4 lg:px-4 lg:py-5">
                    <Art key={open ? "live" : "still"} slug={p.slug} reduce={reduce || !open} />
                  </div>
                </div>

                {/* Words */}
                <div className="relative px-6 pb-6 pt-6 md:px-7 md:pb-7">
                  <h3 className="font-serif text-[clamp(2rem,2.6vw,2.6rem)] leading-none font-light">{p.name}</h3>
                  <p className="mt-3 text-[0.8125rem] leading-5" style={{ opacity: 0.82 }}>
                    <span className="font-semibold">{kinds[p.kind].label}</span> · {p.year}
                  </p>
                  <p className="mt-3 line-clamp-3 text-[0.875rem] leading-6" style={{ opacity: 0.9 }}>{p.summary}</p>

                  {/* Reserved on every plate so nothing shifts; offered on the open one. */}
                  <div
                    className={`relative z-20 mt-3 flex min-h-11 flex-wrap items-center gap-x-6 transition-opacity duration-700 ${open ? "opacity-100 delay-500" : "opacity-0"}`}
                    inert={!open}
                  >
                    <a href={`#work-${p.slug}`} className="inline-flex min-h-11 items-center gap-2 border-b pb-0.5 font-serif text-lg transition-opacity hover:opacity-70" style={{ borderColor: GOLD }}>
                      {w.cardOpen}<ArrowUpRight className="size-4" aria-hidden />
                    </a>
                    {p.links.demo && (
                      <a href={p.links.demo} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-[0.6875rem] tracking-[0.16em] uppercase transition-opacity hover:opacity-70">
                        {w.cardTry}<ArrowUpRight className="size-3.5" aria-hidden />
                      </a>
                    )}
                  </div>
                </div>

                {/* The cycle's clock, along the foot of the open plate. */}
                {open && (
                  <motion.span
                    key={`${i}-${cycling}`} aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-gold"
                    initial={{ scaleX: cycling ? 0 : 1 }} animate={{ scaleX: 1 }}
                    transition={cycling ? { duration: DWELL / 1000, ease: "linear" } : { duration: 0 }}
                    style={{ opacity: cycling ? 1 : 0.4 }}
                  />
                )}
              </section>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
