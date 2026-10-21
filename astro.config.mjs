// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Dominio final del sitio: se usa en canonical, Open Graph, schema y sitemap
export default defineConfig({
  site: 'https://samplag.com.pe',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
