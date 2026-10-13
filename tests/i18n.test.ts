import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  format,
  LOCALES,
  LOCALE_HREFLANG,
  LOCALE_NAMES,
  X_DEFAULT_LOCALE,
  getDictionary,
  isLocale,
  localePath,
} from "../lib/i18n";

/**
 * Lo que esto protege no es la gramática: es que **ningún idioma se quede a
 * medias**.
 *
 * El defecto que medimos en VisuTry —`/es/` con el H1 en inglés— no se ve en
 * una revisión rápida y es exactamente lo que pasa cuando se añade una clave
 * y se traduce en dos de cinco idiomas. El tipo `Dictionary` ya obliga a que
 * la clave exista; esto comprueba además que **no esté vacía** y que no se
 * haya quedado copiada del español.
 */

/** Recorre el diccionario y devuelve cada hoja de texto con su ruta. */
function leaves(value: unknown, path = ""): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => leaves(item, `${path}[${i}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      leaves(child, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

describe("locales", () => {
  it("son los cinco acordados y el por defecto está entre ellos", () => {
    expect([...LOCALES]).toEqual(["es", "en", "it", "pt", "de"]);
    expect(LOCALES).toContain(DEFAULT_LOCALE);
    expect(LOCALES).toContain(X_DEFAULT_LOCALE);
  });

  it("cada uno tiene hreflang y un nombre en su propia lengua", () => {
    for (const locale of LOCALES) {
      expect(LOCALE_HREFLANG[locale]).toBeTruthy();
      expect(LOCALE_NAMES[locale]).toBeTruthy();
    }
  });

  it("isLocale rechaza lo que no es un idioma nuestro", () => {
    expect(isLocale("es")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
    // Un segmento de ruta cualquiera no puede colarse como idioma.
    expect(isLocale("probar")).toBe(false);
  });

  it("localePath siempre antepone el idioma, también en la raíz", () => {
    expect(localePath("de")).toBe("/de");
    expect(localePath("de", "/")).toBe("/de");
    expect(localePath("de", "/probar")).toBe("/de/probar");
    // Tolera que le pasen la ruta sin barra inicial.
    expect(localePath("de", "probar")).toBe("/de/probar");
  });
});

describe("format", () => {
  it("sustituye los marcadores por sus valores", () => {
    expect(format("{a} de {b}", { a: 2, b: 4 })).toBe("2 de 4");
  });

  it("deja el marcador a la vista si falta el valor", () => {
    // Un hueco vacío o un «undefined» en pantalla cuesta más de diagnosticar
    // que ver el nombre del marcador sin resolver.
    expect(format("Quitar {model}", {})).toBe("Quitar {model}");
  });
});

describe("diccionarios", () => {
  const reference = leaves(getDictionary(DEFAULT_LOCALE)).map(([key]) => key);

  it("todos tienen exactamente las mismas claves", () => {
    for (const locale of LOCALES) {
      const keys = leaves(getDictionary(locale)).map(([key]) => key);
      expect(keys.sort()).toEqual([...reference].sort());
    }
  });

  it("ningún texto está vacío en ningún idioma", () => {
    for (const locale of LOCALES) {
      for (const [key, text] of leaves(getDictionary(locale))) {
        expect(text.trim(), `${locale} · ${key}`).not.toBe("");
      }
    }
  });

  it("no quedan textos largos sin traducir, copiados del español", () => {
    const spanish = new Map(leaves(getDictionary("es")));

    for (const locale of LOCALES) {
      if (locale === "es") continue;
      for (const [key, text] of leaves(getDictionary(locale))) {
        // Solo frases de cinco palabras o más. Por debajo de eso hay
        // coincidencias legítimas que no son un olvido: nombres propios y
        // términos del sector («Wayfarer», «RB3016», «Oversized»), y frases
        // que de verdad se escriben igual en dos idiomas — «JPG, PNG o WEBP»
        // es correcto tanto en español como en italiano.
        if (text.trim().split(/\s+/).length < 5) continue;
        expect(text, `${locale} · ${key}`).not.toBe(spanish.get(key));
      }
    }
  });
});
