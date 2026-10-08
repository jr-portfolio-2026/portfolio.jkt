// ─────────────────────────────────────────────────────────────────────────────
// IDENTITY — the only file that says who this site belongs to.
// Template values on purpose. `npm run check:content` lists what is still unfilled.
// ─────────────────────────────────────────────────────────────────────────────
export const site = {
  name: "Your Name", // full name, shown above the headline
  initials: "J.R", // monogram: header, ghost watermark, footer
  year: 2026,
  email: "hello@example.com",
  // An empty string hides the link everywhere. No dead links, ever.
  links: { linkedin: "", github: "" },
  meta: {
    title: "J.R — Law, Trade & Digital Systems",
    description:
      "Selected work across international law, trade, business strategy, institutional practice and applied digital tools.",
    ogImage: "", // e.g. "/og.png" (1200×630). Needed for good link previews.
  },
} as const;
