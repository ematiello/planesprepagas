/**
 * Seguimiento de campañas en el cliente, para las landings de `/lp/[slug]`.
 *
 * Resuelve dos cosas que el sitio estático no puede resolver solo:
 *
 * 1. **De qué campaña vino el lead.** Como el lead se entrega por WhatsApp y no
 *    por un backend, el dato de origen se pierde salvo que viaje dentro del
 *    mensaje. Acá se lee de la URL, se persiste y se adjunta al texto.
 * 2. **Avisarle a Meta y a Google que hubo conversión.** Sin ese evento, las
 *    plataformas ven clics pero no resultados y no pueden optimizar la entrega.
 */

/** Parámetros que nos interesan. `gclid`/`fbclid` los agrega la plataforma sola. */
const TRACKED_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
] as const;

const STORAGE_KEY = 'campaign';

export type Campaign = Partial<Record<(typeof TRACKED_PARAMS)[number], string>>;

/**
 * Lee los parámetros de la URL y los persiste.
 *
 * Persiste en `sessionStorage` porque el visitante puede navegar dentro de la
 * landing (o volver desde WhatsApp) y la URL pierde los parámetros; sin esto,
 * un lead que no convierte en el primer scroll queda sin origen. Se usa
 * `sessionStorage` y no `localStorage` a propósito: el dato muere con la
 * pestaña en vez de atribuirle a esta campaña una visita de la semana que viene.
 */
export function captureCampaign(): Campaign {
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Campaign = {};

  for (const key of TRACKED_PARAMS) {
    const value = params.get(key);
    if (value) fromUrl[key] = value;
  }

  try {
    if (Object.keys(fromUrl).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Campaign) : {};
  } catch {
    // Modo incógnito o storage bloqueado: seguimos con lo que traiga la URL.
    return fromUrl;
  }
}

/**
 * Línea compacta de origen para el mensaje de WhatsApp, o cadena vacía si el
 * visitante no vino de una campaña (tráfico directo u orgánico).
 */
export function campaignSummary(campaign: Campaign): string {
  const source = campaign.utm_source ?? (campaign.gclid ? 'google' : campaign.fbclid ? 'meta' : '');
  if (!source) return '';

  const parts = [source, campaign.utm_medium, campaign.utm_campaign, campaign.utm_content].filter(
    Boolean,
  );
  return `Origen: ${parts.join(' / ')}`;
}

interface TrackLeadOptions {
  company: string;
  plan?: string;
  /** ID de conversión de Google Ads, ya combinado con su etiqueta. */
  googleAdsSendTo?: string;
}

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;

/**
 * Notifica la conversión a las tres plataformas. Cada una se dispara solo si su
 * script está cargado, así que faltar un ID no rompe a las demás.
 */
export function trackLead({ company, plan, googleAdsSendTo }: TrackLeadOptions): void {
  const w = window as unknown as { gtag?: Gtag; fbq?: Fbq };

  w.fbq?.('track', 'Lead', { content_name: plan ?? company, content_category: company });

  if (googleAdsSendTo) {
    w.gtag?.('event', 'conversion', { send_to: googleAdsSendTo });
  }

  w.gtag?.('event', 'generate_lead', {
    method: 'whatsapp',
    source: 'landing',
    company,
    plan,
  });
}
