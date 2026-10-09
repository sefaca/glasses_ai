import { describe, expect, it } from "vitest";
import { DEV_FRAMES } from "../lib/catalog/seed";
import type { FrameProfile } from "../lib/catalog/types";
import { extractPlacement } from "../lib/face/landmarks";
import {
  assessWidthFit,
  computeFrameOverlay,
  WIDTH_FIT_LABEL,
} from "../lib/face/overlay";
import { POPULATION_PD_MM } from "../lib/recommendations/weights";
import {
  GLYPH,
  GLYPH_FRAME_WIDTH,
  GLYPH_PUPIL_DISTANCE,
} from "../lib/ui/glyph-geometry";
import { buildSyntheticFace } from "./helpers/synthetic-face";

/**
 * Superposición a escala de la montura sobre la cara.
 *
 * No es el try-on de §8.7: es un esquema que responde a «¿es demasiado ancha
 * para mi cara?». Lo que se comprueba aquí es que la escala sea correcta, que
 * es lo único que hace útil al esquema.
 */

/** Cara sintética cuyo ancho de referencia son 400 px y la DIP 180 px. */
function placementOf(options = {}) {
  const { landmarks, image } = buildSyntheticFace(options);
  return extractPlacement(landmarks, image)!;
}

const sinMedidas = (frame: FrameProfile): FrameProfile => ({
  ...frame,
  measurements: {
    totalWidthMm: null,
    lensWidthMm: null,
    lensHeightMm: null,
    bridgeMm: null,
    templeMm: null,
  },
});

describe("extracción de la posición de la cara", () => {
  it("sitúa el centro entre pupilas y mide la DIP", () => {
    const p = placementOf();
    expect(p.eyeCenter.x).toBeCloseTo(0.5, 6);
    expect(p.interocularPx).toBeCloseTo(180, 6);
    expect(p.faceWidthPx).toBeCloseTo(400, 6);
  });

  it("recoge la inclinación", () => {
    expect(placementOf({ tiltDeg: 12 }).tiltDeg).toBeCloseTo(12, 4);
  });

  it("devuelve null sin iris", () => {
    const { landmarks, image } = buildSyntheticFace();
    expect(extractPlacement(landmarks.slice(0, 468), image)).toBeNull();
  });
});

describe("escala de la superposición", () => {
  it("una montura de la anchura de la cara ocupa la anchura de la cara", () => {
    // Con DIP 180 px y DIP media de 63 mm, la cara estimada mide
    // 63 · 400/180 = 140 mm. Una montura de 140 mm debe cubrir los 400 px.
    const p = placementOf();
    const frame: FrameProfile = {
      ...DEV_FRAMES[0]!,
      measurements: { ...DEV_FRAMES[0]!.measurements, totalWidthMm: 140 },
    };

    const overlay = computeFrameOverlay(frame, p);
    // widthPct es el ancho del SVG, que incluye el margen del viewBox.
    const svgWidthPx = overlay.widthPct * p.image.width;
    const frameWidthPx = (svgWidthPx * GLYPH_FRAME_WIDTH) / GLYPH.viewBoxWidth;

    expect(frameWidthPx).toBeCloseTo(400, 4);
    expect(overlay.scaledFromFrameWidth).toBe(true);
  });

  it("una montura más ancha se dibuja más ancha", () => {
    const p = placementOf();
    const base = DEV_FRAMES[0]!;
    const estrecha = {
      ...base,
      measurements: { ...base.measurements, totalWidthMm: 130 },
    };
    const ancha = {
      ...base,
      measurements: { ...base.measurements, totalWidthMm: 155 },
    };

    expect(computeFrameOverlay(ancha, p).widthPct).toBeGreaterThan(
      computeFrameOverlay(estrecha, p).widthPct,
    );
  });

  it("la escala es proporcional al tamaño de la cara en la foto", () => {
    // La misma montura sobre una cara que sale al doble de grande debe
    // dibujarse al doble. Si no, el esquema miente sobre la proporción.
    const cerca = placementOf({ cheekboneWidthPx: 400, interocularPx: 180 });
    const lejos = placementOf({ cheekboneWidthPx: 200, interocularPx: 90 });
    const frame = DEV_FRAMES[0]!;

    const a = computeFrameOverlay(frame, cerca).widthPct;
    const b = computeFrameOverlay(frame, lejos).widthPct;
    expect(a / b).toBeCloseTo(2, 4);
  });

  it("sin medidas, alinea lentes con pupilas y lo declara", () => {
    const p = placementOf();
    const overlay = computeFrameOverlay(sinMedidas(DEV_FRAMES[0]!), p);

    expect(overlay.scaledFromFrameWidth).toBe(false);

    // El SVG debe quedar tal que la separación entre centros de lente coincida
    // con la distancia interpupilar real.
    const svgWidthPx = overlay.widthPct * p.image.width;
    const pupilSpanPx = (svgWidthPx * GLYPH_PUPIL_DISTANCE) / GLYPH.viewBoxWidth;
    expect(pupilSpanPx).toBeCloseTo(p.interocularPx, 4);
  });

  it("hereda la inclinación de la cabeza", () => {
    const p = placementOf({ tiltDeg: -9 });
    expect(computeFrameOverlay(DEV_FRAMES[0]!, p).rotationDeg).toBeCloseTo(-9, 4);
  });

  it("mantiene el aspecto del viewBox", () => {
    const p = placementOf();
    const overlay = computeFrameOverlay(DEV_FRAMES[0]!, p);
    const widthPx = overlay.widthPct * p.image.width;
    const heightPx = overlay.heightPct * p.image.height;
    expect(widthPx / heightPx).toBeCloseTo(
      GLYPH.viewBoxWidth / GLYPH.viewBoxHeight,
      6,
    );
  });
});

describe("lectura de ajuste por anchura", () => {
  const p = placementOf(); // cara estimada de 140 mm

  function frameOf(totalWidthMm: number | null): FrameProfile {
    return {
      ...DEV_FRAMES[0]!,
      measurements: { ...DEV_FRAMES[0]!.measurements, totalWidthMm },
    };
  }

  it("una montura de la anchura de la cara está equilibrada", () => {
    expect(assessWidthFit(frameOf(140), p)).toBe("good");
  });

  it("detecta estrecha y ancha", () => {
    expect(assessWidthFit(frameOf(120), p)).toBe("narrow");
    expect(assessWidthFit(frameOf(165), p)).toBe("wide");
  });

  it("sin medidas no se pronuncia, y no hay etiqueta que mostrar", () => {
    expect(assessWidthFit(sinMedidas(DEV_FRAMES[0]!), p)).toBe("unknown");
    expect(WIDTH_FIT_LABEL.unknown).toBeNull();
  });

  it("la etiqueta nunca afirma milímetros", () => {
    // La escala viene de una media de población, no de medir a esta persona.
    for (const label of Object.values(WIDTH_FIT_LABEL)) {
      if (label) expect(label).not.toMatch(/\d/);
    }
  });

  it("la DIP media usada es la misma que la del scoring", () => {
    // Si el overlay y el scoring estimasen la cara con escalas distintas,
    // dirían cosas contradictorias sobre la misma montura.
    expect(POPULATION_PD_MM).toBe(63);
  });
});
