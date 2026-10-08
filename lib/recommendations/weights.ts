import type { FaceShape } from "../face/types";
import type { FrameShape } from "../catalog/types";

/**
 * Configuración del scoring. Vive aquí y no repartida por los componentes
 * → CLAUDE.md §9.3 y §29.3.
 *
 * **Estos números son hipótesis de producto, no ciencia.** Nadie los ha
 * validado con comportamiento real. Están centralizados precisamente para
 * poder recalibrarlos cuando haya datos, y hay un test que comprueba que
 * suman 1 para que una recalibración descuidada no pase silenciosamente.
 */

export type ComponentKey =
  | "faceGeometry"
  | "frameScale"
  | "stylePreference"
  | "colorHarmony"
  | "categoryFit";

export type ScoreWeights = Record<ComponentKey, number>;

export const DEFAULT_WEIGHTS: ScoreWeights = {
  faceGeometry: 0.35,
  frameScale: 0.25,
  stylePreference: 0.15,
  colorHarmony: 0.1,
  categoryFit: 0.15,
};

/**
 * Compatibilidad forma de rostro × forma de montura, 0..1.
 *
 * Recoge la orientación clásica del sector — contrastar la forma del rostro,
 * equilibrar las proporciones — y **no está validada empíricamente**. Es la
 * primera candidata a recalibrarse con datos de try-on y de clicks.
 *
 * `unknown` devuelve un valor neutro: cuando no sabemos la forma, no fingimos
 * tener criterio geométrico y dejamos que decidan los demás componentes.
 */
export const SHAPE_COMPATIBILITY: Record<
  FaceShape,
  Record<FrameShape, number>
> = {
  // Proporciones equilibradas: casi todo funciona.
  oval: {
    rectangular: 0.85, square: 0.8, round: 0.8, oval: 0.75, aviator: 0.9,
    "cat-eye": 0.85, wayfarer: 0.9, geometric: 0.8, oversized: 0.75,
  },
  // Rostro ancho y suave: líneas rectas y ángulos lo estructuran.
  round: {
    rectangular: 0.95, square: 0.9, round: 0.35, oval: 0.5, aviator: 0.75,
    "cat-eye": 0.85, wayfarer: 0.9, geometric: 0.85, oversized: 0.7,
  },
  // Mandíbula marcada: curvas para suavizar.
  square: {
    rectangular: 0.45, square: 0.35, round: 0.95, oval: 0.9, aviator: 0.9,
    "cat-eye": 0.8, wayfarer: 0.5, geometric: 0.55, oversized: 0.75,
  },
  // Más alta que ancha: monturas con altura y presencia horizontal.
  oblong: {
    rectangular: 0.6, square: 0.85, round: 0.75, oval: 0.5, aviator: 0.8,
    "cat-eye": 0.6, wayfarer: 0.9, geometric: 0.7, oversized: 0.95,
  },
  // Frente ancha y mentón estrecho: peso visual abajo, nada pesado arriba.
  heart: {
    rectangular: 0.7, square: 0.6, round: 0.85, oval: 0.9, aviator: 0.95,
    "cat-eye": 0.6, wayfarer: 0.65, geometric: 0.6, oversized: 0.5,
  },
  // Pómulos como punto más ancho: suavizar arriba, abrir el tercio superior.
  diamond: {
    rectangular: 0.6, square: 0.55, round: 0.85, oval: 0.9, aviator: 0.8,
    "cat-eye": 0.95, wayfarer: 0.7, geometric: 0.65, oversized: 0.7,
  },
  // Sin forma estimada: neutro, y que decidan los demás componentes.
  unknown: {
    rectangular: 0.6, square: 0.6, round: 0.6, oval: 0.6, aviator: 0.6,
    "cat-eye": 0.6, wayfarer: 0.6, geometric: 0.6, oversized: 0.6,
  },
};

/**
 * Distancia interpupilar media de población adulta, en mm.
 *
 * Se usa **solo** para estimar una escala aproximada de la cara y poder
 * comparar el ancho de la montura. Es una media, no una medición: cualquier
 * resultado que dependa de ella se marca `estimated` y **nunca se expresa
 * como una medida concreta al usuario** → CLAUDE.md §9.4.
 */
export const POPULATION_PD_MM = 63;

/** Cuánto puede exceder el precio al presupuesto antes de descartar. */
export const BUDGET_TOLERANCE = 1.15;
