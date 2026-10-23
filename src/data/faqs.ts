// Preguntas frecuentes: se muestran en la página y alimentan el schema FAQPage
import { site } from './site';

export const faqs: { q: string; a: string }[] = [
  {
    q: '¿Cómo solicito una cotización?',
    a: 'Completa el formulario de esta página o escríbenos por WhatsApp al 994 694 597 indicando el servicio, el distrito y el tipo de local. Te respondemos con una propuesta a medida.',
  },
  {
    q: '¿Entregan certificado de fumigación o de saneamiento ambiental?',
    a: `Sí. Al finalizar cada servicio te entregamos el certificado del servicio realizado, emitido por una empresa autorizada por el Ministerio de Salud (${site.authorization}). Te sirve como respaldo ante inspecciones sanitarias, municipales o la administración de tu edificio.`,
  },
  {
    q: '¿Atienden hogares o solo empresas?',
    a: 'Atendemos ambos: empresas, negocios, edificios y también viviendas.',
  },
  {
    q: '¿Cada cuánto debo fumigar o desinfectar?',
    a: 'Depende del tipo de local, la actividad y el nivel de riesgo. Después de evaluar tus instalaciones te recomendamos la frecuencia adecuada.',
  },
  {
    q: '¿Cada cuánto se debe limpiar la cisterna y el tanque elevado?',
    a: 'Como referencia, se recomienda limpiar y desinfectar los reservorios de agua al menos cada seis meses, o antes si notas sedimentos, mal olor o cambios en el color del agua. La limpieza debe hacerla una empresa autorizada.',
  },
  {
    q: '¿Cómo sé si una empresa de fumigación está autorizada?',
    a: `Pide el número de su resolución de autorización emitida por la autoridad de salud (DIRIS, DIRESA o GERESA, según la zona). Samplag cuenta con la ${site.authorization}.`,
  },
  {
    q: '¿Tengo que desocupar el local durante el servicio?',
    a: 'Depende del servicio y del producto aplicado. Antes de la visita te indicamos las precauciones y el tiempo recomendado antes de volver a usar el ambiente.',
  },
  {
    q: '¿Atienden fuera de Lima?',
    a: 'Coordinamos servicios a nivel nacional. Escríbenos con tu ubicación para revisar la disponibilidad.',
  },
];
