import { inView, animate } from 'motion';
import { prefersReducedMotion } from './prefersReducedMotion';

/**
 * Count a `data-count` element from 0 to its target when it enters view.
 * `data-decimals` controls fractional digits (e.g. a 4.9 rating).
 */
export function initCountUp(): void {
  const format = (el: HTMLElement, value: number) => {
    const decimals = Number(el.dataset.decimals || '0');
    el.textContent = value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  inView(
    '[data-count]',
    (element) => {
      const el = element as HTMLElement;
      const target = Number(el.dataset.count || '0');
      if (prefersReducedMotion()) {
        format(el, target);
        return;
      }
      animate(0, target, {
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => format(el, v),
      });
    },
    { margin: '0px 0px -20% 0px' },
  );
}
