/**
 * Slide the header out of view on scroll-down, reveal it on scroll-up, and
 * flag `data-scrolled` once the page leaves the very top (for backdrop styling).
 */
export function initScrollHideHeader(el: HTMLElement): () => void {
  let last = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        const goingDown = y > last && y > 96;
        el.style.transform = goingDown ? 'translateY(-100%)' : 'translateY(0)';
        el.dataset.scrolled = String(y > 8);
        last = y;
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
}
