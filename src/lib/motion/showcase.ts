import { scroll } from 'motion';
import { prefersReducedMotion } from './prefersReducedMotion';

/**
 * Drives the pinned Feliz Lite showcase: as the tall track scrolls past, the
 * active hotspot (marker + callout + progress dot) steps through 0…n-1.
 * Under reduced motion the track collapses (CSS) and every callout shows.
 */
export function initShowcase(): VoidFunction | undefined {
  const section = document.querySelector<HTMLElement>('[data-showcase]');
  if (!section) return undefined;

  const hotspots = Array.from(section.querySelectorAll<HTMLElement>('[data-hotspot]'));
  const callouts = Array.from(section.querySelectorAll<HTMLElement>('[data-callout]'));
  const dots = Array.from(section.querySelectorAll<HTMLElement>('[data-dot]'));
  const n = callouts.length;
  if (!n) return undefined;

  const setActive = (idx: number) => {
    hotspots.forEach((el, i) => (el.dataset.active = String(i === idx)));
    callouts.forEach((el, i) => (el.dataset.active = String(i === idx)));
    dots.forEach((el, i) => (el.dataset.active = String(i === idx)));
  };

  if (prefersReducedMotion()) {
    section.dataset.reduced = 'true';
    hotspots.forEach((el) => (el.dataset.active = 'true'));
    callouts.forEach((el) => (el.dataset.active = 'true'));
    dots.forEach((el) => (el.dataset.active = 'true'));
    return undefined;
  }

  setActive(0);
  let current = 0;
  return scroll(
    (progress: number) => {
      const idx = Math.max(0, Math.min(n - 1, Math.floor(progress * n)));
      if (idx !== current) {
        current = idx;
        setActive(idx);
      }
    },
    { target: section, offset: ['start start', 'end end'] },
  );
}
