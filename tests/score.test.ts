import { describe, expect, it } from "vitest";
import { classifyFace, SHAPE_CENTROIDS } from "../lib/face/classify";
import { NEUTRAL_FACE } from "../lib/face/neutral";
import { EMPTY_PREFERENCES, type FaceProfile } from "../lib/face/types";
import { explainRecommendation } from "../lib/recommendations/explain";
import { recommend, scoreFrame } from "../lib/recommendations/score";
import { DEFAULT_WEIGHTS } from "../lib/recommendations/weights";
import {
  makeFrame,
  makeFrameSet,
  makeFrameWithoutMeasurements,
} from "./helpers/frame";

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
    const angular = makeFrame({ shape: "rectangular" });
    const redonda = makeFrame({ shape: "round" });

    expect(scoreFrame(face, EMPTY_PREFERENCES, angular).total).toBeGreaterThan(
      scoreFrame(face, EMPTY_PREFERENCES, redonda).total,
    );
  });

  it("un rostro cuadrado invierte esa preferencia", () => {
    const face = faceOf("square");
    const angular = makeFrame({ shape: "rectangular" });
    const redonda = makeFrame({ shape: "round" });

    expect(scoreFrame(face, EMPTY_PREFERENCES, redonda).total).toBeGreaterThan(
      scoreFrame(face, EMPTY_PREFERENCES, angular).total,
    );
  });

  it("no penaliza a una montura por carecer de medidas: reparte el peso", () => {
    // Es el caso más común del catálogo real: casi nadie publica medidas
    // completas. Una montura sin ellas debe competir por lo que sí sabemos.
    const face = faceOf("round");
    const score = scoreFrame(
      face,
      EMPTY_PREFERENCES,
      makeFrameWithoutMeasurements({ shape: "rectangular" }),
    );
    const scale = score.components.find((c) => c.key === "frameScale")!;
    const geometry = score.components.find((c) => c.key === "faceGeometry")!;

    expect(scale.available).toBe(false);
    expect(scale.weight).toBe(0);
    expect(geometry.weight).toBeCloseTo(1, 10);
    expect(score.total).toBeCloseTo(geometry.score, 10);
  });

  it("usa la anchura del frontal cuando no hay anchura total publicada", () => {
    // 2×lente + puente. No es una estimación: es aritmética sobre valores
    // que sí publica todo el mundo.
    const score = scoreFrame(
      faceOf("oval"),
      EMPTY_PREFERENCES,
      makeFrame({ measurements: {
        totalWidthMm: null,
        lensWidthMm: 58,
        lensHeightMm: 42,
        bridgeMm: 18,
        templeMm: 145,
      } }),
    );
    const scale = score.components.find((c) => c.key === "frameScale")!;
    expect(scale.available).toBe(true);
    expect(scale.estimated).toBe(true);
  });

  it("menos datos disponibles ⇒ menos confianza", () => {
    const face = faceOf("oval");
    const completa = scoreFrame(face, EMPTY_PREFERENCES, makeFrame());
    const escasa = scoreFrame(
      face,
      EMPTY_PREFERENCES,
      makeFrameWithoutMeasurements(),
    );
    expect(escasa.confidence).toBeLessThan(completa.confidence);
  });

  it("respeta el estilo declarado", () => {
    const face = faceOf("oval");
    const prefs = { ...EMPTY_PREFERENCES, styles: ["minimalistas"] };
    const minimal = makeFrame({ styleTags: ["minimalistas"], thickness: 0.15 });
    const gruesa = makeFrame({ styleTags: ["oversized"], thickness: 0.9 });

    expect(scoreFrame(face, prefs, minimal).total).toBeGreaterThan(
      scoreFrame(face, prefs, gruesa).total,
    );
  });
});

describe("recommend", () => {
  const face = faceOf("round");

  it("devuelve 6 recomendaciones ordenadas", () => {
    const recs = recommend(face, EMPTY_PREFERENCES, makeFrameSet());
    expect(recs).toHaveLength(6);
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i - 1]!.score.total).toBeGreaterThanOrEqual(
        recs[i]!.score.total,
      );
    }
    expect(recs.map((r) => r.position)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("diversifica: no más de 2 monturas de la misma forma", () => {
    const recs = recommend(face, EMPTY_PREFERENCES, makeFrameSet());
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
    // una forma desconocida es plana. En ese empate la variedad es lo único
    // que aporta valor.
    const frames = makeFrameSet().map((f) =>
      makeFrameWithoutMeasurements({ id: f.id, shape: f.shape }),
    );
    const recs = recommend(NEUTRAL_FACE, EMPTY_PREFERENCES, frames);

    expect(new Set(recs.map((r) => r.score.total)).size).toBe(1);
    expect(new Set(recs.map((r) => r.frame.shape)).size).toBe(6);
  });

  it("cuando los scores difieren, la mejor montura sigue siendo la primera", () => {
    const frames = makeFrameSet();
    const recs = recommend(face, EMPTY_PREFERENCES, frames);
    const mejor = [...frames]
      .map((frame) => ({
        frame,
        total: scoreFrame(face, EMPTY_PREFERENCES, frame).total,
      }))
      .sort((a, b) => b.total - a.total)[0]!;
    expect(recs[0]!.frame.id).toBe(mejor.frame.id);
  });

  it("es determinista, incluso con empates", () => {
    const frames = makeFrameSet();
    const a = recommend(face, EMPTY_PREFERENCES, frames);
    const b = recommend(face, EMPTY_PREFERENCES, [...frames].reverse());
    expect(a.map((r) => r.frame.id)).toEqual(b.map((r) => r.frame.id));
  });

  it("nunca devuelve más monturas de las que hay", () => {
    const recs = recommend(face, EMPTY_PREFERENCES, makeFrameSet().slice(0, 3), {
      limit: 6,
    });
    expect(recs).toHaveLength(3);
  });

  it("filtra por categoría", () => {
    const graduada = makeFrame({ category: "optical" });
    const recs = recommend(face, EMPTY_PREFERENCES, [graduada], { limit: 6 });
    expect(recs).toHaveLength(0);
  });
});

describe("explicaciones", () => {
  it("no afirma ninguna medida concreta", () => {
    const face = faceOf("round");
    for (const frame of makeFrameSet()) {
      const text = explainRecommendation(
        frame,
        scoreFrame(face, EMPTY_PREFERENCES, frame),
      );
      // La escala es estimada: mencionar milímetros sería inventar precisión.
      expect(text).not.toMatch(/\d/);
      expect(text.length).toBeGreaterThan(0);
    }
  });

  it("cae a un texto genérico cuando no hay ningún componente fuerte", () => {
    const desconocida = classifyFace({
      widthHeightRatio: 1.8,
      jawWidthRatio: 0.15,
      foreheadWidthRatio: 0.15,
      cheekboneWidthRatio: 0.4,
      eyeDistanceRatio: 0.45,
      headTiltDeg: 0,
      symmetry: 1,
    });
    expect(desconocida.shapePrimary).toBe("unknown");

    const frame = makeFrameWithoutMeasurements();
    const text = explainRecommendation(
      frame,
      scoreFrame(desconocida, EMPTY_PREFERENCES, frame),
    );
    expect(text).toBe("Una opción equilibrada para empezar a comparar.");
  });
});
