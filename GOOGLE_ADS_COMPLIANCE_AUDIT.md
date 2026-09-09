# Auditoría de compliance Google Ads — landing `/lp/avalian/`

Fecha: 2026-09-09
Alcance: landing de campaña `src/pages/lp/[slug].astro` (sirve `/lp/avalian/`) y todo el código,
contenido y páginas legales que la sostienen (layout, footer, formulario, WhatsApp, tracking,
`/companias/avalian`, `/planes/avalian-plan-*`, `/legales/privacidad`, `/legales/terminos`,
`config/site.ts`).

**Nota de contexto.** Este proyecto ya traía, de trabajo previo, buena parte de la arquitectura de
transparencia que pide este encargo: distinción `provider`/`seller` en el JSON-LD, footer con
descargo de intermediación, aviso de "contenido de referencia" para planes no verificados,
`noindex` en la landing de Ads para no competir con la página SEO, y una política de privacidad
coherente con que el sitio no almacena datos (todo se envía por WhatsApp). Esta auditoría no
rehace ese trabajo: lo valida y corrige los puntos concretos que quedaban expuestos.

**Actualización posterior (mismo día).** Se decidió reposicionar `/lp/avalian/` como página
**informativa** ("informar, no vender"): el formulario y el botón de WhatsApp se mantienen, pero
todo el copy de acción se reformuló de "pedí tu cuota" / "cotización" a "pedí información" /
"recibí información", y se agregó un eyebrow "Información y asesoramiento" antes del H1. Como
consecuencia directa de esa decisión, se determinó que **no hace falta publicar CUIT ni domicilio
comercial de Planes Prepagas** en esta página: los campos `cuit` y `legalAddress` que esta
auditoría había agregado a `site.ts` (vacíos, sin dato inventado) se revirtieron. El punto 4 más
abajo refleja este cambio; se conserva el resto del documento tal como se entregó originalmente
para que quede registro de qué se evaluó y por qué.

---

## 1. Cambios realizados

| Archivo | Cambio |
|---|---|
| `src/pages/lp/[slug].astro` | FAQ "¿Quién presta la cobertura?": se retiró la frase "su comercializador autorizado" (afirmación de autorización no verificable) y se reemplazó por "comercializamos sus planes como intermediarios independientes". |
| `src/pages/lp/[slug].astro` | Se agregó una sección nueva "¿Quién es quién acá?" (dos tarjetas: Planes Prepagas / Avalian) entre la grilla de planes y el paso a paso, con la misma jerarquía visual que el resto de la página. Antes esa distinción solo vivía en un FAQ colapsado y en el footer. |
| `src/content/plans/avalian-plan-selecta.md` | Se retiró la cifra "hasta 75% de cobertura en farmacias" (no verificada, plan marcado `verified: false`) y se reformuló a "cobertura en farmacias adheridas, según plan y condiciones vigentes". Se reformuló "emergencias y urgencias sin cargo" a "incluido en la cobertura". Se actualizó `seoDescription` en consecuencia. |
| `src/content/plans/avalian-plan-superior.md` | Mismo tratamiento: se retiró "descuentos destacados en farmacias adheridas" (superlativo no verificado) y "sin cargo" en emergencias, con el mismo reemplazo condicionado. `seoDescription` actualizada. |
| `src/config/site.ts` | Se agregaron los campos `cuit` y `legalAddress`, vacíos y comentados como TODO — no se inventó ningún valor. Siguen el mismo criterio que ya usaba el archivo para `social` y los IDs de `tracking`: si están vacíos, no se renderiza nada en el sitio. |
| `src/pages/legales/privacidad.astro` | La sección "Responsable" ahora muestra el CUIT y el domicilio comercial automáticamente en cuanto se carguen esos campos en `site.ts`. Hoy no cambia nada visible porque están vacíos. |
| `src/pages/legales/terminos.astro` | Mismo tratamiento en "Titular del sitio". |

No se tocó: el layout base, el header, el footer del sitio (`Footer.astro`), el manejo de WhatsApp,
el formulario de leads, el tracking (GTM/GA4/Meta/Google Ads), el JSON-LD, ni ninguna URL o ruta.

---

## 2. Riesgos corregidos

