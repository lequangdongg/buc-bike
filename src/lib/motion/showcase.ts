export const initShowcase = (): VoidFunction | undefined => {
  const section = document.querySelector<HTMLElement>('[data-showcase]');
  if (!section) return undefined;

  const hotspots = Array.from(section.querySelectorAll<HTMLElement>('[data-hotspot]'));
  const callouts = Array.from(section.querySelectorAll<HTMLElement>('[data-callout]'));
  if (!callouts.length) return undefined;

  const setActive = (index: number) => {
    hotspots.forEach((el, i) => (el.dataset.active = String(i === index)));
    callouts.forEach((el, i) => {
      el.dataset.active = String(i === index);
      el.setAttribute('aria-pressed', String(i === index));
    });
  };

  const cleanups = [...hotspots, ...callouts].map((el) => {
    const index = Number(el.dataset.hotspot ?? el.dataset.callout);
    const onClick = () => setActive(index);
    el.addEventListener('click', onClick);
    return () => el.removeEventListener('click', onClick);
  });

  setActive(0);
  return () => cleanups.forEach((stop) => stop());
};
