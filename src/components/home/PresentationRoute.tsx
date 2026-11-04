import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { ease, reveal } from "./motion";

/**
 * FORMAT B — "Route".
 * The profile as a journey: one gold line, drawn by the visitor's own scrolling, with a station
 * for each beat of the story and a fork at the end. It is the same visual language as the routes
 * on the hero globe, so the page says "movement between systems" without a single claim.
 *
 * Motion is transform and opacity only. With reduced motion the line is simply already drawn.
 */
/**
 * A station marker that fills as the gold line reaches it. It reads scroll POSITION, not an
 * "entered the viewport" event, so it is correct however the visitor arrives: scrolling down,
 * scrolling back up, or landing mid-list from an anchor link.
 */
function Marker({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "start 64%"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1]);
  return (
    <span
      ref={ref}
      aria-hidden
      className="absolute top-1.5 left-0 grid size-[1.1rem] place-items-center rounded-full border border-gold bg-paper md:left-1/2 md:-translate-x-1/2"
    >
      <motion.span style={{ scale }} className="size-2 rounded-full bg-gold" />
    </span>
  );
}

export function Route() {
  const p = home.presentation;
  const reduce = useReducedMotion();
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 72%", "end 58%"] });
  const drawn = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1]);

  return (
    <div className="mx-auto mt-12 max-w-[72rem] px-6 md:mt-24 md:px-10">
      <motion.header {...reveal} className="max-w-4xl">
        <h3 className="font-serif text-[clamp(3rem,8.4vw,7.6rem)] leading-[0.98] font-light text-relief">
          Bonjour,
          <span className="block italic text-gold-ink">I&rsquo;m {site.name}.</span>
        </h3>
        <p className="mt-10 max-w-[30ch] font-serif text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.25] text-navy-deep/80 md:mt-14">
          {p.lead}
        </p>
      </motion.header>

      <ol ref={list} className="relative mt-20 md:mt-32">
        {/* The track, and the gold that fills it as the visitor scrolls. */}
        <div aria-hidden className="absolute top-2 bottom-0 left-[0.45rem] w-px bg-navy/15 md:left-1/2">
          <motion.div style={{ scaleY: drawn }} className="h-full w-full origin-top bg-gold" />
        </div>

        {p.chapters.map((c, i) => {
          const right = i % 2 === 0;
          return (
            <li key={c.key} className="relative grid pb-16 pl-10 md:grid-cols-2 md:gap-x-28 md:pb-32 md:pl-0">
              <Marker reduce={!!reduce} />

              {/* An oversized numeral on the EMPTY side of the line — it fills the zig-zag's
                  silence without ever sitting behind the words. Texture, never content. */}
              <span
                aria-hidden
                className={`pointer-events-none absolute -top-6 hidden font-serif text-[12rem] leading-none font-light text-gold/30 select-none lining-nums md:block ${
                  right ? "right-[calc(50%+5rem)]" : "left-[calc(50%+5rem)]"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <motion.div
                {...reveal}
                className={`relative md:row-start-1 ${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}
              >
                <span className="meta-label text-gold-ink">
                  {String(i + 1).padStart(2, "0")} &nbsp;—&nbsp; {c.key}
                </span>
                <h4 className="mt-3 font-serif text-[clamp(2.4rem,4.6vw,4.2rem)] leading-[1.02] font-light text-relief">
                  {c.title}
                </h4>
                <p className={`mt-5 max-w-[36ch] text-lg leading-8 text-navy-deep/75 md:text-xl md:leading-9 ${right ? "" : "md:ml-auto"}`}>
                  {c.text}
                </p>
              </motion.div>
            </li>
          );
        })}

      </ol>

      {/* The fork: one route is named, the others are still being drawn. Decorative only —
          the same sentence is already in the last station as real text. */}
      <div aria-hidden className="hidden md:block">
          <svg viewBox="0 0 480 170" fill="none" className="mx-auto -mt-20 h-auto w-full max-w-[30rem]">
            {/* The named route draws itself. The open ones fade in dashed — animating
                pathLength would overwrite a dash pattern, so they use opacity instead. */}
            <motion.path
              d="M240 0 V150"
              strokeWidth={1.4}
              className="stroke-gold"
              initial={{ pathLength: reduce ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.4, ease }}
            />
            {["M240 30 C240 100 92 86 70 156", "M240 30 C240 100 388 86 410 156"].map((d, k) => (
              <motion.path
                key={d}
                d={d}
                strokeWidth={1.1}
                strokeDasharray="3 7"
                strokeLinecap="round"
                className="stroke-navy/45"
                initial={{ opacity: reduce ? 1 : 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.4, ease, delay: 0.5 + k * 0.2 }}
              />
            ))}
            <circle cx="240" cy="150" r="6" className="fill-paper stroke-gold" strokeWidth="1.4" />
            <circle cx="70" cy="156" r="2.5" className="fill-navy/35" />
            <circle cx="410" cy="156" r="2.5" className="fill-navy/35" />
          </svg>
      </div>
    </div>
  );
}
