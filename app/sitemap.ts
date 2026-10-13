import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import {
  LOCALES,
  LOCALE_HREFLANG,
  X_DEFAULT_LOCALE,
  localePath,
} from "@/lib/i18n";

/**
 * Sitemap de las páginas indexables, con sus alternativas por idioma.
 *
 * **Solo entra lo que es indexable.** Hoy el sitio entero está en `noindex`,
 * así que este sitemap existe para que la fontanería esté montada y se pueda
 * verificar, no para enviarlo a Search Console: anunciar URLs que dicen
 * `noindex` es mandar una señal contradictoria. Se envía en el gate G0
 * → docs/GROWTH_SEO.md §4.
 *
 * `/probar` no está, y es a propósito: su contenido lo pinta el cliente y no
 * hay nada que indexar.
 */

/** Rutas sin prefijo de idioma. Cada una se emite en los cinco. */
const PATHS = [
  { path: "/", priority: 1 },
  { path: "/legal/privacy", priority: 0.3 },
  { path: "/legal/terms", priority: 0.3 },
  { path: "/legal/cookies", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap(({ path, priority }) => {
    const languages: Record<string, string> = {};
    for (const locale of LOCALES) {
      languages[LOCALE_HREFLANG[locale]] = absoluteUrl(
        localePath(locale, path),
      );
    }
    languages["x-default"] = absoluteUrl(localePath(X_DEFAULT_LOCALE, path));

    return LOCALES.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      priority,
      alternates: { languages },
    }));
  });
}
