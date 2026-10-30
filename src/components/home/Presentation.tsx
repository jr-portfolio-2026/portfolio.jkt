import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, User } from "lucide-react";
import { useRef } from "react";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { ease, reveal } from "./motion";
import { SectionHeading } from "./SectionHeading";

/**
 * Signature section: a central portrait with two large editorial lines travelling behind it,
 * driven by scroll position (transform only). Without motion the lines rest in place.
 */
export function Presentation() {
  const p = home.presentation;
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "end start"] });

  const firstX = useTransform(scrollYProgress, [0, 1], reduce ? ["-6%", "-6%"] : ["12%", "-34%"]);
  const secondX = useTransform(scrollYProgress, [0, 1], reduce ? ["-6%", "-6%"] : ["-38%", "8%"]);
  const portraitY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["5%", "-5%"]);
  const frontY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["14%", "-14%"]);

  return (
    <section id="presentation" className="py-16 md:py-36" aria-labelledby="presentation-title">
      <div className="mx-auto max-w-[90rem] px-6 md:px-10">
        <SectionHeading index={p.index} title={p.title} note={p.note} id="presentation-title" />
      </div>

      {/* Stage: background words → portrait → foreground label */}
      <div ref={stage} className="relative mt-10 flex h-[34rem] items-center justify-center overflow-hidden md:mt-14 md:h-[46rem]">
        <p className="sr-only">{home.tagline.first} {home.tagline.second}</p>
        <div aria-hidden className="absolute inset-0 flex flex-col justify-center gap-2 md:gap-4">
          <motion.p style={{ x: firstX }} className="whitespace-nowrap font-serif text-[clamp(4.5rem,17vw,16rem)] leading-[0.95] font-light text-navy/[0.16]">
            {home.tagline.first}
          </motion.p>
          <motion.p style={{ x: secondX }} className="whitespace-nowrap font-serif text-[clamp(4.5rem,17vw,16rem)] leading-[0.95] font-light italic text-gold-ink/35">
            {home.tagline.second}
          </motion.p>
        </div>

        <motion.div
          style={{ y: portraitY }}
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1.1, ease }}
          className="blue-portrait-frame relative z-10 aspect-[4/5] w-[min(54vw,22rem)] overflow-hidden md:w-[min(30vw,26rem)]"
        >
          {site.portrait.src ? (
            <img src={`${import.meta.env.BASE_URL}${site.portrait.src}`} alt={site.portrait.alt} width={800} height={1000} loading="lazy" decoding="async" className="size-full object-cover" />
          ) : (
            <div className="grid size-full place-items-center text-center">
              <div>
                <User className="mx-auto size-10 stroke-[0.9] text-cobalt/60" aria-hidden />
                <p className="mt-5 font-serif text-4xl font-light text-navy-deep">{site.initials}</p>
              </div>
            </div>
          )}
          <div className="dossier-grid absolute inset-0 opacity-30" aria-hidden />
        </motion.div>

        {/* The construction-site caption ("Portrait — to be supplied") only ever belonged
            in the template preview. Once a real portrait is dropped in, its own small
            caption of initials appears; until then, the frame speaks for itself. */}
        {site.portrait.src && (
          <motion.span style={{ y: frontY }} className="glass-label absolute bottom-[22%] left-1/2 z-20 -translate-x-1/2 translate-y-6 whitespace-nowrap md:bottom-[20%] md:ml-52 md:translate-x-0">
            {site.name}
          </motion.span>
        )}

        <a href="#work" className="meta-label absolute bottom-4 left-1/2 z-20 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 px-3 md:bottom-8">
          Selected work <ArrowDown className="size-3.5" aria-hidden />
        </a>
      </div>

      <div className="mx-auto mt-12 grid max-w-[90rem] gap-12 px-6 md:mt-20 md:px-10 lg:grid-cols-[1.1fr_.9fr]">
        <motion.div {...reveal}>
          <p className="font-serif text-3xl leading-snug text-navy-deep md:text-4xl">{p.lead}</p>
          <p className="mt-8 max-w-xl text-sm leading-8 text-muted-foreground md:mt-9">{p.body}</p>
          <div className="mt-9 gold-hairline w-36 md:mt-10" />
        </motion.div>
        <motion.dl {...reveal} className="grid content-start gap-px border-t border-navy/10 bg-navy/10 sm:grid-cols-3 lg:grid-cols-1">
          {p.facts.map((f) => (
            <div key={f.k} className="bg-ivory p-5">
              <dt className="meta-soft">{f.k}</dt>
              <dd className="mt-3 font-serif text-xl text-navy-deep">{f.v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
