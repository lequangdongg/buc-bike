/**
 * Motion-style page transition for Astro's <ClientRouter />. Applied via
 * `transition:animate={pageFade}` on <main>. The keyframes themselves live in
 * global.css (the bk-enter / bk-exit keyframes); here we only wire names,
 * timing and easing.
 *
 * Soft rise + fade going forwards, a quieter drop + fade going back.
 */
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export const pageFade = {
  forwards: {
    old: { name: 'bk-exit-down', duration: '0.3s', easing: EASE, fillMode: 'both' },
    new: { name: 'bk-enter-up', duration: '0.45s', easing: EASE, fillMode: 'both' },
  },
  backwards: {
    old: { name: 'bk-exit-up', duration: '0.3s', easing: EASE, fillMode: 'both' },
    new: { name: 'bk-enter-down', duration: '0.45s', easing: EASE, fillMode: 'both' },
  },
};
