import {
  GLYPH,
  GLYPH_FRAME_WIDTH,
  GLYPH_PUPIL_DISTANCE,
} from "../ui/glyph-geometry";
import { POPULATION_PD_MM } from "../recommendations/weights";
import { frameFrontWidthMm, type FrameProfile } from "../catalog/types";
import type { FacePlacement } from "./landmarks";

/**
 * Coloca el dibujo de una montura sobre una cara, a escala.
 *
 * **Qué es y qué no es.** No es el try-on de CLAUDE.md §8.7 y no cierra
 * ningún gate de B1: no hay foto de producto, no hay render fotorrealista y
 * no se parece a llevar esas gafas puestas. Es un **esquema a escala** que
 * responde a una sola pregunta, que resulta ser la mitad de la duda real:
 * *¿esta montura es demasiado ancha o demasiado estrecha para mi cara?*
 *
 * Y es honesto por construcción: un dibujo de línea no se confunde con una
 * foto, así que no puede inducir a pensar que un producto se ve como no se ve
 * — que es justo lo que prohíbe RULE #1 (D-002).
 *
 * Corre entero en el navegador, con la foto que ya está ahí. Coste cero,
 * proveedor ninguno, problema de licencia ninguno.
 */

export interface FrameOverlay {
  /** Centro del SVG, en fracción de la imagen 0..1. */
  centerXPct: number;
  centerYPct: number;
  /** Ancho al que renderizar el SVG, en fracción del ancho de la imagen. */
  widthPct: number;
  /** Alto resultante, derivado del aspecto del viewBox. */
  heightPct: number;
  rotationDeg: number;
  /**
   * `true` si la escala usa la anchura real de la montura. `false` si la
   * fuente no da medidas y hemos tenido que alinear lentes con pupilas, que
   * coloca bien pero **no distingue una montura ancha de una estrecha**.
   */
  scaledFromFrameWidth: boolean;
}

/**
 * La escala absoluta depende de la DIP media de población, no de una medición
 * de esta persona. El error típico entre individuos ronda el ±8 %, así que
 * esto sirve para comparar monturas entre sí, no para afirmar milímetros.
 */
export const OVERLAY_IS_ESTIMATED = true;

export function computeFrameOverlay(
  frame: FrameProfile,
  placement: FacePlacement,
): FrameOverlay {
  // Anchura del frontal: el total si está publicado, y si no, la aritmética
  // sobre lente y puente, que sí publican todos.
  const totalWidthMm = frameFrontWidthMm(frame);

  // Anchura de la montura en píxeles de esta foto.
  //
  //   anchoCaraMm ≈ DIP_media · anchoCaraPx / interpupilarPx
  //   anchoMonturaPx = anchoMonturaMm · anchoCaraPx / anchoCaraMm
  //
  // El ancho de la cara se cancela y queda esto, que además no depende de
  // haber estimado bien el contorno facial:
  const frameWidthPx =
    totalWidthMm !== null
      ? (totalWidthMm * placement.interocularPx) / POPULATION_PD_MM
      : // Sin medidas, se alinean los centros de lente con las pupilas. Queda
        // en su sitio, pero todas las monturas salen del mismo tamaño.
        (placement.interocularPx * GLYPH_FRAME_WIDTH) / GLYPH_PUPIL_DISTANCE;

  // El dibujo no llena el viewBox: hay margen a los lados. Para que la montura
  // mida lo que debe, el SVG se renderiza proporcionalmente más ancho.
  const svgWidthPx = (frameWidthPx * GLYPH.viewBoxWidth) / GLYPH_FRAME_WIDTH;
  const svgHeightPx =
    (svgWidthPx * GLYPH.viewBoxHeight) / GLYPH.viewBoxWidth;

  return {
    centerXPct: placement.eyeCenter.x,
    centerYPct: placement.eyeCenter.y,
    widthPct: svgWidthPx / placement.image.width,
    heightPct: svgHeightPx / placement.image.height,
    rotationDeg: placement.tiltDeg,
    scaledFromFrameWidth: totalWidthMm !== null,
  };
}

/**
 * Lectura de ajuste por anchura, para acompañar al esquema con palabras.
 *
 * Deliberadamente cualitativa: la escala es estimada, así que decir «te sobran
 * 6 mm por lado» sería inventar una precisión que no tenemos → CLAUDE.md §9.4.
 */
export type WidthFit = "narrow" | "good" | "wide" | "unknown";

export function assessWidthFit(
  frame: FrameProfile,
  placement: FacePlacement,
): WidthFit {
  const frontWidthMm = frameFrontWidthMm(frame);
  if (frontWidthMm === null) return "unknown";

  const frameWidthPx =
    (frontWidthMm * placement.interocularPx) / POPULATION_PD_MM;
  const ratio = frameWidthPx / placement.faceWidthPx;

  // Umbrales calibrados sobre **anchura de frontal**, no total: el frontal
  // excluye el vuelo de las bisagras, así que queda unos milímetros por
  // debajo. Son hipótesis de producto, como los pesos del scoring.
  //
  // Asimétricos a propósito: quedarse estrecho molesta más que sobrar.
  if (ratio < 0.88) return "narrow";
  if (ratio > 1.04) return "wide";
  return "good";
}

export const WIDTH_FIT_LABEL: Record<WidthFit, string | null> = {
  narrow: "Puede quedarte estrecha",
  good: "Anchura equilibrada",
  wide: "Puede quedarte ancha",
  unknown: null,
};
