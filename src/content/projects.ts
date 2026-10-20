// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS — the single source for the homepage Selected Work list, every case-study page,
// the prerendered routes and the sitemap. To add a project: add one object here.
//
// Honesty rules (see README): `kind` says what the work actually is. Nothing here may claim a
// client, a metric or an outcome that is not documented. `reviewed: false` means the owner has not
// yet confirmed the wording; `npm run build:release` refuses to build while any project is unreviewed.
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectKind = "application" | "demonstration" | "prototype" | "concept" | "academic";

/** What the visitor is looking at, in plain words. Shown on every card and page. */
export const kinds: Record<ProjectKind, { label: string; note: string }> = {
  application: { label: "Working application", note: "Runs today and can be used." },
  demonstration: { label: "Guided demonstration", note: "A scripted walk-through with sample data." },
  prototype: { label: "Prototype", note: "Partly built; parts are still being specified." },
  concept: { label: "Concept", note: "Described and structured; not built yet." },
  academic: { label: "Academic exercise", note: "Set as coursework; not commissioned work." },
};

export type Project = {
  slug: string;
  mark: string; // short mark used on the typographic plate
  name: string;
  category: string;
  domains: string[];
  kind: ProjectKind;
  status: string;
  year: string;
  summary: string;
  /** Mandatory disclosure shown above the case study (e.g. academic redesigns). */
  disclosure?: string;
  context: string;
  problem: string;
  constraints: string[];
  contribution: string;
  process: string[];
  output: string[];
  evidence: { label: string; text: string; href?: string }[];
  limitations: string[];
  next: string[];
  technologies: string[];
  languages: string[];
  links: { demo?: string; repository?: string };
  /** Optional real image. Without one, a typographic plate is drawn. Never put text in the image. */
  cover?: { src: string; alt: string; width: number; height: number };
  featured: boolean;
  order: number;
  reviewed: boolean;
};

