import { useEffect, useRef, useState } from "react";

/**
 * A slowly rotating orthographic globe, drawn to canvas.
 *
 * Geometry is Natural Earth 50m coastlines (world-atlas), simplified and
 * re-quantised at author time, then projected live with d3-geo so the sphere
 * genuinely turns — arcs, place marks and labels rotate with it and clip at the limb.
 * d3-geo, topojson-client and the coastline data load in one async chunk, so
 * nothing here blocks first paint.
 *
 * On what this does and does not assert:
 *   - Place names are real geography, nothing more. No claim of presence or work.
 *   - The arcs are ornament. Their dash patterns vary for texture only — they do
 *     NOT encode sea/air/rail/road, and there is deliberately no legend, because a
 *     legend would turn decoration into a data claim nothing here can support.
 *   - The visible place names are mirrored into a visually-hidden list, so the text
 *     is not locked inside a canvas.
 *
 * It stops turning when scrolled out of view, when the tab is hidden, and under
 * prefers-reduced-motion — where it renders a single still frame instead.
 */

type Variant = "day" | "night";

type Palette = {
  sky: [string, string, string];
  graticule: string;
  landFill: string;
  landStroke: string;
  route: string;
  routeGlow: string;
  nodeFill: string;
  nodeStroke: string;
  label: string;
  limb: string;
  rim: string;
  atmo: string;
};

const PALETTES: Record<Variant, Palette> = {
  day: {
    sky: ["rgba(255,255,255,.97)", "rgba(248,250,251,.60)", "rgba(221,232,238,.34)"],
    graticule: "rgba(21,55,101,.15)",
    landFill: "rgba(200,220,227,.19)",
    landStroke: "rgba(21,55,101,.55)",
    route: "rgba(171,137,75,.85)",
    routeGlow: "rgba(171,137,75,.26)",
    nodeFill: "rgba(249,248,247,.95)",
    nodeStroke: "rgba(171,137,75,.95)",
    label: "11,31,55",
    limb: "rgba(11,31,55,.10)",
    rim: "rgba(11,31,55,.26)",
    atmo: "rgba(185,208,221,.50)",
  },
  night: {
    sky: ["rgba(37,74,114,.95)", "rgba(20,46,76,.97)", "rgba(9,24,42,.99)"],
    graticule: "rgba(176,206,224,.13)",
    landFill: "rgba(8,22,38,.55)",
    landStroke: "rgba(152,191,212,.52)",
    route: "rgba(226,197,142,.92)",
    routeGlow: "rgba(226,197,142,.30)",
    nodeFill: "rgba(10,26,44,.95)",
    nodeStroke: "rgba(233,207,158,.95)",
    label: "226,236,245",
    limb: "rgba(0,0,0,.34)",
    rim: "rgba(150,190,214,.34)",
    atmo: "rgba(116,170,205,.42)",
  },
};

/**
 * Real places. `tier: 1` stays labelled whenever it faces the viewer;
 * `tier: 2` fades in and out on a slow cycle so the plate keeps changing.
 * Naming a city here says only that the city exists.
 */
