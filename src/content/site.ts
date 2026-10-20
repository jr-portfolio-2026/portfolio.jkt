// ─────────────────────────────────────────────────────────────────────────────
// IDENTITY — the only file that says who this site belongs to.
// Components read these values; no name, initials, contact or link is written in JSX.
// `npm run check:content` lists what is still unfilled; `npm run build:release` refuses to build
// until every item is filled (the plain `npm run build` stays possible for the template preview).
// ─────────────────────────────────────────────────────────────────────────────
export const site = {
  name: "J.R", // public name. Initials only until the owner approves anything longer.
  initials: "J.R", // typographic mark: header, intro monogram, footer
  portfolioLabel: "Professional Portfolio",
  disciplines: ["Software", "Data", "International Trade", "Law"],
  year: 2026,
  email: "hello@example.com",
  // An empty string hides the link everywhere. No dead links, ever.
  links: { linkedin: "", github: "" },

  // Public address of the deployed site, without trailing slash. Used for canonical and Open Graph URLs.
  url: "https://jr-portfolio-2026.github.io/portfolio.jkt",

  // Logo mechanism. Empty `src` = the typographic mark above is used everywhere (header, intro, favicon file).
  // When the identity is approved: drop the file in /public, set `src` ("logo.svg") and `alt`.
  logo: { src: "", alt: "" },

  // Portrait for the Presentation section. Empty `src` = clearly designated placeholder.
  portrait: { src: "", alt: "", caption: "Portrait — to be supplied" },

  meta: {
    title: "J.R — Law, Trade & Digital Systems",
    description:
      "Portfolio of J.R: studies across international law, trade and business, and the digital tools built to support them.",
    // Path inside /public, 1200×630. Empty = no preview image (flagged by check:content).
    ogImage: "og.png",
    ogImageAlt: "J.R — portfolio",
    themeColor: "#F7F4ED",
  },
} as const;
