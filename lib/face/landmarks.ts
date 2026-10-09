import type { FaceMeasurements } from "./types";

/**
 * Landmarks de MediaPipe → `FaceMeasurements`.
 *
 * Función pura: recibe los puntos y el tamaño de la imagen, devuelve ratios.
 * No carga modelos, no toca el DOM y no sabe de React, así que se puede testear
 * con geometrías construidas a mano — que es justo lo que no se puede hacer con
 * la red neuronal detrás.
 *
 * **Detalle que es fácil equivocar:** MediaPipe devuelve coordenadas
 * normalizadas 0..1 *por eje*, no isotrópicas. En una foto 3:4 un `x` de 0,1 y
 * un `y` de 0,1 no miden lo mismo. Hay que multiplicar por ancho y alto antes
 * de medir cualquier distancia, o todas las proporciones salen sesgadas por el
 * formato de la foto.
 */

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Índices de la malla canónica de 478 puntos de MediaPipe.
 * Los 10 últimos (468–477) son los iris y solo existen con `refineLandmarks`.
 */
export const LM = {
  foreheadTop: 10,
  chin: 152,
  noseTip: 1,
  /** Extremos del óvalo facial, aproximadamente a la altura de los pómulos. */
  faceLeft: 234,
  faceRight: 454,
  jawLeft: 172,
  jawRight: 397,
  foreheadLeft: 103,
  foreheadRight: 332,
  /** Centros de iris = pupilas. Dan distancia interpupilar real. */
  irisLeft: 468,
  irisRight: 473,
  // Párpados y comisuras, para medir apertura ocular.
  leftEyeOuter: 33,
  leftEyeInner: 133,
  leftLidUpper: 159,
  leftLidLower: 145,
  rightEyeInner: 362,
  rightEyeOuter: 263,
  rightLidUpper: 386,
  rightLidLower: 374,
} as const;

/** Nº de landmarks que necesitamos. Sin iris no hay distancia interpupilar. */
export const REQUIRED_LANDMARKS = 478;

interface Point {
  x: number;
  y: number;
}

function toPixels(
  landmarks: Landmark[],
  index: number,
  image: ImageSize,
): Point {
  const lm = landmarks[index]!;
  return { x: lm.x * image.width, y: lm.y * image.height };
}

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Distancia perpendicular de un punto a la recta que pasa por `a` y `b`. */
function distanceToLine(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len === 0) return 0;
  return Math.abs(dy * (p.x - a.x) - dx * (p.y - a.y)) / len;
}

/**
 * Simetría aproximada 0..1 respecto al eje frente–mentón.
 *
 * Compara, para tres pares de puntos homólogos, cuánto se aleja cada lado del
 * eje. Un rostro perfectamente simétrico da 1. Sirve sobre todo como señal de
 * que la cabeza está girada: un giro produce asimetría en proyección.
 */
function estimateSymmetry(
  landmarks: Landmark[],
  image: ImageSize,
): number {
  const axisTop = toPixels(landmarks, LM.foreheadTop, image);
  const axisBottom = toPixels(landmarks, LM.chin, image);

  const pairs: Array<[number, number]> = [
    [LM.faceLeft, LM.faceRight],
    [LM.jawLeft, LM.jawRight],
    [LM.foreheadLeft, LM.foreheadRight],
  ];

  const deviations = pairs.map(([leftIndex, rightIndex]) => {
    const left = distanceToLine(
      toPixels(landmarks, leftIndex, image),
      axisTop,
      axisBottom,
    );
    const right = distanceToLine(
      toPixels(landmarks, rightIndex, image),
      axisTop,
      axisBottom,
    );
    const total = left + right;
    if (total === 0) return 0;
    return Math.abs(left - right) / total;
  });

  const mean = deviations.reduce((a, b) => a + b, 0) / deviations.length;
  return Math.min(1, Math.max(0, 1 - 2 * mean));
}

