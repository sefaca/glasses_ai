import { describe, expect, it } from "vitest";
import {
  ACCEPTED_MIME_TYPES,
  ACCEPT_ATTRIBUTE,
  UPLOAD_LIMITS,
  checkUploadDimensions,
  checkUploadMetadata,
} from "../lib/upload/validate";

/**
 * Validación de la subida — CLAUDE.md §8.3 y §15.
 *
 * Esta es la capa de usabilidad. La de seguridad hay que repetirla en servidor
 * cuando exista el endpoint: lo que decide el cliente, lo decide el usuario.
 */

describe("metadatos, antes de decodificar", () => {
  it("acepta los tres formatos declarados", () => {
    for (const type of ACCEPTED_MIME_TYPES) {
      expect(checkUploadMetadata({ type, size: 500_000 }).ok).toBe(true);
    }
  });

  it("rechaza un tipo no soportado", () => {
    const result = checkUploadMetadata({ type: "image/gif", size: 1000 });
    expect(result.issue).toBe("unsupported-type");
    expect(result.message).toMatch(/JPG/);
  });

  it("rechaza algo que no es una imagen", () => {
    expect(
      checkUploadMetadata({ type: "application/pdf", size: 1000 }).issue,
    ).toBe("unsupported-type");
  });

  it("rechaza un archivo vacío antes que por su tipo", () => {
    // Un archivo de 0 bytes es un error del usuario al adjuntar, no un
    // problema de formato: el mensaje debe decir eso.
    expect(checkUploadMetadata({ type: "image/jpeg", size: 0 }).issue).toBe(
      "empty",
    );
  });

  it("rechaza por peso", () => {
    expect(
      checkUploadMetadata({
        type: "image/jpeg",
        size: UPLOAD_LIMITS.maxBytes + 1,
      }).issue,
    ).toBe("too-large");
  });

  it("acepta justo en el límite de peso", () => {
    expect(
      checkUploadMetadata({ type: "image/jpeg", size: UPLOAD_LIMITS.maxBytes })
        .ok,
    ).toBe(true);
  });
});

describe("dimensiones, una vez decodificada", () => {
  it("acepta una foto de móvil normal", () => {
    expect(checkUploadDimensions({ width: 3024, height: 4032 }).ok).toBe(true);
  });

  it("rechaza una imagen por debajo del lado mínimo", () => {
    const result = checkUploadDimensions({ width: 1200, height: 300 });
    expect(result.issue).toBe("too-small");
  });

  it("acepta justo en el lado mínimo", () => {
    expect(
      checkUploadDimensions({
        width: UPLOAD_LIMITS.minSide,
        height: UPLOAD_LIMITS.minSide,
      }).ok,
    ).toBe(true);
  });

  it("rechaza una imagen con demasiados megapíxeles", () => {
    // Freno a imágenes hechas para reventar el decodificador: pocos bytes
    // comprimidos, muchísimos píxeles al descomprimir.
    expect(checkUploadDimensions({ width: 20_000, height: 20_000 }).issue).toBe(
      "too-many-pixels",
    );
  });

  it("rechaza dimensiones imposibles", () => {
    expect(checkUploadDimensions({ width: 0, height: 100 }).issue).toBe("empty");
  });
});

describe("coherencia", () => {
  it("el atributo accept se deriva de la lista real, no se escribe a mano", () => {
    for (const type of ACCEPTED_MIME_TYPES) {
      expect(ACCEPT_ATTRIBUTE).toContain(type);
    }
  });

  it("el lado mínimo coincide con el del quality check", async () => {
    // Si se separan, una foto puede pasar la subida y morir en el análisis con
    // un mensaje distinto, que es confuso sin motivo.
    const { QUALITY_THRESHOLDS } = await import("../lib/face/quality");
    expect(UPLOAD_LIMITS.minSide).toBe(QUALITY_THRESHOLDS.minImageSide);
  });
});
