// ─────────────────────────────────────────────────────────────────────────────
// HOMEPAGE COPY — every visible sentence lives here, nowhere else.
// Swap this file (and theme.css) to produce a different site on the same base.
// ─────────────────────────────────────────────────────────────────────────────
export const home = {
  nav: [
    { label: 'Who we are', href: '#about' },
    { label: 'Fields', href: '#fields' },
    { label: 'Work', href: '#work' },
    { label: 'Method', href: '#method' },
    { label: 'Contact', href: '#contact' },
  ],

  hero: {
    eyebrow: 'Law · Trade · Software',
    // <em> is allowed: it is rendered in the italic display face.
    title: 'Complexity is a <em>design</em> problem.',
    sub: 'We practise law, trade and software as one discipline, so that complicated things become clear, usable and trustworthy.',
    primary: { label: 'Selected work', href: '#work' },
    secondary: { label: 'Get in touch', href: '#contact' },
    footerLeft: 'Portfolio — 2026',
    footerRight: 'Scroll',
  },

  about: {
    label: 'Who we are',
    statement:
      'We are a small international practice working where rules, markets and software meet. We begin with the legal or commercial question, structure the evidence, and end with something people can actually use.',
    facts: [
      { k: 'Focus', v: 'Law · Trade · Systems' },
      { k: 'Practice', v: 'From research to instrument' },
      { k: 'Reach', v: 'International by default' },
    ],
    portrait: { caption: 'Portrait — to be added', placeholder: true },
  },

  fields: {
    label: 'Fields',
    title: 'Four territories, one way of working.',
    items: [
      {
        title: 'International law',
        text: 'Comparative and cross-border analysis, translated into clear and usable legal positions.',
        tags: ['Comparative analysis', 'Institutions', 'Legal research'],
      },
      {
        title: 'International business',
        text: 'Commercial questions examined through strategy, governance and market context.',
        tags: ['Business models', 'Strategy', 'Governance'],
      },
      {
        title: 'International trade',
        text: 'Trade flows, regulatory regimes and operational constraints, made legible.',
        tags: ['Trade mapping', 'Compliance', 'Cross-border'],
      },
      {
        title: 'Software & data',
        text: 'Quiet digital instruments that structure evidence, decisions and recurring work.',
        tags: ['Applied software', 'Data systems', 'Prototyping'],
      },
    ],
  },

  work: {
    label: 'Selected work',
    title: 'Case studies, in preparation.',
    intro:
      'Each study opens as its own chapter: the question, the structure, and a controlled demonstration.',
    // status 'soon' renders a quiet non-link row. status 'live' links to /work/<slug>.
    projects: [
      { slug: 'project-one', title: 'Project one', category: 'Discipline', year: '2026', status: 'soon', placeholder: true },
      { slug: 'project-two', title: 'Project two', category: 'Discipline', year: '2026', status: 'soon', placeholder: true },
      { slug: 'project-three', title: 'Project three', category: 'Discipline', year: '2026', status: 'soon', placeholder: true },
      { slug: 'project-four', title: 'Project four', category: 'Discipline', year: '2026', status: 'soon', placeholder: true },
    ],
  },

  method: {
    label: 'Method',
    title: 'From question to instrument.',
    steps: [
      { title: 'Research', text: 'Read the sources before forming a view.' },
      { title: 'Frame', text: 'Turn the legal or commercial question into a precise problem.' },
      { title: 'Structure', text: 'Organise the evidence so it can be checked.' },
      { title: 'Design', text: 'Build the interface a professional would trust.' },
      { title: 'Refine', text: 'Test, correct, and keep what survives.' },
    ],
  },

  contact: {
    label: 'Contact',
    title: 'Have a problem worth untangling?',
    note: 'Extended demonstrations are shared in a controlled setting.',
  },
} as const;
