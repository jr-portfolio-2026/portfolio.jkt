import { useEffect, useRef, useState } from "react";

/**
 * A slowly rotating orthographic globe, drawn to canvas.
 *
 * Geometry is Natural Earth 50m coastlines (world-atlas), simplified and
 * re-quantised at author time, then projected live with d3-geo so the sphere
 * genuinely turns — routes, place marks and labels rotate with it and clip at the limb.
 * d3-geo, topojson-client and the coastline data load in one async chunk, so
 * nothing here blocks first paint.
 *
 * On what this does and does not assert:
 *   - Place names are real geography, nothing more. No claim of presence or work.
 *   - The three route families are drawn truthfully rather than decoratively:
 *       sea  — polylines through real maritime waypoints (Dover, Gibraltar, Suez,
 *              Bab el-Mandeb, Hormuz, Malacca, Panama, Good Hope). They stay on water.
 *       air  — great circles, which is how aircraft are actually routed.
 *       land — overland corridors between cities that genuinely connect by road or rail.
 *     Each family has its own colour, dash and cadence. There is deliberately still
 *     NO legend and no figures: the lines are accurate geography used as texture, not
 *     a dataset, and labelling them as one would be a claim nothing here supports.
 *   - The visible place names are mirrored into a visually-hidden list, so the text
 *     is not locked inside a canvas.
 *
 * It stops turning when scrolled out of view, when the tab is hidden, and under
 * prefers-reduced-motion — where it renders a single still frame instead.
 */

type Variant = "day" | "night";
type Mode = "sea" | "air" | "land";

type ModePaint = { line: string; glow: string; mark: string };

type Palette = {
  sky: [string, string, string];
  graticule: string;
  landFill: string;
  landStroke: string;
  routes: Record<Mode, ModePaint>;
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
    routes: {
      // muted gold — the warm, dominant family
      sea: { line: "rgba(171,137,75,.82)", glow: "rgba(171,137,75,.22)", mark: "rgba(171,137,75,.95)" },
      // institutional navy — cool, fine, fast
      air: { line: "rgba(21,55,101,.52)", glow: "rgba(21,55,101,.10)", mark: "rgba(21,55,101,.72)" },
      // deep green — the quiet third, but it has to survive the plate's own opacity
      land: { line: "rgba(22,84,68,.80)", glow: "rgba(22,84,68,.20)", mark: "rgba(22,84,68,.90)" },
    },
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
    routes: {
      sea: { line: "rgba(226,197,142,.90)", glow: "rgba(226,197,142,.26)", mark: "rgba(233,207,158,.95)" },
      air: { line: "rgba(168,206,230,.58)", glow: "rgba(168,206,230,.14)", mark: "rgba(190,219,238,.80)" },
      land: { line: "rgba(122,178,160,.62)", glow: "rgba(122,178,160,.16)", mark: "rgba(146,196,179,.85)" },
    },
    nodeFill: "rgba(10,26,44,.95)",
    nodeStroke: "rgba(233,207,158,.95)",
    label: "226,236,245",
    limb: "rgba(0,0,0,.34)",
    rim: "rgba(150,190,214,.34)",
    atmo: "rgba(116,170,205,.42)",
  },
};

/**
 * Real places.
 *   tier 1 — labelled whenever it faces the viewer
 *   tier 2 — label fades in and out on a slow cycle, so the plate keeps changing
 *   tier 3 — mark only, never labelled: density without noise
 * Naming a city here says only that the city exists.
 */
