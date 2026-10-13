import type { Metadata } from "next";
import { absoluteUrl } from "../site";
import {
  INDEXABLE_LOCALES,
  LOCALE_HREFLANG,
  localePath,
  xDefaultLocale,
  type Locale,
} from "./index";

/**
 * Anotaciones `canonical` + `hreflang` de una página.
 *
 * Las tres reglas de Google que más se incumplen, y que esto cumple por
 * construcción:
 *
 * 1. **Recíprocas.** Cada versión enumera a todas, la suya incluida. Si una
 *    página A apunta a B y B no apunta a A, Google ignora la anotación entera.
 * 2. **Absolutas.** Relativas no valen.
 * 3. **Solo páginas indexables.** Nunca se apunta a una `noindex`, porque es
 *    una señal contradictoria. Por eso las alternativas salen de
 *    `INDEXABLE_LOCALES` y no de la lista de idiomas que existen: hoy la web
 *    está en cinco y ninguno es indexable, así que **no se emite hreflang en
 *    absoluto**, que es lo correcto.
 *
 * Con un solo idioma abierto tampoco se emite: un `hreflang` con una sola
 * entrada no dice nada, y el `x-default` apuntaría a la propia página.
 *
 * Se pasa la ruta **sin prefijo de idioma** (`/`, `/probar`), y aquí se
 * construyen las que correspondan.
 */
export function localizedMetadata(
  locale: Locale,
  path: string,
  meta: { title: string; description?: string },
): Metadata {
  const alternates: NonNullable<Metadata["alternates"]> = {
    canonical: absoluteUrl(localePath(locale, path)),
  };

  if (INDEXABLE_LOCALES.length > 1) {
    const languages: Record<string, string> = {};
    for (const candidate of INDEXABLE_LOCALES) {
      languages[LOCALE_HREFLANG[candidate]] = absoluteUrl(
        localePath(candidate, path),
      );
    }
    languages["x-default"] = absoluteUrl(
      localePath(xDefaultLocale(), path),
    );
    alternates.languages = languages;
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates,
  };
}
