import { site } from '@/config/site';

/**
 * Arma un link de WhatsApp con el mensaje ya escrito.
 *
 * Usa api.whatsapp.com/send en vez de wa.me: wa.me depende de una redirección
 * que en algunos escritorios cae en una interstitial, mientras que este
 * endpoint abre WhatsApp Web / la app directamente en ambos.
 *
 * `number` permite dirigir la consulta a la línea de una compañía puntual;
 * omitirlo usa la línea general del sitio. Para resolver cuál corresponde en
 * cada página, usar `contactFor()` de `src/lib/contact.ts`.
 */
export function buildWhatsAppLink(message: string, number: string = site.whatsappNumber): string {
  const params = new URLSearchParams({
    phone: number,
    text: message,
  });
  return `https://api.whatsapp.com/send?${params.toString()}`;
}

/** Mensaje del botón flotante y de los CTA generales, sin compañía ni plan. */
export function genericEnquiryMessage(): string {
  return `¡Hola! Quiero recibir asesoramiento para elegir una cobertura médica.`;
}

/** Mensaje de los CTA de una página de compañía, antes de elegir un plan. */
export function companyEnquiryMessage(companyName: string): string {
  return `¡Hola! Quiero asesoramiento sobre los planes de ${companyName}.`;
}

/** Mensaje al tocar "Consultar" desde un plan puntual, antes de completar el formulario. */
export function planEnquiryMessage(planName: string, companyName: string): string {
  return `¡Hola! Me interesa el ${planName} de ${companyName}. ¿Me pueden pasar más información?`;
}
