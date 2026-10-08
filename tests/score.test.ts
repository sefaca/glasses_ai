import { describe, expect, it } from "vitest";
import { classifyFace, SHAPE_CENTROIDS } from "../lib/face/classify";
import { NEUTRAL_FACE } from "../lib/face/neutral";
import { EMPTY_PREFERENCES, type FaceProfile } from "../lib/face/types";
import { DEV_FRAMES } from "../lib/catalog/seed";
import type { FrameProfile } from "../lib/catalog/types";
import { recommend, scoreFrame } from "../lib/recommendations/score";
import { DEFAULT_WEIGHTS } from "../lib/recommendations/weights";
import { explainRecommendation } from "../lib/recommendations/explain";

function faceOf(shape: keyof typeof SHAPE_CENTROIDS): FaceProfile {
  const c = SHAPE_CENTROIDS[shape];
  return classifyFace({
    widthHeightRatio: c.widthHeightRatio[0],
    jawWidthRatio: c.jawWidthRatio[0],
    foreheadWidthRatio: c.foreheadWidthRatio[0],
    cheekboneWidthRatio: c.cheekboneWidthRatio[0],
    eyeDistanceRatio: 0.45, // ⇒ anchura de cara estimada ≈ 140 mm
    headTiltDeg: 0,
    symmetry: 1,
  });
}

describe("configuración del scoring", () => {
  it("los pesos suman 1", () => {
    const sum = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 10);
  });
});

describe("scoreFrame", () => {
  it("un rostro redondeado puntúa más alto una montura angular que una redonda", () => {
    const face = faceOf("round");
    const rectangular = DEV_FRAMES.find((f) => f.slug === "linea-01")!;
    const round = DEV_FRAMES.find((f) => f.slug === "circulo-01")!;

    const a = scoreFrame(face, EMPTY_PREFERENCES, rectangular);
    const b = scoreFrame(face, EMPTY_PREFERENCES, round);
    expect(a.total).toBeGreaterThan(b.total);
  });

  it("un rostro cuadrado invierte esa preferencia", () => {
    const face = faceOf("square");
    const rectangular = DEV_FRAMES.find((f) => f.slug === "linea-01")!;
    const round = DEV_FRAMES.find((f) => f.slug === "circulo-01")!;

    expect(scoreFrame(face, EMPTY_PREFERENCES, round).total).toBeGreaterThan(
      scoreFrame(face, EMPTY_PREFERENCES, rectangular).total,
    );
  });

  it("no penaliza a una montura por carecer de medidas: reparte el peso", () => {
    // GA-4 sin resolver: muchas fuentes no dan calibre ni puente. Una montura
    // sin medidas debe competir por lo que sí sabemos, no cargar con un 0.
    const face = faceOf("round");
    const withMeasures = DEV_FRAMES.find((f) => f.slug === "linea-01")!;
    const withoutMeasures: FrameProfile = {
      ...withMeasures,
      id: "dev-sin-medidas",
      measurements: {
        totalWidthMm: null,
        lensWidthMm: null,
        lensHeightMm: null,
        bridgeMm: null,
        templeMm: null,
      },
    };

    const score = scoreFrame(face, EMPTY_PREFERENCES, withoutMeasures);
    const scale = score.components.find((c) => c.key === "frameScale")!;
    const geometry = score.components.find((c) => c.key === "faceGeometry")!;

    expect(scale.available).toBe(false);
    expect(scale.weight).toBe(0);
    // Al ser el único componente con datos, la geometría se queda todo el peso.
    expect(geometry.weight).toBeCloseTo(1, 10);
    expect(score.total).toBeCloseTo(geometry.score, 10);
  });

  it("marca como estimado el encaje por anchura", () => {
    // Depende de la DIP media de población, no de una medición. Por eso la
    // explicación no puede afirmar milímetros → CLAUDE.md §9.4.
    const score = scoreFrame(faceOf("oval"), EMPTY_PREFERENCES, DEV_FRAMES[0]!);
    const scale = score.components.find((c) => c.key === "frameScale")!;
    expect(scale.available).toBe(true);
    expect(scale.estimated).toBe(true);
  });

  it("menos datos disponibles ⇒ menos confianza", () => {
    const face = faceOf("oval");
    const complete = scoreFrame(face, EMPTY_PREFERENCES, DEV_FRAMES[0]!);
    const sparse = scoreFrame(face, EMPTY_PREFERENCES, {
      ...DEV_FRAMES[0]!,
      measurements: {
        totalWidthMm: null,
        lensWidthMm: null,
        lensHeightMm: null,
        bridgeMm: null,
        templeMm: null,
      },
    });
    expect(sparse.confidence).toBeLessThan(complete.confidence);
  });

  it("respeta el estilo declarado", () => {
    const face = faceOf("oval");
    const prefs = { ...EMPTY_PREFERENCES, styles: ["minimalistas"] };
    const minimal = DEV_FRAMES.find((f) => f.slug === "elipse-01")!;
    const chunky = DEV_FRAMES.find((f) => f.slug === "amplia-02")!;

    expect(scoreFrame(face, prefs, minimal).total).toBeGreaterThan(
      scoreFrame(face, prefs, chunky).total,
    );
  });
});