export const projects: Project[] = [
  {
    slug: "fretio",
    mark: "F",
    name: "FRET.IO",
    category: "Freight planning tool",
    domains: ["International trade", "Logistics", "Software"],
    kind: "application",
    status: "Public foundation, in development",
    year: "2026",
    summary: "A browser tool that turns a list of goods into a pallet and container plan for international freight.",
    context:
      "International shipments are quoted and booked by container: which pallets, which container type, and whether the load is a full container (FCL) or a partial one (LCL).",
    problem:
      "Goods arrive as lists of items with dimensions, weights and handling constraints. Deciding the container requirement by hand is slow, and the reasoning is hard to check afterwards.",
    constraints: [
      "Items carry handling flags: stackable, fragile, rotation allowed",
      "Pallet standards differ (Euro 1200 × 800 mm, ISO 1200 × 1000 mm)",
      "Container types differ in capacity (20′ dry, 40′ dry, 40′ high cube)",
      "Lengths are entered in metres or centimetres and weights in kilograms, then normalised",
    ],
    contribution: "Product definition, interface design and front-end implementation of the planner.",
    process: [
      "Define the goods model: dimensions, weight and handling flags",
      "Fix the pallet and container reference sizes",
      "Calculate the container requirement from the goods list",
      "Present the result as FCL or LCL",
    ],
    output: [
      "Merchandise entry with handling flags",
      "Pallet and container selection",
      "A calculation for containers and FCL / LCL",
      "Separate entry points for maritime, air and road freight",
    ],
    evidence: [
      { label: "Public tool", text: "Open the working application.", href: "https://e-designxoxo.github.io/FRET.IO/" },
      { label: "Source", text: "Repository on GitHub.", href: "https://github.com/e-designxoxo/FRET.IO" },
    ],
    limitations: [
      "A planning aid: not validated against carrier or terminal rules",
      "Calculation accuracy has not been independently verified",
      "No route, tariff or cost data yet",
    ],
    next: [
      "Independent validation of the loading calculation",
      "Route, tariff and cost layers",
      "Evolution from calculator towards a trade-intelligence product",
    ],
    technologies: ["HTML", "CSS", "JavaScript"],
    languages: [],
    links: { demo: "https://e-designxoxo.github.io/FRET.IO/", repository: "https://github.com/e-designxoxo/FRET.IO" },
    featured: false,
    order: 1,
    reviewed: false,
  },
  {
    slug: "atlas",
    mark: "A",
    name: "ATLAS",
    category: "Legal and regulatory intelligence",
    domains: ["International law", "Regulation", "Data"],
    kind: "concept",
    status: "Concept",
    year: "2026",
    summary: "A concept for structuring legal and regulatory documents so that every statement stays traceable to its source.",
    context:
      "Legal research depends on knowing exactly which document, in which version, says what. The same text circulates under different titles, formats and dates.",
    problem:
      "Without a stable identity for each document, citations drift, duplicates accumulate and a conclusion cannot be traced back to its source.",
    constraints: [
      "Sources arrive in different formats and versions",
      "A document needs one canonical identity, however many copies exist",
      "Every extracted statement must point back to its origin",
    ],
    contribution: "Concept definition and information architecture.",
    process: [
      "Ingest documents",
      "Assign a canonical document identity",
      "Extract and link structure",
      "Support research with traceable citations",
    ],
    output: ["A written concept and information model. No working build is presented."],
    evidence: [],
    limitations: [
      "Concept stage: there is no public application",
      "No claim is made about legal coverage or accuracy",
    ],
    next: [
      "Specify the canonical-identity model",
      "Prototype ingestion on a small public corpus",
      "Define traceability requirements",
    ],
    technologies: [],
    languages: [],
    links: {},
    featured: false,
    order: 2,
    reviewed: false,
  },
  {
    slug: "e4m",
    mark: "E",
    name: "E4M",
    category: "Institutional website",
    domains: ["Non-profit sector", "Information architecture", "Software"],
    kind: "prototype",
    status: "In development — among the most advanced studies",
    year: "2026",
    summary: "An institutional website and platform for Education for Madagascar, organised around its programmes.",
    context:
      "A non-profit speaks to partners, donors, beneficiaries and decision-makers at once, and its site has to answer each of them without becoming a brochure.",
    problem:
      "Programmes, evidence and institutional identity need one coherent public structure that stays readable as the organisation grows.",
    constraints: [
      "Several audiences with different questions",
      "Content owned by non-technical staff",
      "A multilingual foundation is required",
    ],
    contribution: "Information architecture, interface design and front-end implementation.",
    process: [
      "Map programmes and audiences",
      "Define the page structure and editorial model",
      "Design and build the interface",
      "Review with the organisation and iterate",
    ],
    output: [
      "Programme-led information architecture",
      "Editorial publishing structure",
      "Partner and impact presentation",
    ],
    evidence: [{ label: "Source", text: "Latest source on GitHub.", href: "https://github.com/e-designxoxo/E4M_V2" }],
    limitations: [
      "Programme content is still in draft form",
      "The translation architecture is not yet connected",
      "The final publishing workflow is not yet specified",
    ],
    next: ["Deepen programme pages", "Connect multilingual content", "Specify the publishing workflow"],
    technologies: [],
    languages: [],
    links: { repository: "https://github.com/e-designxoxo/E4M_V2" },
    featured: true,
    order: 3,
    reviewed: false,
  },
  {
    slug: "pes",
    mark: "P",
    name: "PES",
    category: "Productivity system",
    domains: ["Workflow design", "Software"],
    kind: "application",
    status: "In daily use",
    year: "2026",
    summary: "A productivity system already used in practice, built around visible priorities and a short review loop.",
    context: "Conventional task tools favour capture over decision; the working day still ends with an unclear picture of priorities.",
    problem: "Keep priorities visible and reviewable without the weight of a full project-management suite.",
    constraints: [
      "Low friction: capturing work must take seconds",
      "Enough structure to review a cycle and stay accountable",
      "Designed around one real working routine",
    ],
    contribution: "Workflow design and implementation, refined through use.",
    process: ["Capture work", "Set priority and status", "Move work through the day", "Review the cycle"],
    output: ["Priority and status controls", "A focused daily view", "Task grouping and review"],
    evidence: [],
    limitations: [
      "Designed around one current workflow",
      "Reporting across longer cycles needs refinement",
      "Not offered as a public product",
    ],
    next: ["Resolve small interaction issues", "Strengthen longer-cycle reporting"],
    technologies: [],
    languages: [],
    links: {},
    featured: false,
    order: 4,
    reviewed: false,
  },
  {
    slug: "payote",
    mark: "Pa",
    name: "Payote",
    category: "Brand website redesign",
    domains: ["Brand strategy", "Commerce", "Design"],
    kind: "academic",
    status: "Academic redesign",
    year: "2026",
    summary: "A school-directed redesign of a French brand's website, testing a clearer commercial narrative.",
    disclosure:
      "Academic exercise set by a school. This is not official work, and it was not commissioned by, or produced with, the brand.",
    context: "A recognisable French brand with a distinct character, studied as a design and positioning exercise.",
    problem: "Can the brand keep its character while its website gains a clearer commercial story and a more disciplined layout?",
    constraints: [
      "Coursework brief and timetable",
      "Public information only: no access to the brand's data or systems",
      "No live commerce connection",
    ],
    contribution: "Brand and market review, narrative reframing and visual direction.",
    process: ["Review the brand and market", "Reframe the product narrative", "Draft editorial commerce concepts", "Test the visual direction"],
    output: ["Brand and market review", "Reframed product narrative", "Responsive visual direction"],
    evidence: [],
    limitations: [
      "An independent academic exercise",
      "No live commerce connection",
      "Product catalogue shown is illustrative",
    ],
    next: ["Develop the purchase journey", "Build a content system", "Resolve production detail"],
    technologies: [],
    languages: [],
    links: {},
    featured: false,
    order: 5,
    reviewed: false,
  },
];

export const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
