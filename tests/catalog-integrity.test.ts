import { describe, expect, it } from "vitest";
import { BRANDS } from "../lib/catalog/brands";
import { FRAMES } from "../lib/catalog/frames";
import { frameFrontWidthMm } from "../lib/catalog/types";

/**
 * Integridad del catálogo.
 *
 * Esto no prueba lógica: prueba **datos**. Existe porque el catálogo va a
 * crecer de 23 monturas a muchas más, y a partir de cierto tamaño nadie
 * revisa una lista a ojo. Los fallos que pilla son los aburridos y caros:
 * un `id` repetido que hace desaparecer una montura de las recomendaciones,
 * un `brandId` que no existe y rompe la página de marca, una notación
 * copiada en el orden equivocado.
 *
 * Las comprobaciones son **de forma, no de exactitud**. Que una medida sea
 * plausible no significa que sea correcta; eso lo dice `measurementsStatus` y
 * solo lo resuelve verificar la ficha oficial. Lo que esto garantiza es que
 * un dato mal tecleado no entre en silencio.
 */

/**
 * Rangos de cordura, en milímetros, sacados de lo que fabrica la industria.
 * Deliberadamente anchos: sirven para cazar un dedazo —un 5 donde iba 50— no
 * para validar que la medida sea la real.
 */
const SANE = {
  lensWidth: [38, 70],
  lensHeight: [25, 60],
  bridge: [12, 30],
  temple: [110, 160],
} as const;

describe("identidad", () => {
  it("ningún id se repite", () => {
    const ids = FRAMES.map((frame) => frame.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ningún slug se repite: un slug duplicado es una URL que se pisa", () => {
    const slugs = FRAMES.map((frame) => frame.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("los slugs son seguros en una URL", () => {
    for (const frame of FRAMES) {
      expect(frame.slug, frame.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("toda montura apunta a una marca que existe y está activa", () => {
    const active = new Set(BRANDS.filter((b) => b.active).map((b) => b.id));
    for (const frame of FRAMES) {
      expect(active, `${frame.id} → ${frame.brandId}`).toContain(frame.brandId);
    }
  });

  it("el nombre de marca de la montura coincide con el del registro", () => {
    // Si divergen, la ficha dice una marca y la página de marca otra.
    const byId = new Map(BRANDS.map((brand) => [brand.id, brand.name]));
    for (const frame of FRAMES) {
      expect(frame.brand, frame.id).toBe(byId.get(frame.brandId));
    }
  });

  it("las marcas tampoco repiten id ni slug", () => {
    const ids = BRANDS.map((brand) => brand.id);
    const slugs = BRANDS.map((brand) => brand.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("medidas", () => {
  it("las que hay son plausibles", () => {
    for (const frame of FRAMES) {
      const m = frame.measurements;
      const check = (
        value: number | null,
        [min, max]: readonly [number, number],
        field: string,
      ) => {
        if (value === null) return;
        expect(value, `${frame.id}.${field}`).toBeGreaterThanOrEqual(min);
        expect(value, `${frame.id}.${field}`).toBeLessThanOrEqual(max);
      };

      check(m.lensWidthMm, SANE.lensWidth, "lensWidthMm");
      check(m.lensHeightMm, SANE.lensHeight, "lensHeightMm");
      check(m.bridgeMm, SANE.bridge, "bridgeMm");
      check(m.templeMm, SANE.temple, "templeMm");
    }
  });

  it("la lente nunca es más alta que ancha", () => {
    // Una montura circular da 50×50 y es correcto —lo vimos con la Round
    // Metal—, así que iguales se permite. Lo que no existe en este catálogo
    // es una lente más alta que ancha: si aparece, lo más probable es que se
    // hayan intercambiado los dos números al teclear.
    for (const frame of FRAMES) {
      const { lensWidthMm, lensHeightMm } = frame.measurements;
      if (lensWidthMm === null || lensHeightMm === null) continue;
      expect(lensHeightMm, `${frame.id}: alto > ancho`).toBeLessThanOrEqual(
        lensWidthMm,
      );
    }
  });

  it("si hay ancho total, es coherente con 2×lente + puente", () => {
    for (const frame of FRAMES) {
      const { totalWidthMm, lensWidthMm, bridgeMm } = frame.measurements;
      if (totalWidthMm === null || lensWidthMm === null || bridgeMm === null) {
        continue;
      }
      // El total incluye aro y bisagras, así que es mayor que la suma, pero
      // no desmesuradamente: más de 25 mm de diferencia es un error de dato.
      const sum = 2 * lensWidthMm + bridgeMm;
      expect(totalWidthMm, `${frame.id}`).toBeGreaterThanOrEqual(sum - 2);
      expect(totalWidthMm, `${frame.id}`).toBeLessThanOrEqual(sum + 25);
    }
  });

  it("`unknown` significa sin medidas, y `indicative` significa con ellas", () => {
    for (const frame of FRAMES) {
      const width = frameFrontWidthMm(frame);
      if (frame.measurementsStatus === "unknown") {
        expect(width, `${frame.id} dice unknown pero tiene anchura`).toBeNull();
      } else {
        expect(width, `${frame.id} dice ${frame.measurementsStatus}`).not.toBeNull();
      }
    }
  });
});

describe("derechos y disciplina de datos", () => {
  it("ninguna montura declara derechos sobre activos ajenos sin fecha", () => {
    // Un permiso en `cleared` sin fecha de verificación es una afirmación sin
    // respaldo, y es justo la que nos metería en un problema con una marca.
    for (const frame of FRAMES) {
      const r = frame.rights;
      const claims =
        r.displayOfficialImage === "cleared" ||
        r.deriveOfficialImage === "cleared" ||
        r.useLogo === "cleared";
      if (claims) {
        expect(r.verifiedAt, `${frame.id} afirma permisos sin fecha`).not.toBeNull();
        expect(r.source.length, frame.id).toBeGreaterThan(0);
      }
    }
  });

  it("toda montura dice de dónde sale su dato", () => {
    for (const frame of FRAMES) {
      expect(frame.rights.source.trim(), frame.id).not.toBe("");
    }
  });

  it("un precio que no es `verified` no lleva importe tratado como cierto", () => {
    for (const frame of FRAMES) {
      if (frame.priceStatus === "unknown") {
        expect(frame.priceCents, `${frame.id}`).toBeNull();
      }
    }
  });
});
