import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Copy, X } from "lucide-react";
import { intro } from "@/content/intro";
import { site } from "@/content/site";
import { useIntroControl } from "@/components/intro/IntroContext";
import { Mark } from "@/components/ui/Mark";
import { ease } from "./motion";

const contact = {
  label: "Contact me",
  rotatingWords: ["Connect.", "Exchange ideas.", "Talk business.", "Collaborate.", "Meet."],
  invitationLines: ["Always discovering.", "Always learning.", "Always making.", "And always open to what comes next."],
  openLabel: "Get in touch",
  closeLabel: "Close",
  panelTitle: "Let's start a conversation.",
  panelBody: "Have a project, opportunity or idea in mind? Send a note.",
  copyLabel: "Copy email",
  copiedLabel: "Email copied",
  writeLabel: "Write an email",
  footerLine: "Law · Trade · Strategy · Software",
} as const;

export function Contact() {
  const c = contact;
  const linkedinUrl = site.links.linkedin || "https://www.linkedin.com/in/your-profile";
  const { replay } = useIntroControl();
  const reduce = !!useReducedMotion();
  const [open, setOpen] = useState(false);
  const [word, setWord] = useState(0);
  const [copied, setCopied] = useState(false);
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const links = [
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "GitHub", href: site.links.github },
  ].filter((link) => link.href);

  useEffect(() => {
    if (reduce || open) return;
    const interval = window.setInterval(() => setWord((current) => (current + 1) % c.rotatingWords.length), 3000);
    return () => window.clearInterval(interval);
  }, [c.rotatingWords.length, open, reduce]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeContact();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const openContact = () => {
    setOpen(true);
    window.requestAnimationFrame(() => closeButton.current?.focus());
  };

  const closeContact = () => {
    setOpen(false);
    window.requestAnimationFrame(() => openButton.current?.focus());
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const panelTransition = reduce ? { duration: 0 } : { duration: 0.85, ease };
  const wordTransition = reduce ? { duration: 0 } : { duration: 0.6, ease };

  return (
    <motion.section
      id="contact"
      aria-labelledby="contact-title"
      animate={{ backgroundColor: open ? "#0B1F37" : "#F9F6EE", color: open ? "#F9F6EE" : "#0B1F37" }}
      transition={panelTransition}
      className="relative isolate overflow-hidden px-6 pb-8 pt-20 md:px-10 md:pt-28"
    >
      <div className="mx-auto flex min-h-[82svh] max-w-[90rem] flex-col border-t border-current/15 pt-8 md:min-h-[88svh] md:pt-10">
        <div className="flex items-center justify-between gap-6">
          <motion.span animate={{ color: open ? "#C8DCE3" : "#8A6A24" }} className="font-serif text-xl font-medium">
            {c.label}
          </motion.span>
          <AnimatePresence>
            {open && (
              <motion.button
                initial={{ opacity: 0, y: reduce ? 0 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                transition={panelTransition}
                ref={closeButton}
                type="button"
                onClick={closeContact}
                className="z-20 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#F9F6EE] hover:text-[#C8DCE3]"
              >
                {c.closeLabel}<X className="size-4" aria-hidden />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="relative flex min-h-[46rem] flex-1 md:min-h-[44rem]">
          <motion.div
            aria-hidden={open}
            inert={open}
            animate={{ opacity: open ? 0 : 1, x: open && !reduce ? "-7%" : 0, scale: open && !reduce ? 0.985 : 1 }}
            transition={panelTransition}
            className={`grid w-full items-center gap-20 py-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-32 ${open ? "pointer-events-none" : ""}`}
          >
            <div>
              <h2 id={open ? undefined : "contact-title"} className="font-sans font-semibold uppercase tracking-[-0.055em] text-navy-deep">
                <span className="sr-only">Let's {c.rotatingWords.join(" Let's ")}</span>
                <span aria-hidden className="block">
                  <span className="block text-[clamp(3.35rem,7.8vw,8.2rem)] leading-[0.86]">Let's</span>
                  <span className="relative mt-3 block h-[0.92em] max-w-full overflow-hidden text-[clamp(2.45rem,6.3vw,7rem)] leading-[0.88] md:mt-5">
                    <span className="invisible block whitespace-nowrap">Exchange ideas.</span>
                    <AnimatePresence initial={false}>
                      <motion.span
                        key={word}
                        initial={{ opacity: reduce ? 1 : 0, y: reduce ? "0%" : "105%" }}
                        animate={{ opacity: 1, y: "0%" }}
                        exit={{ opacity: reduce ? 1 : 0, y: reduce ? "0%" : "-105%" }}
                        transition={wordTransition}
                        className="absolute inset-x-0 top-0 block whitespace-nowrap"
                      >
                        {c.rotatingWords[word]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </h2>
              <p className="mt-16 max-w-5xl font-serif text-[clamp(2rem,3.2vw,3.5rem)] font-light leading-[1.1] tracking-[-0.02em] text-ink-soft">
                <span className="block">{c.invitationLines.slice(0, 3).join(" ")}</span>
                <span className="mt-5 block max-w-[24ch] text-gold-ink">{c.invitationLines[3]}</span>
              </p>
            </div>

            <button
              ref={openButton}
              type="button"
              onClick={openContact}
              className="group relative grid size-52 shrink-0 place-items-center rounded-full bg-gold text-center text-navy-deep shadow-paper transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.025] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold md:size-60"
            >
              <span aria-hidden className="absolute -inset-3 rounded-full border border-navy-deep/25" />
              <span className="flex max-w-32 items-center justify-center gap-2 font-serif text-2xl leading-tight md:text-3xl">
                {c.openLabel}<ArrowUpRight className="size-6 shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
              </span>
            </button>
          </motion.div>

          <AnimatePresence>
            {open && (
              <motion.div
                key="correspondence"
                initial={{ x: reduce ? 0 : "105%" }}
                animate={{ x: 0 }}
                exit={{ x: reduce ? 0 : "105%" }}
                transition={panelTransition}
                className="absolute inset-0 z-10 grid items-center bg-[#0B1F37] py-20 text-[#F9F6EE] lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.58fr)] lg:gap-32"
              >
                <h2 id="contact-title" className="max-w-[10ch] font-serif text-[clamp(4rem,8.5vw,8.5rem)] font-light leading-[0.88] tracking-[-0.025em]">
                  {c.panelTitle}
                </h2>
                <div className="mt-14 border-t border-[#C8DCE3]/25 pt-12 lg:mt-0 lg:border-l lg:border-t-0 lg:pb-4 lg:pl-16 lg:pt-4">
                  <p className="max-w-lg font-serif text-2xl font-light leading-snug text-[#C8DCE3] md:text-3xl">{c.panelBody}</p>

                  <div className="mt-12 rounded-[2rem] bg-[#F7F4ED] p-4 text-navy-deep shadow-[0_24px_60px_-28px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.9)] md:p-5">
                    <a href={`mailto:${site.email}`} className="group flex min-h-24 items-center justify-between gap-5 rounded-[1.4rem] bg-[#FCFBF8] px-5 shadow-[0_10px_22px_-14px_rgba(15,30,53,0.55),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_28px_-14px_rgba(15,30,53,0.6),inset_0_1px_0_rgba(255,255,255,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A2C95]">
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold tracking-[0.12em] text-[#23345A]/55">Email address</span>
                        <span className="mt-1 block truncate font-serif text-xl text-[#0F1E35] md:text-2xl">{site.email}</span>
                      </span>
                      <ArrowUpRight className="size-5 shrink-0 text-[#1A2C95] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
                    </a>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={copyEmail}
                        className={`group inline-flex min-h-14 items-center justify-between gap-4 rounded-full px-6 text-sm font-semibold shadow-[0_10px_20px_-12px_rgba(15,30,53,0.75),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:shadow-[0_4px_10px_-6px_rgba(15,30,53,0.7),inset_0_2px_5px_rgba(15,30,53,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A2C95] ${copied ? "bg-[#AB894B] text-[#0F1E35]" : "bg-[#1A2C95] text-[#FCFBF8]"}`}
                      >
                        {copied ? c.copiedLabel : c.copyLabel}
                        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4 transition-transform group-hover:scale-110" aria-hidden />}
                      </button>

                      <a href={`mailto:${site.email}`} className="group inline-flex min-h-14 items-center justify-between gap-4 rounded-full bg-[#FCFBF8] px-6 text-sm font-semibold text-[#23345A] shadow-[0_10px_20px_-12px_rgba(15,30,53,0.5),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-300 hover:-translate-y-1 hover:text-[#1A2C95] active:translate-y-0 active:shadow-[0_4px_10px_-6px_rgba(15,30,53,0.45),inset_0_2px_5px_rgba(15,30,53,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A2C95]">
                        {c.writeLabel}<ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
                      </a>
                    </div>

                    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="group mt-4 inline-flex min-h-14 w-full items-center justify-between gap-4 rounded-full bg-[#C8DCE3] px-6 text-sm font-semibold text-[#153765] shadow-[0_10px_20px_-12px_rgba(15,30,53,0.5),inset_0_1px_0_rgba(255,255,255,0.75)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#B9D0D8] hover:shadow-[0_16px_26px_-14px_rgba(15,30,53,0.58),inset_0_1px_0_rgba(255,255,255,0.8)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A2C95]">
                      <span>LinkedIn</span>
                      <span className="inline-flex items-center gap-3 text-xs font-medium tracking-[0.08em] text-[#153765]/70">
                        View profile
                        <ArrowUpRight className="size-4 text-[#1A2C95] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
                      </span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="relative z-20 flex flex-col gap-5 border-t border-current/15 py-7 md:flex-row md:items-center md:justify-between">
          <Mark className={open ? "text-xl text-[#F9F6EE]" : "text-xl"} />
          <span className={open ? "meta-soft text-[#C8DCE3]" : "meta-soft"}>{c.footerLine}</span>
          <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={open ? "meta-soft text-[#C8DCE3] hover:text-white" : "meta-soft hover:text-gold-ink"}>
                {link.label}
              </a>
            ))}
            <button type="button" onClick={replay} className={open ? "meta-soft text-[#C8DCE3] underline-offset-4 hover:underline" : "meta-soft underline-offset-4 hover:underline"}>
              {intro.labels.replay}
            </button>
            <span className={open ? "meta-soft text-[#C8DCE3]" : "meta-soft"}>© {site.year}</span>
          </span>
        </footer>
      </div>
    </motion.section>
  );
}
