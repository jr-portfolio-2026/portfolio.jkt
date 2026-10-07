// Headline "resolve": every letter starts displaced and blurred, then settles into place.
// Visible text is plain HTML without JS; screen readers get the full phrase via aria-label.
function rng(seed: number) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export function initResolve(el: HTMLElement, reduce: boolean) {
  if (reduce) { el.classList.add('is-split', 'is-ready'); return; }
  const rand = rng(11);
  let i = 0;
  const full = el.textContent!.trim();

  const split = (node: Node): Node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      (node.textContent ?? '').split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(' '); return; }
        const w = document.createElement('span'); w.className = 'w';
        [...part].forEach((ch) => {
          const l = document.createElement('span'); l.className = 'l'; l.textContent = ch;
          l.style.setProperty('--dx', `${((rand() - 0.5) * 1.1).toFixed(2)}em`);
          l.style.setProperty('--dy', `${(0.15 + rand() * 0.55).toFixed(2)}em`);
          l.style.setProperty('--r', `${((rand() - 0.5) * 38).toFixed(1)}deg`);
          l.style.setProperty('--d', `${(0.12 + i++ * 0.024).toFixed(3)}s`);
          w.append(l);
        });
        frag.append(w);
      });
      return frag;
    }
    const clone = (node as Element).cloneNode(false);
    node.childNodes.forEach((c) => clone.appendChild(split(c)));
    return clone;
  };

  const out = document.createDocumentFragment();
  el.childNodes.forEach((c) => out.appendChild(split(c)));
  el.setAttribute('aria-label', full);
  el.textContent = '';
  el.appendChild(out);
  el.querySelectorAll('.w').forEach((n) => n.setAttribute('aria-hidden', 'true'));
  el.classList.add('is-split');

  const go = () => requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-ready')));
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(go);
}
