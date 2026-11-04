import { motion } from "motion/react";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { ease, reveal } from "./motion";

/**
 * FORMAT C — "Charter".
 * The one dark band on the page. The profile is set as the articles of a short founding
 * document: a preamble, four numbered articles, a signature. Lawyers will recognise the form
 * and smile at it; everyone else just reads a confident, well-set page.
 *
 * It bleeds full width and runs into the edge of the section, so it reads as a change of
 * room rather than a box on the page. Motion is a clipped rise on the headings (transform only).
 */

/** Each heading rises out of a mask — a slow reveal that never fades text in and out of legibility. */
function Rise({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="block overflow-hidden pb-[0.12em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Charter() {
  const p = home.presentation;

  return (
    <div className="relative -mb-16 mt-12 bg-navy-deep text-primary-foreground md:-mb-36 md:mt-24">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gold/60" />

      <div className="mx-auto max-w-[72rem] px-6 py-20 md:px-10 md:py-36">
        {/* Preamble */}
        <header>
          <p className="meta-label text-gold-soft">Preamble</p>
          <h3 className="mt-6 font-serif text-[clamp(3rem,8.4vw,7.6rem)] leading-[0.98] font-light">
            <Rise>Bonjour,</Rise>
            <Rise delay={0.12}>
              <span className="italic text-gold-soft">I&rsquo;m {site.name}.</span>
            </Rise>
          </h3>
          <motion.p
            {...reveal}
            className="mt-10 max-w-[30ch] font-serif text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.25] text-primary-foreground/80 md:mt-14"
          >
            {p.lead}
          </motion.p>
        </header>

        {/* Articles */}
        <ol className="mt-20 md:mt-32">
          {p.chapters.map((c, i) => (
            <motion.li
              key={c.key}
              {...reveal}
              className="grid gap-4 border-t border-primary-foreground/15 py-10 md:grid-cols-[7rem_1fr_1.25fr] md:gap-x-12 md:py-14"
            >
              <span className="font-serif text-[2.6rem] leading-none font-light text-gold-soft lining-nums md:text-[3.4rem]">
                <span aria-hidden className="text-[0.5em] align-top">§&nbsp;</span>
                <span className="sr-only">Article </span>
                {i + 1}
              </span>

              <div>
                <p className="meta-label text-primary-foreground/60">{c.key}</p>
                <h4 className="mt-2 font-serif text-3xl leading-tight font-light md:text-4xl">{c.title}</h4>
              </div>

              <p className="max-w-[44ch] text-lg leading-8 text-primary-foreground/80 md:text-xl md:leading-9">
                {c.text}
              </p>
            </motion.li>
          ))}
        </ol>

        {/* Signature */}
        <motion.footer
          {...reveal}
          className="mt-8 flex flex-col gap-10 border-t border-gold/60 pt-10 md:mt-12 md:flex-row md:items-end md:justify-between md:pt-14"
        >
          <p className="font-serif text-6xl leading-none font-light italic text-gold-soft md:text-8xl">{site.name}</p>
          <dl className="grid gap-5 sm:grid-cols-3 md:gap-10">
            {p.facts.map((f) => (
              <div key={f.k}>
                <dt className="meta-label text-primary-foreground/55">{f.k}</dt>
                <dd className="mt-2 font-serif text-xl text-primary-foreground">{f.v}</dd>
              </div>
            ))}
          </dl>
        </motion.footer>
      </div>
    </div>
  );
}
