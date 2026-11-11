import { motion, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { home } from "@/content/home";
import { kinds, sortedProjects } from "@/content/projects";
import { ease, reveal } from "./motion";
import { StatusRail } from "./StatusRail";
import { Parchment } from "./ProjectPreview";
import { WorkLine } from "./WorkLine";
import { StatusLegend } from "./StatusLegend";

/**
 * SELECTED WORK
 *
 * Opens with a full-width chapter panel — deep navy, layered vertical grain, editorial type —
 * like turning a page into a different room. The cards and case-study bands follow on parchment below.
 *
 * Every fact is read from content/projects.ts; every label from content/home.ts.
 */

/** The chapter panel: a full-bleed atmospheric introduction, navy ground, layered CSS texture. */
function WorkChapter() {
  const w = home.work;
  const reduce = !!useReducedMotion();

  return (
    <div className="relative isolate overflow-hidden bg-[#0B1F37]" style={{ minHeight: "clamp(32rem,80svh,56rem)" }}>
      {/* Layered vertical-grain texture, echoing a painted / motion-blurred field. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            /* Gold warmth — upper left */
            "radial-gradient(ellipse 60% 55% at 18% 15%, rgba(171,137,75,0.14), transparent 65%)",
            /* Mist-blue counter-light — lower right */
            "radial-gradient(ellipse 55% 60% at 85% 90%, rgba(200,220,227,0.09), transparent 60%)",
            /* Soft vertical light column, centre-right, like the reference image */
            "radial-gradient(ellipse 22% 100% at 68% 50%, rgba(255,255,255,0.055), transparent 70%)",
            /* Base ground */
            "linear-gradient(170deg, #102540 0%, #0B1F37 50%, #060E1A 100%)",
          ].join(","),
        }}
      />
      {/* Vertical reeds — the repeating stripe pattern from the reference */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.9) 0 1px, transparent 1px 18px)",
        }}
      />
      {/* Finer cross-grain for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.8) 0 1px, transparent 1px 9px)",
        }}
      />
      {/* Vignette — edges darken, pulling focus inward */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(4,10,22,0.72) 100%)",
        }}
      />

      {/* The text — set against the panel; two columns at large breakpoints */}
      <div className="relative mx-auto flex h-full max-w-[90rem] flex-col justify-between gap-16 px-6 py-16 md:px-10 md:py-20 lg:flex-row lg:items-end lg:gap-24 lg:py-28" style={{ minHeight: "inherit" }}>
        {/* Left: the chapter identity */}
        <div className="max-w-[42rem]">
          <motion.h2
            id="work-title"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, ease, delay: reduce ? 0 : 0.1 }}
            className="font-serif font-light leading-[0.92] tracking-[-0.01em] text-[#F9F6EE]"
            style={{ fontSize: "clamp(3.5rem,8.5vw,8rem)" }}
          >
            {w.title}
          </motion.h2>
        </div>

        {/* Right: lede and a hairline — anchored to the bottom right on large screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease, delay: reduce ? 0 : 0.28 }}
          className="flex max-w-[26rem] flex-col gap-8 lg:mb-2 lg:items-end lg:text-right"
        >
          <span className="h-px w-16 bg-[#AB894B] opacity-60" aria-hidden />
          <p className="font-serif text-[clamp(1.0625rem,1.6vw,1.3125rem)] font-light leading-[1.5] text-[#C8DCE3]/80">
            {w.lede}
          </p>
        </motion.div>
      </div>

      {/* Bottom edge: a hairline dissolve into the parchment below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(249,246,238,0.08) 70%, rgba(249,246,238,0.18))",
        }}
      />
    </div>
  );
}

export function Work() {
  const w = home.work;

  return (
    <section id="work" aria-labelledby="work-title">
      {/* Chapter opening panel */}
      <WorkChapter />

      {/* Cards + case studies on parchment */}
      <div className="relative isolate">
        <Parchment />
        <div className="mx-auto max-w-[90rem] px-6 py-20 md:px-10 md:py-28">

          {/* The card line */}
          <WorkLine />

          {/* The key: what each status word, seen above, actually means */}
          <div className="mt-20 md:mt-28">
            <StatusLegend />
          </div>

          {/* Case-study bands, one per project */}
          <ol className="m-0 mt-24 list-none p-0 md:mt-40">
            {sortedProjects.map((p, i) => (
              <li key={p.slug} id={`work-${p.slug}`} className="scroll-mt-28 border-t border-navy/10">
                <motion.article
                  {...reveal}
                  aria-labelledby={`work-${p.slug}-title`}
                  className="grid gap-x-[6%] gap-y-10 py-16 md:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
                >
                  <div className="lg:sticky lg:top-28 lg:self-start">
                    <p className="meta-label text-gold-ink">{p.category}</p>

                    <h3
                      id={`work-${p.slug}-title`}
                      className="mt-6 font-serif text-[clamp(3rem,6.5vw,5.75rem)] leading-[0.95] font-light text-relief"
                    >
                      {p.name}
                    </h3>

                    <p className="mt-7 text-sm leading-6 text-ink-soft">
                      <span className="font-semibold text-navy-deep">{kinds[p.kind].label}</span>
                      {" — "}{kinds[p.kind].note}
                      <span className="block text-ink-soft/80">{p.status} · {p.year}</span>
                    </p>

                    <div className="mt-10 max-w-sm">
                      <StatusRail kind={p.kind} label={w.railLabel} />
                    </div>
                  </div>

                  <div>
                    <p className="max-w-[38rem] text-[1.0625rem] leading-8 text-navy-deep/90 md:text-[1.125rem] md:leading-9">
                      {p.summary}
                    </p>

                    {p.disclosure && (
                      <p className="mt-7 max-w-[38rem] border-l border-gold pl-5 text-sm leading-6 text-navy-deep/80">
                        {p.disclosure}
                      </p>
                    )}

                    <dl className="mt-12 grid max-w-[38rem] gap-x-10 gap-y-7 border-t border-navy/10 pt-9 sm:grid-cols-2">
                      <div>
                        <dt className="meta-soft">{w.workingNow}</dt>
                        <dd className="mt-3 text-sm leading-6 text-ink-soft">{p.output[0]}</dd>
                      </div>
                      <div>
                        <dt className="meta-soft">{w.nextRefinement}</dt>
                        <dd className="mt-3 text-sm leading-6 text-ink-soft">{p.next[0]}</dd>
                      </div>
                    </dl>

                    <p className="meta-soft mt-9">{p.domains.join("  /  ")}</p>

                    <div className="mt-11 flex flex-wrap items-center gap-x-9 gap-y-2">
                      <Link
                        to="/work/$slug/" params={{ slug: p.slug }}
                        className="group inline-flex min-h-11 items-center gap-2 border-b border-gold pb-0.5 font-serif text-xl text-navy-deep transition-colors hover:text-gold-ink"
                      >
                        {w.openLabel}
                        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                      </Link>
                      {p.links.demo && (
                        <a href={p.links.demo} target="_blank" rel="noreferrer" className="meta-label inline-flex min-h-11 items-center gap-1.5 hover:text-gold-ink">
                          {w.demoLabel}<ArrowUpRight className="size-3.5" aria-hidden />
                        </a>
                      )}
                      {p.links.repository && (
                        <a href={p.links.repository} target="_blank" rel="noreferrer" className="meta-label inline-flex min-h-11 items-center gap-1.5 hover:text-gold-ink">
                          {w.sourceLabel}<ArrowUpRight className="size-3.5" aria-hidden />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              </li>
            ))}
          </ol>

          <p className="meta-soft mt-10 border-t border-navy/10 pt-10 text-center">{w.closing}</p>
        </div>
      </div>
    </section>
  );
}
