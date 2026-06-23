import { scroll, animate } from 'motion';
import { prefersReducedMotion } from './prefersReducedMotion';

/** Fade and gently scale the hero content as the user scrolls past it. */
export function initHeroScroll(el: HTMLElement): void {
  if (prefersReducedMotion()) return;

  scroll(animate(el, { opacity: [1, 0], scale: [1, 1.06], y: [0, 40] }, { ease: 'linear' }), {
    target: el,
    offset: ['start start', 'end start'],
  });
}
