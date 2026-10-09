import { LM, REQUIRED_LANDMARKS, type ImageSize, type Landmark } from "../../lib/face/landmarks";

/**
 * Constructor de mallas faciales sintéticas para los tests.
 *
 * Permite comprobar la extracción de medidas y el quality check con geometrías
 * **conocidas**, sin depender de la red neuronal ni de fotos reales. Si un test
 * dice «un rostro de 400 px de ancho y 500 de alto da un ratio de 0,8», aquí
 * se construye exactamente eso.
 *
 * Solo se posicionan los índices que la extracción usa; el resto se rellena en
 * el centro, porque nada los lee.
 */

export interface SyntheticFaceOptions {
  image?: ImageSize;
  /** Anchura a la altura de los pómulos, en píxeles. */
  cheekboneWidthPx?: number;
  foreheadWidthPx?: number;
  jawWidthPx?: number;
  /** Altura frente–mentón, en píxeles. */
  faceHeightPx?: number;
  /** Distancia interpupilar, en píxeles. */
  interocularPx?: number;
  /** Inclinación de la línea entre pupilas, en grados. */
  tiltDeg?: number;
  /** Desplazamiento horizontal de la nariz respecto al centro: simula giro. */
  noseOffsetPx?: number;
  /** Apertura ocular objetivo (hueco entre párpados / ancho del ojo). */
  eyeOpenness?: number;
  /** Desplazamiento lateral de un par de puntos: simula asimetría. */
  asymmetryPx?: number;
}

const DEFAULTS = {
  image: { width: 1000, height: 1250 },
  cheekboneWidthPx: 400,
  foreheadWidthPx: 340,
  jawWidthPx: 320,
  faceHeightPx: 500,
  interocularPx: 180,
  tiltDeg: 0,
  noseOffsetPx: 0,
  eyeOpenness: 0.3,
  asymmetryPx: 0,
} satisfies Required<SyntheticFaceOptions>;

export function buildSyntheticFace(
  options: SyntheticFaceOptions = {},
): { landmarks: Landmark[]; image: ImageSize } {
  const o = { ...DEFAULTS, ...options };
  const { width, height } = o.image;
  const cx = width / 2;
  const cy = height / 2;

  // Toda la geometría se define en píxeles y se normaliza al final, porque es
  // así como la lee `extractMeasurements`: multiplica por ancho y alto.
  const landmarks: Landmark[] = Array.from({ length: REQUIRED_LANDMARKS }, () => ({
    x: 0.5,
    y: 0.5,
    z: 0,
  }));

  const put = (index: number, px: number, py: number) => {
    landmarks[index] = { x: px / width, y: py / height, z: 0 };
  };

  put(LM.foreheadTop, cx, cy - o.faceHeightPx / 2);
  put(LM.chin, cx, cy + o.faceHeightPx / 2);
  put(LM.noseTip, cx + o.noseOffsetPx, cy);

  // Pómulos: el par que puede desplazarse para simular asimetría.
  put(LM.faceLeft, cx - o.cheekboneWidthPx / 2 + o.asymmetryPx, cy);
  put(LM.faceRight, cx + o.cheekboneWidthPx / 2 + o.asymmetryPx, cy);

  const jawY = cy + o.faceHeightPx * 0.3;
  put(LM.jawLeft, cx - o.jawWidthPx / 2, jawY);
  put(LM.jawRight, cx + o.jawWidthPx / 2, jawY);

  const foreheadY = cy - o.faceHeightPx * 0.3;
  put(LM.foreheadLeft, cx - o.foreheadWidthPx / 2, foreheadY);
  put(LM.foreheadRight, cx + o.foreheadWidthPx / 2, foreheadY);

  // Pupilas: rotar la línea que las une produce exactamente `tiltDeg`.
  const eyeY = cy - o.faceHeightPx * 0.1;
  const half = o.interocularPx / 2;
  const t = (o.tiltDeg * Math.PI) / 180;
  put(LM.irisLeft, cx - half * Math.cos(t), eyeY - half * Math.sin(t));
  put(LM.irisRight, cx + half * Math.cos(t), eyeY + half * Math.sin(t));

  // Ojos: ancho fijo y hueco de párpados derivado de la apertura pedida.
  const eyeWidth = 60;
  const lidGap = o.eyeOpenness * eyeWidth;
  const leftEyeCx = cx - half;
  const rightEyeCx = cx + half;

  put(LM.leftEyeOuter, leftEyeCx - eyeWidth / 2, eyeY);
  put(LM.leftEyeInner, leftEyeCx + eyeWidth / 2, eyeY);
  put(LM.leftLidUpper, leftEyeCx, eyeY - lidGap / 2);
  put(LM.leftLidLower, leftEyeCx, eyeY + lidGap / 2);

  put(LM.rightEyeInner, rightEyeCx - eyeWidth / 2, eyeY);
  put(LM.rightEyeOuter, rightEyeCx + eyeWidth / 2, eyeY);
  put(LM.rightLidUpper, rightEyeCx, eyeY - lidGap / 2);
  put(LM.rightLidLower, rightEyeCx, eyeY + lidGap / 2);

  return { landmarks, image: o.image };
}