type Place = { name: string; at: [number, number]; tier: 1 | 2 | 3 };
const PLACES: Place[] = [
  // ── tier 1 ───────────────────────────────────────────────────────────────
  { name: "Paris", at: [2.35, 48.86], tier: 1 },
  { name: "New York", at: [-74.0, 40.7], tier: 1 },
  { name: "Rotterdam", at: [4.48, 51.92], tier: 1 },
  { name: "Geneva", at: [6.14, 46.2], tier: 1 },
  { name: "Dubai", at: [55.27, 25.2], tier: 1 },
  { name: "Singapore", at: [103.82, 1.35], tier: 1 },
  { name: "Shanghai", at: [121.47, 31.23], tier: 1 },

  // ── tier 2 ───────────────────────────────────────────────────────────────
  { name: "London", at: [-0.13, 51.51], tier: 2 },
  { name: "The Hague", at: [4.3, 52.08], tier: 2 },
  { name: "Antwerp", at: [4.4, 51.22], tier: 2 },
  { name: "Hamburg", at: [9.99, 53.55], tier: 2 },
  { name: "Berlin", at: [13.4, 52.52], tier: 2 },
  { name: "Warsaw", at: [21.01, 52.23], tier: 2 },
  { name: "Kyiv", at: [30.52, 50.45], tier: 2 },
  { name: "Odesa", at: [30.73, 46.48], tier: 2 },
  { name: "Milan", at: [9.19, 45.46], tier: 2 },
  { name: "Madrid", at: [-3.7, 40.42], tier: 2 },
  { name: "Lisbon", at: [-9.14, 38.72], tier: 2 },
  { name: "Istanbul", at: [28.98, 41.01], tier: 2 },
  { name: "Alexandria", at: [29.92, 31.2], tier: 2 },
  { name: "Casablanca", at: [-7.59, 33.57], tier: 2 },
  { name: "Lagos", at: [3.38, 6.52], tier: 2 },
  { name: "Nairobi", at: [36.82, -1.29], tier: 2 },
  { name: "Cape Town", at: [18.42, -33.92], tier: 2 },
  { name: "Durban", at: [31.02, -29.86], tier: 2 },
  { name: "Mumbai", at: [72.88, 19.08], tier: 2 },
  { name: "Colombo", at: [79.86, 6.93], tier: 2 },
  { name: "Jakarta", at: [106.85, -6.21], tier: 2 },
  { name: "Hong Kong", at: [114.17, 22.32], tier: 2 },
  { name: "Busan", at: [129.08, 35.18], tier: 2 },
  { name: "Tokyo", at: [139.69, 35.69], tier: 2 },
  { name: "Sydney", at: [151.21, -33.87], tier: 2 },
  { name: "Panama", at: [-79.52, 8.98], tier: 2 },
  { name: "Santos", at: [-46.33, -23.96], tier: 2 },
  { name: "Buenos Aires", at: [-58.38, -34.6], tier: 2 },
  { name: "Valparaíso", at: [-71.63, -33.05], tier: 2 },
  { name: "Montreal", at: [-73.57, 45.5], tier: 2 },
  { name: "Los Angeles", at: [-118.24, 34.05], tier: 2 },
  { name: "Houston", at: [-95.37, 29.76], tier: 2 },

  // ── tier 3 — marks only ──────────────────────────────────────────────────
  { name: "Bergen", at: [5.32, 60.39], tier: 3 },
  { name: "Gdańsk", at: [18.65, 54.35], tier: 3 },
  { name: "Marseille", at: [5.37, 43.3], tier: 3 },
  { name: "Genoa", at: [8.93, 44.41], tier: 3 },
  { name: "Piraeus", at: [23.64, 37.94], tier: 3 },
  { name: "Beirut", at: [35.5, 33.89], tier: 3 },
  { name: "Jeddah", at: [39.17, 21.49], tier: 3 },
  { name: "Doha", at: [51.53, 25.29], tier: 3 },
  { name: "Tbilisi", at: [44.8, 41.72], tier: 3 },
  { name: "Baku", at: [49.87, 40.41], tier: 3 },
  { name: "Tashkent", at: [69.24, 41.3], tier: 3 },
  { name: "Almaty", at: [76.89, 43.24], tier: 3 },
  { name: "Ürümqi", at: [87.62, 43.83], tier: 3 },
  { name: "Xi'an", at: [108.95, 34.27], tier: 3 },
  { name: "Karachi", at: [67.01, 24.86], tier: 3 },
  { name: "Chennai", at: [80.27, 13.08], tier: 3 },
  { name: "Chittagong", at: [91.78, 22.36], tier: 3 },
  { name: "Bangkok", at: [100.5, 13.76], tier: 3 },
  { name: "Ho Chi Minh City", at: [106.66, 10.82], tier: 3 },
  { name: "Manila", at: [120.98, 14.6], tier: 3 },
  { name: "Kaohsiung", at: [120.3, 22.63], tier: 3 },
  { name: "Qingdao", at: [120.38, 36.07], tier: 3 },
  { name: "Vladivostok", at: [131.89, 43.12], tier: 3 },
  { name: "Dakar", at: [-17.44, 14.72], tier: 3 },
  { name: "Abidjan", at: [-4.01, 5.36], tier: 3 },
  { name: "Luanda", at: [13.23, -8.84], tier: 3 },
  { name: "Mombasa", at: [39.67, -4.04], tier: 3 },
  { name: "Vancouver", at: [-123.12, 49.28], tier: 3 },
  { name: "Veracruz", at: [-96.13, 19.17], tier: 3 },
  { name: "Cartagena", at: [-75.51, 10.39], tier: 3 },
  { name: "Callao", at: [-77.12, -12.05], tier: 3 },
  { name: "Perth", at: [115.86, -31.95], tier: 3 },
  { name: "Auckland", at: [174.76, -36.85], tier: 3 },
];

