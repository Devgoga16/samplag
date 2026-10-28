// Medición de contactos para Google Ads y Analytics 4.
// Si no hay IDs configurados en site.ts, gtag no existe y todo esto queda en silencio.
import { tracking } from '../data/site';

type Lead = 'whatsapp' | 'call' | 'form' | 'email';

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

const SRC_KEY = 'samplag-src';

// Origen de la visita: se guarda al llegar desde un anuncio para mencionarlo en el mensaje de WhatsApp
const params = new URLSearchParams(location.search);
const fromAds = ['gclid', 'gbraid', 'wbraid'].some((k) => params.has(k)) || params.get('utm_source')?.toLowerCase() === 'google';
try {
  if (fromAds) sessionStorage.setItem(SRC_KEY, params.get('utm_campaign') || location.pathname);
} catch {}

const source = () => {
  try { return sessionStorage.getItem(SRC_KEY); } catch { return null; }
};

/** Agrega "Vengo de Google" al mensaje prellenado cuando la visita llegó por un anuncio */
export const waWithSource = (url: string) => {
  const src = source();
  if (!src) return url;
  const [base, query = ''] = url.split('?');
  const text = new URLSearchParams(query).get('text') ?? 'Hola Samplag, quisiera una cotización.';
  if (text.includes('(Vengo de Google')) return url;
  // encodeURIComponent (espacios como %20): URLSearchParams usaría "+", que WhatsApp puede mostrar tal cual
  return `${base}?text=${encodeURIComponent(`${text}\n\n(Vengo de Google · ${src})`)}`;
};

/** Registra un contacto como evento de Analytics y como conversión de Google Ads */
export const trackLead = (kind: Lead) => {
  if (!window.gtag) return;
  window.gtag('event', 'generate_lead', { method: kind, page_path: location.pathname });
  const sendTo = tracking.conversions[kind];
  if (sendTo) window.gtag('event', 'conversion', { send_to: sendTo });
};

// Clics en cualquier enlace de WhatsApp, teléfono o correo de la página
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href]');
  if (!a) return;
  if (a.href.startsWith('https://wa.me/')) {
    a.href = waWithSource(a.href);
    trackLead('whatsapp');
  } else if (a.protocol === 'tel:') trackLead('call');
  else if (a.protocol === 'mailto:') trackLead('email');
});
