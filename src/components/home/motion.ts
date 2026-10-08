export const ease = [0.22, 1, 0.36, 1] as const;

/** Shared scroll-reveal preset used by every section. */
export const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease },
} as const;
