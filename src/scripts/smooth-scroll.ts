// One Lenis instance per page, shared by the site script and the hero.
import Lenis from 'lenis';

let instance: Lenis | null | undefined;

/** The page's smooth-scroll instance, or null when the visitor prefers reduced motion. */
export function getLenis(): Lenis | null {
  if (instance === undefined) {
    instance = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? null : new Lenis({ lerp: 0.09, smoothWheel: true });
  }
  return instance;
}
