export type ServiceCategory = 'plagas' | 'agua' | 'limpieza';

export const categories: Record<ServiceCategory, string> = {
  plagas: 'Control de plagas',
  agua: 'Agua y desagüe',
  limpieza: 'Limpieza técnica',
};

export interface Service {
  title: string;
  /** Nombre con el que llega al formulario y a WhatsApp */
  quote: string;
  icon: string;
  category: ServiceCategory;
  description: string;
  /** Enlace a una sección con el detalle del servicio */
  more?: { href: string; label: string };
}

export const services: Service[] = [
  {
    title: 'Desinsectación',
    quote: 'Desinsectación',
    icon: 'spray',
    category: 'plagas',
    description: 'Control integral de insectos rastreros, voladores y arácnidos, mediante metodologías seguras para empresas y hogares, alineado a las normativas sanitarias vigentes.',
    more: { href: '/fumigacion', label: 'Ver servicio' },
  },
  {
    title: 'Programas de desratización',
    quote: 'Desratización',
    icon: 'rat',
    category: 'plagas',
    description: 'Control integral de roedores mediante inspección, estaciones de cebado seguras, monitoreo y estrategias de exclusión para mitigar el riesgo de proliferación.',
    more: { href: '/desratizacion', label: 'Ver servicio' },
  },
  {
    title: 'Desinfección general',
    quote: 'Desinfección general',
    icon: 'sparkles',
    category: 'limpieza',
    description: 'Reducción y control de la carga microbiana (virus, bacterias y hongos) en ambientes y superficies, mediante desinfectantes autorizados para garantizar espacios bioseguros.',
  },
  {
    title: 'Limpieza de cisternas y tanques elevados',
    quote: 'Limpieza de cisternas y tanques elevados',
    icon: 'droplet',
    category: 'agua',
    description: 'Servicio especializado de limpieza y desinfección de cisternas y tanques elevados, asegurando agua apta para el consumo humano según la normativa vigente.',
    more: { href: '/limpieza-de-cisternas', label: 'Ver servicio' },
  },
  {
    title: 'Limpieza de campanas extractoras',
    quote: 'Limpieza de campanas extractoras',
    icon: 'wind',
    category: 'limpieza',
    description: 'Desengrase de campanas, ductos y filtros de cocinas para reducir riesgos de incendio y malos olores.',
  },
  {
    title: 'Trampas de grasa y pozos sépticos',
    quote: 'Limpieza de trampas de grasa y pozos sépticos',
    icon: 'pipe',
    category: 'agua',
    description: 'Limpieza, succión y transporte de residuos para garantizar el correcto funcionamiento de tus sistemas, prevenir colapsos y cumplir estrictamente con la normativa ambiental vigente.',
  },
  {
    title: 'Control aviar',
    quote: 'Control aviar',
    icon: 'bird',
    category: 'plagas',
    description: 'Plan integral contra palomas y otras aves: púas, gel repelente, cometas, cetrería, retiro de nidos y control correctivo.',
    more: { href: '#control-aviar', label: 'Ver métodos' },
  },
];

/** Opciones extra del selector del formulario */
export const extraQuoteOptions = ['Programa de saneamiento para empresa', 'Otro / no estoy seguro'];
