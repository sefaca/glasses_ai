import { describe, expect, it } from "vitest";
import type { FrameProfile } from "../lib/catalog/types";
import { extractPlacement } from "../lib/face/landmarks";
import { assessWidthFit, WIDTH_FIT_LABEL } from "../lib/face/overlay";
import { POPULATION_PD_MM } from "../lib/recommendations/weights";
import { makeFrame, makeFrameWithoutMeasurements } from "./helpers/frame";
import { buildSyntheticFace } from "./helpers/synthetic-face";

/**
 * Posición de la cara y lectura de ajuste por anchura.
 *
 * Es lo que aporta algo que la imagen generada **no** dice: si la montura es
 * ancha o estrecha *para esta cara*. Gratis e instantáneo, sin pasar por
 * ningún proveedor.
 */

/** Cara sintética: ancho de referencia 400 px, DIP 180 px ⇒ ~140 mm. */
function placementOf(options = {}) {
  const { landmarks, image } = buildSyntheticFace(options);
  return extractPlacement(landmarks, image)!;
}

/** Montura con una anchura de frontal concreta. */
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

describe("posición de la cara en la foto", () => {
  it("sitúa el centro entre pupilas y mide la DIP", () => {
    const p = placementOf();
    expect(p.eyeCenter.x).toBeCloseTo(0.5, 6);
    expect(p.interocularPx).toBeCloseTo(180, 6);
    expect(p.faceWidthPx).toBeCloseTo(400, 6);
  });

  it("recoge la inclinación", () => {
    expect(placementOf({ tiltDeg: 12 }).tiltDeg).toBeCloseTo(12, 4);
  });

  it("conserva el tamaño de la imagen, que la rejilla usa para el aspecto", () => {
    const p = placementOf({ image: { width: 1024, height: 1536 } });
    expect(p.image).toEqual({ width: 1024, height: 1536 });
  });

  it("devuelve null sin iris", () => {
    const { landmarks, image } = buildSyntheticFace();
    expect(extractPlacement(landmarks.slice(0, 468), image)).toBeNull();
  });
});

describe("ajuste por anchura", () => {
  const p = placementOf(); // cara estimada de 140 mm

  it("una montura de la anchura de la cara está equilibrada", () => {
    expect(assessWidthFit(frameOfWidth(140), p)).toBe("good");
  });

  it("detecta estrecha y ancha", () => {
    // Umbrales sobre anchura de frontal: <0,88 y >1,04 de la cara.
    expect(assessWidthFit(frameOfWidth(118), p)).toBe("narrow");
    expect(assessWidthFit(frameOfWidth(152), p)).toBe("wide");
  });

  it("deriva la anchura de lente y puente cuando no hay total publicado", () => {
    // Es el caso normal: las marcas publican 58-14-135, no el ancho total.
    // 2×58 + 14 = 130 mm sobre una cara de 140 ⇒ ratio 0,93, equilibrada.
    const frame = makeFrame({
      measurements: {
        totalWidthMm: null,
        lensWidthMm: 58,
        lensHeightMm: 50,
        bridgeMm: 14,
        templeMm: 135,
      },
    });
    expect(assessWidthFit(frame, p)).toBe("good");
  });

  it("escala con el tamaño de la cara en la foto, no con la foto", () => {
    // La misma montura sobre la misma cara que sale más pequeña en el
    // encuadre debe dar la misma lectura: lo que importa es la proporción.
    //
    // Hay que encoger la cara ENTERA, no solo los pómulos: el ancho de
    // referencia es el máximo de las tres anchuras, así que dejar la frente
    // grande no reduce nada.
    const scale = (k: number) => ({
      cheekboneWidthPx: 400 * k,
      foreheadWidthPx: 340 * k,
      jawWidthPx: 320 * k,
      faceHeightPx: 500 * k,
      interocularPx: 180 * k,
    });

    const frame = frameOfWidth(140);
    expect(assessWidthFit(frame, placementOf(scale(1)))).toBe("good");
    expect(assessWidthFit(frame, placementOf(scale(0.5)))).toBe("good");
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
    // Si el ajuste y el scoring estimasen la cara con escalas distintas,
    // dirían cosas contradictorias sobre la misma montura.
    expect(POPULATION_PD_MM).toBe(63);
  });
});
