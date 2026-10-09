import { GeminiTryOnProvider } from "./gemini";
import { MockTryOnProvider } from "./mock";
import type { TryOnProvider } from "./provider";

/**
 * Elige el proveedor de try-on según el entorno. **Solo servidor.**
 *
 * Aquí es donde el adaptador de CLAUDE.md §10.1 se cobra lo que cuesta: pasar
 * del mock al generativo real es **una variable de entorno**, y cambiar de
 * proveedor cuando el volumen cruce el punto de equilibrio con la Clase A
 * (~1.800 usuarios/mes, D-016) será otra.
 *
 * Sin `GEMINI_API_KEY` se cae al mock en lugar de romper: el resto del
 * producto tiene que poder desarrollarse sin gastar dinero en cada recarga.
 */

let cached: TryOnProvider | null = null;

export function getTryOnProvider(): TryOnProvider {
  if (typeof window !== "undefined") {
    throw new Error(
      "getTryOnProvider() es de servidor: la clave nunca toca el navegador.",
    );
  }
  if (cached) return cached;

  const apiKey = process.env.GEMINI_API_KEY;
  cached = apiKey
    ? new GeminiTryOnProvider({
        apiKey,
        model: process.env.TRYON_MODEL ?? "gemini-3.1-flash-image",
        imageSize: "1K",
      })
    : new MockTryOnProvider({ latencyMs: 1200 });

  return cached;
}

/** `true` si hay un proveedor real detrás. La UI lo necesita para no mentir. */
export function hasRealProvider(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}
