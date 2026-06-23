import { scroll, animate } from 'motion';
import { prefersReducedMotion } from './prefersReducedMotion';

/**
 * Scroll-linked parallax. Each `data-parallax` element drifts vertically across
 * its own scroll range; the numeric value sets the depth (default 0.2).
 */
export function initParallax(): VoidFunction | undefined {
  if (prefersReducedMotion()) return undefined;

  const stops: VoidFunction[] = [];
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const depth = Number(el.dataset.parallax || '0.2');
    const shift = 60 * depth;
    stops.push(
      scroll(animate(el, { y: [-shift, shift] }, { ease: 'linear' }), {
        target: el,
        offset: ['start end', 'end start'],
      }),
    );
  });
  return () => stops.forEach((stop) => stop());
}