type Place = { name: string; at: [number, number]; tier: 1 | 2 };
const PLACES: Place[] = [
  { name: "New York", at: [-74.0, 40.7], tier: 1 },
  { name: "Rotterdam", at: [4.48, 51.92], tier: 1 },
  { name: "Geneva", at: [6.14, 46.2], tier: 1 },
  { name: "Dubai", at: [55.27, 25.2], tier: 1 },
  { name: "Singapore", at: [103.82, 1.35], tier: 1 },
  { name: "Shanghai", at: [121.47, 31.23], tier: 1 },

  { name: "The Hague", at: [4.3, 52.08], tier: 2 },
  { name: "Antwerp", at: [4.4, 51.22], tier: 2 },
  { name: "Hamburg", at: [9.99, 53.55], tier: 2 },
  { name: "Lisbon", at: [-9.14, 38.72], tier: 2 },
  { name: "Istanbul", at: [28.98, 41.01], tier: 2 },
  { name: "Odesa", at: [30.73, 46.48], tier: 2 },
  { name: "Alexandria", at: [29.92, 31.2], tier: 2 },
  { name: "Casablanca", at: [-7.59, 33.57], tier: 2 },
  { name: "Lagos", at: [3.38, 6.52], tier: 2 },
  { name: "Cape Town", at: [18.42, -33.92], tier: 2 },
  { name: "Durban", at: [31.02, -29.86], tier: 2 },
  { name: "Mumbai", at: [72.88, 19.08], tier: 2 },
  { name: "Colombo", at: [79.86, 6.93], tier: 2 },
  { name: "Jakarta", at: [106.85, -6.21], tier: 2 },
  { name: "Hong Kong", at: [114.17, 22.32], tier: 2 },
  { name: "Busan", at: [129.08, 35.18], tier: 2 },
  { name: "Tokyo", at: [139.69, 35.69], tier: 2 },
  { name: "Panama", at: [-79.52, 8.98], tier: 2 },
  { name: "Santos", at: [-46.33, -23.96], tier: 2 },
  { name: "Buenos Aires", at: [-58.38, -34.6], tier: 2 },
  { name: "Valparaíso", at: [-71.63, -33.05], tier: 2 },
  { name: "Montreal", at: [-73.57, 45.5], tier: 2 },
  { name: "Los Angeles", at: [-118.24, 34.05], tier: 2 },
];

const byName = (n: string) => PLACES.find((p) => p.name === n)!.at;

/** Ornamental great circles. The dash patterns are texture, not a taxonomy. */
const LINKS: [string, string][] = [
  ["New York", "Rotterdam"], ["Rotterdam", "Singapore"], ["Singapore", "Shanghai"],
  ["Santos", "Cape Town"], ["New York", "Buenos Aires"], ["Cape Town", "Singapore"],
  ["Lagos", "Rotterdam"], ["Dubai", "Singapore"], ["Rotterdam", "Dubai"],
  ["Shanghai", "Los Angeles"], ["Panama", "Valparaíso"], ["Mumbai", "Dubai"],
  ["Hamburg", "New York"], ["Istanbul", "Alexandria"], ["Busan", "Singapore"],
  ["Montreal", "Lisbon"], ["Durban", "Mumbai"], ["Jakarta", "Hong Kong"],
];
const DASHES: number[][] = [[4, 6], [1.5, 4], [8, 5], [2.5, 3.5], [6, 4, 1.5, 4]];

/** Where the turn begins: centred on France, and how far the sphere is tilted. */
const START_LON = 2.3;
const TILT = -26;
const DEG_PER_SECOND = 2.1;
const TARGET_FPS = 30;
const LABEL_CYCLE = 15000;

