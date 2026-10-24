// Utilidades compartidas por los scripts de la web
export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const EASE_OUT = 'cubic-bezier(.23, 1, .32, 1)';

/** Reinicia una animación CSS de clase (p. ej. la sacudida o el cambio de plaga) */
export const replay = (el: Element, cls: string) => {
  el.classList.remove(cls);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(cls);
};

/** Grupos de botones con selección única (chips, segmentos, filtros, pestañas) */
export const single = (buttons: HTMLElement[], onPick: (b: HTMLElement) => void) => buttons.forEach((b) => b.addEventListener('click', () => {
  buttons.forEach((x) => {
    x.classList.toggle('is-active', x === b);
    x.setAttribute(x.getAttribute('role') === 'tab' ? 'aria-selected' : 'aria-checked', String(x === b));
  });
  onPick(b);
}));
