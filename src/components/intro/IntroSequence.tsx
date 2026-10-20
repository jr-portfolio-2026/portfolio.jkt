import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { intro } from "@/content/intro";
import { site } from "@/content/site";
import { Mark } from "@/components/ui/Mark";
import { MonogramLoader } from "./MonogramLoader";

const ease = [0.22, 1, 0.36, 1] as const;
const breath = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -14, filter: "blur(6px)" },
};

type Phase = "welcome" | "identity";

/**
 * Ivory welcomes → saturated blue identity scene → the page is revealed as the panel lifts away.
 * Always completable: Skip button, Escape, Enter on the identity scene, and a fail-safe timer.
 * With reduced motion there is no timed cycling: one static scene and an explicit Enter button.
 */
export function IntroSequence({ onFinish }: { onFinish: () => void }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>(reduce ? "identity" : "welcome");
  const rootRef = useRef<HTMLDivElement>(null);
  const last = intro.welcomes.length - 1;

  const advance = useCallback(() => {
    if (phase !== "welcome") return;
    if (step < last) setStep((s) => s + 1);
    else setPhase("identity");
  }, [phase, step, last]);

  // Automatic progression, about 1.6 s per welcome (never with reduced motion).
  useEffect(() => {
    if (reduce || phase !== "welcome") return;
    const t = window.setTimeout(advance, intro.welcomeMs);
    return () => window.clearTimeout(t);
  }, [reduce, phase, step, advance]);

  // The identity scene holds, then hands over to the page. With reduced motion the visitor decides.
  useEffect(() => {
    if (reduce || phase !== "identity") return;
    const t = window.setTimeout(onFinish, intro.identityMs);
    return () => window.clearTimeout(t);
  }, [reduce, phase, onFinish]);

  // Guaranteed completion path.
  useEffect(() => {
    const t = window.setTimeout(onFinish, intro.failSafeMs);
    return () => window.clearTimeout(t);
  }, [onFinish]);

  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onFinish();
      const onControl = e.target instanceof HTMLElement && e.target.closest("button, a");
      if (onControl) return; // let a focused button handle Enter / Space itself
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        if (phase === "welcome") advance();
        else onFinish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, advance, onFinish]);

  const current = intro.welcomes[step] ?? intro.welcomes[0];
  const onBlue = phase === "identity";

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={intro.labels.dialog}
      tabIndex={-1}
      className="paper-surface fixed inset-0 z-[60] overflow-hidden outline-none select-none"
      onClick={advance}
      exit={reduce ? { opacity: 0 } : { y: "-100%" }}
      transition={{ duration: reduce ? 0.2 : 0.95, ease }}
      style={{ cursor: phase === "welcome" ? "pointer" : "default" }}
    >
      <div className="grain-overlay" aria-hidden />
      <div className="fiber-overlay" aria-hidden />

      {/* Saturated blue identity scene: rises over the ivory (transform only). */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-cobalt"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 20%, color-mix(in oklch, var(--signal) 70%, white) 0%, transparent 62%), linear-gradient(160deg, var(--signal), var(--cobalt-deep))",
        }}
        initial={{ y: reduce ? "0%" : "100%" }}
        animate={{ y: onBlue ? "0%" : "100%" }}
        transition={{ duration: reduce ? 0 : 1, ease }}
      />

      <Corner className="left-6 top-6 md:left-12 md:top-10">
        <Mark className={`text-2xl tracking-[0.08em] transition-colors duration-700 ${onBlue ? "text-cobalt-foreground" : "text-relief"}`} />
      </Corner>
      <Corner className="right-6 top-6 text-right md:right-12 md:top-10">
        <span className={`meta-label ${onBlue ? "!text-cobalt-foreground/85" : ""}`}>{site.portfolioLabel}</span>
        <span className={`meta-label tabular-nums ${onBlue ? "!text-cobalt-foreground/70" : "opacity-60"}`}>{site.year}</span>
      </Corner>
      <Corner className="bottom-6 left-6 md:bottom-10 md:left-12">
        <span className={`meta-label ${onBlue ? "!text-cobalt-foreground/85" : ""}`}>{site.disciplines.join(" · ")}</span>
      </Corner>
      <Corner className="bottom-6 right-6 items-end text-right md:bottom-10 md:right-12">
        <span className={`meta-label ${onBlue ? "!text-cobalt-foreground/85" : ""}`}>{intro.welcomes.map((w) => w.code).join(" · ")}</span>
        <span className={`meta-label tabular-nums ${onBlue ? "!text-cobalt-foreground/70" : "opacity-60"}`}>
          {phase === "welcome" ? `${String(step + 1).padStart(2, "0")} / ${String(intro.welcomes.length).padStart(2, "0")}` : "— / —"}
        </span>
      </Corner>

      {/* Visible Skip control — present in every phase. */}
      <div className="absolute inset-x-0 top-6 z-10 flex justify-center md:top-9">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFinish();
          }}
          className={`meta-label inline-flex min-h-11 items-center border px-5 transition-colors duration-700 ${
            onBlue ? "border-cobalt-foreground/40 !text-cobalt-foreground hover:bg-cobalt-foreground/10" : "border-navy/25 hover:bg-mist/30"
          }`}
        >
          {intro.labels.skip}
        </button>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {phase === "welcome" ? (
            <motion.div
              key={current?.code}
              className="flex flex-col items-center gap-8"
              variants={breath}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.62, ease }}
              aria-live="polite"
            >
              <p
                lang={current?.lang}
                className="text-relief text-center font-serif text-[clamp(2.75rem,7.5vw,6.5rem)] leading-[1.05] font-light text-balance"
              >
                {current?.word}
              </p>
              <div className="gold-hairline w-24" />
              <span className="meta-soft">{current?.code}</span>
            </motion.div>
          ) : (
            <motion.div key="identity" className="flex flex-col items-center" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <MonogramLoader animated={!reduce} />
              {reduce && (
                <>
                  <p className="mt-8 max-w-md text-center font-serif text-2xl text-cobalt-foreground/90">
                    {intro.welcomes.map((w) => w.word).join(" ")}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFinish();
                    }}
                    className="meta-label pointer-events-auto mt-8 inline-flex min-h-11 items-center border border-cobalt-foreground/50 px-6 !text-cobalt-foreground hover:bg-cobalt-foreground/10"
                  >
                    {intro.labels.enter}
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {phase === "welcome" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center md:bottom-28">
          <span className="meta-soft">{intro.labels.advance}</span>
        </div>
      )}
    </motion.div>
  );
}

function Corner({ className, children }: { className: string; children: ReactNode }) {
  return <div className={`pointer-events-none absolute flex flex-col gap-1 ${className}`}>{children}</div>;
}
