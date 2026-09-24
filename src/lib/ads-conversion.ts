/**
 * Conversiones de Google Ads por clic en los CTA de contacto de las landings:
 * WhatsApp y teléfono.
 *
 * El envío del formulario NO pasa por acá: Google Ads lo mide solo, con la
 * detección automática de formularios de la etiqueta, y un evento manual sobre
 * el mismo submit lo contaría dos veces.
 */

type Gtag = (...args: unknown[]) => void;

/** Tiempo máximo que se espera a que gtag confirme antes de seguir de todos modos. */
const CALLBACK_TIMEOUT_MS = 800;

/**
 * Dispara una conversión de Google Ads.
 *
 * @param sendTo Etiqueta completa de la acción: `AW-XXXXXXXXX/abcDEF...`.
 * @param url    Destino al que navegar una vez enviada la conversión. Omitir si
 *               el enlace abre en pestaña nueva o si no navega (`tel:`): el
 *               navegador sigue solo y no hay nada que retener.
 */
export function reportConversion(sendTo: string, url?: string): void {
  const navigate = () => {
    if (url) window.location.href = url;
  };

  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== 'function') {
    navigate();
    return;
  }

  let done = false;
  const once = () => {
    if (done) return;
    done = true;
    navigate();
  };

  gtag('event', 'conversion', { send_to: sendTo, event_callback: once });

  // Red de seguridad: si gtag no responde, el visitante no queda trabado.
  setTimeout(once, CALLBACK_TIMEOUT_MS);
}

interface ContactConversions {
  /** Etiqueta para los enlaces a `api.whatsapp.com`. Vacía: no se mide. */
  whatsapp: string;
  /** Etiqueta para los enlaces `tel:`. Vacía: no se mide. */
  phone: string;
}

/**
 * Engancha un único listener de clic en el documento que reporta la conversión
 * de cada enlace a WhatsApp o teléfono.
 *
 * Delegado a propósito: cualquier CTA a `api.whatsapp.com` que se sume a la
 * landing queda medido sin acordarse de cablearlo. Los enlaces a `#consultar`
 * y la apertura de WhatsApp desde el submit del formulario no son enlaces a
 * WhatsApp, así que no entran.
 */
export function trackContactClicks({ whatsapp, phone }: ContactConversions): void {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[href]');
    if (!link) return;

    const href = link.getAttribute('href') ?? '';

    if (phone && href.startsWith('tel:')) {
      // `tel:` no navega la página: no hay URL que pasar ni default que frenar.
      reportConversion(phone);
      return;
    }

    if (whatsapp && /^https:\/\/api\.whatsapp\.com\//.test(href)) {
      // En pestaña nueva, o con clic modificado (Ctrl/Cmd/Shift/botón medio), la
      // página actual sigue viva y alcanza con disparar la conversión. Solo si
      // el enlace reemplaza la página hay que retener la navegación hasta que
      // gtag confirme, o el cambio de página cancelaría el request.
      const staysOnPage =
        link.target === '_blank' ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.button !== 0;

      if (staysOnPage) {
        reportConversion(whatsapp);
      } else {
        event.preventDefault();
        reportConversion(whatsapp, link.href);
      }
    }
  });
}
