// Páginas de aterrizaje por servicio (Google Ads y SEO).
// Cada una repite la búsqueda de la persona en el título y lleva directo a WhatsApp, llamada o formulario.
import type { ImageMetadata } from 'astro';
import { faqs, type Faq } from './faqs';
import hero from '../assets/img/hero.jpg';
import tecnico from '../assets/img/tecnico.jpg';

export interface Campaign {
  slug: string;
  /** Servicio con el que llega el pedido a WhatsApp (coincide con services.ts) */
  service: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  h1Highlight: string;
  lead: string;
  waText: string;
  image: ImageMetadata;
  imageAlt: string;
  /** Señales de que la persona necesita el servicio */
  signs: string[];
  includes: { icon: string; title: string; text: string }[];
  ideal: string[];
  faqs: Faq[];
}

// Reutiliza las respuestas ya aprobadas de la página principal
const faq = (start: string) => faqs.find((f) => f.q.startsWith(start))!;

const certificado = faq('¿Entregan certificado');
const autorizada = faq('¿Cómo sé si una empresa');
const desocupar = faq('¿Tengo que desocupar');

export const campaigns: Campaign[] = [
  {
    slug: 'fumigacion',
    service: 'Desinsectación',
    icon: 'spray',
    metaTitle: 'Fumigación en Lima con Certificado · Empresa Autorizada MINSA | Samplag',
    metaDescription: 'Fumigación contra cucarachas, hormigas, moscas y otros insectos en Lima, para empresas y hogares. Certificado en cada servicio y autorización del MINSA. Cotiza gratis por WhatsApp.',
    h1: 'Fumigación en Lima para empresas y hogares,',
    h1Highlight: 'con certificado y autorización del MINSA',
    lead: 'Controlamos cucarachas, hormigas, moscas, polillas y otros insectos con métodos seguros para las personas. Al terminar recibes el certificado del servicio, emitido por una empresa autorizada.',
    waText: 'Hola Samplag, quisiera una cotización de fumigación (desinsectación).',
    image: hero,
    imageAlt: 'Técnico con traje de protección aplicando un tratamiento de fumigación',
    signs: [
      'Ves cucarachas de noche en la cocina, baños o almacén',
      'Hay hormigas, moscas o polillas que vuelven una y otra vez',
      'Te piden el certificado de fumigación para una inspección o la administración del edificio',
      'Tu negocio maneja alimentos y necesitas mantenerlo libre de plagas',
    ],
    includes: [
      { icon: 'search', title: 'Inspección del local', text: 'Identificamos la plaga, los focos y los puntos por donde ingresa.' },
      { icon: 'spray', title: 'Tratamiento según la plaga', text: 'Aplicamos productos autorizados con el método adecuado para cada ambiente.' },
      { icon: 'user-shield', title: 'Personal con EPP', text: 'Técnicos capacitados que trabajan con equipo de protección y procedimientos seguros.' },
      { icon: 'file', title: 'Certificado y recomendaciones', text: 'Te entregamos el certificado del servicio y los cuidados para mantener el resultado.' },
    ],
    ideal: ['Restaurantes y cocinas', 'Edificios y condominios', 'Oficinas', 'Colegios', 'Industrias y almacenes', 'Hogares'],
    faqs: [certificado, desocupar, faq('¿Cada cuánto debo fumigar'), faq('¿Atienden hogares'), autorizada],
  },
  {
    slug: 'desratizacion',
    service: 'Desratización',
    icon: 'rat',
    metaTitle: 'Desratización en Lima · Control de Ratas y Ratones con Certificado | Samplag',
    metaDescription: 'Desratización en Lima para empresas y hogares: inspección, estaciones de cebado seguras, monitoreo y exclusión. Empresa autorizada por el MINSA, con certificado. Cotiza por WhatsApp.',
    h1: 'Desratización en Lima:',
    h1Highlight: 'control de ratas y ratones con respaldo MINSA',
    lead: 'Un programa de control de roedores con inspección, estaciones de cebado seguras, monitoreo y estrategias de exclusión para que no vuelvan. Con certificado en cada servicio.',
    waText: 'Hola Samplag, quisiera una cotización de desratización.',
    image: hero,
    imageAlt: 'Técnico con traje de protección realizando un servicio de control de plagas',
    signs: [
      'Excrementos alargados cerca de paredes o en el almacén',
      'Bolsas, cajas o cables roídos',
      'Ruidos en techos o falsos cielos rasos',
      'Necesitas el certificado de desratización para una inspección',
    ],
    includes: [
      { icon: 'search', title: 'Inspección', text: 'Ubicamos rastros, madrigueras y los puntos por donde ingresan los roedores.' },
      { icon: 'shield', title: 'Estaciones de cebado seguras', text: 'Instaladas en puntos estratégicos para reducir el riesgo para personas y mascotas.' },
      { icon: 'calendar', title: 'Monitoreo', text: 'Revisamos la actividad para ajustar el control según tu local.' },
      { icon: 'file', title: 'Exclusión y certificado', text: 'Te indicamos cómo cerrar los accesos y te entregamos el certificado del servicio.' },
    ],
    ideal: ['Restaurantes y cocinas', 'Industrias y almacenes', 'Edificios y condominios', 'Mercados y comercios', 'Colegios', 'Hogares'],
    faqs: [
      certificado,
      {
        q: '¿La desratización es de una sola visita?',
        a: 'El control de roedores funciona mejor como programa. Después de la inspección te proponemos la frecuencia de visitas y monitoreo según el tipo de local y el nivel de actividad.',
      },
      desocupar,
      autorizada,
    ],
  },
  {
    slug: 'limpieza-de-cisternas',
    service: 'Limpieza de cisternas y tanques elevados',
    icon: 'droplet',
    metaTitle: 'Limpieza de Cisternas y Tanques Elevados en Lima · Con Certificado | Samplag',
    metaDescription: 'Limpieza y desinfección de cisternas y tanques elevados en Lima para edificios, empresas y hogares. Empresa autorizada por el MINSA, con certificado del servicio. Cotiza por WhatsApp.',
    h1: 'Limpieza y desinfección de cisternas y tanques elevados en Lima,',
    h1Highlight: 'con certificado',
    lead: 'Limpiamos y desinfectamos tus reservorios de agua para que sea apta para el consumo humano según la normativa vigente. Lo hace una empresa autorizada por el MINSA y recibes el certificado del servicio.',
    waText: 'Hola Samplag, quisiera una cotización de limpieza de cisterna / tanque elevado.',
    image: tecnico,
    imageAlt: 'Técnico con traje de protección, lentes y respirador',
    signs: [
      'Pasaron más de seis meses desde la última limpieza',
      'Notas sedimentos, mal olor o cambios en el color del agua',
      'La administración del edificio o una inspección te pide el certificado',
      'Vas a ocupar un local o vivienda y no sabes cuándo se limpió',
    ],
    includes: [
      { icon: 'search', title: 'Inspección del reservorio', text: 'Revisamos el estado de la cisterna o el tanque antes de empezar.' },
      { icon: 'droplet', title: 'Limpieza', text: 'Retiramos sedimentos y suciedad de paredes y fondo.' },
      { icon: 'sparkles', title: 'Desinfección', text: 'Aplicamos desinfectantes autorizados para dejar el agua apta para el consumo.' },
      { icon: 'file', title: 'Certificado', text: 'Te entregamos el certificado del servicio realizado.' },
    ],
    ideal: ['Edificios y condominios', 'Restaurantes', 'Colegios', 'Oficinas', 'Industrias', 'Hogares'],
    faqs: [faq('¿Cada cuánto se debe limpiar'), certificado, autorizada, faq('¿Atienden fuera de Lima')],
  },
];
