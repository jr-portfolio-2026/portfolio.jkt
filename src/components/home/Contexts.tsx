import { motion } from "motion/react";
import { home } from "@/content/home";
import { reveal } from "./motion";
import { SectionHeading } from "./SectionHeading";

export function Contexts() {
  const c = home.context;
  return (
    <section id="context" className="px-6 py-16 md:px-10 md:py-36">
      <div className="mx-auto max-w-[90rem]">
        <SectionHeading index={c.index} title={c.title} note={c.note} />
        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-[.7fr_1.3fr] lg:gap-14">
          <motion.p {...reveal} className="max-w-md font-serif text-3xl leading-snug text-navy-deep">{c.statement}</motion.p>
          <ul className="grid grid-cols-2 gap-px bg-navy/10 sm:grid-cols-3">
            {c.languages.map((lang, i) => (
              <motion.li key={lang} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="bg-ivory p-5 md:min-h-32">
                <span className="meta-soft block">0{i + 1}</span>
                <span className="mt-6 block font-serif text-2xl text-navy-deep md:mt-8">{lang}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
