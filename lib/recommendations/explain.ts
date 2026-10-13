import type { FaceProfile, FaceShape } from "../face/types";
import type { FrameProfile, FrameShape } from "../catalog/types";
import { format } from "../i18n";
import type { Dictionary } from "../i18n/types";
import type { FrameScore } from "./score";

/**
 * Explicaciones por plantilla → CLAUDE.md §9.4.
 *
 * Dos reglas que este módulo hace cumplir:
 *
 * 1. **Nunca se afirma una medida.** El componente de anchura se calcula con
 *    una escala estimada a partir de la DIP media de población. Decir «mide
 *    140 mm y tu cara 138» sería inventar precisión, así que cuando el
 *    componente viene `estimated` solo se habla de proporción en cualitativo.
 *
 * 2. **Nunca se afirma la forma del rostro como un hecho.** Siempre «parece»,
 *    y con la forma secundaria cuando existe.
 *
 * Un LLM podrá enriquecer este lenguaje más adelante, pero nunca generar los
 * hechos: los hechos salen del `FrameScore`.
 *
 * La lengua entra por parámetro. Antes estaba incrustada aquí, y eso dejaba
 * la parte del producto que más se lee —la razón por la que te recomendamos
 * algo— en español para todos los idiomas.
 */

export function faceShapeLabel(dict: Dictionary, shape: FaceShape): string {
  return dict.explain.faceShapes[shape];
}

export function frameShapeLabel(dict: Dictionary, shape: FrameShape): string {
  return dict.explain.frameShapes[shape];
}

/** Resumen del perfil, en condicional. Nunca «tu cara es X». */
export function describeFaceProfile(
  dict: Dictionary,
  face: FaceProfile,
): string {
  if (face.shapePrimary === "unknown") return dict.explain.unknownProfile;

  const primary = dict.explain.faceShapes[face.shapePrimary];
  return face.shapeSecondary
    ? format(dict.explain.profileTwo, {
        primary,
        secondary: dict.explain.faceShapes[face.shapeSecondary],
      })
    : format(dict.explain.profileOne, { primary });
}

/**
 * Explicación de una línea para la card de recomendación.
 * Se construye solo con lo que el score pudo medir de verdad.
 */
export function explainRecommendation(
  dict: Dictionary,
  frame: FrameProfile,
  score: FrameScore,
): string {
  const parts: string[] = [];

  const geometry = score.components.find((c) => c.key === "faceGeometry");
  if (geometry?.available && geometry.score >= 0.7) {
    parts.push(
      format(dict.explain.shapeClause, {
        shape: dict.explain.frameShapes[frame.shape],
        effect: dict.explain.frameEffects[frame.shape],
      }),
    );
  }

  const scale = score.components.find((c) => c.key === "frameScale");
  if (scale?.available && scale.score >= 0.7) {
    // Cualitativo a propósito: la escala es estimada, no medida.
    parts.push(dict.explain.widthClause);
  }

  const style = score.components.find((c) => c.key === "stylePreference");
  if (style?.available && style.score >= 0.6) {
    parts.push(dict.explain.styleClause);
  }

  if (parts.length === 0) return dict.explain.fallback;

  // Una coma entre cláusulas. Unir con «y»/«and»/«und» obligaría a una regla
  // de concordancia por idioma, y una enumeración con comas se lee bien en
  // los cinco.
  const sentence = parts.join(", ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

/**
 * Etiqueta visible en la card. El score crudo no se muestra → CLAUDE.md §8.6.
 * `null` significa que no hay nada que presumir y es mejor no decir nada.
 */
export function matchLabel(
  dict: Dictionary,
  score: FrameScore,
): string | null {
  if (score.confidence < 0.35) return null;
  if (score.total >= 0.8) return dict.explain.matchVeryGood;
  if (score.total >= 0.65) return dict.explain.matchGood;
  return null;
}
