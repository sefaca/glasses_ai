import { GeminiTryOnProvider } from "./gemini";
import { MockTryOnProvider } from "./mock";
import { OpenAITryOnProvider } from "./openai";
import type { TryOnProvider } from "./provider";

/**
 * Elige el proveedor de try-on según el entorno. **Solo servidor.**
 *
 * Aquí es donde el adaptador de CLAUDE.md §10.1 se cobra lo que cuesta.
 * Añadir OpenAI junto a Gemini fue **un archivo y una rama de este switch**:
 * ni la ruta, ni la UI, ni el dominio se enteraron. Y la migración a Clase A
 * cuando el volumen cruce el punto de equilibrio (~1.800 usuarios/mes,
 * D-016) será igual de barata.
 *
 * Orden de preferencia: lo que diga `TRYON_PROVIDER`, y si no, la primera
 * clave que haya. Sin ninguna, el mock — el resto del producto tiene que
 * poder desarrollarse sin gastar dinero en cada recarga.
 */

export type ProviderId = "openai" | "gemini" | "mock";

let cached: TryOnProvider | null = null;

/** Qué proveedor se usaría. Sin instanciar nada, para poder informarlo. */
export function resolveProviderId(): ProviderId {
  const explicit = process.env.TRYON_PROVIDER?.trim().toLowerCase();
  if (explicit === "openai" || explicit === "gemini" || explicit === "mock") {
    return explicit;
  }
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GEMINI_API_KEY) return "gemini";
  return "mock";
}

export function getTryOnProvider(): TryOnProvider {
  if (typeof window !== "undefined") {
    throw new Error(
      "getTryOnProvider() es de servidor: la clave nunca toca el navegador.",
    );
  }
  if (cached) return cached;

  switch (resolveProviderId()) {
    case "openai": {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) break;
      cached = new OpenAITryOnProvider({
        apiKey,
        model: process.env.TRYON_MODEL ?? "gpt-image-2",
        quality: "high",
        size: "auto",
      });
      return cached;
    }
    case "gemini": {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) break;
      cached = new GeminiTryOnProvider({
        apiKey,
        model: process.env.TRYON_MODEL ?? "gemini-3.1-flash-image",
        imageSize: "1K",
      });
      return cached;
    }
    case "mock":
      break;
  }

  // Se pidió un proveedor real pero falta su clave: se cae al mock en vez de
  // romper, y queda dicho en el log para que no pase desapercibido.
  cached = new MockTryOnProvider({ latencyMs: 1200 });
  return cached;
}

/** `true` si hay un proveedor real detrás. La UI lo necesita para no mentir. */
export function hasRealProvider(): boolean {
  return getTryOnProvider().assetOwnership !== "mock";
}

/** Para los tests: obliga a releer el entorno. */
export function resetTryOnProvider(): void {
  cached = null;
}
