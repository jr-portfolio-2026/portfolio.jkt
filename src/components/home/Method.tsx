import { motion } from "motion/react";
import { home } from "@/content/home";
import { reveal } from "./motion";
import { SectionHeading } from "./SectionHeading";

export function Method() {
  const m = home.method;
  return (
    <section id="method" className="bg-navy px-6 py-16 text-primary-foreground md:px-10 md:py-36">
      <div className="mx-auto max-w-[90rem]">
        <SectionHeading index={m.index} title={m.title} note={m.note} inverse />
        <motion.p {...reveal} className="mt-12 max-w-3xl font-serif text-3xl leading-snug md:mt-16 md:text-4xl">{m.statement}</motion.p>
        <ol className="mt-14 grid gap-px bg-ivory/15 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {m.steps.map((step, i) => (
            <motion.li key={step} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }} className="min-h-40 bg-navy p-6 md:min-h-52 md:p-7">
              <span className="font-serif text-xl text-gold-soft">0{i + 1}</span>
              <p className="mt-10 max-w-56 font-serif text-2xl leading-snug md:mt-16">{step}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
