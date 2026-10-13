/**
 * Validación de la imagen subida — CLAUDE.md §8.3 y §15.
 *
 * Funciones puras: reciben los metadatos, no el archivo. Así se testean sin
 * navegador y la misma regla puede aplicarse en servidor el día que exista un
 * endpoint de subida — porque esta validación es de usabilidad, y la de
 * seguridad hay que repetirla en servidor pase lo que pase: lo que decide el
 * cliente, lo decide el usuario.
 */

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AcceptedMimeType = (typeof ACCEPTED_MIME_TYPES)[number];

export const UPLOAD_LIMITS = {
  maxBytes: 12 * 1024 * 1024,
  /** Lado menor mínimo. Coincide con el umbral del quality check. */
  minSide: 480,
  /** Tope de megapíxeles: frena imágenes diseñadas para reventar el decodificador. */
  maxMegapixels: 40,
} as const;

export type UploadIssue =
  | "unsupported-type"
  | "too-large"
  | "too-small"
  | "too-many-pixels"
  | "empty";

/**
 * Resultado de una comprobación.
 *
 * Devuelve el **código** del problema, no el texto: el texto depende del
 * idioma y vive en el diccionario. Así estas funciones siguen siendo puras y
 * se testean sin tocar i18n.
 */
export interface UploadCheck {
  ok: boolean;
  issue: UploadIssue | null;
}

function fail(issue: UploadIssue): UploadCheck {
  return { ok: false, issue };
}

const OK: UploadCheck = { ok: true, issue: null };

/**
 * Comprueba tipo y tamaño **antes de decodificar**.
 *
 * El orden importa: decodificar una imagen es la parte cara y la que puede
 * hacer daño, así que lo que se pueda rechazar por metadatos se rechaza antes
 * de tocarla.
 */
export function checkUploadMetadata(file: {
  type: string;
  size: number;
}): UploadCheck {
  if (file.size === 0) return fail("empty");
  if (!ACCEPTED_MIME_TYPES.includes(file.type as AcceptedMimeType)) {
    return fail("unsupported-type");
  }
  if (file.size > UPLOAD_LIMITS.maxBytes) return fail("too-large");
  return OK;
}

/** Comprueba las dimensiones una vez decodificada. */
export function checkUploadDimensions(size: {
  width: number;
  height: number;
}): UploadCheck {
  if (size.width <= 0 || size.height <= 0) return fail("empty");
  if (Math.min(size.width, size.height) < UPLOAD_LIMITS.minSide) {
    return fail("too-small");
  }
  const megapixels = (size.width * size.height) / 1_000_000;
  if (megapixels > UPLOAD_LIMITS.maxMegapixels) return fail("too-many-pixels");
  return OK;
}

/** Valor para el atributo `accept` del input, derivado de la lista real. */
export const ACCEPT_ATTRIBUTE = ACCEPTED_MIME_TYPES.join(",");
