import { motion } from "motion/react";
import { home } from "@/content/home";
import { ease } from "./motion";
import { Globe } from "./Globe";

/**
 * Which headline voice the hero uses. Both live in content/home.ts.
 *   "statement" — "Always discovering. / Always learning. / Always making."
 *                 the closing line is set in gold, a little smaller.
 *   "fields"    — "International law, trade and business, read through digital systems."
 */
const HEADLINE_VARIANT: "statement" | "fields" = "statement";

export function Hero({ ready }: { ready: boolean }) {
  const h = home.hero;
  const show = ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 };

  return (
    <section id="top" aria-labelledby="hero-h" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* The plate sits behind the type, bleeding off the right edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[-26vw] w-[88vw] max-w-[1180px] -translate-y-1/2 opacity-40 md:right-[-18vw] md:left-[54%] md:w-auto md:max-w-none md:opacity-70"
      >
        <Globe />
      </div>

      <div className="wrap relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={show} transition={{ duration: 1.1, ease }}>
          {HEADLINE_VARIANT === "statement" ? (
            <h1 id="hero-h" className="mb-[clamp(36px,5vh,56px)] max-w-[24ch] font-serif text-[clamp(2.3rem,5.1vw,4.3rem)] leading-[1.1] font-light text-relief">
              {h.statement.map((line, i) =>
                i === h.statement.length - 1 ? (
                  <span key={line} className="block text-[0.84em] text-gold-ink">{line}</span>
                ) : (
                  <span key={line} className="block">{line}</span>
                ),
              )}
            </h1>
          ) : (
            <h1 id="hero-h" className="mb-[clamp(36px,5vh,56px)] max-w-[20ch] font-serif text-[clamp(2rem,4vw,3.4rem)] leading-[1.14] font-light text-relief">
              {h.fields.before}
              <em className="font-normal text-gold-ink italic">{h.fields.emphasis}</em>
            </h1>
          )}

          <p className="max-w-[44ch] border-l border-stone pl-6 text-[clamp(1.05rem,1.5vw,1.28rem)] leading-[1.65] text-navy-deep/85">
            {h.lede}
          </p>
        </motion.div>
      </div>

      <a href="#presentation" className="meta-label absolute bottom-[clamp(26px,5vh,54px)] left-1/2 z-10 grid -translate-x-1/2 justify-items-center gap-3 text-ink-soft opacity-75 transition-opacity hover:opacity-100">
        {h.scroll}
        <i aria-hidden className="scroll-line" />
      </a>
    </section>
  );
}
