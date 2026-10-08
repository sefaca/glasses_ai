import { clamp01, round3 } from "../face/classify";
import type { FaceProfile, UserPreferences } from "../face/types";
import type { FrameProfile } from "../catalog/types";
import {
  BUDGET_TOLERANCE,
  DEFAULT_WEIGHTS,
  POPULATION_PD_MM,
  SHAPE_COMPATIBILITY,
  type ComponentKey,
  type ScoreWeights,
} from "./weights";

/**
 * Motor de recomendación. Determinista, puro y sin I/O → CLAUDE.md §9 y D-011.
 *
 * Dos propiedades que no son evidentes y son deliberadas:
 *
 * 1. **Degradación honesta.** Si un componente no tiene datos (una fuente sin
 *    medidas, gate GA-4 sin resolver), no se inventa un 0.5: se marca
 *    `available: false` y su peso se reparte entre los que sí tienen datos.
 *    Así una montura sin medidas no queda penalizada por un dato que falta.
 *
 * 2. **Lo estimado se marca.** El encaje por anchura necesita una escala
 *    absoluta que no tenemos, así que se aproxima con la DIP media de
 *    población. Eso se marca `estimated` y prohíbe afirmar medidas en la
 *    explicación → CLAUDE.md §9.4.
 */

export interface ScoreComponent {
  key: ComponentKey;
  /** Peso efectivo tras repartir el de los componentes sin datos. */
  weight: number;
  score: number;
  available: boolean;
  /** Calculado con una aproximación, no con una medición. */
  estimated?: boolean;
}

export interface FrameScore {
  frameId: string;
  /** 0..1. No se muestra crudo al usuario → CLAUDE.md §8.6. */
  total: number;
  components: ScoreComponent[];
  /** Combina la confianza del perfil facial con la cobertura de datos. */
  confidence: number;
}

type RawComponent = Omit<ScoreComponent, "weight">;

/** Anchura aproximada de la cara en mm. Aproximación, no medida. */
function estimateFaceWidthMm(face: FaceProfile): number | null {
  const { eyeDistanceRatio } = face.measurements;
  if (!Number.isFinite(eyeDistanceRatio) || eyeDistanceRatio <= 0) return null;
  return POPULATION_PD_MM / eyeDistanceRatio;
}

function faceGeometry(face: FaceProfile, frame: FrameProfile): RawComponent {
  const primary = SHAPE_COMPATIBILITY[face.shapePrimary][frame.shape];
  if (!face.shapeSecondary) {
    return { key: "faceGeometry", score: primary, available: true };
  }
  // La forma secundaria existe porque la primera no dominaba: pondera 70/30.
  const secondary = SHAPE_COMPATIBILITY[face.shapeSecondary][frame.shape];
  return {
    key: "faceGeometry",
    score: 0.7 * primary + 0.3 * secondary,
    available: true,
  };
}

/**
 * Encaje por anchura. La regla de oro del sector: la montura debe aproximarse
 * al ancho de la cara, y es mejor pasarse un poco que quedarse corta.
 */
function frameScale(face: FaceProfile, frame: FrameProfile): RawComponent {
  const frameWidth = frame.measurements.totalWidthMm;
  const faceWidth = estimateFaceWidthMm(face);

  if (frameWidth === null || faceWidth === null) {
    return { key: "frameScale", score: 0, available: false };
  }

  const delta = (frameWidth - faceWidth) / faceWidth;
  // Asimétrico a propósito: quedarse estrecho molesta más que sobrar.
  const tolerance = delta >= 0 ? 0.12 : 0.08;
  const z = delta / tolerance;

  return {
    key: "frameScale",
    score: clamp01(Math.exp(-(z * z))),
    available: true,
    estimated: true,
  };
}

function stylePreference(
  prefs: UserPreferences,
  frame: FrameProfile,
): RawComponent {
  // «No lo sé, recomiéndame» no es falta de datos: es ausencia de restricción.
  if (prefs.styles.length === 0) {
    return { key: "stylePreference", score: 0, available: false };
  }
  const wanted = new Set(prefs.styles);
  const hits = frame.styleTags.filter((t) => wanted.has(t)).length;
  return {
    key: "stylePreference",
    score: clamp01(hits / wanted.size),
    available: true,
  };
}

/**
 * Armonía de color **sobre lo que el usuario declara**.
 *
 * Deliberadamente NO se compara con el tono de piel ni con ningún rasgo de la
 * foto: inferir eso sería inferir un atributo personal sensible, que está
 * prohibido por CLAUDE.md regla 15. Sin preferencia declarada, el componente
 * no tiene datos y su peso se reparte.
 */
function colorHarmony(
  prefs: UserPreferences,
  frame: FrameProfile,
): RawComponent {
  const declared = prefs.styles.filter((s) => s.startsWith("color:"));
  if (declared.length === 0) {
    return { key: "colorHarmony", score: 0, available: false };
  }
  const wanted = new Set(declared.map((s) => s.slice("color:".length)));
  return {
    key: "colorHarmony",
    score: wanted.has(frame.colorFamily) ? 1 : 0.2,
    available: true,
  };
}

