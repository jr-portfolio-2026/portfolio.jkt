import { motion } from "motion/react";
import { home } from "@/content/home";
import { kinds } from "@/content/projects";
import { reveal } from "./motion";

/**
 * THE KEY — what each status word means, stated once, so every "Prototype" or
 * "Academic exercise" on the cards and case studies above reads as a stated fact,
 * not a vague impression. Five entries, read straight from content/projects.ts.
 */
export function StatusLegend() {
  const w = home.work;
  const entries = Object.values(kinds);

  return (
    <motion.div {...reveal} className="border-t border-navy/10 pt-10 md:pt-12">
      <p className="meta-label text-gold-ink">{w.legend}</p>
      <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-10">
        {entries.map((k) => (
          <div key={k.label}>
            <dt className="font-serif text-[1.1875rem] font-light leading-tight text-relief">{k.label}</dt>
            <dd className="mt-2 text-[0.8125rem] leading-5 text-ink-soft">{k.note}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}
