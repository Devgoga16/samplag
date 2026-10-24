// Samplag S.A.C. · interacciones comunes a todas las páginas (header, menú, reveal)
import { $, $$, reduceMotion } from './utils';

// Header con sombra al hacer scroll
const header = $('#header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menú móvil
const burger = $<HTMLButtonElement>('#burger');
const nav = $('#nav');
const setMenu = (open: boolean) => {
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  $('use', burger).setAttribute('href', open ? '#i-x' : '#i-menu');
};
burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Enlace activo según la sección visible.
// Se observan todas las secciones para que ninguna quede marcada en bloques fuera del menú.
const links = $$<HTMLAnchorElement>('a[href*="#"]:not(.btn)', nav);
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('is-active', a.hash === `#${en.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach((s) => spy.observe(s));

// Aparición suave de bloques al hacer scroll
const revealTargets = $$('.svc, .sector, .step, .tip, .auth__card, .feats li, .faq details, .sec-head, .rule, .pest, .check, #avian-disuasivo .method, .avian__switch');
const clipTargets = $$('.why__media img, .biz__media img');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  // Escalonado según la posición dentro de su grupo (no según el índice global de la página)
  revealTargets.forEach((el) => {
    const index = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
    el.classList.add('reveal');
    el.style.transitionDelay = `${(index % 4) * 60}ms`;
    // Al terminar se quitan la clase y el retardo, para que el hover recupere su propia transición sin demora
    el.addEventListener('transitionend', function done(e) {
      if (e.target !== el || e.propertyName !== 'opacity') return;
      el.classList.remove('reveal', 'is-in');
      el.style.transitionDelay = '';
      el.removeEventListener('transitionend', done);
    });
    io.observe(el);
  });
  clipTargets.forEach((el) => { el.classList.add('reveal-clip'); io.observe(el); });
}

// Contador "+10 años" del hero
if (!reduceMotion) {
  $$('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const suffix = el.textContent!.replace(/^\+?\d+/, '');
    const duration = 1100;
    const start = performance.now() + 450;
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `+${Math.round(eased * target)}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
