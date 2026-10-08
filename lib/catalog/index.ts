import { isPubliclyListable } from "./rights";
import { ALL_FRAMES } from "./seed";
import type { FrameProfile } from "./types";

/**
 * Única puerta de entrada al catálogo.
 *
 * `listableFrames()` es lo que debe consumir toda la aplicación. El array
 * `ALL_FRAMES` incluye monturas con derechos sin verificar y **no debe usarse
 * directamente** fuera de los tests: por eso esta capa existe, y por eso el
 * motor de recomendación no comprueba derechos — los recibe ya filtrados.
 */

export function listableFrames(): FrameProfile[] {
  return ALL_FRAMES.filter(isPubliclyListable);
}

export function findFrameBySlug(slug: string): FrameProfile | null {
  return listableFrames().find((f) => f.slug === slug) ?? null;
}

export function findFrameById(id: string): FrameProfile | null {
  return listableFrames().find((f) => f.id === id) ?? null;
}

/** Conteo por forma. Para las páginas de categoría de SEO. */
export function countByShape(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const frame of listableFrames()) {
    counts[frame.shape] = (counts[frame.shape] ?? 0) + 1;
  }
  return counts;
}

export { isPubliclyListable, canTryOn, outboundUrl, tryOnBlockedReason } from "./rights";
export type { FrameProfile, FrameShape } from "./types";
