import { animate } from 'motion';
import { prefersReducedMotion } from './prefersReducedMotion';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Desktop language dropdown: animated open/close + click-outside + Escape.
 * Returns a cleanup that detaches the document listeners on navigation.
 */
export function initLangSwitcher(): VoidFunction | undefined {
  const wraps = document.querySelectorAll<HTMLElement>('[data-lang-switcher]');
  if (!wraps.length) return undefined;
  const cleanups = Array.from(wraps).map(wireOne).filter(Boolean) as VoidFunction[];
  return () => cleanups.forEach((c) => c());
}

function wireOne(wrap: HTMLElement): VoidFunction | undefined {
  const trigger = wrap.querySelector<HTMLButtonElement>('[data-lang-trigger]');
  const menu = wrap.querySelector<HTMLElement>('[data-lang-menu]');
  if (!trigger || !menu) return undefined;

  const reduced = prefersReducedMotion();
  let open = false;

  const openMenu = () => {
    open = true;
    menu.classList.remove('hidden');
    trigger.setAttribute('aria-expanded', 'true');
    if (reduced) return;
    animate(
      menu,
      { opacity: [0, 1], transform: ['translateY(-8px) scale(0.97)', 'translateY(0) scale(1)'] },
      { duration: 0.18, ease: EASE },
    );
  };

  const closeMenu = () => {
    if (!open) return;
    open = false;
    trigger.setAttribute('aria-expanded', 'false');
    if (reduced) {
      menu.classList.add('hidden');
      return;
    }
    animate(menu, { opacity: [1, 0], transform: ['translateY(0)', 'translateY(-8px)'] }, { duration: 0.14, ease: 'easeIn' })
      .finished.then(() => {
        if (!open) menu.classList.add('hidden');
      });
  };

  const onTrigger = (e: MouseEvent) => {
    e.stopPropagation();
    open ? closeMenu() : openMenu();
  };
  const onDocClick = (e: MouseEvent) => {
    if (open && !wrap.contains(e.target as Node)) closeMenu();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeMenu();
  };

  trigger.addEventListener('click', onTrigger);
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onKey);

  return () => {
    document.removeEventListener('click', onDocClick);
    document.removeEventListener('keydown', onKey);
  };
}

/**
 * Animated FAQ accordion built on native <details>. Height + opacity tween on
 * open and close; falls back to the native instant toggle under reduced motion.
 */
export function initFaqAccordion(): void {
  if (prefersReducedMotion()) return;

  document.querySelectorAll<HTMLDetailsElement>('[data-faq]').forEach((details) => {
    const summary = details.querySelector('summary');
    const body = details.querySelector<HTMLElement>('[data-faq-body]');
    if (!summary || !body || summary.dataset.bound) return;
    summary.dataset.bound = 'true';

    summary.addEventListener('click', (event) => {
      event.preventDefault();

      if (details.open) {
        animate(
          body,
          { height: [`${body.scrollHeight}px`, '0px'], opacity: [1, 0] },
          { duration: 0.28, ease: 'easeIn' },
        ).finished.then(() => {
          details.open = false;
          body.style.height = '';
          body.style.opacity = '';
        });
      } else {
        details.open = true;
        const target = body.scrollHeight;
        animate(
          body,
          { height: ['0px', `${target}px`], opacity: [0, 1] },
          { duration: 0.34, ease: EASE },
        ).finished.then(() => {
          body.style.height = '';
        });
      }
    });
  });
}
