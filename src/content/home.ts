// ─────────────────────────────────────────────────────────────────────────────
// HOMEPAGE COPY — every visible sentence lives here, nowhere else.
// Icons are referenced by key and mapped in components/home/Fields.tsx.
// ─────────────────────────────────────────────────────────────────────────────
export const home = {
  nav: [
    { label: "Presentation", href: "#presentation" },
    { label: "Fields", href: "#fields" },
    { label: "Work", href: "#work" },
    { label: "Method", href: "#method" },
    { label: "Context", href: "#context" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    dossier: "Professional dossier",
    contexts: "EN · FR · International",
    headline: { before: "Law, commerce and ", emphasis: "systems", after: " for work across borders." },
    lede: "A professional portfolio of legal, commercial, and software systems.",
    sub: "Selected work across international law, trade, business strategy, institutional practice, and applied digital tools.",
    primary: { label: "Selected work", href: "#work" },
    secondary: { label: "Get in touch", href: "#contact" },
  },

  position: {
    label: "Position",
    text: "Analysis should not remain abstract. It should become a position, a structure, or an instrument that can be used.",
  },

  presentation: {
    index: "01",
    title: "Presentation",
    note: "The person behind the dossier",
    lead: "Trained between legal reasoning and commercial practice, working where international rules, trade realities, and digital instruments meet.",
    body: "The work moves from research and comparative analysis to structured data and interfaces that professionals can actually use. Every study in this portfolio begins with a legal or commercial question and ends with something operable.",
    facts: [
      { k: "Focus", v: "Law · Trade · Systems" },
      { k: "Practice", v: "Research to instrument" },
      { k: "Contexts", v: "EN · FR · International" },
    ],
    portrait: { caption: "Portrait / to be supplied", placeholder: true },
  },

  fields: {
    index: "02",
    title: "Field map",
    note: "The intellectual territory",
    items: [
      { n: "I", icon: "law", title: "International Law", text: "Comparative and cross-border analysis translated into clear, usable legal positions.", tags: ["Comparative analysis", "Institutions", "Legal research"] },
      { n: "II", icon: "business", title: "International Business", text: "Commercial questions examined through strategy, governance, and market context.", tags: ["Business models", "Strategy", "Governance"] },
      { n: "III", icon: "trade", title: "International Trade", text: "Trade flows, regulatory regimes, and operational constraints made legible.", tags: ["Trade mapping", "Compliance", "Cross-border"] },
      { n: "IV", icon: "software", title: "Software & Data Tools", text: "Quiet digital instruments that structure evidence, decisions, and recurring work.", tags: ["Applied software", "Data systems", "Prototyping"] },
    ],
  },

  work: {
    index: "03",
    title: "Selected work",
    note: "Studies in preparation",
    selectLabel: "Select a study",
    // live: false renders a quiet, honest "in preparation" state.
    // live: true adds a real link to /work/<slug> (build that route first).
    projects: [
      { slug: "project-one", name: "Project one", category: "Discipline", status: "In preparation", relevance: "Field of practice", problem: "A short statement of the question this study answers and why it matters.", working: "What already works, stated plainly.", improve: "The next refinement.", live: false, placeholder: true },
      { slug: "project-two", name: "Project two", category: "Discipline", status: "In preparation", relevance: "Field of practice", problem: "A short statement of the question this study answers and why it matters.", working: "What already works, stated plainly.", improve: "The next refinement.", live: false, placeholder: true },
      { slug: "project-three", name: "Project three", category: "Discipline", status: "In preparation", relevance: "Field of practice", problem: "A short statement of the question this study answers and why it matters.", working: "What already works, stated plainly.", improve: "The next refinement.", live: false, placeholder: true },
      { slug: "project-four", name: "Project four", category: "Discipline", status: "In preparation", relevance: "Field of practice", problem: "A short statement of the question this study answers and why it matters.", working: "What already works, stated plainly.", improve: "The next refinement.", live: false, placeholder: true },
    ],
  },

  method: {
    index: "04",
    title: "Method",
    note: "Analysis into execution",
    steps: ["Research", "Legal / commercial framing", "Data structuring", "Interface design", "Implementation", "Testing and iteration"],
  },

  capabilities: {
    index: "05",
    title: "Capabilities",
    note: "Selective, not exhaustive",
    items: ["Legal research and comparative analysis", "International trade mapping", "Business model analysis", "Product strategy", "Front-end development", "Data organisation", "Demo prototyping", "Documentation and presentation"],
  },

  context: {
    index: "06",
    title: "Languages & contexts",
    note: "Working across borders",
    statement: "An international practice is also an exercise in interpretation: between languages, jurisdictions, institutions, and commercial realities.",
    languages: ["English", "Français", "中文", "हिन्दी", "Español", "العربية"],
  },

  contact: {
    index: "07",
    label: "Correspondence",
    title: "Available for selected academic, institutional, and professional opportunities.",
    note: "Extended demonstrations may be shared in a controlled review setting.",
    footerLine: "Law · Trade · Strategy · Software",
  },
} as const;
