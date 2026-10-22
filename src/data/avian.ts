// Control aviar: métodos que ofrece Samplag (texto proporcionado por el cliente)
export interface AvianMethod {
  title: string;
  /** Tipo de barrera o enfoque */
  kind: string;
  icon: string;
  purpose: string;
  how?: string;
}

export const avianIntro =
  'Protegemos tus instalaciones, infraestructura y procesos productivos frente a los riesgos sanitarios y daños causados por plagas de aves. Implementamos un plan de control integral adaptado a cada tipo de estructura e intensidad del problema.';

export const deterrent = {
  title: 'Métodos disuasivos',
  subtitle: 'Soluciones de prevención para evitar el posamiento, descanso y anidación',
  text: 'Los métodos disuasivos son sistemas de barrera física, visual y sensorial diseñados para prevenir y alterar el comportamiento de las aves sin causarles daño. Se utilizan para evitar que las aves adopten tus instalaciones como su zona habitual de reposo.',
  methods: [
    {
      title: 'Aves rapaces / cetrería controlada',
      kind: 'Biocontrol disuasivo',
      icon: 'raptor',
      purpose: 'Protege grandes extensiones (plantas industriales, almacenes, zonas agrícolas o aeropuertos) generando un entorno de amenaza natural constante.',
    },
    {
      title: 'Púas de acero inoxidable',
      kind: 'Barrera física',
      icon: 'spikes',
      purpose: 'Evita de forma definitiva que las aves encuentren una superficie estable donde posarse.',
      how: 'Se instalan en cornisas, vigas, bordes de techos y letreros. Al no tener dónde apoyar las patas de forma segura, el ave se ve obligada a retirarse a otro lugar.',
    },
    {
      title: 'Gel repelente',
      kind: 'Barrera táctil y sensorial',
      icon: 'gel',
      purpose: 'Disuade el contacto en superficies o zonas donde no es factible o estético colocar estructuras rígidas.',
      how: 'Se aplica un gel no tóxico que genera una sensación pegajosa e incómoda en las patas del ave, rompiendo su hábito de regresar a ese punto.',
    },
    {
      title: 'Cometas disuasivas',
      kind: 'Barrera visual',
      icon: 'kite',
      purpose: 'Protege áreas abiertas y de gran extensión (patios de maniobras, almacenes, zonas agrícolas).',
      how: 'Aprovecha las corrientes de aire para simular el vuelo constante de aves rapaces (depredadores), manteniendo a las aves en estado de alerta e impidiendo que desciendan al área.',
    },
    {
      title: 'Retiro sanitario de nidos',
      kind: 'Limpieza y prevención',
      icon: 'nest',
      purpose: 'Corta el ciclo de arraigo y reproducción de la colonia en el lugar.',
      how: 'Remoción y limpieza profunda de los puntos fijados de anidación para eliminar el sentido de pertenencia de las aves en la estructura.',
    },
  ] satisfies AvianMethod[],
};

export const corrective = {
  title: 'Control correctivo',
  subtitle: 'Intervención directa para la reducción de poblaciones elevadas',
  text: 'El control correctivo se aplica cuando los métodos disuasivos pasivos no son suficientes debido a una alta densidad poblacional o cuando el nivel de infestación representa un riesgo sanitario inminente.',
  method: {
    title: 'Caza sanitaria / control poblacional regulado',
    kind: 'Control poblacional',
    icon: 'crosshair',
    purpose: 'Reduce de forma rápida y efectiva el volumen de ejemplares en áreas críticas donde la presencia masiva de aves desborda los métodos de disuasión.',
    how: 'Ejecución de jornadas de control mediante carabinas de aire comprimido a cargo de personal calificado. Se realiza bajo estrictos protocolos de seguridad, en horarios estratégicos y en estricto cumplimiento de la normativa legal, con las autorizaciones correspondientes de la autoridad competente (SERFOR).',
  } satisfies AvianMethod,
  guarantees: ['Personal calificado', 'Protocolos de seguridad', 'Horarios estratégicos', 'Autorización de SERFOR'],
};
