import { MotionConfig } from "motion/react";
import { Capabilities } from "./Capabilities";
import { Contact } from "./Contact";
import { Contexts } from "./Contexts";
import { Fields } from "./Fields";
import { Hero } from "./Hero";
import { Method } from "./Method";
import { Position } from "./Position";
import { Presentation } from "./Presentation";
import { SiteHeader } from "./SiteHeader";
import { Work } from "./Work";

/** Homepage = an ordered list of sections. Reorder, add or remove them here. */
export function PortfolioHome() {
  return (
    // reducedMotion="user": JS-driven animations honour the visitor's OS setting too.
    <MotionConfig reducedMotion="user">
      <div className="paper-surface relative min-h-screen overflow-x-clip">
        <div className="grain-overlay fixed" aria-hidden />
        <SiteHeader />
        <main>
          <Hero />
          <Position />
          <Presentation />
          <Fields />
          <Work />
          <Method />
          <Capabilities />
          <Contexts />
          <Contact />
        </main>
      </div>
    </MotionConfig>
  );
}
