/**
 * Fuente única de verdad para los datos de la marca.
 *
 * Todo lo marcado con TODO son PLACEHOLDERS: cambiarlos acá y el sitio entero
 * queda actualizado (header, footer, legales, links de WhatsApp, JSON-LD,
 * títulos SEO). No hardcodear ninguno de estos valores en los componentes.
 *
 * [Test deploy automático: 2026-08-16 13:35]
 */

export const site = {
  name: 'Planes Prepagas',

  /**
   * Identidad del titular del sitio.
   *
   * ⚠️ BLOQUEANTE PARA LA APELACIÓN DE GOOGLE ADS ⚠️
   *
   * Google rechazó la cuenta, entre otros motivos, por "ocultar o tergiversar la
   * identidad de la empresa". Hasta acá el sitio se identificaba con el dominio
   * ('planesprepagas.com.ar') haciendo de razón social: así figuraba en el
   * copyright, en el JSON-LD, como Responsable en la política de privacidad y
   * como Titular en los términos. Un dominio no identifica a nadie.
   *
   * El titular opera como PERSONA FÍSICA (monotributo), así que lo que
   * corresponde publicar es nombre y apellido + CUIT/CUIL + localidad.
   *
   * Mientras estos campos estén vacíos, el sitio NO inventa ningún dato: los
   * bloques de identidad simplemente no se renderizan. Pero la apelación no
   * debería presentarse así — es exactamente el punto que Google reprocha.
   *
   * Datos aportados por el titular (2026-09-11). Verificar que coincidan
   * EXACTAMENTE con la constancia de inscripción de AFIP antes de apelar: la
   * apelación adjunta esa constancia como evidencia, y una diferencia de
   * tipeo entre el sitio y el documento juega en contra en vez de a favor.
   */
  legalName: 'Farrell Ercília Noemi',
  taxId: '27-04455493-0',
  legalLocation: 'Ciudad Autónoma de Buenos Aires, Argentina',

  /** Figura bajo la que opera, para los textos legales. */
  legalForm: 'Persona física (responsable monotributo)',

  tagline:
    'Asesores independientes en medicina prepaga. Te ayudamos a entender y comparar las coberturas disponibles.',

  description:
    'Planes Prepagas es un asesor independiente en medicina prepaga. Informamos y comparamos los planes de las compañías que publicamos, te explicamos las diferencias y, si lo pedís, te acompañamos en la gestión de la solicitud ante la compañía. No somos una empresa de medicina prepaga. Asesoramiento sin costo por WhatsApp.',

  /**
   * Contacto general del sitio: la línea con la que se atienden las páginas que
   * no son de ninguna compañía en particular (home, contacto, empresas, footer).
   *
   * Cada compañía puede declarar su propio WhatsApp y teléfono en su archivo de
   * `src/content/companies/`; lo que no declare cae acá. La resolución vive en
   * `src/lib/contact.ts` — no leer estos valores directamente en una página de
   * compañía, porque saltearía su línea propia.
   */

  /**
   * Número de WhatsApp en formato internacional, solo dígitos.
   * 54 país + 9 móvil + 11 área + 67675521 → línea 11 6767-5521.
   */
  whatsappNumber: '5491167675521',

  phones: {
    /** Mismo número que WhatsApp: un solo contacto para llamadas y chat. */
    sales: { label: '+54 11 6767-5521', href: 'tel:+541167675521' },
    /** TODO: horario de atención real. */
    hours: 'Lunes a viernes de 9 a 18 h',
  },

  /**
   * Línea dedicada a la atención de las landings de campaña (`/lp/[slug]`).
   *
   * Es un número DISTINTO del general a propósito: permite separar el volumen
   * que llega por publicidad paga del que llega por el sitio. Vive acá y no
   * hardcodeado en la landing porque `/contacto` la declara explícitamente:
   * dos números en el mismo dominio sin explicación es una de las
   * incoherencias de identidad que Google señala al revisar un anunciante.
   */
  campaignLine: {
    whatsappNumber: '5491124891888',
    label: '+54 9 11 2489-1888',
    href: 'tel:+5491124891888',
  },

  email: 'info@planesprepagas.com.ar',

  /**
   * Sin domicilio a propósito: la atención es solo por teléfono, mail y WhatsApp,
   * así que el sitio no publica dirección. Zona de cobertura, para el JSON-LD.
   */
  areaServed: 'AR',

  /**
   * Perfiles sociales de la marca.
   *
   * Vacíos a propósito: una URL vacía no se renderiza en el footer ni entra al
   * `sameAs` del JSON-LD. Antes apuntaban a las portadas genéricas de cada red,
   * lo que le declaraba a Google que instagram.com era un perfil nuestro.
   *
   * TODO: cargar la URL completa del perfil real de cada red que se use.
   * Ej: 'https://www.instagram.com/planesprepagas'.
   */
  social: {
    instagram: '',
    facebook: '',
    linkedin: '',
  },

  /**
   * ID de GA4 ('G-XXXXXXXXXX') para cargar gtag.js directo, sin GTM.
   *
   * Vacío a propósito: la medición entra por Google Tag Manager
   * (`tracking.gtmId`), y GA4 se configura como etiqueta DENTRO del contenedor.
   *
   * NO cargar los dos a la vez. Si GTM ya dispara una etiqueta de GA4 y acá
   * hay un ID, cada page_view se cuenta dos veces y las métricas quedan al
   * doble. Este campo solo sirve si algún día se saca GTM del medio.
   *
   * La propiedad de GA4 del sitio es `G-Z36TMMESD7`, y vive como etiqueta
   * dentro del contenedor de GTM. Se anota acá solo para no salir a buscarla:
   * este campo tiene que seguir vacío.
   */
  analyticsId: '',

  /**
   * Seguimiento de las landings de campaña (`/lp/[slug]`).
   *
   * Todos vacíos por defecto: un ID vacío no inyecta ningún script, así que el
   * sitio funciona sin ellos y no carga píxeles de terceros mientras no haya
   * campañas activas. Cargar solo los que se usen.
   *
   * Sin estos IDs, Meta y Google Ads reciben clics pero NO conversiones, y no
   * pueden optimizar la entrega hacia quien realmente consulta.
   */
  tracking: {
    /**
     * Contenedor de Google Tag Manager ('GTM-XXXXXXX').
     *
     * Es la vía de medición del sitio: carga en todas las páginas, incluidas
     * las landings. GA4, conversiones y cualquier otra etiqueta se administran
     * desde la interfaz de GTM, sin volver a tocar código.
     *
     * Los contactos salientes empujan `generate_lead` al dataLayer: en GTM se
     * enganchan con un activador de tipo "Evento personalizado" con ese nombre.
     */
    gtmId: 'GTM-NNNXJH88',
    /** TODO: ID del píxel de Meta, solo dígitos (ej: '123456789012345'). */
    metaPixelId: '',
    /** TODO: ID de conversión de Google Ads ('AW-XXXXXXXXX'). */
    googleAdsId: '',
    /**
     * TODO: etiqueta de la acción de conversión de Google Ads (la cadena que
     * sigue a la barra en `AW-XXXXXXXXX/abcDEF...`). Sin esto, el ID solo no
     * registra la conversión.
     */
    googleAdsLabel: '',
  },
} as const;

