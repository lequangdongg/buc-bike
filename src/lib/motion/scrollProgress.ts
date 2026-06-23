import { scroll } from 'motion';

/** Drive a fixed reading-progress bar from page scroll (0 → 1 scaleX). */
export function initScrollProgress(bar: HTMLElement): void {
  scroll((progress: number) => {
    bar.style.transform = `scaleX(${progress})`;
  });
}
