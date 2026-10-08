import { motion } from "motion/react";
import { reveal } from "./motion";

export function SectionHeading({
  index, title, note, inverse = false,
}: { index: string; title: string; note: string; inverse?: boolean }) {
  return (
    <motion.div {...reveal} className="grid items-baseline gap-x-5 gap-y-2 md:grid-cols-[4rem_1fr_auto]">
      <span className={`font-serif text-xl ${inverse ? "text-[oklch(0.8_0.085_82)]" : "text-[oklch(0.5_0.09_80)]"}`}>{index}</span>
      <h2 className={`font-serif text-4xl font-light md:text-6xl ${inverse ? "text-primary-foreground" : "text-relief"}`}>{title}</h2>
      <span className={`meta-label ${inverse ? "text-primary-foreground/70" : "meta-soft"}`}>{note}</span>
    </motion.div>
  );
}
