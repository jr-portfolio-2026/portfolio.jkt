import { motion, useReducedMotion } from "motion/react";
import { ease } from "./motion";

/**
 * PROJECT PLATES — one per project, each drawn in that project's own codes.
 *
 * A plate has two layers:
 *   Field — the full-bleed material the card is made of (sea-chart hatch, vellum, linen, reeded glass).
 *           It is CSS only, always visible, and it is what the card looks like when folded.
 *   Art   — one drawing, set in the middle of the open card. It mounts when the card opens, so it
 *           plays each time the card is opened, and never while it is folded.
 *
 * Nothing here imitates an interface that does not exist. To add a project: add a `palette` entry,
 * a `fields` entry and an `art` entry below, all keyed by the project slug in content/projects.ts.
 */

/** Fine paper tooth and a coarser fibre, as two noise tiles. */
const noise = (freq: number | string, oct: number) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${oct}' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E")`;
const TOOTH = noise(0.85, 3);
const FIBRE = noise(0.0875, 2);
/** Long, thin fibres: the same noise stretched along one axis, as in laid paper. */
const LAID = noise("0.008333 0.3333", 3);

/** `ink` / `soft` read on the project's own field (its open state). `restInk` / `restSoft` read on paper (its resting state). */
type Palette = { field: string; ink: string; soft: string; dark: boolean; restInk: string; restSoft: string };

/** Each project's own colours, read from its own identity. */
export const palette: Record<string, Palette> = {
  fretio: { field: "#0D2E42", ink: "#E8F4F7", soft: "#1AB3C8", dark: true, restInk: "#0E3A54", restSoft: "#167A8A" },
  payote: { field: "#16305A", ink: "#F3F6FA", soft: "#6D8FC4", dark: true, restInk: "#1C3A66", restSoft: "#4667AE" },
  e4m: { field: "#E9EAD7", ink: "#195301", soft: "#006C65", dark: false, restInk: "#195301", restSoft: "#006C65" },
  pes: { field: "#E7E2DA", ink: "#3B3630", soft: "#8A8176", dark: false, restInk: "#3B3630", restSoft: "#6F665B" },
};
const fallback: Palette = { field: "#C8DCE3", ink: "#0B1F37", soft: "#153765", dark: false, restInk: "#0B1F37", restSoft: "#153765" };
export const toneOf = (slug: string) => palette[slug] ?? fallback;

const GOLD = "#AB894B";

/** The material of each card. Several layers, all quiet; together they give the surface its depth. */
const fields: Record<string, string> = {
  // A chart, not a hatch: the actual contour rings are drawn by FretioContours below.
  // This CSS layer only sets the ambient light the chart sits in — a glow where the
  // soundings originate, a pool of depth where they fade, a vignette at the edges.
  fretio: [
    "radial-gradient(90% 70% at 24% 14%, rgba(95,185,216,.16), transparent 55%)",
    "radial-gradient(75% 60% at 82% 88%, rgba(8,28,44,.55), transparent 58%)",
    "radial-gradient(130% 120% at 50% 50%, transparent 48%, rgba(4,14,24,.58))",
  ].join(","),
  // A seam: a dashed wireframe field on the left half, a placed block field on the right.
  payote: [
    "linear-gradient(90deg, transparent 49.6%, rgba(109,143,196,.6) 49.6% 50.4%, transparent 50.4%)",
    "repeating-linear-gradient(0deg, rgba(109,143,196,.1) 0 1px, transparent 1px 9px)",
    "radial-gradient(90% 70% at 12% 10%, rgba(109,143,196,.22), transparent 60%)",
    "radial-gradient(120% 120% at 50% 50%, transparent 52%, rgba(3,12,26,.62))",
  ].join(","),
  // The surface of the site itself: the sage ground of their pages, lit from the top left,
  // settling into their green at the edges. No pattern — the page is the subject here.
  e4m: [
    "radial-gradient(90% 70% at 26% 8%, rgba(255,255,255,.68), transparent 58%)",
    "linear-gradient(180deg, rgba(255,255,255,.38), transparent 44%)",
    "radial-gradient(120% 110% at 50% 50%, transparent 54%, rgba(46,90,30,.17))",
  ].join(","),
  // Reeded glass, full bleed, with light pooling.
  pes: [
    "linear-gradient(to top, rgba(231,226,218,.93) 0, rgba(231,226,218,.86) 34%, transparent 62%)", // calm the reeding under the words
    "radial-gradient(90% 70% at 25% 12%, rgba(255,255,255,.7), transparent 60%)",
    "repeating-linear-gradient(90deg, rgba(255,255,255,.58) 0 5px, rgba(59,54,48,.075) 5px 14px)",
    "radial-gradient(125% 125% at 50% 50%, transparent 55%, rgba(59,54,48,.18))",
  ].join(","),
};

