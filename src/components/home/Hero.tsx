import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { home } from "@/content/home";
import { site } from "@/content/site";
import { ease } from "./motion";

export function Hero() {
  const h = home.hero;
  return (
    <section id="top" className="relative flex min-h-[92svh] items-end px-6 pb-12 pt-28 md:px-10 md:pb-20">
      <div className="relative mx-auto w-full max-w-[90rem]">
        <div className="mb-10 flex items-center justify-between gap-4 border-b border-navy/10 pb-4 md:mb-12">
          <span className="meta-label">{h.dossier}</span>
          <span className="meta-soft">{h.contexts}</span>
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_.8fr] lg:gap-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease }}>
            <p className="meta-label mb-6 text-[oklch(0.5_0.09_80)] md:mb-7">{site.name}</p>
            <h1 className="max-w-5xl font-serif text-[clamp(3.1rem,7vw,7.25rem)] leading-[.94] font-light text-relief">
              {h.headline.before}
              <em className="font-normal text-navy">{h.headline.emphasis}</em>
              {h.headline.after}
            </h1>
          </motion.div>

          <motion.div className="lg:pb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 1 }}>
            <p className="font-serif text-2xl leading-snug text-navy-deep">{h.lede}</p>
            <p className="mt-5 max-w-lg text-sm leading-7 text-navy-deep/75">{h.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="h-12 rounded-none px-7">
                <a href={h.primary.href}>{h.primary.label} <ArrowRight /></a>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-none border-navy/25 bg-ivory/60 px-7">
                <a href={h.secondary.href}>{h.secondary.label}</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      <span aria-hidden className="pointer-events-none absolute right-[-2vw] top-[12%] select-none font-serif text-[28vmin] leading-none text-navy/[0.03]">
        {site.initials}
      </span>
    </section>
  );
}
