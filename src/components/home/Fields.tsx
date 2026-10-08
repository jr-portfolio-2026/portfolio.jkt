import { motion } from "motion/react";
import { ArrowUpRight, Globe2, Scale, Waypoints, type LucideIcon } from "lucide-react";
import { home } from "@/content/home";
import { reveal } from "./motion";
import { SectionHeading } from "./SectionHeading";

const icons: Record<string, LucideIcon> = { law: Scale, business: Globe2, trade: Waypoints, software: ArrowUpRight };

export function Fields() {
  const f = home.fields;
  return (
    <section id="fields" className="px-6 py-16 md:px-10 md:py-36">
      <div className="mx-auto max-w-[90rem]">
        <SectionHeading index={f.index} title={f.title} note={f.note} />
        <div className="mt-12 border-t border-navy/10 md:mt-16">
          {f.items.map((item, i) => {
            const Icon = icons[item.icon] ?? ArrowUpRight;
            return (
              <motion.article
                key={item.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.07 }}
                className="grid grid-cols-[2.5rem_1fr] gap-x-3 gap-y-4 border-b border-navy/10 py-8 md:grid-cols-[4rem_3rem_1fr_1.2fr] md:items-start md:gap-6 md:py-9"
              >
                <span className="font-serif text-xl text-[oklch(0.5_0.09_80)]">{item.n}</span>
                <Icon className="hidden size-5 stroke-[1.25] text-navy/60 md:mt-1 md:block" aria-hidden />
                <h3 className="font-serif text-3xl font-light text-relief md:text-4xl">{item.title}</h3>
                <div className="col-start-2 md:col-start-auto">
                  <p className="max-w-lg text-sm leading-7 text-muted-foreground">{item.text}</p>
                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    {item.tags.map((t) => <li key={t} className="meta-soft">{t}</li>)}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
