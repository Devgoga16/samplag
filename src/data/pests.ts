export interface Pest {
  id: string;
  label: string;
  icon: string;
  tag: string;
  title: string;
  /** Servicio recomendado (coincide con el selector del formulario) */
  svc: string;
  /** 1 bajo · 2 medio · 3 alto */
  risk: 1 | 2 | 3;
  desc: string;
  signs: string[];
}

export const pests: Pest[] = [
  {
    id: 'cucarachas', label: 'Cucarachas', icon: 'bug',
    tag: 'Insectos rastreros', title: 'Control de cucarachas', svc: 'Fumigación integral', risk: 3,
    desc: 'Se esconden en cocinas, desagües y grietas, y salen de noche. Contaminan alimentos y superficies, y se reproducen muy rápido.',
    signs: ['Las ves de noche al prender la luz', 'Excrementos como granitos negros en cajones', 'Olor desagradable en zonas cerradas'],
  },
  {
    id: 'roedores', label: 'Ratas y ratones', icon: 'rat',
    tag: 'Roedores', title: 'Control de ratas y ratones', svc: 'Desratización', risk: 3,
    desc: 'Dañan mercadería, cables e instalaciones, y contaminan alimentos y superficies. Un programa de desratización con monitoreo evita que vuelvan.',
    signs: ['Excrementos alargados cerca de paredes', 'Bolsas, cajas o cables roídos', 'Ruidos en techos o falsos cielos rasos'],
  },
  {
    id: 'voladores', label: 'Moscas y zancudos', icon: 'fly',
    tag: 'Insectos voladores', title: 'Control de moscas y zancudos', svc: 'Fumigación integral', risk: 2,
    desc: 'Se concentran cerca de residuos, aguas estancadas y zonas de alimentos. Son molestos para clientes y trabajadores y pueden transmitir enfermedades.',
    signs: ['Presencia constante cerca de basura o alimentos', 'Agua acumulada en recipientes o canaletas', 'Larvas en sumideros o desagües'],
  },
  {
    id: 'polillas', label: 'Polillas', icon: 'moth',
    tag: 'Insectos de almacén', title: 'Control de polillas', svc: 'Fumigación integral', risk: 1,
    desc: 'Atacan telas, alfombras, papeles y alimentos secos almacenados. El daño suele notarse cuando la infestación ya avanzó.',
    signs: ['Agujeros en ropa, cortinas o alfombras', 'Pequeños gusanos o capullos en esquinas', 'Polillas en despensas y almacenes'],
  },
  {
    id: 'palomas', label: 'Palomas', icon: 'bird',
    tag: 'Aves', title: 'Control de palomas', svc: 'Control aviar', risk: 2,
    desc: 'Sus excrementos ensucian y deterioran techos, fachadas y equipos, y pueden afectar la higiene de tu local. El control aviar evita que se posen y aniden.',
    signs: ['Excrementos en cornisas, techos o ventanas', 'Nidos en canaletas o aires acondicionados', 'Aves posadas de forma permanente'],
  },
];

export const riskLabel = ['', 'Riesgo bajo', 'Riesgo medio', 'Riesgo alto'] as const;
