# Sitio comercial de planes de medicina prepaga

Sitio de un broker de salud: presenta los planes de las compañías representadas y canaliza
consultas. Astro + Tailwind, 100% estático, sin backend: los leads salen por WhatsApp.

Hoy hay **una sola compañía cargada (Avalian)**, pero nada en el código la nombra: las
páginas se arman desde `src/content/`. Sumar una compañía es agregar archivos de contenido
—ver [Sumar una compañía](#sumar-una-compañía)—, no tocar componentes.

## Comandos

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/ para revisar el build
```

## Antes de publicar: qué hay que reemplazar

Todo lo marcado con `TODO` en el código. En orden de importancia:

| Qué | Dónde |
|---|---|
| Nombre comercial y razón social | `src/config/site.ts` |
| **Número de WhatsApp general** (formato `5491123456789`) | `src/config/site.ts` → `whatsappNumber` |
| Líneas propias por compañía (opcional) | `src/content/companies/*.md` → `whatsappNumber`, `phone` |
| Teléfono, email, redes | `src/config/site.ts` |
| Dominio real | `astro.config.mjs` → `site` y `public/robots.txt` |
| ID de GA4 (opcional) | `src/config/site.ts` → `analyticsId` |
| Logo real | `src/components/layout/Header.astro` (hoy es un monograma tipográfico) |
| Trayectoria y equipo | `src/pages/quienes-somos.astro` |

Sin el número de WhatsApp real, **ningún formulario del sitio sirve**: es el primer cambio.

## Contenido

No hace falta tocar código para cargar contenido. Todo vive en `src/content/`:

- `companies/*.md` — una compañía por archivo (nombre, color de marca, sitio, cartilla y
  su contacto propio, opcional).
- `plans/*.md` — un plan por archivo. `company` referencia el nombre de archivo de la
  compañía; si no existe, **el build falla** en vez de renderizar una tarjeta rota.
- `faq/*.md` — una categoría por archivo, con su lista de preguntas. Son transversales al
  sitio, así que **no deben nombrar una compañía puntual**.

El nombre del archivo es la URL: `plans/avalian-plan-cerca.md` → `/planes/avalian-plan-cerca`,
y `companies/avalian.md` → `/companias/avalian`.

## Estructura de páginas

| URL | Qué es |
|---|---|
| `/` | Home general. Lista las compañías representadas, sin nombrar ninguna en el código. |
| `/planes` | Todos los planes, agrupados por compañía. |
| `/planes/[slug]` | Detalle de un plan. |
| `/companias/[slug]` | Página de una compañía, con sus planes y **su línea de contacto**. Es la versión **indexable**: emite `ItemList`, `BreadcrumbList` y, si la compañía cargó `faq`, `FAQPage`. |
| `/lp/[slug]` | **Landing de campaña** para Meta y Google Ads. `noindex`, fuera del sitemap, sin navegación. Ver abajo. |

## Landings de campaña (`/lp/[slug]`)

Destino del tráfico pago. Se generan desde la misma colección, así que cada compañía nueva
tiene su landing sin escribir código.

Difieren del resto del sitio a propósito:

- **`noindex` y fuera del sitemap.** La página que posiciona es `/companias/[slug]`. Si las
  dos se indexaran competirían por el mismo término y Google repartiría la autoridad. Por
  la misma razón **no** se bloquean en `robots.txt`: un robot que no puede rastrearlas
  nunca lee el `noindex` y podría indexarlas igual desde un link externo.
- **Sin header de navegación ni footer de links.** Cada link que no sea el CTA es una ruta
  de escape que se paga y no convierte. El pie conserva solo los legales, que Meta y Google
  exigen para aprobar el destino.
- **Capturan el origen de campaña.** `src/lib/campaign-client.ts` lee los UTMs (y
  `gclid`/`fbclid`), los persiste en `sessionStorage` y los adjunta al mensaje de WhatsApp.
  Sin eso el origen se pierde: el lead sale por WhatsApp y no hay backend que lo registre.

### El equilibrio de marca en la landing

La landing está escrita **con la marca de la compañía al frente**: el titular habla de su
cobertura, no de nuestro servicio, y el logo encabeza la página. Es lo que corresponde en
tráfico frío, donde el visitante busca la prepaga y no a su comercializador.

Lo que **no** hay que quitar, aunque tiente:

| Elemento | Dónde | Por qué |
|---|---|---|
| "Comercializado por {marca}" | Encabezado | Identifica al vendedor sin robar protagonismo |
| "¿Quién presta la cobertura?" | Última de la FAQ | Aclara con quién se firma el contrato |
| Descargo de intermediación | Pie (`LandingLayout`) | Sostiene el uso de la marca ajena |

**Meta y Google Ads suspenden cuentas por tergiversación** cuando el destino aparenta ser
el sitio oficial de una marca que no es tuya (políticas de *Misrepresentation* y *Business
Impersonation*). El costo de cruzar esa línea no es un reproche: es la cuenta publicitaria
dada de baja y el dominio marcado. Estos tres elementos son lo que separa "comercializador
autorizado" de "impersonación", y ocupan muy poco espacio.

### Configurar el seguimiento

Los IDs viven en `src/config/site.ts` → `tracking`. Vacío = no se inyecta el script, así que
el sitio funciona sin ellos y no carga píxeles de terceros mientras no haya campañas.

| Campo | Dónde se saca |
|---|---|
| `metaPixelId` | Meta Events Manager → tu píxel → ID (solo dígitos) |
| `googleAdsId` | Google Ads → Herramientas → Conversiones → `AW-XXXXXXXXX` |
| `googleAdsLabel` | La misma acción de conversión: la cadena después de la barra |

**Google Ads necesita los dos campos.** Con el ID solo, la conversión no se registra y la
campaña no puede optimizar hacia quien realmente consulta.

## Sumar una compañía

1. Crear `src/content/companies/<slug>.md` con `name`, `brandColor`, `summary`, `website` y
   `order`. Si tiene línea propia, sumar `whatsappNumber` y `phone` (el `.md` de Avalian
   trae el ejemplo comentado).
2. Si tenés autorización de la marca para usar su logo, dejarlo en `src/assets/companias/`
   y apuntarlo con `logo:` (ruta relativa al `.md`). Sin logo se ve el badge de texto.
3. Opcional: cargar `faq:` con preguntas **propias de esa compañía**. No repetir las de
   `src/content/faq/` — publicar las mismas preguntas en dos URLs duplica contenido y
   schema, y Google descarta una de las dos.
4. Crear sus planes en `src/content/plans/`, con `company: <slug>`.

Con eso aparecen solas: su página `/companias/<slug>`, su landing `/lp/<slug>`, su sección
en `/planes`, su tarjeta en la home, su entrada en el footer y —si declaró contacto propio—
su bloque en `/contacto`.

### Contacto por compañía

Cada compañía puede atenderse con su propio WhatsApp y teléfono. Lo que no declare cae al
contacto general de `src/config/site.ts`. La resolución vive en `src/lib/contact.ts`:

```ts
const contact = contactFor(company); // línea de la compañía, o la general
```

**No leer `site.whatsappNumber` directamente en una página de compañía o de plan**: saltea
la línea propia y manda todos los leads al número general. Usar siempre `contactFor()`.

### El flag `verified`

Cada plan tiene `verified: false` por defecto y el sitio muestra un aviso de "contenido de
referencia" mientras haya alguno sin verificar. Poné `verified: true` recién cuando hayas
confirmado los beneficios contra la documentación oficial vigente de la compañía. Publicar
coberturas sin confirmar es publicidad engañosa; por eso el aviso es el default.

## Decisiones de diseño

- **Paleta azul marino + ámbar**, deliberadamente distinta del verde institucional de las
  prepagas: el sitio no debe leerse como una compañía de salud sino como un intermediario.
- **El verde queda reservado a WhatsApp** y a nada más, para que la acción de contacto se
  reconozca al instante.
- **El color de cada compañía se usa solo en su badge**, nunca como fondo o CTA. Así el
  sitio no se "viste" de ninguna marca ajena.
- **Logo donde se presenta la compañía, badge de texto donde se identifica un plan.**
  `CompanyLogo` (logo oficial, con fallback automático al badge) va en la home, en los
  encabezados de `/planes`, en `/companias/[slug]`, en el footer y en `/contacto`. Las
  tarjetas de plan siguen con `CompanyBadge`: son una grilla, y repetir el logo en cada
  tarjeta lo convierte en ruido.
- **Los logos van sin recolorear.** Sobre fondo navy no se los tiñe de blanco sino que se
  los pone en un chip claro (`onDark` en `CompanyLogo`) — alterar los colores de una marca
  ajena no es una opción, y el texto oscuro del logo desaparecería sobre el navy.
- **Un logo de terceros requiere autorización de la marca.** El campo `logo` es opcional
  justamente por eso: una compañía sin autorización se carga igual y se ve con badge de
  texto hasta que el logo llegue.
- **Cero JavaScript de framework.** El filtro, el acordeón, el menú y el formulario son
  scripts vanilla en cada componente.

## Nota de alcance en el footer

En letra pequeña (`src/components/layout/Footer.astro`): los planes pertenecen a cada
compañía, manda el contrato de la compañía y no lo publicado acá, y las marcas citadas son
de sus titulares. No es una aclaración de intermediación — es lo que protege sobre la
exactitud de los beneficios listados y sobre el uso de marcas de terceros.

**Los dos textos de `/legales/` son una base de trabajo, no un dictamen.** Llevan un aviso
visible de "pendiente de revisión legal" que hay que borrar recién cuando un profesional
los haya revisado.

## Deploy

Salida estática en `dist/`. Funciona en Vercel, Netlify, Cloudflare Pages o cualquier
hosting de archivos. Build: `npm run build`. Directorio publicado: `dist`.
