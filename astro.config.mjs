// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/data/site.ts';

// Dominio final del sitio: se usa en canonical, Open Graph, schema y sitemap
export default defineConfig({
  site: 'https://samplag.com.pe',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // Con la tienda apagada, /tienda solo redirige al inicio: no debe aparecer en el sitemap
      filter: (page) => site.storeEnabled || !new URL(page).pathname.startsWith('/tienda'),
    }),
  ],
  build: { inlineStylesheets: 'auto' },
});
