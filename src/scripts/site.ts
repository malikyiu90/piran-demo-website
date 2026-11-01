// Site-wide behaviour: smooth scroll, header state, mobile menu and scroll reveals.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------------- scroll */

let lenis: Lenis | null = null;
if (!reduceMotion) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target: HTMLElement | number) {
  if (lenis) lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : -80, duration: 1.4 });
  else if (typeof target === 'number') window.scrollTo({ top: target });
  else target.scrollIntoView();
}

document.addEventListener('click', (event) => {
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
  if (!link) return;
  const url = new URL(link.href, window.location.href);
  if (url.pathname !== window.location.pathname || !url.hash) return;
  const target = url.hash === '#main' && link.hasAttribute('data-to-top') ? 0 : document.querySelector<HTMLElement>(url.hash);
  if (target === null) return;
  event.preventDefault();
  scrollToTarget(target);
  if (target !== 0) history.replaceState(null, '', url.hash);
});

// Arriving on a page with a hash (e.g. /contact#quote) — let layout settle, then glide there.
if (window.location.hash.length > 1) {
  const target = document.querySelector<HTMLElement>(window.location.hash);
  if (target) window.addEventListener('load', () => requestAnimationFrame(() => scrollToTarget(target)), { once: true });
}

/* ---------------------------------------------------------------- header */

const header = document.querySelector<HTMLElement>('[data-header]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const menuToggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menuLabel = document.querySelector<HTMLElement>('[data-menu-label]');
let menuOpen = false;

// The header stays visible at all times; it only gains a solid background once the page scrolls.
function onScroll(y: number) {
  header?.classList.toggle('is-scrolled', y > 8);
}
if (lenis) lenis.on('scroll', ({ scroll }: { scroll: number }) => onScroll(scroll));
else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
onScroll(window.scrollY);

function setMenu(open: boolean) {
  if (!menu || !menuToggle) return;
  menuOpen = open;
  menu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  if (menuLabel) menuLabel.textContent = open ? 'Close menu' : 'Open menu';
  if (open) lenis?.stop();
  else lenis?.start();
}

menuToggle?.addEventListener('click', () => setMenu(!menuOpen));
menu?.addEventListener('click', (e) => {
  if ((e.target as Element).closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) {
    setMenu(false);
    menuToggle?.focus();
  }
});
window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
  if (e.matches && menuOpen) setMenu(false);
});

/* --------------------------------------------------------------- reveals */

if (!reduceMotion) {
  // Initial states are set here (not in CSS) so content stays visible if scripts fail.
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  gsap.set(items, { autoAlpha: 0, y: 36 });
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });

  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax) || 12;
    gsap.fromTo(el, { yPercent: -amount / 2 }, {
      yPercent: amount / 2,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-draw-line]').forEach((el) => {
    gsap.fromTo(el, { scaleX: 0 }, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top 70%', end: 'bottom 70%', scrub: true },
    });
  });
}

// Fonts and late images change layout; keep trigger positions accurate.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
