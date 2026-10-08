import { motion } from "motion/react";
import { home } from "@/content/home";
import { reveal } from "./motion";

export function Position() {
  return (
    <section className="px-6 py-16 md:px-10 md:py-32" aria-label="Positioning statement">
      <motion.div {...reveal} className="dossier-visual relative mx-auto max-w-[90rem] overflow-hidden !min-h-0">
        <div className="dossier-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="relative ml-auto flex min-h-[26rem] max-w-4xl items-end p-4 md:min-h-[34rem] md:p-14">
          <div className="dossier-glass w-full p-6 md:p-12">
            <span className="meta-label">{home.position.label}</span>
            <p className="mt-6 font-serif text-3xl leading-tight text-navy-deep md:mt-8 md:text-5xl">{home.position.text}</p>
            <div className="mt-8 gold-hairline w-36 md:mt-9" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
