import {
  REQUIRED_LANDMARKS,
  estimateYaw,
  eyeOpenness,
  faceCoverage,
  type ImageSize,
  type Landmark,
} from "./landmarks";

/**
 * Quality check previo al análisis — CLAUDE.md §8.4.
 *
 * Objetivo doble: no analizar una foto inservible, y **no enviar nunca una
 * imagen claramente mala a un proveedor caro**. Todo esto corre en el
 * navegador, antes de que la foto salga del dispositivo.
 *
 * Diseño del mensaje: un fallo no es un rechazo, es una instrucción. El
 * usuario tiene que saber **qué hacer diferente**, no qué ha hecho mal.
 */

export type QualityIssue =
  | "no-face"
  | "multiple-faces"
  | "resolution-too-low"
  | "face-too-small"
  | "head-turned"
  | "head-tilted"
  | "eyes-closed"
  | "incomplete-landmarks";

export interface QualityResult {
  ok: boolean;
  issues: QualityIssue[];
}

/** Umbrales. Configurables porque son hipótesis, no verdades. */
export const QUALITY_THRESHOLDS = {
  /** Lado menor mínimo en píxeles. */
  minImageSide: 480,
  /** El rostro debe ocupar al menos esta fracción del ancho de la imagen. */
  minFaceCoverage: 0.15,
  /** Proxy de giro 0..1. Por encima, la geometría proyectada deja de servir. */
  maxYaw: 0.28,
  /** Inclinación en grados. Por encima, se pide repetir. */
  maxTiltDeg: 20,
  /** Apertura ocular mínima (hueco entre párpados / ancho del ojo). */
  minEyeOpenness: 0.12,
} as const;

/**
 * Evalúa una foto a partir de los rostros detectados.
 *
 * `faces` es la lista de mallas detectadas: su longitud resuelve «hay cara» y
 * «hay una sola», y la primera malla es la que se mide.
 */
export function checkQuality(
  faces: Landmark[][],
  image: ImageSize,
): QualityResult {
  const issues: QualityIssue[] = [];

  // La resolución se comprueba siempre: es independiente de la detección y es
  // la causa más fácil de corregir para el usuario.
  if (
    Math.min(image.width, image.height) < QUALITY_THRESHOLDS.minImageSide
  ) {
    issues.push("resolution-too-low");
  }

  if (faces.length === 0) {
    issues.push("no-face");
    return { ok: false, issues };
  }
  if (faces.length > 1) {
    issues.push("multiple-faces");
    return { ok: false, issues };
  }

  const landmarks = faces[0]!;
  if (landmarks.length < REQUIRED_LANDMARKS) {
    // Sin iris no hay distancia interpupilar y media geometría se cae.
    issues.push("incomplete-landmarks");
    return { ok: false, issues };
  }

  if (faceCoverage(landmarks, image) < QUALITY_THRESHOLDS.minFaceCoverage) {
    issues.push("face-too-small");
  }

  if (estimateYaw(landmarks, image) > QUALITY_THRESHOLDS.maxYaw) {
    issues.push("head-turned");
  }

  const tilt = headTilt(landmarks, image);
  if (Math.abs(tilt) > QUALITY_THRESHOLDS.maxTiltDeg) {
    issues.push("head-tilted");
  }

  const left = eyeOpenness(landmarks, image, "left");
  const right = eyeOpenness(landmarks, image, "right");
  if (
    left < QUALITY_THRESHOLDS.minEyeOpenness ||
    right < QUALITY_THRESHOLDS.minEyeOpenness
  ) {
    issues.push("eyes-closed");
  }

  return { ok: issues.length === 0, issues };
}

/** Inclinación en grados a partir de la línea entre pupilas. */
function headTilt(landmarks: Landmark[], image: ImageSize): number {
  const l = landmarks[468]!;
  const r = landmarks[473]!;
  const dx = (r.x - l.x) * image.width;
  const dy = (r.y - l.y) * image.height;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

/**
 * Mensaje accionable por problema, en orden de prioridad.
 *
 * Se devuelve **uno solo**: una lista de seis correcciones a la vez no se lee,
 * y arreglar la primera suele arreglar varias.
 */
const ISSUE_MESSAGE: Record<QualityIssue, string> = {
  "no-face": "No reconocemos una cara en la foto. Prueba con una foto frontal.",
  "multiple-faces":
    "Hay más de una persona. Necesitamos una foto en la que salgas solo tú.",
  "incomplete-landmarks":
    "No vemos bien los ojos. Prueba con una foto más frontal y sin nada que los tape.",
  "head-turned":
    "La cara está girada. Necesitamos que mires de frente a la cámara.",
  "head-tilted": "Endereza un poco la cabeza y repite la foto.",
  "eyes-closed": "Tienes los ojos cerrados o entornados. Prueba otra foto.",
  "face-too-small":
    "La cara sale muy pequeña. Acércate o recorta la foto alrededor de tu cara.",
  "resolution-too-low":
    "La foto tiene poca resolución. Necesitamos una imagen de al menos 480 píxeles de lado.",
};

/** Prioridad: primero lo que invalida todo, luego lo que se corrige fácil. */
const ISSUE_PRIORITY: QualityIssue[] = [
  "no-face",
  "multiple-faces",
  "incomplete-landmarks",
  "head-turned",
  "eyes-closed",
  "face-too-small",
  "resolution-too-low",
  "head-tilted",
];

export function primaryIssueMessage(result: QualityResult): string | null {
  if (result.ok) return null;
  for (const issue of ISSUE_PRIORITY) {
    if (result.issues.includes(issue)) return ISSUE_MESSAGE[issue];
  }
  return null;
}

/**
 * Lo que este check **no** detecta, y conviene no fingir que sí:
 *
 * - Oclusión fuerte (mano, pelo tapando media cara). CLAUDE.md §8.4 lo pide,
 *   pero MediaPipe no da confianza por landmark y detectarlo de verdad
 *   requeriría otro modelo. La asimetría y el giro lo capturan en parte.
 * - Filtros de belleza. Alteran la geometría y no hay forma fiable de verlo.
 * - Gafas ya puestas. Se pide en el texto, no se comprueba.
 *
 * Están declarados aquí para que nadie asuma una cobertura que no existe.
 */
export const KNOWN_GAPS = [
  "strong-occlusion",
  "beauty-filters",
  "existing-glasses",
] as const;
