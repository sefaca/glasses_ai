import { describe, expect, it } from "vitest";
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
import { makeFrame, makeFrameWithoutMeasurements } from "./helpers/frame";
import { buildSyntheticFace } from "./helpers/synthetic-face";

/**
 * Superposición a escala de la montura sobre la cara.
 *
 * No es el try-on de §8.7: es un esquema que responde a «¿es demasiado ancha
 * para mi cara?». Lo que se comprueba es la escala, que es lo único que hace
 * útil al esquema.
 */

/** Cara sintética: ancho de referencia 400 px, DIP 180 px ⇒ ~140 mm. */
function placementOf(options = {}) {
  const { landmarks, image } = buildSyntheticFace(options);
  return extractPlacement(landmarks, image)!;
}

/** Montura con una anchura de frontal concreta, vía lente y puente. */
function frameOfWidth(frontWidthMm: number | null): FrameProfile {
  if (frontWidthMm === null) return makeFrameWithoutMeasurements();
  return makeFrame({
    measurements: {
      totalWidthMm: frontWidthMm,
      lensWidthMm: null,
      lensHeightMm: null,
      bridgeMm: null,
      templeMm: null,
    },
  });
}

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
    const overlay = computeFrameOverlay(frameOfWidth(140), p);

    const svgWidthPx = overlay.widthPct * p.image.width;
    const frameWidthPx = (svgWidthPx * GLYPH_FRAME_WIDTH) / GLYPH.viewBoxWidth;

    expect(frameWidthPx).toBeCloseTo(400, 4);
    expect(overlay.scaledFromFrameWidth).toBe(true);
  });

  it("deriva la anchura de lente y puente cuando no hay total publicado", () => {
    // Es el caso normal: las marcas publican 58-14-135, no el ancho total.
    const p = placementOf();
    const frame = makeFrame({
      measurements: {
        totalWidthMm: null,
        lensWidthMm: 58,
        lensHeightMm: 50,
        bridgeMm: 14,
        templeMm: 135,
      },
    });

    const svgWidthPx = computeFrameOverlay(frame, p).widthPct * p.image.width;
    const frameWidthPx = (svgWidthPx * GLYPH_FRAME_WIDTH) / GLYPH.viewBoxWidth;
    const esperado = ((2 * 58 + 14) * p.interocularPx) / POPULATION_PD_MM;

    expect(frameWidthPx).toBeCloseTo(esperado, 4);
  });

  it("una montura más ancha se dibuja más ancha", () => {
    const p = placementOf();
    expect(computeFrameOverlay(frameOfWidth(155), p).widthPct).toBeGreaterThan(
      computeFrameOverlay(frameOfWidth(130), p).widthPct,
    );
  });

  it("la escala es proporcional al tamaño de la cara en la foto", () => {
    // La misma montura sobre una cara que sale al doble de grande debe
    // dibujarse al doble. Si no, el esquema miente sobre la proporción.
    const cerca = placementOf({ cheekboneWidthPx: 400, interocularPx: 180 });
    const lejos = placementOf({ cheekboneWidthPx: 200, interocularPx: 90 });
    const frame = frameOfWidth(140);

    const a = computeFrameOverlay(frame, cerca).widthPct;
    const b = computeFrameOverlay(frame, lejos).widthPct;
    expect(a / b).toBeCloseTo(2, 4);
  });

  it("sin medidas, alinea lentes con pupilas y lo declara", () => {
    const p = placementOf();
    const overlay = computeFrameOverlay(makeFrameWithoutMeasurements(), p);

    expect(overlay.scaledFromFrameWidth).toBe(false);

    const svgWidthPx = overlay.widthPct * p.image.width;
    const pupilSpanPx = (svgWidthPx * GLYPH_PUPIL_DISTANCE) / GLYPH.viewBoxWidth;
    expect(pupilSpanPx).toBeCloseTo(p.interocularPx, 4);
  });

  it("hereda la inclinación de la cabeza", () => {
    const p = placementOf({ tiltDeg: -9 });
    expect(computeFrameOverlay(frameOfWidth(140), p).rotationDeg).toBeCloseTo(
      -9,
      4,
    );
  });

  it("mantiene el aspecto del viewBox", () => {
    const p = placementOf();
    const overlay = computeFrameOverlay(frameOfWidth(140), p);
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

  it("una montura de la anchura de la cara está equilibrada", () => {
    expect(assessWidthFit(frameOfWidth(140), p)).toBe("good");
  });

  it("detecta estrecha y ancha", () => {
    // Umbrales sobre anchura de frontal: <0,88 y >1,04 de la cara.
    expect(assessWidthFit(frameOfWidth(118), p)).toBe("narrow");
    expect(assessWidthFit(frameOfWidth(152), p)).toBe("wide");
  });

  it("sin medidas no se pronuncia, y no hay etiqueta que mostrar", () => {
    expect(assessWidthFit(makeFrameWithoutMeasurements(), p)).toBe("unknown");
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