/**
 * A closed, wavy ring: points around an ellipse, perturbed by two sine harmonics so it
 * reads as surveyed rather than drawn, joined with a smooth Catmull-Rom-to-Bezier curve.
 * Used for FRET.IO's chart — soundings around a depot, not decoration.
 */
function contourRing(cx: number, cy: number, r: number, amp: number, seed: number) {
  const N = 11;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const wobble = Math.sin(a * 3 + seed) * amp + Math.sin(a * 5 + seed * 1.6) * amp * 0.45;
    const rr = r + wobble;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.84]);
  }
  const d: string[] = [];
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N]!, p1 = pts[i]!, p2 = pts[(i + 1) % N]!, p3 = pts[(i + 2) % N]!;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(i === 0
      ? `M ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`
      : `C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`);
  }
  return d.join(" ") + " Z";
}

/** FRET.IO's field: depth contours fanning from one depot mark, in the brand's own cyan and gold. */
function FretioContours() {
  const CX = 96, CY = 132;
  const rings = [
    { r: 20, amp: 2.2, seed: 0.4, op: 0.5, dash: false },
    { r: 42, amp: 4.0, seed: 1.9, op: 0.36, dash: false },
    { r: 68, amp: 6.2, seed: 3.1, op: 0.24, dash: true },
    { r: 98, amp: 8.4, seed: 4.6, op: 0.17, dash: false },
    { r: 134, amp: 10.5, seed: 6.0, op: 0.11, dash: false },
    { r: 176, amp: 12.8, seed: 7.4, op: 0.07, dash: true },
  ];
  return (
    <svg
      viewBox="0 0 300 380" className="absolute inset-0 size-full" aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      {rings.map((ring, i) => (
        <path
          key={i}
          d={contourRing(CX, CY, ring.r, ring.amp, ring.seed)}
          fill="none"
          stroke="#5FB9D8"
          strokeWidth={i === 0 ? 1.1 : 0.7}
          strokeOpacity={ring.op}
          strokeDasharray={ring.dash ? "1 4" : undefined}
        />
      ))}
      {/* The depot itself — a single marked point the soundings radiate from. */}
      <circle cx={CX} cy={CY} r="2.2" fill={GOLD} opacity="0.75" />
    </svg>
  );
}

export function Field({ slug }: { slug: string }) {
  const p = toneOf(slug);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: p.field }} aria-hidden>
      <div className="absolute inset-0" style={{ backgroundImage: fields[slug] }} />
      {slug === "fretio" && <FretioContours />}
      <div
        className="absolute inset-0 opacity-[0.3] mix-blend-soft-light"
        style={{ backgroundImage: FIBRE, backgroundSize: "480px 480px" }}
      />
      <div
        className={`absolute inset-0 ${p.dark ? "opacity-[0.30] mix-blend-overlay" : "opacity-[0.22] mix-blend-multiply"}`}
        style={{ backgroundImage: TOOTH }}
      />
    </div>
  );
}

/** A transition factory: every step takes the card's opening into account, and none when motion is reduced. */
type T = (d: number, delay?: number) => { duration: number; delay: number; ease: typeof ease };
type ArtProps = { t: T };

/**
 * FRET.IO — a loading plan, settling.
 *
 * A container silhouette, side-on. Inside it, three dashed bays mark where cargo is
 * meant to go — the plan drawn before anything moves. Three pallets slide in from the
 * quay, one after another, and settle exactly onto their bay, which then fades: the
 * plan is realised. One motion, not a dashboard — no gauges, no ridges, no counters.
 */
