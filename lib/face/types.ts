/**
 * Perfil facial. Geometría orientativa para elegir monturas — nunca identidad.
 *
 * Todas las medidas son **ratios adimensionales** normalizados al ancho máximo
 * de la cara. No hay milímetros: sin referencia de escala conocida no se puede
 * medir en absoluto, y fingir que sí es lo que CLAUDE.md §8.5 prohíbe.
 *
 * Se calcula en el navegador y es lo único que viaja al servidor. Decisión de
 * arquitectura, no conclusión jurídica → CLAUDE.md §14 PRIVACY RULE.
 */

/** Clasificación orientativa. `unknown` es un resultado legítimo, no un error. */
export type FaceShape =
  | "oval"
  | "round"
  | "square"
  | "oblong"
  | "heart"
  | "diamond"
  | "unknown";

/** Medidas crudas derivadas de los landmarks, ya normalizadas. */
export interface FaceMeasurements {
  /** anchoMáximo / altura. <0.75 alargada · >0.95 ancha */
  widthHeightRatio: number;
  /** anchoMandíbula / anchoMáximo */
  jawWidthRatio: number;
  /** anchoPómulos / anchoMáximo */
  cheekboneWidthRatio: number;
  /** anchoFrente / anchoMáximo */
  foreheadWidthRatio: number;
  /** distanciaInterocular / anchoMáximo */
  eyeDistanceRatio: number;
  /** Inclinación de la cabeza en grados. Negativo = hacia la izquierda. */
  headTiltDeg: number;
  /** Simetría aproximada 0..1. 1 = perfectamente simétrica. */
  symmetry: number;
}

export interface FaceProfile {
  shapePrimary: FaceShape;
  /** Segunda forma cuando la primera no domina con claridad. */
  shapeSecondary: FaceShape | null;
  measurements: FaceMeasurements;
  /** 0..1. Baja confianza ⇒ la UI debe moderar el lenguaje. */
  confidence: number;
}

/** Lo que el usuario declara. Nunca se infiere de la cara → CLAUDE.md §9.1. */
export interface UserPreferences {
  category: "sunglasses" | "optical";
  /** Vacío = «no lo sé, recomiéndame». No es un error. */
  styles: string[];
  /** Límite superior en céntimos de euro. `null` = sin límite declarado. */
  budgetMaxCents: number | null;
}

export const EMPTY_PREFERENCES: UserPreferences = {
  category: "sunglasses",
  styles: [],
  budgetMaxCents: null,
};
