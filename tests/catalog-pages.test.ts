import { describe, expect, it } from "vitest";
import { brandsWithFrames, countByShape } from "../lib/catalog";
import type { FrameShape } from "../lib/catalog/types";
import { CATALOG_COPY } from "../lib/content/catalog-copy";
import {
  SHAPE_COPY,
  SHAPE_META,
  SHAPE_PAGE_NAME,
} from "../lib/content/shape-copy";
import {
  SECTION_SLUGS,
  SHAPE_SLUGS,
  brandPath,
  sectionFromSlug,
  sectionSlug,
  shapeFromSlug,
  shapePath,
  shapeSlug,
} from "../lib/content/sections";
import { LOCALES, type Locale } from "../lib/i18n";

/**
 * Lo que mantiene honestas a las páginas de catálogo.
 *
 * Son muchas —nueve formas y catorce marcas en cinco idiomas— y ese es
 * justo el escenario en el que las cosas se tuercen sin que nadie lo vea:
 * una traducción que se queda en español, dos slugs que colisionan y hacen
 * desaparecer una página, o nueve textos que acaban siendo el mismo con el
 * nombre cambiado, que es lo que Google llama contenido escalado.
 */

const SHAPES = (Object.keys(SHAPE_SLUGS) as FrameShape[]).filter(
  (shape) => (countByShape()[shape] ?? 0) > 0,
);

describe("slugs", () => {
  it("no colisionan dentro de un idioma", () => {
    // Las dos secciones comparten la ruta `[section]/[item]`, así que una
    // colisión haría que una de las dos páginas dejara de existir.
    for (const locale of LOCALES) {
      const slugs = [
        SECTION_SLUGS.sunglasses[locale],
        SECTION_SLUGS.brands[locale],
      ];
      expect(new Set(slugs).size, locale).toBe(slugs.length);

      const shapeSlugs = SHAPES.map((shape) => shapeSlug(shape, locale));
      const brandSlugs = brandsWithFrames().map((brand) => brand.slug);
      expect(new Set(shapeSlugs).size, `${locale} formas`).toBe(
        shapeSlugs.length,
      );
      expect(new Set(brandSlugs).size, `${locale} marcas`).toBe(
        brandSlugs.length,
      );
    }
  });

  it("son seguros en una URL", () => {
    for (const locale of LOCALES) {
      const all = [
        SECTION_SLUGS.sunglasses[locale],
        SECTION_SLUGS.brands[locale],
        ...SHAPES.map((shape) => shapeSlug(shape, locale)),
      ];
      for (const slug of all) {
        expect(slug, `${locale}: ${slug}`).toMatch(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        );
      }
    }
  });

  it("ida y vuelta: de slug se vuelve a la misma forma y sección", () => {
    for (const locale of LOCALES) {
      for (const shape of SHAPES) {
        expect(shapeFromSlug(shapeSlug(shape, locale), locale)).toBe(shape);
      }
      expect(
        sectionFromSlug(sectionSlug("sunglasses", locale), locale),
      ).toBe("sunglasses");
      expect(sectionFromSlug(sectionSlug("brands", locale), locale)).toBe(
        "brands",
      );
      expect(sectionFromSlug("no-existe", locale)).toBeNull();
    }
  });

  it("las rutas construidas llevan la sección de su idioma", () => {
    for (const locale of LOCALES) {
      expect(shapePath("aviator", locale)).toContain(
        sectionSlug("sunglasses", locale),
      );
      expect(brandPath("ray-ban", locale)).toContain(
        sectionSlug("brands", locale),
      );
    }
  });

  it("el alemán usa el término que se busca allí, no la traducción literal", () => {
    // Si alguien «corrige» esto a una traducción literal, la página deja de
    // competir por la búsqueda real.
    expect(shapeSlug("aviator", "de")).toBe("pilotenbrillen");
    expect(shapeSlug("cat-eye", "de")).toBe("schmetterlingsbrillen");
  });
});

describe("textos", () => {
  it("cada forma tiene texto propio en los cinco idiomas", () => {
    for (const locale of LOCALES) {
      for (const shape of SHAPES) {
        const copy = SHAPE_COPY[locale][shape];
        expect(copy?.intro?.trim(), `${locale}.${shape}.intro`).toBeTruthy();
        expect(
          copy?.choosing?.trim(),
          `${locale}.${shape}.choosing`,
        ).toBeTruthy();
        expect(
          SHAPE_PAGE_NAME[locale][shape]?.trim(),
          `${locale}.${shape}.name`,
        ).toBeTruthy();
      }
    }
  });

  it("ninguna forma repite el texto de otra: no son la misma plantilla", () => {
    for (const locale of LOCALES) {
      const intros = SHAPES.map((shape) => SHAPE_COPY[locale][shape].intro);
      expect(new Set(intros).size, `${locale} intros`).toBe(intros.length);

      const choosing = SHAPES.map(
        (shape) => SHAPE_COPY[locale][shape].choosing,
      );
      expect(new Set(choosing).size, `${locale} choosing`).toBe(
        choosing.length,
      );
    }
  });

  it("ningún idioma se quedó con el texto español", () => {
    for (const locale of LOCALES) {
      if (locale === "es") continue;
      for (const shape of SHAPES) {
        expect(
          SHAPE_COPY[locale][shape].intro,
          `${locale}.${shape}`,
        ).not.toBe(SHAPE_COPY.es[shape].intro);
      }
    }
  });

  it("el texto de forma no afirma medidas: eso va en las guías con su fuente", () => {
    // Un número aquí sería un dato sin fuente citable en la propia página.
    for (const locale of LOCALES) {
      for (const shape of SHAPES) {
        const { intro } = SHAPE_COPY[locale][shape];
        expect(intro, `${locale}.${shape}`).not.toMatch(/\d+\s*mm/);
      }
    }
  });

  it("las plantillas de metadatos tienen el hueco del nombre", () => {
    for (const locale of LOCALES) {
      expect(SHAPE_META[locale].title, locale).toContain("{shape}");
      expect(SHAPE_META[locale].description, locale).toContain("{shape}");
    }
  });

  it("los textos de catálogo están completos en los cinco idiomas", () => {
    const leaves = (value: unknown): string[] =>
      typeof value === "string"
        ? [value]
        : value && typeof value === "object"
          ? Object.values(value).flatMap(leaves)
          : [];

    const reference = leaves(CATALOG_COPY.es).length;
    for (const locale of LOCALES) {
      const texts = leaves(CATALOG_COPY[locale as Locale]);
      expect(texts.length, locale).toBe(reference);
      for (const text of texts) expect(text.trim(), locale).not.toBe("");
    }
  });

  it("toda marca con monturas tiene su página alcanzable", () => {
    for (const brand of brandsWithFrames()) {
      expect(brand.slug.trim()).not.toBe("");
      expect(brandPath(brand.slug, "es")).toContain(brand.slug);
    }
  });
});