/**
 * Maritime and overland turning points. These are never labelled and never marked —
 * they exist only so a sea route bends around the world the way a ship does,
 * instead of cutting a great circle across three continents.
 */
const WAYPOINTS: Record<string, [number, number]> = {
  Dover: [1.5, 50.9],
  Biscay: [-6.5, 45.5],
  Finisterre: [-10.5, 42.5],
  PortugalW: [-9.9, 38.4],
  Gibraltar: [-5.6, 35.95],
  Alboran: [-2.5, 36.2],
  Sardinia: [8.5, 38.5],
  Sicily: [12.2, 36.8],
  Crete: [24.5, 34.3],
  PortSaid: [32.3, 31.4],
  Suez: [32.9, 29.3],
  RedSea: [37.8, 21.5],
  BabElMandeb: [43.45, 12.6],
  Aden: [48.5, 12.4],
  Socotra: [55.0, 12.0],
  ArabianSea: [63.5, 17.5],
  Hormuz: [56.4, 26.5],
  GulfOman: [59.0, 24.0],
  Laccadive: [73.5, 6.0],
  SriLankaS: [80.5, 4.5],
  BengalS: [88.0, 5.5],
  Andaman: [95.0, 5.5],
  Malacca: [100.4, 2.9],
  SingStrait: [104.2, 1.1],
  SouthChina: [111.5, 11.5],
  Luzon: [119.5, 19.0],
  TaiwanStrait: [119.0, 24.3],
  EastChina: [124.5, 30.5],
  KoreaStrait: [128.5, 33.5],
  NorthPacific: [-170.0, 44.0],
  PacificMid: [-150.0, 35.0],
  AtlanticNW: [-45.0, 44.0],
  AtlanticMid: [-32.0, 38.0],
  AtlanticSE: [-12.0, 8.0],
  GulfGuinea: [-2.0, 2.5],
  AtlanticS: [-5.0, -28.0],
  BrazilE: [-33.0, -22.0],
  GoodHope: [19.5, -35.5],
  AgulhasE: [32.0, -36.0],
  IndianS: [60.0, -30.0],
  IndianMid: [70.0, -12.0],
  Mozambique: [40.5, -18.0],
  Florida: [-79.8, 28.0],
  Bahamas: [-76.5, 23.5],
  Windward: [-74.2, 19.0],
  Caribbean: [-75.6, 14.5],
  GulfMexico: [-91.0, 24.5],
  YucatanCh: [-86.0, 21.3],
  PacificSE: [-82.0, -15.0],
  Magellan: [-69.0, -54.5],
  PlataE: [-52.0, -36.0],
  Bosphorus: [29.1, 41.1],
  Aegean: [25.5, 37.0],
  TasmanSea: [158.0, -36.0],
  CoralSea: [152.0, -22.0],
  JavaSea: [110.0, -5.0],
  AustraliaW: [112.0, -28.0],
};

