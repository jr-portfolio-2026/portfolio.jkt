import { motion } from "motion/react";
import { reveal } from "./motion";

export function SectionHeading({
  title, inverse = false, id,
}: { title: string; inverse?: boolean; id?: string }) {
  return (
    <motion.div {...reveal}>
      <h2 id={id} className={`font-serif text-4xl font-light md:text-6xl ${inverse ? "text-primary-foreground" : "text-relief"}`}>{title}</h2>
    </motion.div>
  );
}
