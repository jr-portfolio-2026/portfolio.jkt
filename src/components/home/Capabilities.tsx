import { motion } from "motion/react";
import { home } from "@/content/home";
import { reveal } from "./motion";
import { SectionHeading } from "./SectionHeading";

export function Capabilities() {
  const c = home.capabilities;
  return (
    <section className="px-6 py-16 md:px-10 md:py-36" aria-label={c.title}>
      <div className="mx-auto max-w-[90rem]">
        <SectionHeading index={c.index} title={c.title} note={c.note} />
        <ul className="mt-12 grid border-t border-navy/10 md:mt-16 md:grid-cols-2">
          {c.items.map((item, i) => (
            <motion.li key={item} {...reveal}
              className={`flex items-baseline gap-5 border-b border-navy/10 py-5 md:py-6 ${i % 2 === 0 ? "md:pr-10" : "md:border-l md:pl-10"}`}>
              <span className="meta-label text-[oklch(0.5_0.09_80)]">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-serif text-xl text-navy-deep md:text-2xl">{item}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
