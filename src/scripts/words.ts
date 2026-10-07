// Scroll-linked statement: words brighten as the reader moves through the paragraph.
export function initWords(reduce: boolean) {
  const el = document.querySelector<HTMLElement>('[data-words]');
  if (!el) return;
  const words = el.textContent!.trim().split(/\s+/);
  el.setAttribute('aria-label', words.join(' '));
  el.textContent = '';
  const spans = words.map((w) => {
    const s = document.createElement('span');
    s.className = 'word'; s.textContent = w; s.setAttribute('aria-hidden', 'true');
    el.append(s, ' ');
    return s;
  });
  if (reduce) { spans.forEach((s) => s.classList.add('on')); return; }
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = el.getBoundingClientRect(), vh = innerHeight;
    // independent of paragraph height: starts when the top enters the lower 10% of the screen,
    // finishes when the top reaches 30% from the top (the natural reading position)
    const p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.6)));
    const n = Math.ceil(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('on', i < n));
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  update();
}
