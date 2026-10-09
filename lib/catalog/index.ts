import { activeBrands, type Brand } from "./brands";
import { FRAMES } from "./frames";
import { isPubliclyListable } from "./rights";
import type { FrameProfile } from "./types";

/**
 * Única puerta de entrada al catálogo.
 *
 * `listableFrames()` es lo que debe consumir toda la aplicación. El motor de
 * recomendación no comprueba derechos: los recibe ya filtrados, para que la
 * lógica de producto no pueda saltárselos por descuido.
 */

export function listableFrames(): FrameProfile[] {
  return FRAMES.filter(isPubliclyListable);
}

export function findFrameBySlug(slug: string): FrameProfile | null {
  return listableFrames().find((f) => f.slug === slug) ?? null;
}

export function findFrameById(id: string): FrameProfile | null {
  return listableFrames().find((f) => f.id === id) ?? null;
}

export function framesOfBrand(brandId: string): FrameProfile[] {
  return listableFrames().filter((f) => f.brandId === brandId);
}

/** Marcas que tienen al menos una montura listable. */
export function brandsWithFrames(): Brand[] {
  const ids = new Set(listableFrames().map((f) => f.brandId));
  return activeBrands().filter((brand) => ids.has(brand.id));
}

/** Conteo por forma. Para las páginas de categoría de SEO. */
export function countByShape(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const frame of listableFrames()) {
    counts[frame.shape] = (counts[frame.shape] ?? 0) + 1;
  }
  return counts;
}

export { findBrand, activeBrands } from "./brands";
export type { Brand } from "./brands";
export {
  canLabelAsProduct,
  canTryOn,
  isPubliclyListable,
  outboundUrl,
  tryOnBlockedReason,
} from "./rights";
export { frameFrontWidthMm } from "./types";
export type { FrameProfile, FrameShape } from "./types";