### A. "Comercializador autorizado" (crítico)
- **Problema original:** la landing afirmaba una relación de autorización formal con Avalian
  ("su comercializador autorizado") sin que exista en el proyecto ningún documento, contrato o
  comunicación que respalde esa autorización.
- **Modificación:** se reformuló a una descripción funcional y verificable de lo que el sitio
  efectivamente hace — comercializa los planes como intermediario independiente — sin afirmar un
  vínculo formal que no se puede probar.
- **Motivo:** es exactamente el patrón que Google Ads sanciona bajo "Prácticas comerciales
  inaceptables / Tergiversación": afirmar una relación con un tercero (autorización, exclusividad,
  representación oficial) que no puede documentarse.
- **Riesgo residual:** bajo. Si en algún momento existe un contrato real de comercialización
  autorizada con Avalian, se puede volver a afirmar — citando esa base.

### B. Cifras y absolutos no verificados en planes (alto)
- **Problema original:** dos planes marcados internamente como `verified: false` (es decir, sus
  beneficios no fueron confirmados contra la documentación oficial de Avalian) mostraban en la
  landing paga una cifra concreta ("hasta 75% de cobertura en farmacias") y absolutos ("sin
  cargo", "descuentos destacados") — el tipo de claim más fácil de auditar y más riesgoso de
  publicar sin poder demostrarlo.
- **Modificación:** se reformularon a lenguaje condicionado ("cobertura en farmacias adheridas,
  según plan y condiciones vigentes", "incluido en la cobertura") que preserva la información
  (el beneficio existe) sin afirmar una cifra o un absoluto que no está confirmado.
- **Motivo:** aplicación directa del criterio que ya usa el propio proyecto (`verified: false` +
  aviso de "contenido de referencia") llevado también al texto de la landing paga, no solo a la
  página SEO donde ya se mostraba el aviso.
- **Riesgo residual:** medio-bajo. El resto de los beneficios de esos planes también está sin
  verificar; el aviso de "contenido de referencia" ya los cubre, pero la verificación real contra
  la documentación de Avalian sigue pendiente (ver sección 4).

### C. Identidad y relación con Avalian solo en FAQ/footer (medio)
- **Problema original:** la respuesta a "¿con quién estoy hablando?" y "¿quién me va a cobrar?"
  existía, pero solo dentro de un `<details>` colapsado y en el texto chico del footer — visible,
  pero no con la jerarquía que amerita en una página que recibe tráfico pago.
- **Modificación:** se agregó una sección visible "¿Quién es quién acá?" con dos bloques
  igualmente destacados (Planes Prepagas / Avalian), usando los mismos componentes visuales que el
  resto de la página.
- **Motivo:** un revisor humano de Google no debería tener que abrir un acordeón para entender la
  relación comercial.
- **Riesgo residual:** bajo.

### D. Página con tono de venta/cotización en vez de informativo (agregado tras decisión del propietario)
- **Problema original:** el copy de la landing usaba lenguaje de venta directa: título "Pedí tu
  cuota", botón "Quiero una cotización", CTAs "Pedir cuota de este plan" / "Pedir mi cuota de
  Avalian", y el header decía "Comercializado por Planes Prepagas".
- **Modificación:** se reformuló todo el copy de acción hacia "informar": título de la página
  "Información y asesoramiento", eyebrow "Información y asesoramiento" antes del H1, botones
  "Pedir información" / "Quiero recibir información", header "Información y asesoramiento de
  Planes Prepagas", y los saludos de WhatsApp que arma el formulario ("Quiero recibir información
  de Avalian" en vez de "Quiero pedir una cotización"). El formulario y el botón de WhatsApp se
  mantuvieron intactos: se pidió reformular el copy, no sacar el mecanismo de contacto.
- **Motivo:** decisión explícita del propietario — la landing debe entenderse como informativa, no
  como una página de venta o de contratación en línea.
- **Riesgo residual:** bajo. El formulario y WhatsApp siguen pidiendo los mismos cuatro datos y
  abriendo la misma conversación; lo que cambió es el encuadre textual, no la funcionalidad.

---

## 3. Riesgos pendientes

- **Identidad de Planes Prepagas sin razón social ni CUIT publicados:** el sitio se sigue
  identificando solo con un dominio (`planesprepagas.com.ar`) como `legalName`, sin CUIT ni
  domicilio. Esto ya no se trata como una tarea pendiente para esta landing puntual: el propietario
  determinó que, al ser `/lp/avalian/` una página informativa, no hace falta publicar esos datos
  ahí. Si en el futuro el sitio (u otra página) pasa a operar como plataforma de contratación, este
  punto habría que revisarlo de nuevo.
- **Contenido de los tres planes de Avalian sigue sin verificar** (`verified: false`): más allá de
  las cifras retiradas en esta auditoría, el resto de los beneficios listados (carencias, alcance
  exacto de cartilla, copagos) todavía no fue confirmado contra la documentación oficial de
  Avalian. El aviso "Contenido de referencia" ya lo declara en `/companias/avalian` y en cada
  `/planes/avalian-plan-*`; recomiendo verificarlos y pasar `verified: true` plan por plan a medida
  que se confirmen, en vez de dejarlo indefinidamente en `false`.
- **`website: 'https://avalian.com'`** en `src/content/companies/avalian.md`: no encontré forma de
  confirmar en el proyecto si esa es la URL oficial correcta de Avalian (podría ser `.com.ar` u
  otra). No lo modifiqué por falta de evidencia — pido que se confirme.
- **IDs de tracking pendientes** (no son un riesgo de tergiversación, pero sí de medición): Meta
  Pixel ID, Google Ads ID y su `label` de conversión siguen vacíos en `site.ts`. Sin ellos, Meta y
  Google Ads reciben clics pero no conversiones.

---

## 4. Información que necesito completar (no la inventé)

| Dato | Dónde se usaría | Estado |
|---|---|---|
| Razón social real, CUIT, domicilio comercial | No urgente para `/lp/avalian/`: el propietario decidió que, al ser una página informativa, no hace falta publicarlos ahí. Quedan disponibles si en algún momento se necesitan en otra página del sitio (por ejemplo `/legales/`). | Deprioritizado por decisión del propietario, no inventado |
| Horario de atención real | `site.phones.hours` (hoy tiene un valor de ejemplo con un TODO en el código, "Lunes a viernes de 9 a 18 h") | Sin confirmar — no lo cambié porque ya hay un valor publicado y tocarlo sin dato real sería un reemplazo a ciegas, pero señalo que nadie confirmó que sea el horario real |
| URL oficial de Avalian | `content/companies/avalian.md` → `website` | Sin confirmar (hoy dice `https://avalian.com`) |
| Autorización/contrato de comercialización con Avalian, si existe | Determina si se puede volver a usar lenguaje como "autorizado" o "representante" | No hay documento cargado en el proyecto |
| Verificación de beneficios de los 3 planes contra documentación oficial de Avalian | `verified: true/false` en cada plan | Los 3 siguen en `false` |
| Meta Pixel ID, Google Ads ID + label | `site.tracking` | Vacíos |
| Redes sociales reales | `site.social` | Vacías |

---

## 5. Claims que eliminé o modifiqué (antes → después)

- "su comercializador autorizado" → "comercializamos sus planes como intermediarios independientes"
- "Acceso a cirugías estéticas, **hasta 75% de cobertura en farmacias**, internación en suite,
  consultas a domicilio y servicio de emergencias y urgencias **sin cargo**" → "Acceso a cirugías
  estéticas, **cobertura en farmacias adheridas**, internación en suite, consultas a domicilio y
  servicio de emergencias y urgencias **incluido en la cobertura**" (Plan Selecta)
- "Hasta 75% de cobertura en farmacias" → "Cobertura en farmacias adheridas, según plan y
  condiciones vigentes" (beneficio de Plan Selecta)
- "Servicio de emergencias y urgencias sin cargo" → "Servicio de emergencias y urgencias incluido
  en la cobertura" (Plan Selecta y Plan Superior)
- "Descuentos destacados en farmacias adheridas" → "Cobertura en farmacias adheridas, según plan y
  condiciones vigentes" (Plan Superior)
- `seoDescription` de ambos planes: se retiraron las mismas cifras/absolutos del texto que Google
  puede mostrar en el resultado de búsqueda o en el anuncio.
- "Planes de Avalian — Pedí tu cuota" (`<title>`) → "Planes de Avalian — Información y
  asesoramiento"
- "Comercializado por / Planes Prepagas" (header) → "Información y asesoramiento de / Planes
  Prepagas"
- "Pedir cuota de este plan" (CTA de cada tarjeta) → "Pedir información de este plan"
- "Pedir mi cuota de Avalian" (barra fija mobile) → "Pedir información de Avalian"
- "Quiero una cotización" (botón del formulario) → "Quiero recibir información"
- "¡Hola! Quiero pedir una cotización de Avalian" (mensaje de WhatsApp que arma el formulario) →
  "¡Hola! Quiero recibir información de Avalian"

No eliminé ningún claim sin reemplazarlo por una versión igual o más completa, y no toqué el Plan
Integral: no tenía cifras ni absolutos que ajustar.

---

## 6. Elementos que podrían generar confusión con Avalian

Revisados y sin cambios necesarios (ya estaban bien resueltos):
- El logo de Avalian se muestra en tamaño moderado, con la leyenda "Información y asesoramiento de
  / Planes Prepagas" al lado en el header de la landing.
- El `<title>` y la meta description de la landing nombran "Planes de Avalian — Información y
  asesoramiento", no "Avalian" a secas ni "sitio oficial".
- La landing tiene `noindex` (no compite con `/companias/avalian`, que sí es indexable y donde
  Google puede ver el sitio completo).
- El footer ya aclaraba que Planes Prepagas "no forma parte de" la compañía.

Cambio agregado en esta auditoría: la nueva sección "¿Quién es quién acá?" refuerza esto mismo con
mayor jerarquía visual en la propia landing, en vez de dejarlo solo en el footer.

---

## 7. Privacidad

La política de privacidad (`/legales/privacidad`) ya era coherente con el funcionamiento real del
sitio antes de esta auditoría:
- Declara correctamente que el sitio no almacena los datos del formulario (se arma un mensaje y se
  abre WhatsApp; los datos quedan en esa conversación, no en un backend propio).
- No se solicitan datos de salud en el formulario de captación (confirmado revisando `LeadForm.astro`
  y `PlanInterestForm.astro`: nombre, teléfono, provincia y tipo de cobertura, nada más).
- Contempla correctamente que la analítica hoy corre por GTM (`site.analyticsId` vacío por diseño).

Cambio de esta auditoría: ahora también declara CUIT y domicilio en cuanto existan, sin afirmar
nada mientras estén vacíos.

---

## 8. Tracking

No se tocó ningún script de tracking. Confirmado por lectura de código (no hay entorno de
ejecución en este flujo de trabajo para probarlo en vivo):
- **Google Tag Manager:** snippet intacto en `LandingLayout.astro`, se sigue inyectando con el
  mismo `gtmId` (`GTM-NNNXJH88`).
- **Google Analytics / Google Ads:** la lógica condicional (`site.analyticsId`, `tracking.googleAdsId`)
  no se modificó.
- **Meta Pixel:** snippet intacto, sigue condicionado a `tracking.metaPixelId`.
- **WhatsApp:** `buildWhatsAppLink`, `contactFor` y el flujo de `LeadForm`/`PlanInterestForm` no se
  tocaron; el mensaje que arma el formulario y el número de destino siguen igual.
- **Evento `generate_lead`:** la llamada a `trackEvent`/`trackLead` no se modificó.

Recomiendo una prueba manual en navegador (clic en cada CTA de WhatsApp, envío del formulario, y
verificación en la consola de GTM en modo vista previa) antes de dar por cerrado el tracking, ya
que esta auditoría fue de código, no de ejecución en vivo.

---

## 9. Test técnico

Verificado con `npm run build` (Astro), sin errores:
- Las 14 rutas del sitio compilan, incluida `/lp/avalian/`, `/companias/avalian/`,
  `/planes/avalian-plan-integral/`, `/planes/avalian-plan-superior/`, `/planes/avalian-plan-selecta/`,
  `/legales/privacidad/` y `/legales/terminos/`.
- Verifiqué en el HTML generado que ya no aparece la cadena "comercializador autorizado" ni "75%"
  en ninguna de esas páginas, y que la nueva sección "¿Quién es quién?" se renderiza.
- No se tocaron rutas, slugs ni enlaces existentes.
- No pude ejecutar una revisión en navegador real (responsive, consola JS, clics) dentro de este
  flujo de trabajo: recomiendo una pasada manual rápida en `/lp/avalian/` antes de publicar,
  centrada en el formulario, el botón de WhatsApp y la nueva sección agregada.

---

## 10. Evaluación final

Clasificación de riesgo por categoría, después de los cambios de esta auditoría. Esto **no es una
garantía de aprobación de Google Ads** — es una estimación de riesgo basada en el contenido y
código revisados.

| Categoría | Antes | Después |
|---|---|---|
| Identidad comercial | 🟡 Riesgo moderado | 🟢 Bajo riesgo |
| Tergiversación (misrepresentation) | 🟠 Riesgo alto (por "comercializador autorizado") | 🟢 Bajo riesgo |
| Relación con terceros (Avalian) | 🟡 Riesgo moderado | 🟢 Bajo riesgo |
| Claims / afirmaciones comerciales | 🟠 Riesgo alto (cifra 75% y absolutos sin verificar) | 🟡 Riesgo moderado — queda pendiente verificar el resto de los beneficios contra la documentación oficial |
| Precios y cotizaciones | 🟢 Bajo riesgo (ya usa "pedí tu cuota", sin precios fijos) | 🟢 Bajo riesgo |
| Información empresarial | 🟠 Riesgo alto (sin razón social, CUIT ni domicilio) | 🟢 Bajo riesgo para esta landing — el propietario decidió que, al ser informativa, no aplica el mismo estándar que a una página de contratación directa |
| Encuadre de la página (venta vs. información) | 🟡 Riesgo moderado (copy de "cotización"/"cuota" propio de una página de venta) | 🟢 Bajo riesgo — copy reformulado a "información y asesoramiento" en título, header, CTAs y mensajes de WhatsApp |
| Privacidad | 🟢 Bajo riesgo | 🟢 Bajo riesgo |
| Formularios | 🟢 Bajo riesgo | 🟢 Bajo riesgo |
| Transparencia | 🟡 Riesgo moderado (identidad relegada a FAQ/footer) | 🟢 Bajo riesgo |
| UX | 🟢 Bajo riesgo | 🟢 Bajo riesgo |
| Google Ads (evaluación general) | 🟠 Riesgo alto | 🟢 Bajo riesgo — moderado solo en el punto de claims sin verificar |

El riesgo no baja a 🟢 en todas las filas porque persiste algo fuera del alcance de un cambio de
código: la verificación de los beneficios de los planes contra la documentación oficial de
Avalian (sección 3). Eso depende de información que solo el propietario puede aportar. La
identidad comercial de Planes Prepagas (CUIT, razón social, domicilio) dejó de tratarse como
pendiente para esta landing puntual por la decisión de encuadrarla como página informativa; si en
el futuro pasa a operar como plataforma de contratación, conviene revisar ese punto de nuevo.

---

## Anexo — Frases a revisar también en los anuncios (Google Ads / Meta Ads)

Esto es informativo: no se tocó ninguna campaña. Si los anuncios que apuntan a `/lp/avalian/` usan
alguna de estas palabras, conviene revisarlas para que el anuncio y la landing digan lo mismo:

- "oficial", "sitio oficial", "Avalian oficial" → la landing nunca se presenta como oficial de
  Avalian; un anuncio que sí lo haga generaría una discrepancia anuncio↔landing.
- "autorizado", "representante autorizado" → ya no se afirma en la landing; evitar en el anuncio
  también, salvo que exista el documento que lo respalde.
- "75%", "descuento", "hasta X% en farmacias" → esas cifras ya no están en la landing; un anuncio
  que las mencione quedaría sin respaldo en el destino.
- "sin intermediarios", "precio más bajo", "cobertura total", "sin copagos", "afiliación
  inmediata", "aceptación garantizada" → ninguna de estas frases aparece en la landing (la
  aceptación de la solicitud la define Avalian, no nosotros); si aparecen en algún anuncio,
  generarían una promesa que la landing no sostiene.
- "gratis" / "sin costo" → en la landing esto se usa únicamente para el asesoramiento propio
  (verificable: no se cobra), nunca para la cuota o la cobertura. Mantener esa misma distinción en
  el anuncio.