function Fretio({ t }: ArtProps) {
  const p = palette.fretio!;
  const CY = "#5FB9D8";
  const G = "#C9A84C";
  const SETTLE: [number, number, number, number] = [0.3, 1.4, 0.4, 1];

  // Container, side view: a plain shell with one door seam toward the stern.
  const shell = { x: 20, y: 118, w: 260, h: 150, rx: 4 };

  // Three bays, left to right, each a pallet's resting place.
  const bays = [
    { x: 36, y: 142, w: 70, h: 102, from: -140, delay: 0.1 },
    { x: 115, y: 142, w: 70, h: 102, from: -180, delay: 0.42 },
    { x: 194, y: 142, w: 70, h: 102, from: -220, delay: 0.76 },
  ];

  return (
    <svg viewBox="0 0 300 380" className="size-full overflow-visible" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* Container silhouette */}
      <motion.rect
        x={shell.x} y={shell.y} width={shell.w} height={shell.h} rx={shell.rx}
        fill="none" stroke={p.soft} strokeWidth="1.5"
        initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} transition={t(0.6)}
      />
      <motion.line
        x1={shell.x + shell.w - 26} y1={shell.y} x2={shell.x + shell.w - 26} y2={shell.y + shell.h}
        stroke={p.soft} strokeWidth="1"
        initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={t(0.5, 0.1)}
      />
      {/* Ground line — the quay */}
      <motion.line
        x1="6" y1={shell.y + shell.h + 10} x2="294" y2={shell.y + shell.h + 10}
        stroke={p.soft} strokeWidth="1"
        initial={{ opacity: 0, pathLength: 0 }} animate={{ opacity: 0.22, pathLength: 1 }} transition={t(0.7)}
      />

      {/* The plan: three dashed bays, drawn first, each fading as its pallet lands */}
      {bays.map((b, i) => (
        <motion.rect
          key={`bay${i}`} x={b.x} y={b.y} width={b.w} height={b.h}
          fill="none" stroke={CY} strokeWidth="0.9" strokeDasharray="3 3"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.55, 0.55, 0] }}
          transition={{ ...t(1.1, 0.25), times: [0, 0.2, 0.7, 1], delay: 0.25 + b.delay * 0.12 }}
        />
      ))}

      {/* The cargo: slides in from the quay, settles onto its bay with a soft overshoot */}
      {bays.map((b, i) => (
        <motion.g
          key={`pallet${i}`}
          initial={{ x: b.from, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ ...t(0.9, b.delay), ease: SETTLE }}
        >
          <rect
            x={b.x} y={b.y} width={b.w} height={b.h} rx="1.5"
            fill={i === 2 ? G : CY} opacity={i === 2 ? 0.88 : 0.7 - i * 0.1}
          />
          {/* Two slats — a pallet, not a block */}
          {[0.32, 0.68].map((f, j) => (
            <rect key={j} x={b.x + 5} y={b.y + b.h * f - 0.7} width={b.w - 10} height="1.4" fill="rgba(5,16,26,.28)" />
          ))}
        </motion.g>
      ))}
    </svg>
  );
}

/** Payote — a seam crosses; the dashed wireframe gives way to placed blocks, one in gold. */
function Payote({ t }: ArtProps) {
  const p = palette.payote!;
  const bars = [
    { x: 14, y: 16, w: 74, h: 30, c: p.soft, o: 0.85 },
    { x: 94, y: 16, w: 36, h: 30, c: "#4667AE", o: 0.55 },
    { x: 14, y: 54, w: 48, h: 46, c: GOLD, o: 0.95 },
    { x: 68, y: 54, w: 62, h: 20, c: "#0996D4", o: 0.5 },
    { x: 68, y: 80, w: 62, h: 18, c: "#2C4A6B", o: 0.4 },
  ];
  return (
    <svg viewBox="0 0 300 380" className="size-full overflow-visible" aria-hidden preserveAspectRatio="xMidYMid meet">
      <g transform="translate(30 55) scale(1.72)">
        {bars.map((b, i) => (
          <motion.rect
            key={`w${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke={p.soft} strokeWidth="0.8" strokeDasharray="2.5 2.5"
            initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={t(0.7, 0.9)}
          />
        ))}
        {bars.map((b, i) => (
          <motion.rect
            key={`b${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} opacity={b.o}
            initial={{ opacity: 0 }} animate={{ opacity: b.o }} transition={t(0.7, 1)}
          />
        ))}
      </g>
      <motion.line
        x1="150" y1="20" x2="150" y2="360" stroke={GOLD} strokeWidth="1.4"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.9 }} transition={t(1.3, 0.1)}
      />
    </svg>
  );
}

/**
 * E4M — the charity's own mark, used as a loading mark, resolving into the site built for it.
 *
 * The logo is THEIRS and is never redrawn. public/projects/e4m/{mark,wordmark}.png are the exact
 * files from the project's own source with the background removed and nothing else changed. All
 * this component does is bring them in: the mark holds the frame while a gold ring closes around
 * it, then it settles into the header of a portrait of the page — their headline, their green,
 * their teal, the proportions of the site. Everything drawn around the logo is the website.
 */
