import { site, identity } from '@/config/site';

/* Solo los perfiles con URL cargada. Un `sameAs` con la portada de instagram.com
   le declara a Google que ese perfil genérico es nuestro. */
const sameAs = Object.values(site.social).filter(Boolean);

/*
 * JSON-LD de la organización.
 *
 * Tipo `ProfessionalService` y no `Organization` a secas: describe qué hace el
 * sitio (asesorar), que es lo que Google pide explicitar. Y `legalName` ahora
 * lleva el nombre del titular real — antes llevaba el dominio, con lo cual los
 * datos estructurados declaraban que la razón social de la empresa era
 * "planesprepagas.com.ar".
 *
 * `identifier` publica el CUIT/CUIL: es el dato que permite cruzar el sitio con
 * un registro público y, por lo tanto, verificar la identidad del anunciante.
 * `disambiguatingDescription` dice en una línea lo que NO somos, que es lo que
 * un revisor necesita para no confundir el sitio con el de una prepaga.
 */
export function buildOrganizationSchema(siteUrl: URL | undefined) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}#organization`,
    name: site.name,
    ...(identity.legalName && { legalName: identity.legalName }),
    ...(identity.taxId && {
      taxID: identity.taxId,
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'CUIT',
        value: identity.taxId,
      },
    }),
    description: site.description,
    disambiguatingDescription:
      'Asesor independiente en medicina prepaga. No es una empresa de medicina prepaga ni forma parte de las compañías cuyos planes informa.',
    url: siteUrl?.href,
    telephone: site.phones.sales.label,
    email: site.email,
    ...(identity.location && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.legalAddress.street,
        addressLocality: site.legalAddress.locality,
        addressRegion: site.legalAddress.region,
        addressCountry: 'AR',
      },
    }),
    // `areaServed` cubre la zona de cobertura: la atención es a distancia, el
    // domicilio es el del titular y no un local de atención al público.
    areaServed: { '@type': 'Country', name: site.areaServed },
    knowsAbout: ['Medicina prepaga', 'Cobertura médica', 'Planes de salud'],
    ...(sameAs.length > 0 && { sameAs }),
  };
}
