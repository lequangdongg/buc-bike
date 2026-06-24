import { scroll } from 'motion';
import { prefersReducedMotion } from './prefersReducedMotion';

/**
 * Feliz Lite showcase interaction.
 * - Desktop: pinned track; scroll steps the active hotspot 0…n-1 (tap also works).
 * - Mobile: not pinned; TAP a numbered hotspot or dot to reveal its callout.
 * - Reduced motion: every callout is listed statically (CSS), no JS needed.
 */
export function initShowcase(): VoidFunction | undefined {
  const section = document.querySelector<HTMLElement>('[data-showcase]');
  if (!section) return undefined;

  const hotspots = Array.from(section.querySelectorAll<HTMLElement>('[data-hotspot]'));
  const callouts = Array.from(section.querySelectorAll<HTMLElement>('[data-callout]'));
  const dots = Array.from(section.querySelectorAll<HTMLElement>('[data-dot]'));
  const n = callouts.length;
  if (!n) return undefined;

  let current = -1;
  const setActive = (idx: number) => {
    if (idx === current) return;
    current = idx;
    hotspots.forEach((el, i) => (el.dataset.active = String(i === idx)));
    callouts.forEach((el, i) => (el.dataset.active = String(i === idx)));
    dots.forEach((el, i) => (el.dataset.active = String(i === idx)));
  };

  // Reduced motion: list everything, skip interaction entirely.
  if (prefersReducedMotion()) {
    section.dataset.reduced = 'true';
    hotspots.forEach((el) => (el.dataset.active = 'true'));
    callouts.forEach((el) => (el.dataset.active = 'true'));
    dots.forEach((el) => (el.dataset.active = 'true'));
    return undefined;
  }

  setActive(0);

  // Tap any marker or dot to jump to it (works on every viewport).
  const cleanups: VoidFunction[] = [];
  [...hotspots, ...dots].forEach((el, i) => {
    const idx = i % n; // hotspots then dots both index 0…n-1
    const onClick = () => setActive(idx);
    el.addEventListener('click', onClick);
    cleanups.push(() => el.removeEventListener('click', onClick));
  });

  // Desktop only: scrub the active hotspot from the pinned scroll track.
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  if (isDesktop) {
    const stop = scroll(
      (progress: number) => setActive(Math.max(0, Math.min(n - 1, Math.floor(progress * n)))),
      { target: section, offset: ['start start', 'end end'] },
    );
    cleanups.push(stop);
  }

  return () => cleanups.forEach((c) => c());
}