export function Globe({ variant = "day", className = "" }: { variant?: Variant; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stop = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];

    (async () => {
      const [d3, topo, landTopo] = await Promise.all([
        import("d3-geo"),
        import("topojson-client"),
        import("./land.json"),
      ]);
      if (stop) return;

      const el = canvas.current, box = host.current;
      if (!el || !box) return;
      const ctx = el.getContext("2d");
      if (!ctx) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const land = topo.feature(landTopo as any, (landTopo as any).objects.land);
      const graticule = d3.geoGraticule().step([15, 15])();
      const links = LINKS.map(([a, b], i) => {
        const it = d3.geoInterpolate(byName(a), byName(b));
        return {
          line: { type: "LineString" as const, coordinates: Array.from({ length: 80 }, (_, k) => it(k / 79)) },
          at: it,
          dash: DASHES[i % DASHES.length]!,
        };
      });

      const proj = d3.geoOrthographic().rotate([-START_LON, TILT]).clipAngle(90);
      const path = d3.geoPath(proj, ctx);
      const pal = PALETTES[variant];
      const widths = new Map<string, number>();

      let w = 0, h = 0, r = 0, dpr = 1, fontPx = 11;
      // The plate bleeds past the viewport, so track where the window actually cuts it.
      let viewLeft = -Infinity, viewRight = Infinity;
      const resize = () => {
        const rect = box.getBoundingClientRect();
        if (!rect.width) return;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = rect.width; h = rect.width;
        el.width = Math.round(w * dpr); el.height = Math.round(h * dpr);
        el.style.width = w + "px"; el.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        r = w / 2 - w * 0.045;
        proj.scale(r).translate([w / 2, h / 2]);
        fontPx = Math.max(9, Math.min(13, r * 0.032));
        viewLeft = -rect.left;
        viewRight = window.innerWidth - rect.left;
        widths.clear();
      };

      const labelFont = () => `600 ${fontPx}px Manrope, system-ui, sans-serif`;
      const widthOf = (s: string) => {
        let v = widths.get(s);
        if (v === undefined) { ctx.font = labelFont(); v = ctx.measureText(s).width; widths.set(s, v); }
        return v;
      };

      /** tier-2 labels breathe in and out, each on its own phase */
      const pulse = (t: number, i: number) => {
        const ph = ((t / LABEL_CYCLE) + i * 0.6180339887) % 1;
        if (ph < 0.14) return ph / 0.14;
        if (ph < 0.46) return 1;
        if (ph < 0.6) return 1 - (ph - 0.46) / 0.14;
        return 0;
      };

      const draw = (lambda: number, t: number) => {
        if (!w) return;
        proj.rotate([lambda, TILT]);
        const centre: [number, number] = [-lambda, -TILT];
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2, cy = h / 2;

        const atmo = ctx.createRadialGradient(cx, cy, r * 0.97, cx, cy, r * 1.07);
        atmo.addColorStop(0, pal.atmo); atmo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.07, 0, Math.PI * 2);
        ctx.fillStyle = atmo; ctx.fill();

        const sky = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.38, r * 0.05, cx, cy, r);
        sky.addColorStop(0, pal.sky[0]); sky.addColorStop(0.52, pal.sky[1]); sky.addColorStop(1, pal.sky[2]);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = sky; ctx.fill();

        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();

        ctx.beginPath(); path(graticule);
        ctx.strokeStyle = pal.graticule; ctx.lineWidth = 0.6; ctx.stroke();

        ctx.beginPath(); path(land);
        ctx.fillStyle = pal.landFill; ctx.fill();
        ctx.strokeStyle = pal.landStroke; ctx.lineWidth = 0.85;
        ctx.lineJoin = "round"; ctx.stroke();

        ctx.save();
        for (const { line, dash } of links) {
          ctx.setLineDash(dash);
          ctx.beginPath(); path(line);
          ctx.strokeStyle = pal.routeGlow; ctx.lineWidth = 2.8; ctx.stroke();
          ctx.beginPath(); path(line);
          ctx.strokeStyle = pal.route; ctx.lineWidth = 0.95; ctx.stroke();
        }
        ctx.restore();

        // one mark travelling each arc, staggered so they never move in formation
        path.pointRadius(2.4);
        links.forEach((lk, i) => {
          const phase = ((t / 11000 + i / links.length) % 1);
          ctx.beginPath(); path({ type: "Point", coordinates: lk.at(phase) });
          ctx.fillStyle = pal.nodeStroke; ctx.fill();
        });
        ctx.restore();

        // ── place marks and labels, collision-tested, fading toward the limb ──
        ctx.font = labelFont();
        ctx.textBaseline = "middle";
        type Cand = { p: Place; x: number; y: number; a: number; i: number };
        const cands: Cand[] = [];
        PLACES.forEach((p, i) => {
          const d = d3.geoDistance(centre, p.at);
          if (d > Math.PI / 2 - 0.1) return;
          const edge = Math.min(1, Math.max(0, (Math.PI / 2 - 0.1 - d) / 0.42));
          const a = p.tier === 1 ? edge : edge * pulse(t, i);
          if (a < 0.03) return;
          const xy = proj(p.at);
          if (!xy) return;
          cands.push({ p, x: xy[0], y: xy[1], a, i });
        });
        cands.sort((m, n) => (m.p.tier - n.p.tier) || (n.a - m.a));

        const placed: [number, number, number, number][] = [];
        const pad = fontPx * 0.5;
        for (const c of cands) {
          const tw = widthOf(c.p.name);
          // Labels sit on the inward side of their mark, so none runs off the sphere.
          const flip = c.x > cx;
          const gap = fontPx * 0.72;
          const lx = flip ? c.x - gap - tw : c.x + gap;
          const ly = c.y;
          // never draw a label the window would slice through
          if (lx < viewLeft + 8 || lx + tw > viewRight - 8) continue;
          const box4: [number, number, number, number] = [lx - pad, ly - fontPx, lx + tw + pad, ly + fontPx];
          const hit = placed.some(([a1, b1, a2, b2]) => !(box4[2] < a1 || box4[0] > a2 || box4[3] < b1 || box4[1] > b2));
          if (hit) continue;
          placed.push(box4);

          ctx.beginPath(); ctx.arc(c.x, c.y, c.p.tier === 1 ? 3 : 2.1, 0, Math.PI * 2);
          ctx.fillStyle = pal.nodeFill; ctx.globalAlpha = c.a; ctx.fill();
          ctx.strokeStyle = pal.nodeStroke; ctx.lineWidth = 1.3; ctx.stroke();

          ctx.globalAlpha = c.a * (c.p.tier === 1 ? 0.92 : 0.66);
          ctx.fillStyle = `rgba(${pal.label},1)`;
          ctx.fillText(c.p.name, lx, ly);
          ctx.globalAlpha = 1;
        }

        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
        const limb = ctx.createRadialGradient(cx, cy, r * 0.74, cx, cy, r);
        limb.addColorStop(0, "rgba(0,0,0,0)"); limb.addColorStop(1, pal.limb);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = limb; ctx.fill();
        ctx.restore();

        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = pal.rim; ctx.lineWidth = 1; ctx.stroke();
      };

      resize();
      const ro = new ResizeObserver(() => { resize(); draw(lambda, performance.now()); });
      ro.observe(box);
      const onWinResize = () => { resize(); draw(lambda, performance.now()); };
      window.addEventListener("resize", onWinResize);
      cleanups.push(() => window.removeEventListener("resize", onWinResize));
      cleanups.push(() => ro.disconnect());

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      let lambda = -START_LON;
      let onScreen = true;
      let last = performance.now();

      const frame = (now: number) => {
        if (stop) return;
        const dt = now - last;
        if (dt >= 1000 / TARGET_FPS) {
          lambda = (lambda + (DEG_PER_SECOND * dt) / 1000) % 360;
          draw(lambda, now);
          last = now;
        }
        raf = requestAnimationFrame(frame);
      };

      const running = () => onScreen && !document.hidden && !reduce.matches;
      const sync = () => {
        cancelAnimationFrame(raf);
        if (running()) { last = performance.now(); raf = requestAnimationFrame(frame); }
        else draw(lambda, performance.now());
      };

      const io = new IntersectionObserver((entries) => {
        const e = entries[0];
        if (!e) return;
        onScreen = e.isIntersecting;
        sync();
      }, { threshold: 0 });
      io.observe(box);
      cleanups.push(() => io.disconnect());

      document.addEventListener("visibilitychange", sync);
      reduce.addEventListener("change", sync);
      cleanups.push(() => document.removeEventListener("visibilitychange", sync));
      cleanups.push(() => reduce.removeEventListener("change", sync));

      setReady(true);
      sync();
    })();

    return () => {
      stop = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, [variant]);

  return (
    <div ref={host} className={"plate " + className} data-ready={ready || undefined}>
      <canvas ref={canvas} aria-hidden />
      {/* the drawn names, so the text is not locked inside a canvas */}
      <p className="sr-only">
        A decorative rotating globe marking {PLACES.map((p) => p.name).join(", ")}.
      </p>
    </div>
  );
}
