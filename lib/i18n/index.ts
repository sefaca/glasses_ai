import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { it } from "./it";
import { pt } from "./pt";
import type { Dictionary } from "./types";

/**
 * Base de i18n → CLAUDE.md §21.
 *
 * Cinco idiomas con **rutas localizadas y hreflang**, por decisión explícita
 * del fundador el 2026-10-11 → D-026. La recomendación técnica era publicar
 * uno y abrir el resto por un gate medible; queda escrita en el log con su
 * riesgo, y la decisión es suya.
 *
 * Todos los idiomas llevan prefijo, el español incluido. Es más feo que dejar
 * `es` en la raíz, pero evita el caso que rompe el hreflang: una URL sin
 * prefijo que es a la vez «la home» y «la home española».
 */

export const LOCALES = ["es", "en", "it", "pt", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

export type { Dictionary, LegalDoc, LegalSection } from "./types";

const DICTIONARIES: Record<Locale, Dictionary> = { es, en, it, pt, de };

/**
 * Etiqueta de cada idioma **en su propio idioma**: quien busca alemán no lee
 * «Alemán», lee «Deutsch».
 */
export const LOCALE_NAMES: Record<Locale, string> = {
  es: "Español",
  en: "English",
  it: "Italiano",
  pt: "Português",
  de: "Deutsch",
};

/**
 * Valor de `hreflang` y de `<html lang>`.
 *
 * Hoy coincide con el código de ruta. Se mantiene como mapa aparte porque en
 * cuanto haya datos para separar `pt-BR` de `pt-PT`, o para añadir `es-MX`,
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
 * Idiomas que **pueden indexarse**. Vacío significa que nada lo está.
 *
 * Esta lista es la palanca del gate G0 → docs/GROWTH_SEO.md. Abrir un idioma
 * es añadirlo aquí, y con eso cambian a la vez el `robots` de las páginas, el
 * `hreflang`, el `x-default`, el sitemap y el `robots.txt`.
 *
 * Existe porque hacerlo a mano sitio por sitio produce justo la contradicción
 * que Google resuelve como le parece: un `hreflang` que apunta a páginas
 * `noindex`, o un `x-default` hacia una versión no indexable. Si solo se abre
 * un idioma, las anotaciones tienen que hablar únicamente de ese.
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
 * Idioma al que apunta `x-default`: la versión que se ofrece a quien no
 * encaja en ninguna otra.
 *
 * **Tiene que ser una página indexable.** Mientras solo haya un idioma
 * abierto, es ese; cuando haya varios, el inglés por alcance. Apuntar al
 * inglés estando en `noindex` sería mandar a Google a una puerta cerrada.
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
 * Ruta localizada. `localePath("de", "/probar")` → `/de/probar`.
 *
 * Centralizado para que ningún componente construya la URL a mano: un enlace
 * que se deja el prefijo saca al usuario de su idioma sin avisar.
 */
/**
 * Resuelve los marcadores `{nombre}` de una frase del diccionario.
 *
 * Existe porque el diccionario no puede contener funciones: no cruzarían la
 * frontera servidor→cliente de React y el build falla. Un marcador sin valor
 * se deja tal cual en vez de imprimir `undefined`, que es más fácil de ver en
 * una captura que un hueco vacío.
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