function E4m({ t }: ArtProps) {
  const base = import.meta.env.BASE_URL;
  const MARK = `${base}projects/e4m/mark.png`;
  const WORD = `${base}projects/e4m/wordmark.png`;
  const GREEN = "#2E5A1E";      // their heading green
  const DEEP = "#1F4411";       // the band across the top of their site
  const TEAL = "#2A6B62";       // their second colour, the one the italic is set in
  const SHEET = "#FCFBF5";
  const hand = 1.95;            // the page composes after the mark has handed over

  return (
    <svg viewBox="0 0 420 300" className="size-full" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* ── The page ─────────────────────────────────────────────────────────── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(0.9, hand)}>
        <rect x="0.5" y="0.5" width="419" height="299" rx="3" fill={SHEET} stroke={GREEN} strokeOpacity="0.16" />
        <rect x="0.5" y="0.5" width="419" height="4" fill={DEEP} />

        {/* Header: their mark and wordmark, the nav, the donate button */}
        <image href={MARK} x="22" y="17" width="30" height="30" preserveAspectRatio="xMidYMid meet" />
        <image href={WORD} x="58" y="27" width="92" height="10" preserveAspectRatio="xMinYMid meet" />
        {[214, 250, 286].map((x) => (
          <rect key={x} x={x} y="31" width="24" height="2.4" rx="1.2" fill={GREEN} opacity="0.32" />
        ))}
        <rect x="336" y="22" width="62" height="20" rx="10" fill={GREEN} />
        <rect x="348" y="30" width="38" height="3.4" rx="1.7" fill={SHEET} opacity="0.9" />
        <rect x="0" y="58" width="420" height="1" fill={GREEN} opacity="0.12" />

        {/* The headline, as the site sets it: roman, with the second word italic in teal */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(0.8, hand + 0.3)}>
          <text x="26" y="116" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="29" fill={GREEN}>
            Building
            <tspan fill={TEAL} fontStyle="italic"> futures,</tspan>
          </text>
          <text x="26" y="149" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="29" fill={GREEN}>
            through education
          </text>
        </motion.g>

        {/* A line of body copy, then the two calls to action the page carries */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(0.8, hand + 0.45)}>
          {[[26, 176, 168], [26, 186, 146], [26, 196, 158]].map(([x, y, w], i) => (
            <rect key={i} x={x} y={y} width={w} height="3" rx="1.5" fill={GREEN} opacity="0.22" />
          ))}
          <rect x="26" y="218" width="74" height="22" rx="2" fill={GREEN} />
          <rect x="40" y="227" width="46" height="3.4" rx="1.7" fill={SHEET} opacity="0.9" />
          <rect x="110" y="218" width="86" height="22" rx="2" fill="none" stroke={GREEN} strokeWidth="1.2" strokeOpacity="0.55" />
          <rect x="124" y="227" width="58" height="3.4" rx="1.7" fill={GREEN} opacity="0.5" />
        </motion.g>

        {/* The photograph's place on the page — held, not borrowed */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(0.9, hand + 0.6)}>
          <rect x="256" y="92" width="140" height="148" rx="4" fill={TEAL} opacity="0.13" />
          <rect x="256" y="92" width="140" height="148" rx="4" fill="none" stroke={TEAL} strokeWidth="1" strokeOpacity="0.3" />
          <rect x="268" y="212" width="58" height="20" rx="3" fill={SHEET} />
          <rect x="276" y="220" width="36" height="3" rx="1.5" fill={GREEN} opacity="0.45" />
        </motion.g>

        {/* The row of figures along the foot, kept as marks: their numbers are theirs to state */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(0.8, hand + 0.75)}>
          <rect x="26" y="256" width="170" height="1" fill={GREEN} opacity="0.16" />
          {[26, 86, 146].map((x) => (
            <g key={x}>
              <rect x={x} y="268" width="18" height="7" rx="1.5" fill={GREEN} opacity="0.55" />
              <rect x={x} y="280" width="34" height="2.6" rx="1.3" fill={GREEN} opacity="0.25" />
            </g>
          ))}
        </motion.g>
      </motion.g>

      {/* ── The loading mark: their emblem, holding the frame, then handing over ──
          It starts opaque, so the plate opens on the mark and never flashes the page first. */}
      <motion.g
        initial={{ opacity: 1 }} animate={{ opacity: 0 }}
        transition={{ duration: t(0.55).duration, delay: t(0, hand).delay, ease }}
      >
        <rect x="0" y="0" width="420" height="300" fill={SHEET} />
        <image href={MARK} x="160" y="78" width="100" height="100" preserveAspectRatio="xMidYMid meet" />
        {/* the ring closes while it loads */}
        <circle cx="210" cy="128" r="76" fill="none" stroke={GREEN} strokeWidth="1" strokeOpacity="0.13" />
        <motion.circle
          cx="210" cy="128" r="76" fill="none" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round"
          transform="rotate(-90 210 128)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={t(1.45, 0.1)}
        />
        <rect x="150" y="232" width="120" height="2.5" rx="1.25" fill={GREEN} opacity="0.14" />
        <motion.rect
          x="150" y="232" width="120" height="2.5" rx="1.25" fill={GREEN} opacity="0.55"
          style={{ transformBox: "fill-box", transformOrigin: "left" }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={t(1.45, 0.1)}
        />
      </motion.g>
    </svg>
  );
}