/**
 * Identidad publicable del titular, derivada de `site`.
 *
 * Un solo lugar decide cómo se nombra a la empresa en los legales, el
 * copyright y el JSON-LD, para que no vuelva a pasar que un dominio termine
 * ocupando el lugar de la razón social en cuatro páginas distintas.
 *
 * `isComplete` es false mientras falte cualquiera de los tres datos: los
 * bloques de identidad lo usan para no renderizar una ficha a medias, que es
 * peor que no tenerla.
 */
export const identity = {
  isComplete: Boolean(site.legalName && site.taxId && site.legalLocation),
  /** Cómo se firma el sitio. Cae al nombre comercial si aún no hay datos reales. */
  displayName: site.legalName || site.name,
  legalName: site.legalName,
  taxId: site.taxId,
  location: site.legalLocation,
  form: site.legalForm,
} as const;

/**
 * Links de navegación principal del header.
 *
 * Las compañías no van acá: se listan en la home y en /planes, y cada una tiene
 * su página en /companias/[slug]. Con pocas compañías, un ítem de menú que
 * despliega una sola opción sobra; si el catálogo crece, corresponde sumar
 * "Compañías" apuntando a un índice.
 */
export const mainNav = [
  { label: 'Planes', href: '/planes' },
  { label: 'Empresas', href: '/empresas' },
  { label: 'Quiénes somos', href: '/quienes-somos' },
  { label: 'Contacto', href: '/contacto' },
] as const;

/** Links secundarios de la barra superior angosta. */
export const topBarNav = [
  { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
] as const;

/** Columna de legales del footer. */
export const legalNav = [
  { label: 'Términos y condiciones', href: '/legales/terminos' },
  { label: 'Política de privacidad', href: '/legales/privacidad' },
] as const;