const placeAt = (n: string): [number, number] => {
  const p = PLACES.find((q) => q.name === n);
  if (p) return p.at;
  const w = WAYPOINTS[n];
  if (w) return w;
  throw new Error(`Globe: unknown point "${n}"`);
};

/**
 * Each route is an ordered list of places and waypoints. Consecutive pairs are
 * joined by a great-circle segment, so a long sea lane reads as one continuous
 * line that bends through the straits it actually passes through.
 */
type Route = { mode: Mode; via: string[] };
const ROUTES: Route[] = [
  // ── sea: the Asia–Europe trunk and its branches ──────────────────────────
  { mode: "sea", via: ["Rotterdam", "Dover", "Biscay", "Finisterre", "PortugalW", "Gibraltar", "Alboran", "Sardinia", "Sicily", "Crete", "PortSaid", "Suez", "RedSea", "BabElMandeb", "Aden", "Socotra", "ArabianSea", "Laccadive", "SriLankaS", "Andaman", "Malacca", "Singapore"] },
  { mode: "sea", via: ["Singapore", "SingStrait", "SouthChina", "TaiwanStrait", "Shanghai"] },
  { mode: "sea", via: ["Shanghai", "EastChina", "KoreaStrait", "Busan"] },
  { mode: "sea", via: ["Hamburg", "Dover", "Biscay", "Finisterre", "AtlanticMid", "AtlanticNW", "New York"] },
  { mode: "sea", via: ["Rotterdam", "Dover", "Biscay", "Finisterre", "PortugalW", "Casablanca", "Dakar", "Abidjan", "Lagos"] },
  { mode: "sea", via: ["Lagos", "GulfGuinea", "Luanda", "AtlanticS", "GoodHope", "Cape Town"] },
  { mode: "sea", via: ["Cape Town", "AgulhasE", "Durban", "Mozambique", "Mombasa", "IndianMid", "Colombo"] },
  { mode: "sea", via: ["Dubai", "Hormuz", "GulfOman", "ArabianSea", "Laccadive", "SriLankaS", "Andaman", "Malacca", "Singapore"] },
  { mode: "sea", via: ["Mumbai", "ArabianSea", "GulfOman", "Hormuz", "Dubai"] },
  { mode: "sea", via: ["New York", "Florida", "Bahamas", "Windward", "Caribbean", "Cartagena", "Panama"] },
  { mode: "sea", via: ["Panama", "PacificSE", "Callao", "Valparaíso"] },
  { mode: "sea", via: ["Shanghai", "EastChina", "NorthPacific", "PacificMid", "Los Angeles"] },
  { mode: "sea", via: ["Santos", "BrazilE", "AtlanticS", "GoodHope", "AgulhasE", "Durban"] },
  { mode: "sea", via: ["Buenos Aires", "PlataE", "BrazilE", "Santos"] },
  { mode: "sea", via: ["Singapore", "JavaSea", "Jakarta"] },
  { mode: "sea", via: ["Istanbul", "Bosphorus", "Aegean", "Piraeus", "Crete", "Alexandria"] },
  { mode: "sea", via: ["Houston", "GulfMexico", "YucatanCh", "Caribbean", "Cartagena"] },
  { mode: "sea", via: ["Singapore", "SingStrait", "SouthChina", "Manila"] },
  { mode: "sea", via: ["Sydney", "TasmanSea", "CoralSea", "Auckland"] },
  { mode: "sea", via: ["Perth", "AustraliaW", "IndianS", "IndianMid", "Colombo"] },

  // ── air: great circles, as aircraft are actually routed ──────────────────
  { mode: "air", via: ["Paris", "New York"] },
  { mode: "air", via: ["London", "Dubai"] },
  { mode: "air", via: ["Geneva", "Singapore"] },
  { mode: "air", via: ["Paris", "Shanghai"] },
  { mode: "air", via: ["New York", "Santos"] },
  { mode: "air", via: ["Dubai", "Sydney"] },
  { mode: "air", via: ["Tokyo", "Los Angeles"] },
  { mode: "air", via: ["Istanbul", "Lagos"] },
  { mode: "air", via: ["Nairobi", "Mumbai"] },
  { mode: "air", via: ["Montreal", "Lisbon"] },
  { mode: "air", via: ["Hong Kong", "Sydney"] },
  { mode: "air", via: ["Madrid", "Buenos Aires"] },
  { mode: "air", via: ["Geneva", "Nairobi"] },
  { mode: "air", via: ["Vancouver", "Tokyo"] },

  // ── land: corridors that genuinely connect by road or rail ───────────────
  { mode: "land", via: ["Rotterdam", "Antwerp", "Paris"] },
  { mode: "land", via: ["Paris", "Geneva", "Milan"] },
  { mode: "land", via: ["Hamburg", "Berlin", "Warsaw"] },
  { mode: "land", via: ["Warsaw", "Kyiv", "Odesa"] },
  { mode: "land", via: ["Paris", "Madrid", "Lisbon"] },
  { mode: "land", via: ["Istanbul", "Tbilisi", "Baku"] },
  { mode: "land", via: ["Baku", "Tashkent", "Almaty", "Ürümqi", "Xi'an", "Shanghai"] },
  { mode: "land", via: ["Karachi", "Mumbai"] },
  { mode: "land", via: ["Bangkok", "Ho Chi Minh City"] },
  { mode: "land", via: ["Hamburg", "Rotterdam"] },
];

