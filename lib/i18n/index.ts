import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { it } from "./it";
import { pt } from "./pt";
import type { Dictionary } from "./types";

/**
 * Base de i18n â†’ CLAUDE.md Â§21.
 *
 * Cinco idiomas con **rutas localizadas y hreflang**, por decisiÃ³n explÃ­cita
 * del fundador el 2026-10-11 â†’ D-026. La recomendaciÃ³n tÃ©cnica era publicar
 * uno y abrir el resto por un gate medible; queda escrita en el log con su
 * riesgo, y la decisiÃ³n es suya.
 *
 * Todos los idiomas llevan prefijo, el espaÃ±ol incluido. Es mÃ¡s feo que dejar
 * `es` en la raÃ­z, pero evita el caso que rompe el hreflang: una URL sin
 * prefijo que es a la vez Â«la homeÂ» y Â«la home espaÃ±olaÂ».
 */

export const LOCALES = ["es", "en", "it", "pt", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

export type { Dictionary, LegalDoc, LegalSection } from "./types";

const DICTIONARIES: Record<Locale, Dictionary> = { es, en, it, pt, de };

/**
 * Etiqueta de cada idioma **en su propio idioma**: quien busca alemÃ¡n no lee
 * Â«AlemÃ¡nÂ», lee Â«DeutschÂ».
 */
export const LOCALE_NAMES: Record<Locale, string> = {
  es: "EspaÃ±ol",
  en: "English",
  it: "Italiano",
  pt: "PortuguÃªs",
  de: "Deutsch",
};

/**
 * Valor de `hreflang` y de `<html lang>`.
 *
 * Hoy coincide con el cÃ³digo de ruta. Se mantiene como mapa aparte porque en
 * cuanto haya datos para separar `pt-BR` de `pt-PT`, o para aÃ±adir `es-MX`,
 * lo que cambia es esto y no las rutas.
 */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  es: "es",
  en: "en",
  it: "it",
  pt: "pt",
  de: "de",
};

/**
 * Idiomas que **pueden indexarse**. VacÃ­o significa que nada lo estÃ¡.
 *
 * Esta lista es la palanca del gate G0 â†’ docs/GROWTH_SEO.md. Abrir el espaÃ±ol
 * es aÃ±adir `"es"` aquÃ­, y con eso cambian a la vez el `robots` de las
 * pÃ¡ginas, el `hreflang`, el `x-default`, el sitemap y el `robots.txt`.
 *
 * Existe porque hacerlo a mano sitio por sitio produce justo la contradicciÃ³n
 * que Google resuelve como le parece: un `hreflang` que apunta a pÃ¡ginas
 * `noindex`, o un `x-default` hacia una versiÃ³n no indexable. Si solo se abre
 * un idioma, las anotaciones tienen que hablar Ãºnicamente de ese.
 */
export const INDEXABLE_LOCALES: readonly Locale[] = ["es"];

export function isIndexable(locale: Locale): boolean {
  return INDEXABLE_LOCALES.includes(locale);
}

/** `true` si hay algo que indexar en todo el sitio. */
export function anyIndexable(): boolean {
  return INDEXABLE_LOCALES.length > 0;
}

/**
 * Idioma al que apunta `x-default`: la versiÃ³n que se ofrece a quien no
 * encaja en ninguna otra.
 *
 * **Tiene que ser una pÃ¡gina indexable.** Mientras solo haya un idioma
 * abierto, es ese; cuando haya varios, el inglÃ©s por alcance. Apuntar al
 * inglÃ©s estando en `noindex` serÃ­a mandar a Google a una puerta cerrada.
 */
export function xDefaultLocale(): Locale {
  if (INDEXABLE_LOCALES.includes("en")) return "en";
  return INDEXABLE_LOCALES[0] ?? DEFAULT_LOCALE;
}

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Ruta localizada. `localePath("de", "/probar")` â†’ `/de/probar`.
 *
 * Centralizado para que ningÃºn componente construya la URL a mano: un enlace
 * que se deja el prefijo saca al usuario de su idioma sin avisar.
 */
/**
 * Resuelve los marcadores `{nombre}` de una frase del diccionario.
 *
 * Existe porque el diccionario no puede contener funciones: no cruzarÃ­an la
 * frontera servidorâ†’cliente de React y el build falla. Un marcador sin valor
 * se deja tal cual en vez de imprimir `undefined`, que es mÃ¡s fÃ¡cil de ver en
 * una captura que un hueco vacÃ­o.
 */
export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export function localePath(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}
