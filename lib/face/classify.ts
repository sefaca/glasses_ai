import type { FaceMeasurements, FaceProfile, FaceShape } from "./types";

/**
 * Clasificación de forma facial por pertenencia difusa a perfiles de referencia.
 *
 * Por qué así y no con una cascada de `if`: una cascada devuelve una etiqueta
 * dura y no sabe decir «está entre dos». Aquí cada forma puntúa, se ordena, y
 * si la segunda queda cerca se expone como `shapeSecondary`. Eso es lo que
 * permite el lenguaje que exige CLAUDE.md §8.5 — «parece encajar con X, con
 * algunas características de Y» — en lugar de «tu cara es X».
 *
 * Los centroides son **hipótesis de producto**, no antropometría validada. Están
 * aquí para poder recalibrarlos con datos reales → CLAUDE.md §9.3.
 */

/** Rasgos que distinguen una forma de otra, con su tolerancia. */
interface ShapeCentroid {
  widthHeightRatio: [value: number, tolerance: number];
  jawWidthRatio: [value: number, tolerance: number];
  foreheadWidthRatio: [value: number, tolerance: number];
  cheekboneWidthRatio: [value: number, tolerance: number];
}

export const SHAPE_CENTROIDS: Record<
  Exclude<FaceShape, "unknown">,
  ShapeCentroid
> = {
  // Equilibrada y algo más alta que ancha. Es el perfil «comodín».
  oval: {
    widthHeightRatio: [0.78, 0.07],
    jawWidthRatio: [0.8, 0.1],
    foreheadWidthRatio: [0.82, 0.1],
    cheekboneWidthRatio: [0.97, 0.05],
  },
  // Ancha, mandíbula suave y poco marcada.
  round: {
    widthHeightRatio: [0.95, 0.09],
    jawWidthRatio: [0.86, 0.09],
    foreheadWidthRatio: [0.84, 0.1],
    cheekboneWidthRatio: [0.98, 0.05],
  },
  // Lados casi paralelos: frente y mandíbula tan anchas como los pómulos.
  square: {
    widthHeightRatio: [0.9, 0.09],
    jawWidthRatio: [0.95, 0.07],
    foreheadWidthRatio: [0.93, 0.07],
    cheekboneWidthRatio: [0.96, 0.06],
  },
  // Claramente más alta que ancha.
  oblong: {
    widthHeightRatio: [0.68, 0.07],
    jawWidthRatio: [0.84, 0.11],
    foreheadWidthRatio: [0.86, 0.11],
    cheekboneWidthRatio: [0.95, 0.07],
  },
  // Frente ancha, mentón estrecho.
  heart: {
    widthHeightRatio: [0.8, 0.09],
    jawWidthRatio: [0.68, 0.08],
    foreheadWidthRatio: [0.95, 0.07],
    cheekboneWidthRatio: [0.95, 0.06],
  },
  // Pómulos como punto más ancho, frente y mandíbula estrechas.
  diamond: {
    widthHeightRatio: [0.79, 0.09],
    jawWidthRatio: [0.72, 0.08],
    foreheadWidthRatio: [0.75, 0.08],
    cheekboneWidthRatio: [1.0, 0.04],
  },
};

/** Umbrales de interpretación del resultado. Configurables a propósito. */
export const CLASSIFY_THRESHOLDS = {
  /** Por debajo de esto no se afirma ninguna forma: `unknown`. */
  minPrimaryScore: 0.45,
  /** Si la 2ª queda a menos de esta distancia de la 1ª, se expone como secundaria. */
  secondaryWithin: 0.12,
} as const;

/**
 * Pertenencia 0..1 de un valor a `[centro, tolerancia]`.
 * Decae de forma suave: 1 en el centro, ~0.37 a una tolerancia, →0 más lejos.
 */
function membership(value: number, [center, tolerance]: [number, number]): number {
  const z = (value - center) / tolerance;
  return Math.exp(-(z * z));
}

function scoreShape(m: FaceMeasurements, c: ShapeCentroid): number {
  const parts = [
    membership(m.widthHeightRatio, c.widthHeightRatio),
    membership(m.jawWidthRatio, c.jawWidthRatio),
    membership(m.foreheadWidthRatio, c.foreheadWidthRatio),
    membership(m.cheekboneWidthRatio, c.cheekboneWidthRatio),
  ];
  return parts.reduce((a, b) => a + b, 0) / parts.length;
}

/** Puntuación de cada forma, de mayor a menor. Útil para depurar y calibrar. */
export function scoreAllShapes(
  m: FaceMeasurements,
): Array<{ shape: Exclude<FaceShape, "unknown">; score: number }> {
  return (
    Object.entries(SHAPE_CENTROIDS) as Array<
      [Exclude<FaceShape, "unknown">, ShapeCentroid]
    >
  )
    .map(([shape, centroid]) => ({ shape, score: scoreShape(m, centroid) }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Penaliza la confianza cuando el input no da para afirmar mucho: cabeza girada
 * o cara asimétrica. Preferimos decir «no estamos seguros» a inventar precisión.
 */
function inputQuality(m: FaceMeasurements): number {
  const tilt = Math.min(Math.abs(m.headTiltDeg) / 25, 1);
  const tiltPenalty = 1 - 0.5 * tilt;
  const symmetryPenalty = 0.6 + 0.4 * clamp01(m.symmetry);
  return clamp01(tiltPenalty * symmetryPenalty);
}

export function classifyFace(m: FaceMeasurements): FaceProfile {
  const ranked = scoreAllShapes(m);
  const [best, second] = ranked;

  if (!best || best.score < CLASSIFY_THRESHOLDS.minPrimaryScore) {
    return {
      shapePrimary: "unknown",
      shapeSecondary: null,
      measurements: m,
      confidence: 0,
    };
  }

  const hasSecondary =
    second !== undefined &&
    best.score - second.score < CLASSIFY_THRESHOLDS.secondaryWithin;

  // Una segunda forma pisándole los talones es, en sí misma, menos certeza.
  const separation = hasSecondary && second ? best.score - second.score : 1;
  const distinctness = clamp01(
    separation / CLASSIFY_THRESHOLDS.secondaryWithin,
  );

  return {
    shapePrimary: best.shape,
    shapeSecondary: hasSecondary && second ? second.shape : null,
    measurements: m,
    confidence: round3(
      clamp01(best.score) * inputQuality(m) * (0.7 + 0.3 * distinctness),
    ),
  };
}

export function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}
