import { motion, useReducedMotion } from "motion/react";
import { kinds, projects, type ProjectKind } from "@/content/projects";
import { ease } from "./motion";

/**
 * "How far along is it?" — the honesty of the whole section in one line.
 * Three stops from Concept to Working application; coursework sits apart, because it is
 * a different kind of thing, not an earlier stage. Position comes only from `project.kind`.
 */
const STOPS: ProjectKind[] = ["concept", "prototype", "application"];
// Coursework only gets its own detached stop while a project of that kind exists.
const HAS_ACADEMIC = projects.some((p) => p.kind === "academic");
const POSITION: Record<ProjectKind, number> = { concept: 0, prototype: 1, demonstration: 1.5, application: 2, academic: -1 };

export function StatusRail({ kind, label }: { kind: ProjectKind; label: string }) {
  const reduce = useReducedMotion();
  const at = POSITION[kind];
  const apart = kind === "academic";
  const t = reduce ? { duration: 0 } : { duration: 0.8, ease };

  return (
    <div role="img" aria-label={`${label}: ${kinds[kind].label}`}>
      <p className="meta-soft mb-5" aria-hidden>{label}</p>
      <div aria-hidden className={`grid items-start gap-x-8 gap-y-6 ${HAS_ACADEMIC ? "sm:grid-cols-[minmax(0,1fr)_auto]" : ""}`}>
        <div>
          <div className="relative mx-[5px] h-3">
            <span className="absolute inset-x-0 top-1/2 h-px bg-navy/20" />
            <motion.span
              className="absolute inset-x-0 top-1/2 h-px origin-left bg-gold"
              initial={false} animate={{ scaleX: Math.max(at, 0) / 2 }} transition={t}
            />
            {STOPS.map((s, i) => (
              <span
                key={s}
                className={`absolute top-1/2 size-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-500 ${at >= i ? "border-gold bg-gold" : "border-navy/30 bg-ivory"}`}
                style={{ left: `${i * 50}%` }}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[0.6875rem] leading-4 tracking-[0.04em]">
            {STOPS.map((s, i) => (
              <span
                key={s}
                className={`${i === 1 ? "text-center" : i === 2 ? "text-right" : ""} transition-colors duration-500 ${kind === s ? "font-semibold text-navy-deep" : "text-ink-soft/70"}`}
              >
                {kinds[s].label}
              </span>
            ))}
          </div>
        </div>

        {HAS_ACADEMIC && (
        <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-3">
          <div className="relative h-3 w-10 sm:w-full sm:min-w-28">
            <span className="absolute inset-x-0 top-1/2 border-t border-dotted border-navy/30" />
            <span className={`absolute right-0 top-1/2 size-[10px] -translate-y-1/2 rounded-full border transition-colors duration-500 ${apart ? "border-gold bg-gold" : "border-navy/30 bg-ivory"}`} />
          </div>
          <span className={`text-[0.6875rem] leading-4 tracking-[0.04em] transition-colors duration-500 ${apart ? "font-semibold text-navy-deep" : "text-ink-soft/70"}`}>
            {kinds.academic.label}
          </span>
        </div>
        )}
      </div>
    </div>
  );
}
