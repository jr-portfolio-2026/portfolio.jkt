export function initMenu() {
  const root = document.documentElement;
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  if (!toggle || !panel) return;
  const label = toggle.querySelector('[data-menu-label]');

  const set = (open: boolean) => {
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    if (open) panel.removeAttribute('inert'); else panel.setAttribute('inert', '');
    if (label) label.textContent = open ? 'Close' : 'Menu';
    if (open) setTimeout(() => panel.querySelector<HTMLElement>('a')?.focus(), 60);
  };

  toggle.addEventListener('click', () => set(!root.classList.contains('menu-open')));
  panel.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) set(false); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('menu-open')) { set(false); toggle.focus(); }
  });
  matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) set(false); });
}
