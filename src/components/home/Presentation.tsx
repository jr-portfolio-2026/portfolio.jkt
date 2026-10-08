import { motion } from "motion/react";
import { User } from "lucide-react";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { ease, reveal } from "./motion";
import { SectionHeading } from "./SectionHeading";

export function Presentation() {
  const p = home.presentation;
  return (
    <section id="presentation" className="px-6 py-16 md:px-10 md:py-36" aria-label={p.title}>
      <div className="mx-auto max-w-[90rem]">
        <SectionHeading index={p.index} title={p.title} note={p.note} />
        <div className="mt-12 grid items-center gap-14 md:mt-16 lg:grid-cols-[1.1fr_.9fr]">
          <motion.div {...reveal}>
            <p className="font-serif text-3xl leading-snug text-navy-deep md:text-4xl">{p.lead}</p>
            <p className="mt-8 max-w-xl text-sm leading-8 text-muted-foreground md:mt-9">{p.body}</p>
            <div className="mt-9 gold-hairline w-36 md:mt-10" />
            <dl className="mt-9 grid gap-px border-t border-navy/10 bg-navy/10 sm:grid-cols-3 md:mt-10">
              {p.facts.map((f) => (
                <div key={f.k} className="bg-ivory p-5">
                  <dt className="meta-soft">{f.k}</dt>
                  <dd className="mt-3 font-serif text-xl text-navy-deep">{f.v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1.1, ease }}
            className="relative mx-auto w-full max-w-md lg:max-w-lg"
          >
            <motion.div
              aria-hidden className="transition-glass absolute -inset-4 -z-10 md:-inset-6"
              animate={{ opacity: [0.45, 0.75, 0.45], rotate: [-1.5, 1.5, -1.5] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="blue-portrait-frame relative aspect-[4/5] overflow-hidden">
              <div className="dossier-grid absolute inset-0 opacity-40" aria-hidden />
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <User className="mx-auto size-10 stroke-[0.9] text-cobalt/60" />
                  <p className="mt-6 font-serif text-4xl font-light text-navy-deep">{site.initials}</p>
                </div>
              </div>
              <motion.div
                aria-hidden className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                animate={{ x: ["-120%", "320%"] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.5 }}
              />
              <span className="glass-label absolute bottom-5 left-5 md:bottom-6 md:left-6">{p.portrait.caption}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
