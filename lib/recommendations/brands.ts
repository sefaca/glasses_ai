import type { Brand } from "../catalog/brands";
import type { FrameProfile } from "../catalog/types";
import type { FaceProfile, UserPreferences } from "../face/types";
import { scoreFrame } from "./score";
import type { ScoreWeights } from "./weights";

/**
 * Qué marcas encajan con este rostro.
 *
 * No es una opinión sobre la marca: es **la puntuación de su catálogo para
 * esta cara concreta**. Una casa con catálogo angular sube con un rostro
 * redondeado y baja con uno cuadrado, porque son sus monturas las que puntúan,
 * no su reputación.
 *
 * Se promedian solo sus **mejores** monturas, no todas. Una marca con cien
 * modelos no debe quedar por debajo de una con tres solo por tener también
 * cosas que no encajan: lo que importa es si tiene algo bueno para ti.
 */

/** Cuántas de sus mejores monturas entran en la media. */
const TOP_FRAMES_PER_BRAND = 3;

export interface BrandSuggestion {
  brand: Brand;
  /** 0..1. Media de sus mejores monturas para este rostro. */
  score: number;
  /** Cuántas monturas suyas hay en el catálogo. */
  frameCount: number;
  /** Las formas con las que destaca para esta cara. Para explicar el porqué. */
  topShapes: string[];
}

export function suggestBrands(
  face: FaceProfile,
  prefs: UserPreferences,
  frames: FrameProfile[],
  brands: Brand[],
  weights?: ScoreWeights,
): BrandSuggestion[] {
  const byBrand = new Map<string, FrameProfile[]>();
  for (const frame of frames) {
    if (frame.category !== prefs.category) continue;
    const list = byBrand.get(frame.brandId);
    if (list) list.push(frame);
    else byBrand.set(frame.brandId, [frame]);
  }

  const suggestions: BrandSuggestion[] = [];

  for (const brand of brands) {
    const brandFrames = byBrand.get(brand.id);
    if (!brandFrames || brandFrames.length === 0) continue;

    const scored = brandFrames
      .map((frame) => ({
        frame,
        total: scoreFrame(face, prefs, frame, weights).total,
      }))
      .sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total;
        // Desempate estable: sin esto el orden depende del orden de entrada.
        return a.frame.id.localeCompare(b.frame.id);
      });

    const top = scored.slice(0, TOP_FRAMES_PER_BRAND);
    const score = top.reduce((sum, s) => sum + s.total, 0) / top.length;

    suggestions.push({
      brand,
      score: Math.round(score * 1000) / 1000,
      frameCount: brandFrames.length,
      topShapes: [...new Set(top.map((s) => s.frame.shape))],
    });
  }

  return suggestions.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.brand.name.localeCompare(b.brand.name);
  });
}

/**
 * ¿Merece la pena presentar esto como «sugerido para tu cara»?
 *
 * Con perfil neutro todas las marcas empatan, porque la geometría puntúa
 * plana. Presentar un empate como una sugerencia personalizada sería
 * exactamente el tipo de falsa personalización que CLAUDE.md §0 prohíbe.
 */
export function suggestionsAreMeaningful(
  suggestions: BrandSuggestion[],
): boolean {
  if (suggestions.length < 2) return false;
  const best = suggestions[0]!.score;
  const worst = suggestions[suggestions.length - 1]!.score;
  return best - worst > 0.02;
}
