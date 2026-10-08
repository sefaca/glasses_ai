import { es } from "./es";
import { en } from "./en";
import type { Dictionary } from "./types";

/**
 * Base de i18n → CLAUDE.md §21.
 *
 * Los textos viven fuera de los componentes desde el primer día porque
 * retrofitarlo después es caro y el producto tiene que poder ir a LATAM y a
 * inglés. Lo que **no** se hace todavía es rutas localizadas ni hreflang: eso
 * entra cuando el funnel esté validado, no antes.
 */

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

export type { Dictionary } from "./types";

const DICTIONARIES: Record<Locale, Dictionary> = { es, en };

export function getDictionary(locale: Locale = DEFAULT_LOCALE): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Precio en céntimos → texto localizado. `null` cuando no hay precio verificado. */
export function formatPrice(
  cents: number | null,
  locale: Locale = DEFAULT_LOCALE,
): string | null {
  if (cents === null) return null;
  return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
