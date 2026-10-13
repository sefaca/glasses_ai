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
 * Idioma al que apunta `x-default`: la versión que se ofrece a quien no
 * encaja en ninguna otra. Inglés, por ser el alcance más amplio.
 */
export const X_DEFAULT_LOCALE: Locale = "en";

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
