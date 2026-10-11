import { ACCESS_HEADER } from "../server/access";
import type { UploadPayload } from "../upload/prepare";

/**
 * El código de acceso se guarda en el navegador para no pedirlo en cada
 * prueba. Es una comodidad de alfa privada, no un mecanismo de seguridad:
 * quien tiene el código lo tiene, esté donde esté guardado.
 */
const ACCESS_STORAGE_KEY = "lookfit.accessCode";

export function readAccessCode(): string | null {
  try {
    return window.localStorage.getItem(ACCESS_STORAGE_KEY);
  } catch {
    // Ventana privada o almacenamiento bloqueado: se pedirá cada vez.
    return null;
  }
}

export function saveAccessCode(code: string): void {
  try {
    window.localStorage.setItem(ACCESS_STORAGE_KEY, code.trim());
  } catch {
    // Si no se puede guardar, la petición de esta sesión igualmente funciona.
  }
}

/**
 * Cliente del endpoint de try-on.
 *
 * El navegador nunca habla con el proveedor: habla con nuestra ruta, que es
 * la que tiene la clave → CLAUDE.md regla 6.
 */

export type TryOnClientResult =
  | {
      status: "completed";
      resultUrl: string;
      /** `false` ⇒ la UI no puede presentarlo como ese producto. RULE #1. */
      labelAsProduct: boolean;
      /** `true` ⇒ no hay proveedor real detrás; es el mock. */
      simulated: boolean;
    }
  /** Hace falta código de acceso. La UI debe pedirlo, no mostrar un error. */
  | { status: "needs-access" }
  | { status: "failed"; message: string };

/** Códigos del servidor → algo que una persona pueda hacer al respecto. */
const MESSAGES: Record<string, string> = {
  rate_limited:
    "Has hecho muchas pruebas seguidas. Espera unos minutos y vuelve a intentarlo.",
  provider_timeout: "El proveedor ha tardado demasiado. Vuelve a intentarlo.",
  provider_unavailable:
    "El proveedor no está disponible ahora mismo. Vuelve a intentarlo en un momento.",
  content_rejected:
    "No hemos podido generar esta prueba. Prueba con otra montura u otra foto.",
  invalid_input: "Algo falla con la imagen. Prueba con otra foto.",
  no_face_detected: "No reconocemos una cara en la foto.",
  unknown: "No hemos podido generar la prueba. Vuelve a intentarlo.",
};

export async function requestTryOn(
  frameId: string,
  photo: UploadPayload,
  signal?: AbortSignal,
): Promise<TryOnClientResult> {
  const accessCode = readAccessCode();
  let response: Response;
  try {
    response = await fetch("/api/try-on", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Si no hay código, no se manda la cabecera: en local no hay puerta.
        ...(accessCode ? { [ACCESS_HEADER]: accessCode } : {}),
      },
      signal,
      body: JSON.stringify({
        frameId,
        mimeType: photo.mimeType,
        imageBase64: photo.base64,
      }),
    });
  } catch {
    return { status: "failed", message: MESSAGES.provider_unavailable! };
  }

  let payload: {
    status?: string;
    resultUrl?: string;
    errorCode?: string;
    labelAsProduct?: boolean;
    simulated?: boolean;
  };
  try {
    payload = await response.json();
  } catch {
    return { status: "failed", message: MESSAGES.unknown! };
  }

  if (payload.status === "completed" && payload.resultUrl) {
    return {
      status: "completed",
      resultUrl: payload.resultUrl,
      labelAsProduct: payload.labelAsProduct === true,
      simulated: payload.simulated === true,
    };
  }

  const code = payload.errorCode ?? "unknown";
  // La puerta no es un error del usuario: es un paso que falta. La UI pide el
  // código en lugar de enseñar un fallo.
  if (code === "access_denied") return { status: "needs-access" };
  return { status: "failed", message: MESSAGES[code] ?? MESSAGES.unknown! };
}
