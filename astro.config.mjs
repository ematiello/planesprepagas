// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// `site` alimenta sitemap.xml, las URLs canónicas y las og:url absolutas.
export default defineConfig({
  site: 'https://www.planesprepagas.com.ar',
  // Sin `redirects` mientras el sitio general está oculto (2026-10-01): las URLs
  // viejas (/avalian, /companias, /nuestras-oficinas, /planes, etc.) se
  // redirigen a la home con un 302 en public/.htaccess. Astro en modo estático
  // solo genera redirecciones por meta refresh, no un código HTTP real.
  // Las landings de campaña (/lp/*) van con noindex y quedan fuera del sitemap:
  // la versión indexable es la home (y, con el sitio general, /companias/[slug]). No se bloquean
  // en robots.txt a propósito — si el robot no puede rastrearlas, nunca lee el
  // noindex y podrían indexarse igual desde un link externo.
  integrations: [sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/lp/') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
