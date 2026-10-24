# Samplag S.A.C. · Landing (Astro)

Landing de Samplag S.A.C., empresa de saneamiento ambiental y control de plagas. Está hecha con [Astro](https://astro.build) y genera un sitio estático listo para Vercel.

## Comandos

| Comando           | Qué hace                                          |
|-------------------|---------------------------------------------------|
| `npm install`     | Instala dependencias (requiere Node 22.23.4 o superior) |
| `npm run dev`     | Servidor local en `http://localhost:4321`         |
| `npm run build`   | Genera el sitio en `dist/`                        |
| `npm run preview` | Sirve `dist/` para revisar el build final          |

## Estructura

```
src/
  data/          ← contenido editable: contacto, servicios, plagas, FAQ
    site.ts      ← teléfonos, correo, R.A., dirección/horario/RUC (null = por confirmar)
    services.ts
    pests.ts
    faqs.ts      ← también genera el schema FAQPage
  components/    ← una sección por archivo (Hero, Services, Normativa, Contact…)
  layouts/       ← <head>, SEO, Open Graph y datos estructurados
  scripts/       ← interacciones (menú, filtros, plagas, checklist, WhatsApp)
  styles/        ← global.css
  assets/img/    ← fotos (Astro las optimiza a WebP)
public/          ← logos, favicon, og-image.jpg y robots.txt
legacy-static/   ← versión HTML anterior (solo de referencia; se puede borrar)
```

### Completar datos pendientes
En `src/data/site.ts`, reemplaza `null` por el dato real y la etiqueta amarilla "por confirmar" desaparece sola:
- `address`: dirección de la oficina
- `schedule`: horario de atención
- `ruc`: RUC

## Tienda en línea (uTracker)

- Página `/tienda`, más una muestra de productos en la landing (sección "Tienda Samplag") y un carrito lateral disponible en todas las páginas.
- Los productos, precios y stock se administran en **uTracker**. La web los lee en vivo, así que no hace falta tocar el código para agregar o cambiar productos.
- El catálogo también se lee al compilar, para los datos estructurados de Google. Cuando agregues productos nuevos, vuelve a desplegar en Vercel para que Google los vea.
- La conexión está en `src/data/store.ts`: URL de la API y llave publicable. La lógica del carrito y del pago está en `src/scripts/store.ts`.
- El pago se hace en una ventana de uTracker; al confirmarse, el carrito se vacía y se muestra el link de seguimiento.

## Despliegue en Vercel

1. Sube el proyecto a un repositorio de GitHub, GitLab o Bitbucket.
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio. Vercel detecta Astro solo:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node.js: 22.x o superior
3. Haz clic en **Deploy**.
4. En **Settings → Domains**, agrega `samplag.com.pe` y `www.samplag.com.pe` y configura los DNS que te indique Vercel.

También puedes desplegar desde la terminal:

```bash
npx vercel --prod
```

> El dominio está fijado en `astro.config.mjs` (`site`). Si se publica en otro dominio, cámbialo ahí para que el canonical, el Open Graph y el sitemap apunten bien.

## SEO
- El sitemap se genera en `/sitemap-index.xml`. Envíalo en Google Search Console.
- La estrategia y el gancho están en `SEO.md`.
