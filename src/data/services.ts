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
}

export const services: Service[] = [
  {
    title: 'Fumigación integral',
    quote: 'Fumigación integral',
    icon: 'spray',
    category: 'plagas',
    description: 'Control de cucarachas, insectos rastreros y voladores, polillas y otras plagas en interiores y exteriores.',
  },
  {
    title: 'Programas de desratización',
    quote: 'Desratización',
    icon: 'rat',
    category: 'plagas',
    description: 'Control de roedores con monitoreo, colocación de cebaderos y seguimiento para evitar reinfestaciones.',
  },
  {
    title: 'Desinfección general',
    quote: 'Desinfección general',
    icon: 'sparkles',
    category: 'limpieza',
    description: 'Eliminación de virus, bacterias y hongos en ambientes, superficies y áreas de alto tránsito.',
  },
  {
    title: 'Limpieza de cisternas y tanques elevados',
    quote: 'Limpieza de cisternas y tanques elevados',
    icon: 'droplet',
    category: 'agua',
    description: 'Limpieza y desinfección de reservorios de agua para mantener el agua de consumo en condiciones seguras.',
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
    description: 'Limpieza y extracción de residuos para evitar atoros, olores y contaminación en desagües.',
  },
  {
    title: 'Limpieza industrial',
    quote: 'Limpieza industrial',
    icon: 'factory',
    category: 'limpieza',
    description: 'Limpieza profunda de plantas, almacenes y áreas operativas, adaptada al ritmo de tu operación.',
  },
  {
    title: 'Control aviar',
    quote: 'Control aviar',
    icon: 'bird',
    category: 'plagas',
    description: 'Medidas para evitar que las aves aniden o se posen en techos, fachadas y estructuras de tu local.',
  },
];

/** Opciones extra del selector del formulario */
export const extraQuoteOptions = ['Programa de saneamiento para empresa', 'Otro / no estoy seguro'];
