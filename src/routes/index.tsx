import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { PortfolioHome } from "@/components/home/PortfolioHome";
import { IntroContext } from "@/components/intro/IntroContext";
import { IntroSequence } from "@/components/intro/IntroSequence";
import { intro } from "@/content/intro";
import { site } from "@/content/site";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => pageHead({ title: site.meta.title, description: site.meta.description, path: "/" }),
  component: Home,
});

function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem(intro.storageKey) === "1";
  } catch {
    return false; // storage blocked: show the intro, it can always be skipped
  }
}

function setSeen(value: boolean) {
  try {
    if (value) window.sessionStorage.setItem(intro.storageKey, "1");
    else window.sessionStorage.removeItem(intro.storageKey);
  } catch {
    /* storage unavailable: nothing to remember */
  }
}

/**
 * pending = server render / first paint, before we know whether to show the intro
 * intro   = the sequence is on screen
 * done    = the homepage is revealed
 */
type Status = "pending" | "intro" | "done";

function Home() {
  const [status, setStatus] = useState<Status>("pending");

  useEffect(() => {
    setStatus(hasSeenIntro() ? "done" : "intro");
  }, []);

  // While the intro is up the page behind it must not scroll. Skip, Escape and the fail-safe always release this.
  useEffect(() => {
    if (status !== "intro") return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [status]);

  const finish = useCallback(() => {
    setSeen(true);
    setStatus("done");
    window.requestAnimationFrame(() => document.getElementById("main")?.focus({ preventScroll: true }));
  }, []);

  const replay = useCallback(() => {
    setSeen(false);
    window.scrollTo({ top: 0 });
    setStatus("intro");
  }, []);

  const control = useMemo(() => ({ replay }), [replay]);

  return (
    <IntroContext.Provider value={control}>
      {/* `inert` keeps keyboard focus out of the page while the intro covers it. */}
      <div data-home-shell inert={status === "intro"} style={{ opacity: status === "pending" ? 0 : 1 }}>
        <PortfolioHome ready={status === "done"} />
      </div>
      <AnimatePresence>{status === "intro" && <IntroSequence key="intro" onFinish={finish} />}</AnimatePresence>
    </IntroContext.Provider>
  );
}
