# Checklist pre-apelación — Google Ads · Prácticas comerciales inaceptables

Segunda apelación. La primera fue rechazada. **No presentar hasta que todo lo marcado como
🔴 esté completo**, porque son los puntos que Google citó textualmente en el rechazo.

Fecha de preparación: 2026-09-11

---

## A. Sitio — hecho ✅

Verificado sobre el HTML compilado (`npm run build` + auditoría automática).

- [x] 🔴 Identidad de Planes Prepagas visible en el primer pantallazo de `/lp/avalian/`
      **en todos los breakpoints**. Se eliminó el `hidden … sm:block` que la ocultaba
      por debajo de 640 px.
- [x] 🔴 Franja de descargo en la primera pantalla: *"Este sitio pertenece a Planes
      Prepagas y no es el sitio oficial de Avalian"*.
- [x] 🔴 H1 reformulado: de *"Cobertura médica Avalian para vos y tu familia"* a
      *"Información sobre los planes de Avalian"*.
- [x] 🔴 Sección "Quién es quién acá" restaurada (se había eliminado en el commit `bba49a5`,
      **antes** de la primera apelación) y ubicada antes de la grilla de planes.
- [x] 🔴 Razón social, CUIT/CUIL y localidad publicados en footer, quiénes somos, contacto,
      términos, privacidad y JSON-LD.
- [x] 🔴 Eliminada toda afirmación de *"representar"* a las compañías (7 archivos).
- [x] 🔴 Política de privacidad corregida: declara GTM, GA4 `G-Z36TMMESD7`, cookies `_ga`,
      parámetros de campaña y `sessionStorage`. Antes decía que el sitio **no** usaba
      cookies de analítica, y era falso.
- [x] Política de privacidad actualizada a los 6 campos reales del formulario.
- [x] Logo de Avalian fuera del header, y etiquetado donde aparece.
- [x] Enlace saliente al sitio oficial de Avalian (`avalian.com`, verificado).
- [x] `seller` retirado del JSON-LD de los planes (afirmaba un rol de venta no documentado).
- [x] Las dos líneas telefónicas declaradas y explicadas en `/contacto`.
- [x] Lenguaje de contratación suavizado: *"Te asociás"* → *"Decidís vos"*;
      *"Cómo asociarte a Avalian"* → *"Cómo es el proceso"*.

## B. Antes de apelar — pendiente 🔴

- [ ] 🔴 **Deploy a producción.** Todo lo anterior está compilado pero **no publicado**.
      Los deploys son manuales por MCP de Hostinger. Sin esto, Google revisa el sitio viejo.
- [ ] 🔴 **Verificar los datos de AFIP.** Que "Farrell Ercília Noemi" y el CUIL
      `27-04455493-0` coincidan **carácter por carácter** con la constancia de inscripción.
      La constancia se adjunta como evidencia; una diferencia de tipeo juega en contra.
- [ ] 🔴 **Corregir los anuncios en la cuenta de Google Ads:**
  - [ ] Eliminar todo display URL `www.avalian.com.ar` → dejar `planesprepagas.com.ar`
  - [ ] Eliminar todo final URL apuntando a `avalian.com.ar`
  - [ ] Reemplazar headlines/descriptions por los de `AD_TEMPLATES_AVALIAN.md`
  - [ ] Al menos un headline por anuncio debe decir "Planes Prepagas"
  - [ ] Eliminar la campaña de competidor (OSDE en el texto del anuncio)
  - [ ] Quitar "garantizado", "24/7", "afiliación en 5 minutos", "mejores precios"
  - [ ] Quitar "Más de 200.000 familias confían en Avalian"
  - [ ] Quitar "especialista de Avalian" / "nuestros vendedores"
  - [ ] Renombrar campañas: prefijo `GADS_Search_PP_…`
  - [ ] `utm_campaign=pp-avalian-info` (antes `avalian-leads`)
- [ ] 🔴 **Nombre del anunciante en la cuenta** = `Planes Prepagas`, y que el perfil de
      pagos esté a nombre de Farrell Ercília Noemi con el mismo CUIL. **DATO A VERIFICAR:**
      no tengo acceso a la cuenta para comprobarlo.
- [ ] 🟡 Confirmar el horario de atención real (hoy publica "lunes a viernes de 9 a 18 h",
      valor que nadie confirmó y que llevaba un TODO en el código).

## C. Recomendado antes de reactivar 🟡

- [ ] Verificar los beneficios de los 3 planes contra la documentación oficial de Avalian
      y pasar `verified: true` plan por plan. Hoy los 3 están en `false`.
- [ ] Cargar los perfiles de redes sociales reales en `site.social` (hoy vacíos, y por eso
      no entran al `sameAs` del JSON-LD).
- [ ] Crear la acción de conversión de Google Ads y la etiqueta en GTM. **Hoy el contenedor
      `GTM-NNNXJH88` solo tiene GA4: la campaña no registra ninguna conversión.**
- [ ] Considerar un Google Business Profile a nombre de Planes Prepagas: da una fuente
      externa de identidad, que es de lo que Google dice que se nutre al revisar.

---

## D. Evidencia a adjuntar en la apelación

| # | Documento | Prueba |
|---|---|---|
| 1 | Constancia de inscripción de AFIP | Quién es Planes Prepagas |
| 2 | Captura de `/quienes-somos` mostrando titular + CUIL | Identidad publicada |
| 3 | Captura de `/lp/avalian/` **en mobile**, primera pantalla | Identidad propia dominante + descargo visible |
| 4 | Captura de la sección "Quién es quién acá" | Relación con Avalian explicada |
| 5 | Captura de `/legales/privacidad` (sección cookies) | Coherencia código ↔ política |
| 6 | Titularidad del dominio `planesprepagas.com.ar` | El dominio es propio |
| 7 | Captura del footer con el descargo de no-afiliación | Presente en todo el sitio |
| 8 | Anuncios nuevos con display URL propio | Corrección de la suplantación |
| 9 | Comprobante de titularidad de la línea de WhatsApp | Quién atiende al usuario |
| 10 | Este checklist + `AD_TEMPLATES_AVALIAN.md` | Cambios reales y verificables |

**Si existe algún documento de vínculo con Avalian** (contrato, alta como productor,
liquidación de comisiones), adjuntarlo también. El titular indicó que **no hay documento
formal**, por eso el sitio no afirma ningún vínculo: solo describe la actividad
(informar y asesorar). Es preferible así — afirmar un vínculo indemostrable es lo que
originó la sanción.

---

## E. Qué NO decir en la apelación

- ❌ "Somos representantes/comercializadores autorizados de Avalian" — no hay documento.
- ❌ "Es un malentendido, no cambiamos nada" — Google pidió explícitamente cambios reales.
- ❌ "El sitio no usa cookies" — es falso y verificable en diez segundos.
- ❌ Cualquier cifra de afiliados, años en el mercado o testimonios sin respaldo.
