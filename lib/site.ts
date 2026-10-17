/**
 * Datos del sitio que dependen del despliegue, no del contenido.
 *
 * `SITE_URL` tiene que ser absoluta y sin barra final: `metadataBase`, los
 * `hreflang` y el sitemap la usan para construir URLs canónicas, y Google
 * ignora las anotaciones hreflang relativas.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lookfit.app"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Dirección de contacto pública.
 *
 * Vive aquí y no en los diccionarios porque es la misma en los cinco
 * idiomas y aparece en documentos legales: tenerla en un solo sitio evita
 * que una traducción se quede con una dirección vieja que ya nadie lee.
 */
export const SUPPORT_EMAIL = "infolookfit@gmail.com";
