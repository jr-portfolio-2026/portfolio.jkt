import { initMenu } from './menu';
import { initReveal } from './reveal';
import { initResolve } from './resolve';
import { initWords } from './words';
import { initHeroField } from './hero-field';
import { initCursor } from './cursor';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

initMenu();
initReveal(reduce);
initWords(reduce);
initCursor();

const title = document.querySelector<HTMLElement>('[data-resolve]');
if (title) initResolve(title, reduce);

const field = document.querySelector<HTMLElement>('[data-hero-field]');
if (field) initHeroField(field, reduce);

const root = document.documentElement;
const header = document.querySelector<HTMLElement>('[data-header]');
const darks = [...document.querySelectorAll<HTMLElement>('.dark')];
const onScroll = () => {
  root.classList.toggle('is-scrolled', scrollY > 8);
  if (header) {
    const y = 44; // vertical centre of the floating bar
    header.classList.toggle('header--dark', darks.some((d) => { const r = d.getBoundingClientRect(); return r.top <= y && r.bottom >= y; }));
  }
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();
