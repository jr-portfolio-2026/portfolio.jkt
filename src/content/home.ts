// ─────────────────────────────────────────────────────────────────────────────
// HOMEPAGE COPY — every visible sentence lives here, nowhere else.
// Narrative: Identity → Presentation → Selected work → Practice → Method → Context → Contact.
// Projects come from content/projects.ts. Icons are referenced by key (mapped in components/home/Practice.tsx).
// ─────────────────────────────────────────────────────────────────────────────
export const home = {
  // Agreed navigation. The section ids below are the existing ones; rename them
  // together with these hrefs if the labels settle permanently.
  nav: [
    { label: "About", href: "#presentation" },
    { label: "Fields", href: "#practice" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],

  // Candidate tagline — an editorial territory, not a professional claim. Used by Hero and Presentation.
  tagline: { first: "LAW • TRADE • BUSINESS", second: "CONTRACTS · INCOTERMS · CUSTOMS · MARKETS · COMPLIANCE · LOGISTICS" },

  hero: {
    // Two candidate voices. HEADLINE_VARIANT in components/home/Hero.tsx picks one.
    //   "statement" — temperament; the fields are named by the lede underneath.
    //   "fields"    — names the fields in the headline itself, second clause in italic gold.
    statement: ["Always discovering.", "Always learning.", "Always making."],
    fields: { before: "International law, trade and business, ", emphasis: "read through digital systems." },
    lede: "A student exploring international trade, business and digital creation, with an academic background in French and English law.",
    scroll: "Scroll",
  },

  presentation: {
    index: "01",
    title: "Presentation",
    note: "The person behind the dossier",
    lead: "An emerging professional working where international rules, trade realities and digital tools meet.",
    body: "The work moves from research and comparative analysis to structured data and interfaces that people can use. It is presented as it stands: some of it runs today, some is still being specified.",
    facts: [
      { k: "Focus", v: "Law · Trade · Systems" },
      { k: "Practice", v: "Research to instrument" },
      { k: "Contexts", v: "EN · FR · International" },
    ],
  },

  work: {
    index: "02",
    title: "Selected work",
    note: "Studies, with their status stated",
    selectLabel: "Select a study",
    openLabel: "Open case study",
    notesLabel: "Case notes",
    workingNow: "Working now",
    nextRefinement: "Next refinement",
    legend: "What each label means",
  },

  practice: {
    index: "03",
    title: "Practice",
    note: "Fields and capabilities",
    fields: [
      { n: "I", icon: "law", title: "International Law", text: "Comparative and cross-border analysis translated into clear, usable legal positions.", tags: ["Comparative analysis", "Institutions", "Legal research"] },
      { n: "II", icon: "business", title: "International Business", text: "Commercial questions examined through strategy, governance and market context.", tags: ["Business models", "Strategy", "Governance"] },
      { n: "III", icon: "trade", title: "International Trade", text: "Trade flows, regulatory regimes and operational constraints made legible.", tags: ["Trade mapping", "Compliance", "Cross-border"] },
      { n: "IV", icon: "software", title: "Software & Data Tools", text: "Quiet digital instruments that structure evidence, decisions and recurring work.", tags: ["Applied software", "Data systems", "Prototyping"] },
    ],
    capabilitiesLabel: "Capabilities",
    capabilities: ["Legal research and comparative analysis", "International trade mapping", "Business model analysis", "Product strategy", "Front-end development", "Data organisation", "Demo prototyping", "Documentation and presentation"],
  },

  method: {
    index: "04",
    title: "Method",
    note: "Reasoning into execution",
    statement: "Analysis should not remain abstract. It should become a position, a structure or an instrument that can be used.",
    steps: ["Research", "Legal / commercial framing", "Data structuring", "Interface design", "Implementation", "Testing and iteration"],
  },

  context: {
    index: "05",
    title: "International context",
    note: "Working across borders",
    statement: "An international practice is also an exercise in interpretation: between languages, jurisdictions, institutions and commercial realities.",
    // Languages are claims about the owner: confirm each before release.
    languages: ["English", "Français", "Español"],
  },

  contact: {
    index: "06",
    label: "Correspondence",
    title: "Available for selected academic, institutional and professional opportunities.",
    note: "Extended demonstrations may be shared in a controlled review setting.",
    footerLine: "Law · Trade · Strategy · Software",
  },
} as const;
