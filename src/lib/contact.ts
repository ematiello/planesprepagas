import type { CollectionEntry } from 'astro:content';
import { site } from '@/config/site';

/** Datos de contacto efectivos de una página: los de la compañía o los del sitio. */
export interface Contact {
  whatsappNumber: string;
  phone: { label: string; href: string };
}

/**
 * Resuelve con qué línea se atiende una página.
 *
 * Cada compañía puede tener su propio WhatsApp y teléfono (ver el schema de
 * `companies` en `src/content.config.ts`). Lo que no declare cae al contacto
 * general del sitio, así que sumar una compañía con línea propia es agregar dos
 * campos en su .md — y una sin línea propia sigue funcionando sin tocar nada.
 *
 * Sin argumento devuelve el contacto general: es lo que corresponde en las
 * páginas que no son de ninguna compañía (home, contacto, empresas, footer).
 */
export function contactFor(company?: CollectionEntry<'companies'>): Contact {
  return {
    whatsappNumber: company?.data.whatsappNumber ?? site.whatsappNumber,
    phone: company?.data.phone ?? site.phones.sales,
  };
}