/**
 * Per-family cadence. `drift` scrolls the dash pattern itself, so each family
 * moves at its own rhythm even before the travelling mark is considered:
 * sea crawls forward, air runs backward and quick, land sits between them.
 */
const MODE_STYLE: Record<Mode, { dash: number[]; width: number; glow: number; travelMs: number; drift: number }> = {
  sea: { dash: [10, 7], width: 1.05, glow: 3.0, travelMs: 30000, drift: 0.022 },
  air: { dash: [1.4, 4.6], width: 0.9, glow: 0, travelMs: 12000, drift: -0.055 },
  land: { dash: [3.5, 3], width: 0.95, glow: 2.1, travelMs: 20000, drift: 0.034 },
};

/** Where the turn begins: centred on France, and how far the sphere is tilted. */
const START_LON = 2.3;
const TILT = -26;
const DEG_PER_SECOND = 2.1;
const TARGET_FPS = 30;
const LABEL_CYCLE = 15000;
const SEG_STEPS = 16;
/** Spline tension. 0.5 is a plain Catmull-Rom; lower hugs the waypoints and stops
 *  the curve bulging onto land at a tight corner like Gibraltar. */
const TENSION = 0.36;

type Vec3 = [number, number, number];
const toVec = ([lon, lat]: [number, number]): Vec3 => {
  const p = (lon * Math.PI) / 180, t = (lat * Math.PI) / 180;
  return [Math.cos(t) * Math.cos(p), Math.cos(t) * Math.sin(p), Math.sin(t)];
};
const toLonLat = ([x, y, z]: Vec3): [number, number] => {
  const r = Math.hypot(x, y, z) || 1;
  return [(Math.atan2(y, x) * 180) / Math.PI, (Math.asin(z / r) * 180) / Math.PI];
};

/**
 * A smooth curve through the given points, interpolated as 3-D unit vectors and
 * re-normalised onto the sphere. Piecewise great circles would meet at a visible
 * corner at every waypoint — a shipping lane does not have corners, so the route
 * is splined instead. Two points reduce to a plain great circle.
 */
