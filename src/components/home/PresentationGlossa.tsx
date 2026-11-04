import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { reveal } from "./motion";

/**
 * FORMAT A — "Glossa".
 * The page of an annotated legal edition: one sheet of paper, the text in a wide serif measure,
 * a narrow left margin of rubrics (the little headings a code prints beside each paragraph) and a
 * right margin of "cf." cross-references that really link to the other sections of this page.
 * The profile reads the way the reader's own authorities do. Everything is plain visible text.
 */

/** Underlines one phrase with a dotted gold rule, the way a commentary flags a term of art. */
function Stress({ text, em }: { text: string; em: string }) {
  const at = text.indexOf(em);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <em className="not-italic underline decoration-gold decoration-dotted decoration-[1.5px] underline-offset-[6px]">{em}</em>
      {text.slice(at + em.length)}
    </>
  );
}

export function Glossa() {
  const p = home.presentation;

  return (
    <div className="mx-auto mt-12 max-w-[78rem] px-4 md:mt-24 md:px-10">
      <motion.article
        {...reveal}
        aria-label={`${site.name}, in the first person`}
        className="bg-card px-6 py-14 shadow-paper ring-1 ring-navy/10 md:px-[6%] md:py-24"
      >
        {/* Running head */}
        <p className="meta-label mb-12 flex items-center justify-between text-gold-ink md:mb-16">
          <span>Presentation</span>
          <span aria-hidden className="text-navy/40">{site.initials}</span>
        </p>

        <h3 className="font-serif text-[clamp(3rem,8.4vw,7.6rem)] leading-[0.98] font-light text-relief">
          Bonjour,
          <span className="block italic text-gold-ink">I&rsquo;m {site.name}.</span>
        </h3>

        <p className="mt-12 max-w-[30ch] font-serif text-[clamp(1.7rem,3.2vw,2.7rem)] leading-[1.25] text-navy-deep md:mt-16">
          {p.lead}
        </p>

        {/* The ruled margin belongs to the commentary only, so it starts below the headline. */}
        <div className="relative mt-14 md:mt-24">
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[9.5rem] hidden w-px bg-gold/40 md:block" />

          <ol className="space-y-12 md:space-y-20">
            {p.chapters.map((c, i) => (
              <motion.li
                key={c.key}
                {...reveal}
                className="grid gap-3 md:grid-cols-[9rem_minmax(0,1fr)_11rem] md:gap-x-10"
              >
                {/* Left margin — the rubric that names the paragraph. */}
                <div className="flex items-baseline gap-3 md:block md:pt-2 md:pr-1 md:text-right">
                  <span className="font-serif text-lg text-gold-ink lining-nums md:block">§&nbsp;{i + 1}</span>
                  <span className="meta-label text-navy md:mt-1 md:block">{c.key}</span>
                </div>

                <div>
                  <h4 className="font-serif text-2xl text-navy-deep/55 md:text-[1.7rem]">{c.title}</h4>
                  <p className="mt-3 max-w-[40ch] font-serif text-[1.4rem] leading-[1.5] text-navy-deep md:text-[1.7rem]">
                    <Stress text={c.text} em={c.em} />
                  </p>
                </div>

                {/* Right margin — "cf.", as a commentary cross-refers. A real link, never hover-only. */}
                {c.see ? (
                  <p className="md:pt-3">
                    <a
                      href={c.see.href}
                      className="group inline-flex min-h-11 items-center gap-2 font-serif text-lg text-navy transition-colors hover:text-gold-ink md:items-start"
                    >
                      <span className="meta-soft">cf.</span>
                      <span className="underline decoration-navy/25 underline-offset-[5px] group-hover:decoration-gold">{c.see.label}</span>
                      <ArrowUpRight className="mt-[0.2em] size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </a>
                  </p>
                ) : null}
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Colophon: the old fact sheet, reduced to a printer's line. */}
        <dl className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-navy/10 pt-8 md:mt-24">
          {p.facts.map((f) => (
            <div key={f.k} className="flex items-baseline gap-3">
              <dt className="meta-soft">{f.k}</dt>
              <dd className="font-serif text-lg text-navy-deep">{f.v}</dd>
            </div>
          ))}
        </dl>
      </motion.article>
    </div>
  );
}
