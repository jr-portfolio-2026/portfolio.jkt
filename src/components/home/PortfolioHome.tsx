import { MotionConfig } from "motion/react";
import { Contact } from "./Contact";
import { Contexts } from "./Contexts";
import { Hero } from "./Hero";
import { Method } from "./Method";
import { Practice } from "./Practice";
import { Presentation } from "./Presentation";
import { SiteHeader } from "./SiteHeader";
import { Work } from "./Work";

/**
 * Homepage = an ordered list of sections. Reorder, add or remove them here.
 * `ready` becomes true when the intro hands over, so the hero's entrance plays as the page is revealed.
 */
export function PortfolioHome({ ready }: { ready: boolean }) {
  return (
    // reducedMotion="user": JS-driven animations honour the visitor's OS setting too.
    <MotionConfig reducedMotion="user">
      <div className="paper-surface relative min-h-screen overflow-x-clip">
        <a href="#main" className="skip-link">Skip to content</a>
        <div className="grain-overlay fixed" aria-hidden />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero ready={ready} />
          <Presentation />
          <Work />
          <Practice />
          <Method />
          <Contexts />
          <Contact />
        </main>
      </div>
    </MotionConfig>
  );
}