/** Apertura de un ojo: hueco entre párpados relativo al ancho del ojo. */
export function eyeOpenness(
  landmarks: Landmark[],
  image: ImageSize,
  side: "left" | "right",
): number {
  const [outer, inner, upper, lower] =
    side === "left"
      ? [LM.leftEyeOuter, LM.leftEyeInner, LM.leftLidUpper, LM.leftLidLower]
      : [LM.rightEyeOuter, LM.rightEyeInner, LM.rightLidUpper, LM.rightLidLower];

  const width = distance(
    toPixels(landmarks, outer, image),
    toPixels(landmarks, inner, image),
  );
  if (width === 0) return 0;

  const gap = distance(
    toPixels(landmarks, upper, image),
    toPixels(landmarks, lower, image),
  );
  return gap / width;
}

/**
 * Proxy de giro de cabeza (yaw) 0..1.
 *
 * Compara la distancia horizontal de la punta de la nariz a cada borde del
 * rostro. De frente son parecidas; girada, una se come a la otra. 0 = de
 * frente, 1 = completamente de perfil.
 *
 * Es una aproximación proyectiva, no un ángulo. No se expone como grados
 * precisamente para no dar a entender una precisión que no tiene.
 */
export function estimateYaw(landmarks: Landmark[], image: ImageSize): number {
  const nose = toPixels(landmarks, LM.noseTip, image);
  const left = toPixels(landmarks, LM.faceLeft, image);
  const right = toPixels(landmarks, LM.faceRight, image);

  const toLeft = Math.abs(nose.x - left.x);
  const toRight = Math.abs(nose.x - right.x);
  const total = toLeft + toRight;
  if (total === 0) return 1;

  return Math.min(1, Math.abs(toLeft - toRight) / total);
}

/**
 * Extrae las medidas. `null` si faltan landmarks.
 *
 * `faceWidth` es el **máximo** de las tres anchuras (frente, pómulos,
 * mandíbula), cada una medida a su propia altura. Así los tres ratios son
 * comparables entre sí y uno de ellos vale 1 — y *cuál* vale 1 ya informa de
 * qué tercio del rostro es el más ancho, que es el eje que separa un rostro de
 * corazón de uno de diamante.
 */
export function extractMeasurements(
  landmarks: Landmark[],
  image: ImageSize,
): FaceMeasurements | null {
  if (landmarks.length < REQUIRED_LANDMARKS) return null;
  if (image.width <= 0 || image.height <= 0) return null;

  const faceHeight = distance(
    toPixels(landmarks, LM.foreheadTop, image),
    toPixels(landmarks, LM.chin, image),
  );
  const foreheadWidth = distance(
    toPixels(landmarks, LM.foreheadLeft, image),
    toPixels(landmarks, LM.foreheadRight, image),
  );
  const cheekboneWidth = distance(
    toPixels(landmarks, LM.faceLeft, image),
    toPixels(landmarks, LM.faceRight, image),
  );
  const jawWidth = distance(
    toPixels(landmarks, LM.jawLeft, image),
    toPixels(landmarks, LM.jawRight, image),
  );
  const interocular = distance(
    toPixels(landmarks, LM.irisLeft, image),
    toPixels(landmarks, LM.irisRight, image),
  );

  const faceWidth = Math.max(foreheadWidth, cheekboneWidth, jawWidth);
  if (faceWidth === 0 || faceHeight === 0) return null;

  const irisLeft = toPixels(landmarks, LM.irisLeft, image);
  const irisRight = toPixels(landmarks, LM.irisRight, image);
  const headTiltDeg =
    (Math.atan2(irisRight.y - irisLeft.y, irisRight.x - irisLeft.x) * 180) /
    Math.PI;

  return {
    widthHeightRatio: faceWidth / faceHeight,
    jawWidthRatio: jawWidth / faceWidth,
    cheekboneWidthRatio: cheekboneWidth / faceWidth,
    foreheadWidthRatio: foreheadWidth / faceWidth,
    eyeDistanceRatio: interocular / faceWidth,
    headTiltDeg,
    symmetry: estimateSymmetry(landmarks, image),
  };
}

/** Fracción del ancho de la imagen que ocupa el rostro. */
export function faceCoverage(
  landmarks: Landmark[],
  image: ImageSize,
): number {
  if (landmarks.length < REQUIRED_LANDMARKS || image.width <= 0) return 0;
  const width = distance(
    toPixels(landmarks, LM.faceLeft, image),
    toPixels(landmarks, LM.faceRight, image),
  );
  return width / image.width;
}
