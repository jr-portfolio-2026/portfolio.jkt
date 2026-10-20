// Introductory sequence: ivory welcomes → saturated blue identity scene → portfolio.
// All timings are here so the pacing can be tuned without touching the component.
export const intro = {
  welcomes: [
    { word: "Welcome.", lang: "en", code: "EN" },
    { word: "Bienvenue.", lang: "fr", code: "FR" },
    { word: "Ласкаво просимо.", lang: "uk", code: "UK" },
  ],
  welcomeMs: 1600, // each welcome stays about this long unless the visitor advances sooner
  identityMs: 2600, // how long the blue identity scene holds before the page is revealed
  failSafeMs: 20000, // the intro always closes by itself after this, whatever happens
  storageKey: "portfolio-intro-seen", // sessionStorage: one showing per browser session
  labels: {
    dialog: "Introduction",
    skip: "Skip intro",
    advance: "Click, tap or press Enter to continue",
    loading: "Entering the portfolio",
    enter: "Enter the portfolio",
    replay: "Replay introduction",
  },
} as const;
