// Samplag S.A.C. · interacciones propias de la landing (formulario, hero, filtros, plagas, control aviar, checklist)
import { site, waLink } from '../data/site';
import { pests, riskLabel } from '../data/pests';
import { $, $$, reduceMotion, EASE_OUT, replay, single } from './utils';
import { trackLead, waWithSource } from './track';

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
  trackLead('form');
  window.open(waWithSource(waLink(buildMessage(formData()))), '_blank', 'noopener');
});

form.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  if (target.classList.contains('is-invalid') && target.value.trim()) target.classList.remove('is-invalid');
  // Mantiene el mailto de respaldo con los datos que ya escribió el usuario
  const body = buildMessage(formData()).replace(/\*/g, '');
  mail.href = `mailto:${site.email}?subject=${encodeURIComponent('Solicitud de cotización')}&body=${encodeURIComponent(body)}`;
});

// Tarjeta "¿Qué necesitas hoy?" del hero
const quick = { service: 'Desinsectación', client: 'empresa' };
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

// Control aviar: pestañas Métodos disuasivos / Control correctivo
const avianSwitch = $('.avian__switch');
single($$('[data-avian]'), (b) => {
  const id = b.dataset.avian!;
  avianSwitch.dataset.active = id;
  $$('.avian__panel').forEach((p) => {
    const on = p.id === `avian-${id}`;
    p.hidden = !on;
    if (on) replay(p, 'is-entering');
  });
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
