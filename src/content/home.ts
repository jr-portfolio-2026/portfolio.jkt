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
  tagline: { first: "LAW · TRADE · BUSINESS", second: "BUSINESS · LAW · TRADE" },
  
  // second: "CONTRACTS · INCOTERMS · CUSTOMS · MARKETS · COMPLIANCE · LOGISTICS" },
  hero: {
    // Two candidate voices. HEADLINE_VARIANT in components/home/Hero.tsx picks one.
    //   "statement" — temperament; the fields are named by the lede underneath.
    //   "fields"    — names the fields in the headline itself, second clause in italic gold.
    statement: ["Always discovering.", "Always learning.", "Always making."],
    fields: { before: "International law, trade and business, ", emphasis: "read through digital systems." },
    lede: "Name Surname ∙ Studying international trade, exploring business in France and across borders, while creating and building digital projects along the way.",
    scroll: "Scroll",
  },

  presentation: {
    index: "01",
    title: "Presentation",
    note: "The person behind the dossier",
    // The three layouts in components/home/Presentation{Glossa,Route,Charter}.tsx all open with "Bonjour, I'm {site.name}."
    // The greeting stays French in every language — a signature, not a translated string — and the
    // name always comes from site.name, so it is never typed here or anywhere else in content.
    lead: "Law didn’t hold my attention until I started building with it.",
    // One story in four beats. Every layout reads this same list, so editing a sentence here
    // changes it everywhere.
    //   key   — the one-word label        title — the beat's heading
    //   em    — a phrase a layout may stress; it must appear verbatim in `text`
    //   see   — an optional cross-reference ("cf. …") to another section; null for none
    chapters: [
      { key: "Studied", title: "Two legal systems", text: "Common law first, then civil and public law.", em: "civil and public law", see: null },
      { key: "Used", title: "Where it stuck", text: "The part that stuck was using them: trade rules, cross-border questions, problems that look like a freight calculation or a customs clause.", em: "a freight calculation or a customs clause", see: { label: "Fields of practice", href: "#practice" } },
      { key: "Built", title: "FRET.IO", text: "When a tool doesn’t exist, I make it. FRET.IO started with a freight estimate done by hand, every time, and that wasn’t worth repeating.", em: "FRET.IO", see: { label: "Selected work", href: "#work" } },
      { key: "Next", title: "Still open", text: "Where this goes next is open. One path leads back to the bar.", em: "back to the bar", see: { label: "Get in touch", href: "#contact" } },
    ],
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
    lede: "Four studies, at different stages, each kept honest about where it actually stands.",
    // The line under the sheet on the left: the position comes from each project's `kind`.
    // The cards
    selectLabel: "Select a project",
    selectHint: "Choose a plate to open it. The slow cycle stops as soon as you do.",
    pause: "Pause the cycle",
    play: "Resume the cycle",
    cardOpen: "Open the study",
    cardTry: "Try it",
    railLabel: "How far along it is",
    legend: "What each label means",
    workingNow: "Working now",
    nextRefinement: "Next refinement",
    openLabel: "Open the case study",
    demoLabel: "Live demo",
    sourceLabel: "Source",
    closing: "Further studies are added here as they are ready to be shown.",
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
