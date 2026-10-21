// Samplag S.A.C. · interacciones de la landing
import { site, waLink } from '../data/site';
import { pests, riskLabel } from '../data/pests';

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE_OUT = 'cubic-bezier(.23, 1, .32, 1)';

/** Reinicia una animación CSS de clase (p. ej. la sacudida o el cambio de plaga) */
const replay = (el: Element, cls: string) => {
  el.classList.remove(cls);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(cls);
};

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
const links = $$<HTMLAnchorElement>('a[href^="#"]:not(.btn)', nav);
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${en.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach((s) => spy.observe(s));

// Botones "Cotizar este servicio": preseleccionan el servicio y llevan al formulario
const select = $<HTMLSelectElement>('#servicio');
document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest<HTMLElement>('[data-service]');
  if (!btn) return;
  select.value = btn.dataset.service!;
  $('#contacto').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => $<HTMLInputElement>('#qform [name="nombre"]').focus({ preventScroll: true }), 600);
});

// Formulario de cotización → WhatsApp con mensaje armado
const form = $<HTMLFormElement>('#qform');
const error = $('#qerror');
const mail = $<HTMLAnchorElement>('#qmail');
const formData = () => Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, String(v).trim()])) as Record<string, string>;

const buildMessage = (d: Record<string, string>) => 'Hola Samplag, quisiera solicitar una cotización.\n\n' + [
  `*Nombre:* ${d.nombre}`,
  d.empresa && `*Empresa:* ${d.empresa}`,
  `*Teléfono:* ${d.telefono}`,
  `*Distrito:* ${d.distrito}`,
  `*Servicio:* ${d.servicio}`,
  d.mensaje && `*Detalle:* ${d.mensaje}`,
].filter(Boolean).join('\n');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;
  $$<HTMLInputElement>('[required]', form).forEach((el) => {
    const bad = !el.value.trim();
    if (bad) replay(el, 'is-invalid'); else el.classList.remove('is-invalid');
    if (bad && ok) { el.focus(); ok = false; }
  });
  error.hidden = ok;
  if (!ok) return;
  window.open(waLink(buildMessage(formData())), '_blank', 'noopener');
});

form.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  if (target.classList.contains('is-invalid') && target.value.trim()) target.classList.remove('is-invalid');
  // Mantiene el mailto de respaldo con los datos que ya escribió el usuario
  const body = buildMessage(formData()).replace(/\*/g, '');
  mail.href = `mailto:${site.email}?subject=${encodeURIComponent('Solicitud de cotización')}&body=${encodeURIComponent(body)}`;
});

// Grupos de botones con selección única (chips, segmentos, filtros, pestañas)
const single = (buttons: HTMLElement[], onPick: (b: HTMLElement) => void) => buttons.forEach((b) => b.addEventListener('click', () => {
  buttons.forEach((x) => {
    x.classList.toggle('is-active', x === b);
    x.setAttribute(x.getAttribute('role') === 'tab' ? 'aria-selected' : 'aria-checked', String(x === b));
  });
  onPick(b);
}));

// Tarjeta "¿Qué necesitas hoy?" del hero
const quick = { service: 'Fumigación integral', client: 'empresa' };
const quickGo = $<HTMLAnchorElement>('#quick-go');
const updateQuick = () => {
  const who = quick.client === 'empresa' ? 'para mi empresa' : 'para mi hogar';
  quickGo.href = waLink(`Hola Samplag, quisiera una cotización de ${quick.service.toLowerCase()} ${who}.`);
};
single($$('[data-quick]'), (b) => { quick.service = b.dataset.quick!; updateQuick(); });
const quickType = $('.quick__type');
single($$('[data-client]'), (b) => {
  quick.client = b.dataset.client!;
  quickType.dataset.active = quick.client;
  updateQuick();
});
updateQuick();

// Filtro de servicios por categoría
const cards = $$('#services-grid .svc');
// Las que salen desaparecen al instante; las que quedan entran en cascada (WAAPI: interrumpible y fuera del hilo principal)
single($$('[data-filter]'), (b) => {
  const f = b.dataset.filter;
  let i = 0;
  cards.forEach((c) => {
    const show = f === 'all' || c.dataset.cat === f;
    c.classList.toggle('is-hidden', !show);
    if (!show) return;
    c.classList.add('is-in');
    c.getAnimations().forEach((a) => a.cancel());
    c.animate(
      reduceMotion
        ? [{ opacity: 0 }, { opacity: 1 }]
        : [{ opacity: 0, transform: 'translateY(10px) scale(.98)' }, { opacity: 1, transform: 'none' }],
      { duration: 320, delay: i++ * 40, easing: EASE_OUT, fill: 'backwards' },
    );
  });
});

// Selector "¿Qué plaga tienes?"
const panel = $('#pest-panel');
const pestMain = $('.pest__main', panel);
const field = (k: string) => $(`[data-f="${k}"]`, panel);
const pestCta = $('#pest-cta');
single($$('[data-pest]'), (b) => {
  const p = pests.find((x) => x.id === b.dataset.pest);
  if (!p) return;
  field('tag').textContent = p.tag;
  field('title').textContent = p.title;
  field('desc').textContent = p.desc;
  field('signs').replaceChildren(...p.signs.map((s) => Object.assign(document.createElement('li'), { textContent: s })));
  field('svc').textContent = p.svc;
  field('risk').dataset.level = String(p.risk);
  field('risk').setAttribute('aria-label', riskLabel[p.risk]);
  pestCta.dataset.service = p.svc;
  replay(pestMain, 'is-swapping');
  replay(field('svc'), 'is-swapping');
});

// Checklist sanitario
const check = $<HTMLFormElement>('#check');
const boxes = $$<HTMLInputElement>('input[type="checkbox"]', check);
const bar = $('#check-bar');
const msg = $('#check-msg');
const checkGo = $<HTMLAnchorElement>('#check-go');
const updateCheck = () => {
  const done = boxes.filter((b) => b.checked).length;
  const pending = boxes.filter((b) => !b.checked).map((b) => b.value);
  bar.style.transform = `scaleX(${done / boxes.length})`;
  bar.classList.toggle('is-ok', done === boxes.length);
  msg.innerHTML = done === boxes.length
    ? '<b>¡Todo al día!</b> Programa tu próximo mantenimiento con nosotros.'
    : `<b>${done} de ${boxes.length}</b> puntos al día. Te ayudamos con lo pendiente.`;
  checkGo.href = waLink(pending.length
    ? `Hola Samplag, revisé el checklist sanitario y necesito cotizar: ${pending.join(', ')}.`
    : 'Hola Samplag, quisiera programar el mantenimiento periódico de mi local.');
};
check.addEventListener('change', updateCheck);
check.addEventListener('submit', (e) => e.preventDefault());
updateCheck();

// Aparición suave de bloques al hacer scroll
const revealTargets = $$('.svc, .sector, .step, .tip, .auth__card, .feats li, .faq details, .sec-head, .rule, .pest, .check');
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
