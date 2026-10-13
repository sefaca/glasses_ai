import type { Metadata } from "next";
import { absoluteUrl } from "../site";
import {
  LOCALES,
  LOCALE_HREFLANG,
  X_DEFAULT_LOCALE,
  localePath,
  type Locale,
} from "./index";

/**
 * Anotaciones `canonical` + `hreflang` de una página, para todos los idiomas.
 *
 * Las tres reglas de Google que más se incumplen, y que esto cumple por
 * construcción:
 *
 * 1. **Recíprocas.** Cada versión enumera a todas, la suya incluida. Si una
 *    página A apunta a B y B no apunta a A, Google ignora la anotación entera.
 * 2. **Absolutas.** Relativas no valen.
 * 3. **Solo páginas que existen y son indexables.** Nunca se apunta a una
 *    `noindex`, porque es una señal contradictoria.
 *
 * Se pasa la ruta **sin prefijo de idioma** (`/`, `/probar`), y aquí se
 * construyen las cinco.
 */
export function localizedMetadata(
  locale: Locale,
  path: string,
  meta: { title: string; description?: string },
): Metadata {
  const languages: Record<string, string> = {};
  for (const candidate of LOCALES) {
    languages[LOCALE_HREFLANG[candidate]] = absoluteUrl(
      localePath(candidate, path),
    );
  }
  languages["x-default"] = absoluteUrl(localePath(X_DEFAULT_LOCALE, path));

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: absoluteUrl(localePath(locale, path)),
      languages,
    },
  };
}
