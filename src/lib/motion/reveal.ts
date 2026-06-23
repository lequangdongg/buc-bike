import { inView, animate, stagger } from 'motion';
import { prefersReducedMotion } from './prefersReducedMotion';

/**
 * Fade-and-rise elements as they enter the viewport. A container marked
 * `data-reveal` staggers its `data-reveal-item` children; otherwise the
 * container itself animates.
 */
export function initReveal(): void {
  if (prefersReducedMotion()) return;

  inView(
    '[data-reveal]',
    (element) => {
      const items = element.querySelectorAll<HTMLElement>('[data-reveal-item]');
      const targets = items.length ? Array.from(items) : [element as HTMLElement];
      animate(
        targets,
        { opacity: [0, 1], y: [28, 0] },
        { duration: 0.7, delay: stagger(0.09), ease: [0.16, 1, 0.3, 1] },
      );
    },
    { margin: '0px 0px -12% 0px' },
  );
}
