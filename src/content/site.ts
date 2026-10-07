// ─────────────────────────────────────────────────────────────────────────────
// IDENTITY — the only file that holds who you are.
// Everything here is a neutral template value. Run `npm run check:content`
// to list what still needs replacing before the site is shared.
// ─────────────────────────────────────────────────────────────────────────────
export const site = {
  name: 'Your Name',
  initials: 'YN',
  year: 2026,
  email: 'hello@example.com',
  // Empty string = the link is hidden everywhere (no dead links).
  links: { linkedin: '', github: '' },
  meta: {
    title: 'Your Name — Law, Trade & Software',
    description:
      'An international practice working where law, trade and software meet. Selected work, method and contact.',
    ogImage: '', // 1200×630 image, e.g. '/og.png' — needed for good link previews
  },
} as const;
