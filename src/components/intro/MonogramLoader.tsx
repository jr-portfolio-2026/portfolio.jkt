import { motion } from "motion/react";
import { intro } from "@/content/intro";
import { site } from "@/content/site";

const FONT = "Cormorant Garamond, Times New Roman, serif";

/**
 * Identity scene mark, drawn on the saturated blue ground: a layered mist outline, a paper-coloured
 * body and a slow gold foil sweep. It acts as the loading mark: a hairline fills while it holds.
 * Uses the configured initials, so a new owner only edits site.ts.
 */
export function MonogramLoader({ animated = true }: { animated?: boolean }) {
  const text = site.initials;
  const common = {
    x: "50%",
    y: "58%",
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    fontFamily: FONT,
    fontWeight: 400,
    fontSize: 240,
    letterSpacing: 6,
  };

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={animated ? { opacity: 0, scale: 0.97 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: animated ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg viewBox="0 0 600 300" className="h-[30vmin] min-h-36 w-auto" role="img" aria-label={`${text} monogram`}>
        <defs>
          {animated && (
            <filter id="mono-liquid" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="3" result="noise">
                <animate attributeName="baseFrequency" values="0.012;0.02;0.008;0.012" dur="9s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" xChannelSelector="R" yChannelSelector="G" scale="10">
                <animate attributeName="scale" values="16;6;10;4;8" dur="6s" repeatCount="indefinite" />
              </feDisplacementMap>
            </filter>
          )}
          <linearGradient id="mono-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fcfbf8" />
            <stop offset="100%" stopColor="#c8dce3" />
          </linearGradient>
          <linearGradient id="mono-foil" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ab894b" stopOpacity="0" />
            <stop offset="45%" stopColor="#ab894b" stopOpacity="0" />
            <stop offset="50%" stopColor="#e5cf9a" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ab894b" stopOpacity="0" />
            <stop offset="100%" stopColor="#ab894b" stopOpacity="0" />
            {animated && <animate attributeName="x1" values="-1;1" dur="4.8s" repeatCount="indefinite" />}
            {animated && <animate attributeName="x2" values="0;2" dur="4.8s" repeatCount="indefinite" />}
          </linearGradient>
          <mask id="mono-mask">
            <text {...common} fill="white">{text}</text>
          </mask>
        </defs>

        <g filter={animated ? "url(#mono-liquid)" : undefined}>
          <text {...common} fill="none" stroke="#c8dce3" strokeWidth="9" strokeLinejoin="round" opacity="0.5">{text}</text>
        </g>
        <text {...common} fill="url(#mono-body)">{text}</text>
        <g mask="url(#mono-mask)">
          <rect x="0" y="0" width="600" height="300" fill="url(#mono-foil)" />
        </g>
      </svg>

      <div className="mt-10 flex flex-col items-center gap-3">
        <div className="relative h-px w-44 overflow-hidden bg-cobalt-foreground/20" aria-hidden>
          <motion.div
            className="absolute inset-y-0 left-0 bg-gold-soft"
            initial={{ width: animated ? "0%" : "100%" }}
            animate={{ width: "100%" }}
            transition={{ duration: intro.identityMs / 1000 - 0.4, ease: "linear" }}
          />
        </div>
        <span className="meta-label !text-cobalt-foreground/80">{intro.labels.loading}</span>
      </div>
    </motion.div>
  );
}
