// "Order from complexity": a grid of points starts scattered and settles into a precise lattice
// while the headline resolves. It then answers the pointer gently. Static when motion is reduced.
type P = { hx: number; hy: number; jx: number; jy: number; ph: number; ox: number; oy: number };

export function initHeroField(host: HTMLElement, reduce: boolean) {
  const canvas = host.querySelector('canvas');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;

  const css = getComputedStyle(document.documentElement);
  const navy = css.getPropertyValue('--navy').trim() || '#153765';
  const gold = css.getPropertyValue('--gold').trim() || '#ab894b';

  let w = 0, h = 0, cols = 0, rows = 0, cell = 56, pts: P[] = [];
  let running = false, raf = 0, start = performance.now();
  const SETTLE = 3400;
  const ptr = { x: -9999, y: -9999 };
  let seed = 5;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  const build = () => {
    const r = host.getBoundingClientRect();
    w = r.width; h = r.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = w < 640 ? 40 : w < 1100 ? 52 : 60;
    cols = Math.ceil(w / cell) + 2; rows = Math.ceil(h / cell) + 2;
    const ox = (w - (cols - 1) * cell) / 2, oy = (h - (rows - 1) * cell) / 2;
    seed = 5; pts = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++)
      pts.push({ hx: ox + i * cell, hy: oy + j * cell, jx: (rnd() - 0.5) * cell * 2.4, jy: (rnd() - 0.5) * cell * 2.4, ph: rnd() * 6.28, ox: 0, oy: 0 });
  };

  const xs = () => new Float32Array(pts.length);
  let X = xs(), Y = xs();

  const draw = (now: number) => {
    const t = reduce ? 1 : Math.min(1, (now - start) / SETTLE);
    const e = 1 - Math.pow(1 - t, 3);
    ctx.clearRect(0, 0, w, h);
    if (X.length !== pts.length) { X = xs(); Y = xs(); }
    const R = 150;
    for (let k = 0; k < pts.length; k++) {
      const p = pts[k];
      let x = p.hx + p.jx * (1 - e) + (reduce ? 0 : Math.sin(now / 2200 + p.ph) * 1.3 * e);
      let y = p.hy + p.jy * (1 - e) + (reduce ? 0 : Math.cos(now / 2600 + p.ph) * 1.3 * e);
      const dx = x - ptr.x, dy = y - ptr.y, d = Math.hypot(dx, dy);
      let tx = 0, ty = 0;
      if (d < R && d > 0.01) { const f = Math.pow(1 - d / R, 2) * 16; tx = (dx / d) * f; ty = (dy / d) * f; }
      p.ox += (tx - p.ox) * 0.12; p.oy += (ty - p.oy) * 0.12;
      X[k] = x + p.ox; Y[k] = y + p.oy;
    }
    ctx.strokeStyle = navy; ctx.globalAlpha = 0.085; ctx.lineWidth = 1; ctx.beginPath();
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const k = j * cols + i;
      if (i < cols - 1) { ctx.moveTo(X[k], Y[k]); ctx.lineTo(X[k + 1], Y[k + 1]); }
      if (j < rows - 1) { ctx.moveTo(X[k], Y[k]); ctx.lineTo(X[k + cols], Y[k + cols]); }
    }
    ctx.stroke();
    ctx.fillStyle = navy; ctx.globalAlpha = 0.28;
    for (let k = 0; k < pts.length; k++) ctx.fillRect(X[k] - 1, Y[k] - 1, 2, 2);
    ctx.fillStyle = gold;
    for (let k = 0; k < pts.length; k++) {
      const d = Math.hypot(X[k] - ptr.x, Y[k] - ptr.y);
      if (d < R) { ctx.globalAlpha = (1 - d / R) * 0.9; ctx.beginPath(); ctx.arc(X[k], Y[k], 2.2, 0, 6.283); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
  };

  const loop = (now: number) => { draw(now); raf = running ? requestAnimationFrame(loop) : 0; };
  const run = (on: boolean) => {
    if (reduce) return;
    if (on && !running) { running = true; raf = requestAnimationFrame(loop); }
    if (!on) { running = false; cancelAnimationFrame(raf); }
  };

  build(); draw(performance.now());
  if (!reduce) {
    new IntersectionObserver((en) => run(en[0].isIntersecting), { threshold: 0 }).observe(host);
    document.addEventListener('visibilitychange', () => run(!document.hidden));
    host.parentElement?.addEventListener('pointermove', (e) => { const r = host.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; });
    host.parentElement?.addEventListener('pointerleave', () => { ptr.x = ptr.y = -9999; });
    run(true);
  }
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(() => { build(); draw(performance.now()); }, 150); });
}
