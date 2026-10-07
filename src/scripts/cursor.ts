// Floating glass label that follows the pointer over the work list (fine pointers only).
export function initCursor() {
  const label = document.querySelector<HTMLElement>('[data-cursor]');
  const list = document.querySelector<HTMLElement>('.projects');
  if (!label || !list || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
  const tick = () => {
    cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
    label.style.transform = `translate(${cx + 18}px, ${cy + 18}px)`;
    raf = label.classList.contains('on') ? requestAnimationFrame(tick) : 0;
  };
  list.addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    const row = (e.target as HTMLElement).closest<HTMLElement>('.project');
    if (!row) { label.classList.remove('on'); return; }
    label.textContent = row.dataset.label ?? '';
    if (!label.classList.contains('on')) { cx = x; cy = y; label.classList.add('on'); }
    if (!raf) raf = requestAnimationFrame(tick);
  });
  list.addEventListener('pointerleave', () => label.classList.remove('on'));
}
