import type { FaceProfile, FaceShape } from "../face/types";
import type { FrameProfile, FrameShape } from "../catalog/types";
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
 */

const SHAPE_LABEL_ES: Record<FaceShape, string> = {
  oval: "ovalado",
  round: "redondeado",
  square: "cuadrado",
  oblong: "alargado",
  heart: "de corazón",
  diamond: "de diamante",
  unknown: "difícil de clasificar",
};

const FRAME_EFFECT_ES: Record<FrameShape, string> = {
  rectangular: "aporta líneas definidas y estructura el rostro",
  square: "marca ángulos y da presencia",
  round: "suaviza los rasgos y resta dureza",
  oval: "pasa desapercibida y equilibra sin llamar la atención",
  aviator: "abre la mirada y alarga visualmente el rostro",
  "cat-eye": "eleva la mirada y realza el tercio superior",
  wayfarer: "da anchura y un aire clásico reconocible",
  geometric: "introduce un contraste de forma más rotundo",
  oversized: "añade volumen y acorta visualmente el rostro",
};

export function faceShapeLabel(shape: FaceShape): string {
  return SHAPE_LABEL_ES[shape];
}

/** Resumen del perfil, en condicional. Nunca «tu cara es X». */
export function describeFaceProfile(face: FaceProfile): string {
  if (face.shapePrimary === "unknown") {
    return "No hemos podido estimar la forma de tu rostro con suficiente claridad. Aun así, puedes explorar estilos y probártelos.";
  }
  const primary = SHAPE_LABEL_ES[face.shapePrimary];
  if (face.shapeSecondary) {
    return `Tu rostro parece encajar principalmente con un perfil ${primary}, con algunas características de un perfil ${SHAPE_LABEL_ES[face.shapeSecondary]}.`;
  }
  return `Tu rostro parece encajar principalmente con un perfil ${primary}.`;
}

/**
 * Explicación de una línea para la card de recomendación.
 * Se construye solo con lo que el score pudo medir de verdad.
 */
export function explainRecommendation(
  frame: FrameProfile,
  score: FrameScore,
): string {
  const parts: string[] = [];

  const geometry = score.components.find((c) => c.key === "faceGeometry");
  if (geometry?.available && geometry.score >= 0.7) {
    parts.push(`La forma ${frameShapeLabel(frame.shape)} ${FRAME_EFFECT_ES[frame.shape]}`);
  }

  const scale = score.components.find((c) => c.key === "frameScale");
  if (scale?.available && scale.score >= 0.7) {
    // Cualitativo a propósito: la escala es estimada, no medida.
    parts.push("su anchura queda proporcionada respecto a tu rostro");
  }

  const style = score.components.find((c) => c.key === "stylePreference");
  if (style?.available && style.score >= 0.6) {
    parts.push("y encaja con el estilo que has elegido");
  }

  if (parts.length === 0) {
    return "Una opción equilibrada para empezar a comparar.";
  }

  const sentence = parts.join(", ").replace(/, y /, " y ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

const FRAME_SHAPE_LABEL_ES: Record<FrameShape, string> = {
  rectangular: "rectangular",
  square: "cuadrada",
  round: "redonda",
  oval: "ovalada",
  aviator: "aviador",
  "cat-eye": "cat-eye",
  wayfarer: "wayfarer",
  geometric: "geométrica",
  oversized: "oversized",
};

export function frameShapeLabel(shape: FrameShape): string {
  return FRAME_SHAPE_LABEL_ES[shape];
}

/**
 * Etiqueta visible en la card. El score crudo no se muestra → CLAUDE.md §8.6.
 * `null` significa que no hay nada que presumir y es mejor no decir nada.
 */
export function matchLabel(score: FrameScore): string | null {
  if (score.confidence < 0.35) return null;
  if (score.total >= 0.8) return "Muy buena combinación";
  if (score.total >= 0.65) return "Buena combinación";
  return null;
}
