# Samplag S.A.C.: estrategia SEO y gancho para Google

Fecha: 21/10/2026

## 1. El gancho (hook)

**Idea central: "Saneamiento con respaldo MINSA".**

En este rubro, la gente que busca en Google no quiere "una fumigación". Quiere **cumplir** con una inspección, con la municipalidad o con la administración del edificio, y no arriesgarse con un fumigador informal. Samplag tiene algo verificable que muchos competidores no muestran: la **R.A. N° 305-2020-DSAIA-DIRIS-LS**. El gancho convierte ese dato en el motivo para elegirlos.

| Dónde | Texto |
|---|---|
| Title (Google) | `Fumigación y Limpieza de Cisternas en Lima · Autorizada por MINSA \| Samplag` |
| Meta description | `Empresa de saneamiento ambiental autorizada por el Ministerio de Salud (R.A. 305-2020-DSAIA-DIRIS-LS). Fumigación, desratización, cisternas, campanas y trampas de grasa. Cotiza gratis por WhatsApp.` |
| H1 del hero | "Fumigación y saneamiento ambiental en Lima, con autorización del MINSA" |
| Frase de marca | "Saneamiento con respaldo MINSA" |
| Gancho de contenido | "¿Tu empresa cumple con el D.S. 022-2001-SA?", con checklist sanitario por sector |

**Por qué funciona**
1. **Intención comercial alta**: quien busca "empresa de fumigación autorizada" o "limpieza de cisterna para inspección" ya está por contratar.
2. **Diferencial verificable**: no promete nada que no se pueda comprobar.
3. **Contenido normativo**: la sección "Lo que exige la norma" atrae búsquedas informativas ("D.S. 022-2001-SA", "cada cuánto limpiar la cisterna") y lleva a esas visitas hacia la cotización.

> ⚠️ **No usar** "certificado de fumigación para licencia de funcionamiento" mientras Samplag no confirme que emite certificado. Además, el requisito depende del TUPA de cada municipalidad y no encontré una norma que lo exija de forma general.

## 2. Palabras clave objetivo

Las agrupo por intención. Antes de lanzar, los volúmenes hay que validarlos en Google Keyword Planner o en Search Console.

**Principales (home)**
- fumigación en Lima · empresa de fumigación en Lima
- saneamiento ambiental Lima · empresa de saneamiento ambiental autorizada
- control de plagas Lima

**Por servicio (futuras páginas de Fase 2)**
- limpieza de cisternas y tanques elevados Lima · desinfección de reservorios de agua
- desratización Lima · control de roedores para empresas
- limpieza de campanas extractoras · limpieza de trampas de grasa para restaurantes
- limpieza industrial Lima · control de palomas (control aviar)

**Long tail informativo (FAQ y blog)**
- cada cuánto se debe limpiar la cisterna
- qué dice el D.S. 022-2001-SA
- cómo saber si una empresa de fumigación está autorizada
- cuánto tiempo esperar después de una fumigación

**Local (cuando se confirme la dirección)**
- fumigación en Surco / Miraflores / San Isidro / La Molina, según los distritos que confirme el cliente

## 3. Qué ya quedó implementado en la landing
- `title`, `meta description`, `canonical`, `hreflang es-PE` y Open Graph y Twitter con URL absoluta.
- Un solo H1 con la palabra clave y la ciudad. Los H2 y H3 usan los términos de búsqueda ("limpieza de cisternas", "desratización").
- Schema `LocalBusiness` con `hasOfferCatalog` (8 servicios) y `hasCredential` (R.A. de MINSA).
- Schema `FAQPage` con las preguntas visibles en la página. Puede generar resultados enriquecidos.
- La sección "Lo que exige la norma", que es el gancho de contenido.
- Un selector "¿Qué plaga tienes?" con texto rico en palabras clave (cucarachas, roedores, palomas, etc.).
- `robots.txt` y sitemap automático (`/sitemap-index.xml`, generado por @astrojs/sitemap).
- Imágenes con `alt` descriptivo, `loading="lazy"`, `width` y `height` para evitar saltos de diseño.

## 4. Acciones fuera de la web (lo que más mueve el SEO local)
1. **Recuperar el dominio samplag.com.pe**: hoy responde 403. Es lo primero y lo más urgente.
2. **Perfil de Empresa en Google (Google Business Profile)**:
   - Crearlo o reclamarlo con la categoría "Servicio de control de plagas" y, como secundaria, "Servicio de limpieza".
   - Usar la misma dirección y teléfono que la web (NAP consistente).
   - Subir fotos reales del equipo y de los trabajos.
3. **Reseñas**: hoy tienen 0. Después de cada servicio se puede enviar por WhatsApp el enlace para dejar una reseña en Google. La meta es 20 reseñas en los primeros 3 meses.
4. **Datos consistentes**: unificar dirección, correo y teléfonos entre Facebook, Google y la web.
5. **Directorios**: Páginas Amarillas Perú, directorios de proveedores para condominios y gremios de restaurantes.
6. **Google Search Console**: verificar el dominio y enviar `https://samplag.com.pe/sitemap-index.xml`.

## 5. Fase 2 (contenido que posiciona)
- Una página por servicio (`/limpieza-de-cisternas-lima`, `/fumigacion-lima`, etc.) con 600 a 900 palabras, FAQ propia y CTA.
- Un blog de prevención con un artículo al mes. Por ejemplo: "Checklist sanitario para restaurantes", "Señales de roedores en tu almacén" y "Cada cuánto limpiar la cisterna de tu edificio".
- Una landing por campaña de temporada, como verano y dengue o el inicio del año escolar, cuando el cliente las defina.

## 6. Por confirmar antes de publicar
- El texto exacto de la frecuencia de limpieza de reservorios. La fuente que encontré es secundaria y habla de "cada seis meses", así que en la web se presenta como recomendación.
- Si emiten certificado o constancia de servicio. Si la emiten, se agrega un segundo gancho: "Certificado de saneamiento ambiental".
- La dirección vigente, que se necesita para Google Business Profile y para el schema.
