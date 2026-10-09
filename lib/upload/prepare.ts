/**
 * Prepara la foto para enviarla al proveedor generativo.
 *
 * Se reduce antes de salir por tres razones, y las tres importan: una foto de
 * móvil de 4000 px tarda más en subir, cuesta más de procesar y **no mejora el
 * resultado** — el modelo trabaja a 1K. Enviar menos píxeles también es
 * minimización de datos, que es lo que pide §14.
 *
 * Y se recodifica a JPEG: eso descarta los metadatos EXIF del original, que
 * pueden llevar coordenadas GPS y modelo de cámara. Nadie necesita eso.
 */

export const MAX_UPLOAD_SIDE = 1536;
const JPEG_QUALITY = 0.9;

export interface UploadPayload {
  mimeType: "image/jpeg";
  base64: string;
  width: number;
  height: number;
}

export async function prepareUpload(
  source: Blob,
  maxSide: number = MAX_UPLOAD_SIDE,
): Promise<UploadPayload> {
  const bitmap = await createImageBitmap(source);
  try {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo preparar la imagen.");
    context.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) throw new Error("No se pudo codificar la imagen.");

    return {
      mimeType: "image/jpeg",
      base64: await toBase64(blob),
      width,
      height,
    };
  } finally {
    bitmap.close();
  }
}

async function toBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // En trozos, porque `String.fromCharCode(...bytes)` revienta la pila con
  // arrays de megabytes.
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}
