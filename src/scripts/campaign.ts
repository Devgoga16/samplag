// Samplag S.A.C. · formulario corto de las páginas de campaña → WhatsApp
import { waLink } from '../data/site';
import { $, $$, replay } from './utils';
import { trackLead, waWithSource } from './track';

const form = $<HTMLFormElement>('#cotizar');
const error = $('[data-error]', form);
const fields = $$<HTMLInputElement | HTMLSelectElement>('[required]', form);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let ok = true;
  fields.forEach((el) => {
    const bad = !el.value.trim();
    if (bad) replay(el, 'is-invalid'); else el.classList.remove('is-invalid');
    if (bad && ok) { el.focus(); ok = false; }
  });
  error.hidden = ok;
  if (!ok) return;

  const d = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, String(v).trim()]));
  const text = `Hola Samplag, quisiera una cotización de ${form.dataset.service!.toLowerCase()}.\n\n` + [
    `*Nombre:* ${d.nombre}`,
    `*Teléfono:* ${d.telefono}`,
    `*Distrito:* ${d.distrito}`,
    `*Es para:* ${d.tipo}`,
  ].join('\n');
  trackLead('form');
  window.open(waWithSource(waLink(text)), '_blank', 'noopener');
});

form.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  if (target.classList.contains('is-invalid') && target.value.trim()) target.classList.remove('is-invalid');
});