/** Encaje de categoría: presupuesto y coherencia material/grosor. */
function categoryFit(
  prefs: UserPreferences,
  frame: FrameProfile,
): RawComponent {
  const parts: number[] = [];

  if (prefs.budgetMaxCents !== null && frame.priceCents !== null) {
    const ratio = frame.priceCents / prefs.budgetMaxCents;
    // Dentro de presupuesto, puntúa igual: ser más barato no es mejor encaje.
    parts.push(ratio <= 1 ? 1 : clamp01(1 - (ratio - 1) / (BUDGET_TOLERANCE - 1)));
  }

  // Una montura muy gruesa no es «minimalista», diga lo que diga su etiqueta.
  if (prefs.styles.includes("minimalistas")) {
    parts.push(clamp01(1 - frame.thickness));
  }
  if (prefs.styles.includes("oversized")) {
    parts.push(clamp01(frame.thickness));
  }

  if (parts.length === 0) {
    return { key: "categoryFit", score: 0, available: false };
  }
  return {
    key: "categoryFit",
    score: parts.reduce((a, b) => a + b, 0) / parts.length,
    available: true,
  };
}

export function scoreFrame(
  face: FaceProfile,
  prefs: UserPreferences,
  frame: FrameProfile,
  weights: ScoreWeights = DEFAULT_WEIGHTS,
): FrameScore {
  const raw: RawComponent[] = [
    faceGeometry(face, frame),
    frameScale(face, frame),
    stylePreference(prefs, frame),
    colorHarmony(prefs, frame),
    categoryFit(prefs, frame),
  ];

  const availableWeight = raw
    .filter((c) => c.available)
    .reduce((sum, c) => sum + weights[c.key], 0);

  const components: ScoreComponent[] = raw.map((c) => ({
    ...c,
    // Reparto proporcional del peso de los componentes sin datos.
    weight: c.available && availableWeight > 0 ? weights[c.key] / availableWeight : 0,
  }));

  const total = components.reduce((sum, c) => sum + c.weight * c.score, 0);

  // Menos componentes con datos ⇒ menos confianza, aunque el total sea alto.
  const coverage = availableWeight;

  return {
    frameId: frame.id,
    total: round3(clamp01(total)),
    components,
    confidence: round3(clamp01(face.confidence * (0.5 + 0.5 * coverage))),
  };
}

export interface Recommendation {
  frame: FrameProfile;
  score: FrameScore;
  position: number;
}

export interface RecommendOptions {
  limit?: number;
  weights?: ScoreWeights;
  /** Máximo de monturas de la misma forma, para que las 6 no se parezcan. */
  maxPerShape?: number;
}

/**
 * Filtro duro previo al scoring: categoría y presupuesto fuera de tolerancia.
 * Lo que no se puede comprar no se recomienda, por bien que puntúe.
 */
function passesHardFilters(
  prefs: UserPreferences,
  frame: FrameProfile,
): boolean {
  if (frame.category !== prefs.category) return false;
  if (prefs.budgetMaxCents !== null && frame.priceCents !== null) {
    if (frame.priceCents > prefs.budgetMaxCents * BUDGET_TOLERANCE) return false;
  }
  return true;
}

/**
 * Recomienda monturas ya filtradas por derechos.
 *
 * **Este motor no comprueba derechos**: espera recibir solo monturas listables.
 * La comprobación vive en `lib/catalog/rights.ts` y se aplica en la capa que
 * consulta el catálogo, para que la lógica de producto no pueda saltársela por
 * descuido.
 */
export function recommend(
  face: FaceProfile,
  prefs: UserPreferences,
  frames: FrameProfile[],
  options: RecommendOptions = {},
): Recommendation[] {
  const { limit = 6, weights = DEFAULT_WEIGHTS, maxPerShape = 2 } = options;

  const scored = frames
    .filter((f) => f.active && passesHardFilters(prefs, f))
    .map((frame) => ({ frame, score: scoreFrame(face, prefs, frame, weights) }))
    .sort((a, b) => {
      if (b.score.total !== a.score.total) return b.score.total - a.score.total;
      // Desempate estable: sin esto el orden depende del orden de entrada.
      return a.frame.id.localeCompare(b.frame.id);
    });

  const perShape = new Map<string, number>();
  const picked: Recommendation[] = [];

  for (const candidate of scored) {
    if (picked.length >= limit) break;
    const used = perShape.get(candidate.frame.shape) ?? 0;
    if (used >= maxPerShape) continue;
    perShape.set(candidate.frame.shape, used + 1);
    picked.push({ ...candidate, position: picked.length + 1 });
  }

  // Si la diversidad por forma nos deja cortos, se completa con los mejores.
  if (picked.length < limit) {
    const already = new Set(picked.map((p) => p.frame.id));
    for (const candidate of scored) {
      if (picked.length >= limit) break;
      if (already.has(candidate.frame.id)) continue;
      picked.push({ ...candidate, position: picked.length + 1 });
    }
  }

  return picked;
}