function sphericalSpline(pts: [number, number][], steps: number): [number, number][] {
  const v = pts.map(toVec);
  const P: Vec3[] = [v[0]!, ...v, v[v.length - 1]!];
  const out: [number, number][] = [];
  for (let i = 1; i < P.length - 2; i++) {
    const p0 = P[i - 1]!, p1 = P[i]!, p2 = P[i + 1]!, p3 = P[i + 2]!;
    for (let k = 0; k < steps; k++) {
      const t = k / steps, t2 = t * t, t3 = t2 * t;
      const h00 = 2 * t3 - 3 * t2 + 1, h10 = t3 - 2 * t2 + t;
      const h01 = -2 * t3 + 3 * t2, h11 = t3 - t2;
      const q = [0, 1, 2].map((d) =>
        h00 * p1[d]! + h10 * TENSION * (p2[d]! - p0[d]!) + h01 * p2[d]! + h11 * TENSION * (p3[d]! - p1[d]!),
      ) as Vec3;
      out.push(toLonLat(q));
    }
  }
  out.push(toLonLat(P[P.length - 2]!));
  return out;
}

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

      // Build every route once: one smooth chain of coordinates through its waypoints.
      const routes = ROUTES.map(({ mode, via }) => {
        const pts = sphericalSpline(via.map(placeAt), SEG_STEPS);
        return { mode, line: { type: "LineString" as const, coordinates: pts }, pts };
      });
      // Draw family by family so the canvas state changes once per family, not per line.
      const byMode = (["sea", "land", "air"] as Mode[]).map((m) => ({ mode: m, list: routes.filter((r) => r.mode === m) }));

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

        // ── routes, one family at a time, each on its own cadence ────────────
        ctx.save();
        ctx.lineCap = "butt";
        for (const { mode, list } of byMode) {
          const st = MODE_STYLE[mode], paint = pal.routes[mode];
          ctx.setLineDash(st.dash);
          ctx.lineDashOffset = -(t * st.drift) % 1000;
          if (st.glow) {
            ctx.strokeStyle = paint.glow; ctx.lineWidth = st.glow;
            for (const rt of list) { ctx.beginPath(); path(rt.line); ctx.stroke(); }
          }
          ctx.strokeStyle = paint.line; ctx.lineWidth = st.width;
          for (const rt of list) { ctx.beginPath(); path(rt.line); ctx.stroke(); }
        }
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;

        // one mark travelling each route, staggered so they never move in formation
        path.pointRadius(2.2);
        for (const { mode, list } of byMode) {
          const st = MODE_STYLE[mode];
          ctx.fillStyle = pal.routes[mode].mark;
          list.forEach((rt, i) => {
            const phase = (t / st.travelMs + i / Math.max(1, list.length)) % 1;
            const at = rt.pts[Math.min(rt.pts.length - 1, Math.floor(phase * rt.pts.length))]!;
            ctx.beginPath(); path({ type: "Point", coordinates: at }); ctx.fill();
          });
        }
        ctx.restore();

        // ── place marks: every visible place, fading toward the limb ─────────
        type Cand = { p: Place; x: number; y: number; a: number; i: number };
        const cands: Cand[] = [];
        PLACES.forEach((p, i) => {
          const d = d3.geoDistance(centre, p.at);
          if (d > Math.PI / 2 - 0.1) return;
          const edge = Math.min(1, Math.max(0, (Math.PI / 2 - 0.1 - d) / 0.42));
          if (edge < 0.03) return;
          const xy = proj(p.at);
          if (!xy) return;
          cands.push({ p, x: xy[0], y: xy[1], a: edge, i });
        });

        for (const c of cands) {
          if (c.p.tier === 3) {
            // a soft dot only: density without another gold ring competing for attention
            ctx.globalAlpha = c.a * 0.3;
            ctx.beginPath(); ctx.arc(c.x, c.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${pal.label},1)`; ctx.fill();
            continue;
          }
          ctx.globalAlpha = c.a;
          ctx.beginPath(); ctx.arc(c.x, c.y, c.p.tier === 1 ? 3 : 2.1, 0, Math.PI * 2);
          ctx.fillStyle = pal.nodeFill; ctx.fill();
          ctx.strokeStyle = pal.nodeStroke; ctx.lineWidth = 1.3; ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.restore();

        // ── labels: tiers 1 and 2 only, collision-tested ─────────────────────
        ctx.font = labelFont();
        ctx.textBaseline = "middle";
        const labelled = cands
          .filter((c) => c.p.tier !== 3)
          .map((c) => ({ ...c, a: c.p.tier === 1 ? c.a : c.a * pulse(t, c.i) }))
          .filter((c) => c.a >= 0.03)
          .sort((m, n) => (m.p.tier - n.p.tier) || (n.a - m.a));

        const placed: [number, number, number, number][] = [];
        const pad = fontPx * 0.5;
        for (const c of labelled) {
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
