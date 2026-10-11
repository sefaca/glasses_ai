import { POPULATION_PD_MM } from "../recommendations/weights";
import { frameFrontWidthMm, type FrameProfile } from "../catalog/types";
import type { FacePlacement } from "./landmarks";

/**
 * Lectura de ajuste por anchura.
 *
 * Aquí vivía también `computeFrameOverlay`, que colocaba un esquema de la
 * montura sobre la foto a escala. Se retiró al conectar el proveedor
 * generativo: al elegir una montura se genera la imagen real directamente, y
 * un dibujo intermedio que después se sustituye solo añadía ruido. El
 * historial de git lo tiene si vuelve a hacer falta.
 *
 * Lo que sí sobrevive es esto, porque sigue aportando algo que la imagen
 * generada **no** dice: si la montura es ancha o estrecha *para esta cara*.
 * Y es gratis e instantáneo.
 */

export type WidthFit = "narrow" | "good" | "wide" | "unknown";

/**
 * Deliberadamente cualitativa: la escala sale de la distancia interpupilar
 * media de población (63 mm), no de medir a esta persona —el error entre
 * individuos ronda el ±8 %—, así que decir «te sobran 6 mm por lado» sería
 * inventar una precisión que no tenemos → CLAUDE.md §9.4.
 */
export function assessWidthFit(
  frame: FrameProfile,
  placement: FacePlacement,
): WidthFit {
  const frontWidthMm = frameFrontWidthMm(frame);
  if (frontWidthMm === null) return "unknown";

  // anchoMonturaPx = anchoMm · interpupilarPx / DIP_media
  // El ancho de la cara se cancela en la derivación, así que esto no depende
  // de haber estimado bien el contorno facial, solo de la distancia entre
  // pupilas, que es el dato más fiable que tenemos.
  const frameWidthPx =
    (frontWidthMm * placement.interocularPx) / POPULATION_PD_MM;
  const ratio = frameWidthPx / placement.faceWidthPx;

  // Umbrales sobre **anchura de frontal**, no total: el frontal excluye el
  // vuelo de las bisagras. Son hipótesis de producto, como los pesos del
  // scoring. Asimétricos a propósito: quedarse estrecho molesta más que
  // sobrar.
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
