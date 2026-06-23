import { animate, stagger } from 'motion';
import { prefersReducedMotion } from './prefersReducedMotion';

/**
 * Wire the mobile hamburger overlay: open/close buttons, scroll-lock,
 * staggered Motion One entrance, and Escape-to-close. Returns a cleanup that
 * restores body scroll (called on navigation teardown).
 */
export function initMobileMenu(): VoidFunction | undefined {
  const menu = document.getElementById('mobile-menu');
  const openBtn = document.getElementById('menu-open');
  const closeBtn = document.getElementById('menu-close');
  if (!menu || !openBtn || !closeBtn) return undefined;

  const backdrop = menu.querySelector<HTMLElement>('[data-menu-backdrop]');
  const items = menu.querySelectorAll<HTMLElement>('[data-menu-item]');
  const reduced = prefersReducedMotion();

  const open = () => {
    menu.classList.remove('hidden');
    menu.dataset.open = 'true';
    document.body.style.overflow = 'hidden';
    openBtn.setAttribute('aria-expanded', 'true');
    if (reduced) return;
    if (backdrop) animate(backdrop, { opacity: [0, 1] }, { duration: 0.25 });
    animate(
      items,
      { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0)'] },
      { duration: 0.4, delay: stagger(0.06), ease: [0.16, 1, 0.3, 1] },
    );
  };

  const close = () => {
    menu.dataset.open = 'false';
    document.body.style.overflow = '';
    openBtn.setAttribute('aria-expanded', 'false');
    if (reduced) {
      menu.classList.add('hidden');
      return;
    }
    animate(menu, { opacity: [1, 0] }, { duration: 0.2 }).finished.then(() => {
      menu.classList.add('hidden');
      menu.style.opacity = '';
    });
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && menu.dataset.open === 'true') close();
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', onKey);

  return () => {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  };
}