/** PES — a pane of mist glass; four marks resolve in turn and light passes across. */
function Pes({ t }: ArtProps) {
  const p = palette.pes!;
  return (
    <div className="relative mx-auto h-full max-w-full aspect-[4/5] overflow-hidden border" style={{ background: "rgba(252,250,247,0.88)", borderColor: "rgba(59,54,48,0.18)" }} aria-hidden>
      <div className="absolute inset-x-[14%] top-[18%] flex flex-col gap-[clamp(1.75rem,6.5vh,3.25rem)]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <motion.span
              className="block size-[11px] rotate-45 border"
              style={{ borderColor: i === 1 ? GOLD : p.soft, background: i === 1 ? GOLD : "transparent" }}
              initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={t(0.6, 0.5 + i * 0.4)}
            />
            <motion.span
              className="block h-[2.5px] flex-1 origin-left rounded-full"
              style={{ background: p.ink, opacity: 0.5 }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={t(0.6, 0.6 + i * 0.4)}
            />
          </div>
        ))}
      </div>
      <motion.span
        className="absolute inset-x-[14%] bottom-[14%] block h-px origin-left"
        style={{ background: GOLD }}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={t(1, 2.2)}
      />
      <motion.div
        className="pointer-events-none absolute inset-y-0 w-2/5"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,.85), transparent)" }}
        initial={{ x: "-130%" }} animate={{ x: "330%" }} transition={t(2.6, 0.3)}
      />
    </div>
  );
}

const art: Record<string, (p: ArtProps) => React.ReactElement> = { fretio: Fretio, payote: Payote, e4m: E4m, pes: Pes };

/** The open card's drawing. Mount it to play it; with reduced motion every step lands at once. */
export function Art({ slug, reduce }: { slug: string; reduce: boolean }) {
  const A = art[slug];
  const t: T = (d, delay = 0) => (reduce ? { duration: 0, delay: 0, ease } : { duration: d, delay: delay + 0.5, ease });
  return A ? <A t={t} /> : null;
}

/**
 * The page material behind the whole Work section: mineral parchment, not antique.
 * Pale ivory tinted toward mist blue (top right) and warm stone (bottom left), laid-paper fibres,
 * a fine tooth, and a very slow drift of light across it. It fades into the page at top and bottom,
 * so the section has no hard edge. Decorative; always behind the content.
 */
export function Parchment() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_7%,#000_93%,transparent)]"
    >
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#F9F6EE,#F3EDE0 55%,#F6F1E6)" }} />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "radial-gradient(70% 55% at 92% 8%, rgba(200,220,227,.55), transparent 62%), radial-gradient(60% 50% at 4% 96%, rgba(218,209,200,.7), transparent 64%)" }}
      />
      <motion.div
        className="absolute -inset-x-[10%] inset-y-0"
        style={{ backgroundImage: "radial-gradient(42% 38% at 50% 30%, rgba(255,255,255,.55), transparent 70%)" }}
        initial={{ x: "-12%" }}
        animate={reduce ? { x: "0%" } : { x: ["-12%", "12%"] }}
        transition={reduce ? { duration: 0 } : { duration: 26, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
      />
      <div className="absolute inset-0 opacity-[0.13] mix-blend-multiply" style={{ backgroundImage: LAID, backgroundSize: "240px 240px" }} />
      <div className="absolute inset-0 opacity-[0.22] mix-blend-soft-light" style={{ backgroundImage: FIBRE, backgroundSize: "480px 480px" }} />
      <div className="absolute inset-0 opacity-[0.14] mix-blend-multiply" style={{ backgroundImage: TOOTH }} />
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(130% 110% at 50% 50%, transparent 60%, rgba(120,104,72,.14))" }} />
    </div>
  );
}
