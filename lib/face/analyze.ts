import { classifyFace } from "./classify";
import { extractMeasurements, type ImageSize, type Landmark } from "./landmarks";
import { checkQuality, primaryIssueMessage, type QualityResult } from "./quality";
import type { FaceProfile } from "./types";

/**
 * Análisis facial **en el navegador**.
 *
 * Este módulo es la única parte de `lib/face` que no es pura, y está aislada a
 * propósito: carga el modelo, lo ejecuta y devuelve un `FaceProfile`. Toda la
 * geometría y las reglas viven en `landmarks.ts`, `quality.ts` y `classify.ts`,
 * que sí son puros y están testeados sin navegador.
 *
 * Por qué en cliente y no en servidor → D-007 y CLAUDE.md §14: para analizar
 * proporciones **la foto no tiene que salir del dispositivo**. Lo que cruza al
 * servidor es un `FaceProfile`, una veintena de números sin imagen. Es una
 * decisión de arquitectura, no una conclusión jurídica.
 *
 * El modelo y el wasm se sirven desde nuestro propio origen
 * (`public/mediapipe/`, preparado por `scripts/vision-assets.mjs`): el análisis
 * no debe depender de un CDN de terceros ni darle a nadie la lista de quién
 * usa el producto.
 */

export type AnalysisOutcome =
  | { status: "ok"; profile: FaceProfile; quality: QualityResult }
  /** La foto se pudo procesar pero no sirve. `message` dice qué hacer. */
  | { status: "rejected"; quality: QualityResult; message: string }
  /** Fallo técnico: no cargó el modelo, no se pudo decodificar la imagen… */
  | { status: "error"; message: string };

/** Detectamos hasta dos caras: con una sola no se puede avisar de que hay varias. */
const MAX_FACES = 2;

const WASM_PATH = "/mediapipe/wasm";
const MODEL_PATH = "/mediapipe/face_landmarker.task";

// El wasm pesa ~12 MB y el modelo ~3,6 MB: se carga una vez por sesión y se
// reutiliza. La promesa se cachea para que dos llamadas simultáneas no
// disparen dos cargas.
let landmarkerPromise: Promise<FaceLandmarkerLike> | null = null;

/**
 * Subconjunto de la API de MediaPipe que usamos.
 *
 * Declarado aquí para que el resto del código no dependa de los tipos del
 * paquete, que es justo lo que permitiría sustituirlo sin tocar nada más.
 */
interface FaceLandmarkerLike {
  detect(image: ImageBitmapSource): { faceLandmarks: Landmark[][] };
  close(): void;
}

async function loadLandmarker(): Promise<FaceLandmarkerLike> {
  if (typeof window === "undefined") {
    throw new Error("El análisis facial solo se ejecuta en el navegador.");
  }
  // Import dinámico: así el bundle del servidor nunca incluye MediaPipe y la
  // descarga no bloquea la carga inicial de la página.
  const { FaceLandmarker, FilesetResolver } = await import(
    "@mediapipe/tasks-vision"
  );
  const fileset = await FilesetResolver.forVisionTasks(WASM_PATH);

  return (await FaceLandmarker.createFromOptions(fileset, {
    baseOptions: { modelAssetPath: MODEL_PATH, delegate: "GPU" },
    runningMode: "IMAGE",
    numFaces: MAX_FACES,
    // Imprescindible: añade los 10 puntos de iris y con ellos la distancia
    // interpupilar. Sin esto `extractMeasurements` devuelve null.
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false,
  })) as unknown as FaceLandmarkerLike;
}

/** Precarga el modelo. Útil al entrar en la pantalla de subida. */
export function warmUpFaceAnalysis(): void {
  if (typeof window === "undefined") return;
  landmarkerPromise ??= loadLandmarker();
  void landmarkerPromise.catch(() => {
    // Un fallo de precarga no debe romper nada: se reintenta al analizar.
    landmarkerPromise = null;
  });
}

/**
 * Analiza una imagen ya decodificada.
 *
 * No recibe un `File` a propósito: decodificar es responsabilidad de quien
 * llama, y así esta función sirve igual para una foto subida que para un
 * fotograma de cámara el día que exista ese modo (D-012).
 */
export async function analyzeFaceImage(
  source: ImageBitmap,
): Promise<AnalysisOutcome> {
  const image: ImageSize = { width: source.width, height: source.height };

  let landmarker: FaceLandmarkerLike;
  try {
    landmarkerPromise ??= loadLandmarker();
    landmarker = await landmarkerPromise;
  } catch {
    // Se descarta la promesa fallida para que el siguiente intento recargue.
    landmarkerPromise = null;
    return {
      status: "error",
      message:
        "No hemos podido cargar el analizador. Comprueba tu conexión y vuelve a intentarlo.",
    };
  }

  let faces: Landmark[][];
  try {
    faces = landmarker.detect(source).faceLandmarks ?? [];
  } catch {
    return {
      status: "error",
      message: "No hemos podido procesar la imagen. Prueba con otra foto.",
    };
  }

  const quality = checkQuality(faces, image);
  if (!quality.ok) {
    return {
      status: "rejected",
      quality,
      message:
        primaryIssueMessage(quality) ??
        "Necesitamos una foto más frontal y con mejor luz.",
    };
  }

  const measurements = extractMeasurements(faces[0]!, image);
  if (!measurements) {
    return {
      status: "rejected",
      quality,
      message: "No vemos bien los ojos. Prueba con una foto más frontal.",
    };
  }

  return { status: "ok", profile: classifyFace(measurements), quality };
}

/** Libera el modelo. Para cuando el usuario sale del flujo de análisis. */
export async function releaseFaceAnalysis(): Promise<void> {
  if (!landmarkerPromise) return;
  const pending = landmarkerPromise;
  landmarkerPromise = null;
  try {
    (await pending).close();
  } catch {
    // Si nunca llegó a cargar, no hay nada que liberar.
  }
}
