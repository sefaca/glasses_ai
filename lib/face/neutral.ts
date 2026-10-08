import type { FaceProfile } from "./types";

/**
 * Perfil facial neutro: lo que usamos **antes** de que el usuario suba nada.
 *
 * No es un perfil «medio». Es la ausencia de perfil, declarada de forma que el
 * motor se comporte con honestidad:
 *
 * - `shapePrimary: "unknown"` ⇒ la matriz de compatibilidad devuelve un valor
 *   plano, así que la geometría no inventa preferencias.
 * - `eyeDistanceRatio: 0` ⇒ no se puede estimar la anchura de la cara, el
 *   componente de escala se marca `available: false` y reparte su peso. Sin
 *   cara no hay juicio sobre anchura, y no lo finge.
 * - `confidence: 0` ⇒ `matchLabel()` no devuelve etiqueta, así que ninguna
 *   card presume de «buena combinación» sin haber visto a nadie.
 *
 * El resultado es que la lista previa se ordena solo por estilo y presupuesto,
 * que es exactamente lo único que el usuario nos ha dicho.
 */
export const NEUTRAL_FACE: FaceProfile = {
  shapePrimary: "unknown",
  shapeSecondary: null,
  measurements: {
    widthHeightRatio: 0,
    jawWidthRatio: 0,
    cheekboneWidthRatio: 0,
    foreheadWidthRatio: 0,
    eyeDistanceRatio: 0,
    headTiltDeg: 0,
    symmetry: 0,
  },
  confidence: 0,
};