describe("recommend", () => {
  const face = faceOf("round");

  it("devuelve 6 recomendaciones ordenadas", () => {
    const recs = recommend(face, EMPTY_PREFERENCES, DEV_FRAMES);
    expect(recs).toHaveLength(6);
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i - 1]!.score.total).toBeGreaterThanOrEqual(
        recs[i]!.score.total,
      );
    }
    expect(recs.map((r) => r.position)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("diversifica: no más de 2 monturas de la misma forma", () => {
    const recs = recommend(face, EMPTY_PREFERENCES, DEV_FRAMES);
    const perShape = new Map<string, number>();
    for (const r of recs) {
      perShape.set(r.frame.shape, (perShape.get(r.frame.shape) ?? 0) + 1);
    }
    for (const count of perShape.values()) {
      expect(count).toBeLessThanOrEqual(2);
    }
  });

  it("con todo empatado devuelve 6 formas distintas, no las 6 primeras", () => {
    // Perfil neutro: el único componente con datos es la geometría, que para
    // una forma desconocida es plana, así que todas las monturas empatan. En
    // ese caso la variedad es lo único que aporta valor — enseñar dos Amplia
    // y dos Bloque por orden alfabético sería lo contrario de reducir la
    // elección.
    const recs = recommend(NEUTRAL_FACE, EMPTY_PREFERENCES, DEV_FRAMES);
    const totals = new Set(recs.map((r) => r.score.total));
    expect(totals.size).toBe(1); // efectivamente, todo empatado

    const shapes = recs.map((r) => r.frame.shape);
    expect(new Set(shapes).size).toBe(6);
  });

  it("cuando los scores difieren, la mejor montura sigue siendo la primera", () => {
    // La diversificación no puede costar la posición 1: ordena las formas por
    // su mejor montura, así que la ganadora absoluta abre la lista.
    const recs = recommend(face, EMPTY_PREFERENCES, DEV_FRAMES);
    const best = [...DEV_FRAMES]
      .map((frame) => ({ frame, total: scoreFrame(face, EMPTY_PREFERENCES, frame).total }))
      .sort((a, b) => b.total - a.total)[0]!;
    expect(recs[0]!.frame.id).toBe(best.frame.id);
  });

  it("es determinista, incluso con empates", () => {
    const shuffled = [...DEV_FRAMES].reverse();
    const a = recommend(face, EMPTY_PREFERENCES, DEV_FRAMES);
    const b = recommend(face, EMPTY_PREFERENCES, shuffled);
    expect(a.map((r) => r.frame.id)).toEqual(b.map((r) => r.frame.id));
  });

  it("el presupuesto es un filtro duro con tolerancia", () => {
    const prefs = { ...EMPTY_PREFERENCES, budgetMaxCents: 5000 };
    const recs = recommend(face, prefs, DEV_FRAMES, { limit: 20 });
    for (const r of recs) {
      // 5000 × 1.15 de tolerancia
      expect(r.frame.priceCents!).toBeLessThanOrEqual(5750);
    }
    expect(recs.length).toBeGreaterThan(0);
  });

  it("nunca devuelve más monturas de las que hay", () => {
    const recs = recommend(face, EMPTY_PREFERENCES, DEV_FRAMES.slice(0, 3), {
      limit: 6,
    });
    expect(recs).toHaveLength(3);
  });
});

describe("explicaciones", () => {
  it("no afirma ninguna medida concreta", () => {
    const face = faceOf("round");
    for (const frame of DEV_FRAMES) {
      const text = explainRecommendation(
        frame,
        scoreFrame(face, EMPTY_PREFERENCES, frame),
      );
      // La escala es estimada: mencionar mm sería inventar precisión.
      expect(text).not.toMatch(/\d+\s*mm/i);
      expect(text).not.toMatch(/\d/);
      expect(text.length).toBeGreaterThan(0);
    }
  });

  it("cae a un texto genérico cuando no hay ningún componente fuerte", () => {
    // Forma desconocida ⇒ geometría neutra (0.6), por debajo del umbral de 0.7
    // que exige la plantilla. Y sin medidas, tampoco hay nada que decir de la
    // anchura. La explicación no debe quedarse vacía ni inventar un motivo.
    const unknownFace = classifyFace({
      widthHeightRatio: 1.8,
      jawWidthRatio: 0.15,
      foreheadWidthRatio: 0.15,
      cheekboneWidthRatio: 0.4,
      eyeDistanceRatio: 0.45,
      headTiltDeg: 0,
      symmetry: 1,
    });
    expect(unknownFace.shapePrimary).toBe("unknown");

    const frame: FrameProfile = {
      ...DEV_FRAMES[0]!,
      measurements: {
        totalWidthMm: null,
        lensWidthMm: null,
        lensHeightMm: null,
        bridgeMm: null,
        templeMm: null,
      },
    };
    const text = explainRecommendation(
      frame,
      scoreFrame(unknownFace, EMPTY_PREFERENCES, frame),
    );
    expect(text).toBe("Una opción equilibrada para empezar a comparar.");
  });
});
