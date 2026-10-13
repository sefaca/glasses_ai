import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  INDEXABLE_LOCALES,
  LOCALES,
  anyIndexable,
  isIndexable,
  xDefaultLocale,
} from "../lib/i18n";
import { localizedMetadata } from "../lib/i18n/metadata";

/**
 * Las reglas que hacen que abrir un idioma sea seguro.
 *
 * El fallo que esto previene es silencioso y caro: abrir el español y dejar
 * el `hreflang` apuntando a los otros cuatro, que siguen en `noindex`, o un
 * `x-default` hacia una página cerrada. Google no avisa de eso; simplemente
 * ignora las anotaciones o elige por su cuenta qué versión mostrar.
 *
 * Están escritas para seguir valiendo **después** de abrir idiomas: no
 * comprueban que la lista esté vacía, comprueban las invariantes.
 */

describe("indexabilidad por idioma", () => {
  it("todo idioma indexable es un idioma que existe", () => {
    for (const locale of INDEXABLE_LOCALES) {
      expect(LOCALES).toContain(locale);
    }
  });

  it("`anyIndexable` concuerda con la lista", () => {
    expect(anyIndexable()).toBe(INDEXABLE_LOCALES.length > 0);
  });

  it("`isIndexable` solo dice que sí de los de la lista", () => {
    for (const locale of LOCALES) {
      expect(isIndexable(locale)).toBe(INDEXABLE_LOCALES.includes(locale));
    }
  });

  it("x-default apunta a un idioma abierto, nunca a uno cerrado", () => {
    const target = xDefaultLocale();
    if (anyIndexable()) {
      expect(INDEXABLE_LOCALES).toContain(target);
    } else {
      // Sin nada abierto no se emite hreflang, así que el valor no llega a
      // usarse; aun así devuelve algo coherente en vez de romper.
      expect(target).toBe(DEFAULT_LOCALE);
    }
  });
});

describe("hreflang", () => {
  const meta = localizedMetadata(DEFAULT_LOCALE, "/", { title: "x" });

  it("el canonical siempre existe y es absoluto", () => {
    expect(String(meta.alternates?.canonical)).toMatch(/^https:\/\//);
  });

  it("no se emiten alternativas con menos de dos idiomas abiertos", () => {
    if (INDEXABLE_LOCALES.length < 2) {
      expect(meta.alternates?.languages).toBeUndefined();
    }
  });

  it("si se emiten, solo contienen idiomas abiertos y todas son absolutas", () => {
    const languages = meta.alternates?.languages;
    if (!languages) return;

    const open = new Set<string>(INDEXABLE_LOCALES);
    for (const [key, href] of Object.entries(languages)) {
      if (key !== "x-default") expect(open).toContain(key);
      expect(String(href)).toMatch(/^https:\/\//);
    }
    // Recíproco: el propio idioma tiene que estar entre las alternativas.
    expect(Object.keys(languages)).toContain(DEFAULT_LOCALE);
  });
});
