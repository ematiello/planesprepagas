// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// `site` alimenta sitemap.xml, las URLs canónicas y las og:url absolutas.
export default defineConfig({
  site: 'https://www.planesprepagas.com.ar',
  // URLs viejas que se mantienen redirigidas para no romper links externos ni
  // lo ya indexado.
  redirects: {
    // Cada compañía vive en /companias/[slug]; el slug suelto lleva a su página.
    '/avalian': '/companias/avalian',
    // No hay índice de compañías: /planes ya las lista a todas con sus planes.
    '/companias': '/planes',
    // La atención es solo por teléfono, mail y WhatsApp: no publicamos domicilio.
    '/nuestras-oficinas': '/contacto',
  },
  // Las landings de campaña (/lp/*) van con noindex y quedan fuera del sitemap:
  // la versión indexable de cada compañía es /companias/[slug]. No se bloquean
  // en robots.txt a propósito — si el robot no puede rastrearlas, nunca lee el
  // noindex y podrían indexarse igual desde un link externo.
  integrations: [sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/lp/') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
