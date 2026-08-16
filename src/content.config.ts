import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Compañías representadas. Una por archivo: sumar una aseguradora nueva es
 * agregar un .md, sin tocar código.
 */
const companies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/companies' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      /**
       * Logo oficial de la compañía, ruta relativa al .md. Opcional: sin logo se
       * cae al badge de texto, así que una compañía cuyo logo todavía no tenemos
       * autorización para usar se carga igual.
       *
       * Reproducir un logo ajeno requiere permiso de la marca. No sumar uno sin
       * tener esa autorización.
       */
      logo: image().optional(),
      /** Color de marca. Se usa SOLO en el badge del plan, nunca como fondo o CTA. */
      brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Debe ser un hex de 6 dígitos'),
      /** Descripción de una línea, redactada por nosotros (nunca copy ajeno). */
      summary: z.string(),
      /** Sitio oficial de la compañía. */
      website: z.string().url(),
      /** Cartilla oficial: cada compañía tiene la suya, no unificamos. */
      directoryUrl: z.string().url().optional(),
      /**
       * Línea de WhatsApp propia de la compañía, en formato internacional y solo
       * dígitos. Cada compañía se atiende con su propio número; lo que no se
       * declare cae al contacto general de `src/config/site.ts` (ver
       * `src/lib/contact.ts`), así que una compañía sin línea propia no necesita
       * declarar nada.
       */
      whatsappNumber: z
        .string()
        .regex(
          /^\d{10,15}$/,
          'Solo dígitos, en formato internacional (ej: 5491167675521)',
        )
        .optional(),
      /** Teléfono propio de la compañía. Mismo criterio de fallback que el WhatsApp. */
      phone: z
        .object({
          label: z.string(),
          href: z.string().startsWith('tel:', 'Debe empezar con "tel:"'),
        })
        .optional(),
      /**
       * Preguntas propias de esta compañía, para su página en /companias/[slug].
       *
       * Deben ser distintas de las de `src/content/faq/` (que son del sitio y ya
       * emiten FAQPage en /preguntas-frecuentes): repetir las mismas preguntas
       * en dos URLs duplica contenido y schema, y Google descarta una de las dos.
       * Acá van las que solo aplican a esta compañía.
       */
      faq: z
        .array(z.object({ question: z.string(), answer: z.string() }))
        .optional(),
      order: z.number().default(99),
    }),
});

/**
 * Planes del comparador. `company` es una referencia validada en build: si un
 * plan apunta a una compañía inexistente, el build falla en vez de renderizar
 * un badge vacío.
 */
const plans = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/plans' }),
  schema: z.object({
    name: z.string(),
    company: reference('companies'),
    /** Frase de posicionamiento, una línea. */
    tagline: z.string(),
    /** 2-4 líneas: a quién apunta y qué resuelve. */
    summary: z.string(),
    /** 4-8 ítems para la lista de la página de detalle. */
    benefits: z.array(z.string()).min(3),
    /** Perfil al que apunta, se muestra como chip. */
    audience: z.string(),
    /** Destacar en home y arriba del listado. */
    featured: z.boolean().default(false),
    order: z.number().default(99),
    seoDescription: z.string().max(165),
    /**
     * true solo cuando los beneficios fueron confirmados contra la documentación
     * oficial vigente de la compañía. Mientras haya alguno en false, el sitio
     * muestra un aviso de "datos ilustrativos" — publicar precios o coberturas
     * sin verificar es publicidad engañosa, así que el aviso es intencional.
     */
    verified: z.boolean().default(false),
  }),
});

/** Categorías de FAQ. Cada archivo agrupa las preguntas de un tema. */
const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    category: z.string(),
    order: z.number().default(99),
    items: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .min(1),
  }),
});

export const collections = { companies, plans, faq };
