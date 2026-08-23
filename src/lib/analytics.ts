import { site } from '@/config/site';

/**
 * Emisión de eventos de conversión, con una sola vía activa a la vez.
 *
 * El sitio puede medir de dos maneras y son excluyentes:
 *
 * - **Con Google Tag Manager** (`tracking.gtmId`): el evento se empuja al
 *   `dataLayer` y se engancha dentro del contenedor con un activador de tipo
 *   "Evento personalizado" cuyo nombre es el del evento. Las etiquetas de GA4,
 *   Google Ads o Meta se administran desde GTM, sin volver a tocar código.
 * - **Sin GTM** (`analyticsId`): cae al `gtag.js` que carga el layout.
 *
 * Nunca las dos: con GTM disparando GA4 y además una llamada a `gtag`, cada
 * conversión se contaría dos veces.
 *
 * Este helper existe para que esa decisión viva en un solo lugar. Antes cada
 * formulario llamaba a `window.gtag` directo, así que al pasar a GTM habrían
 * quedado mudos sin que nada fallara de forma visible.
 */
type Gtag = (...args: unknown[]) => void;

export function trackEvent(name: string, payload: Record<string, unknown> = {}): void {
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: Gtag };

  if (site.tracking.gtmId) {
    w.dataLayer?.push({ event: name, ...payload });
    return;
  }

  w.gtag?.('event', name, payload);
}
