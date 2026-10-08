import { describe, expect, it } from "vitest";
import {
  CLASSIFY_THRESHOLDS,
  SHAPE_CENTROIDS,
  classifyFace,
  scoreAllShapes,
} from "../lib/face/classify";
import type { FaceMeasurements } from "../lib/face/types";

/** Medidas que caen exactamente en el centroide de una forma. */
function atCentroid(
  shape: keyof typeof SHAPE_CENTROIDS,
  overrides: Partial<FaceMeasurements> = {},
): FaceMeasurements {
  const c = SHAPE_CENTROIDS[shape];
  return {
    widthHeightRatio: c.widthHeightRatio[0],
    jawWidthRatio: c.jawWidthRatio[0],
    foreheadWidthRatio: c.foreheadWidthRatio[0],
    cheekboneWidthRatio: c.cheekboneWidthRatio[0],
    eyeDistanceRatio: 0.45,
    headTiltDeg: 0,
    symmetry: 1,
    ...overrides,
  };
}

describe("clasificación de forma facial", () => {
  it("reconoce cada forma en su propio centroide", () => {
    for (const shape of Object.keys(SHAPE_CENTROIDS) as Array<
      keyof typeof SHAPE_CENTROIDS
    >) {
      expect(classifyFace(atCentroid(shape)).shapePrimary).toBe(shape);
    }
  });

  it("devuelve unknown en vez de inventar una forma cuando nada encaja", () => {
    const absurd: FaceMeasurements = {
      widthHeightRatio: 1.8,
      jawWidthRatio: 0.15,
      foreheadWidthRatio: 0.15,
      cheekboneWidthRatio: 0.4,
      eyeDistanceRatio: 0.45,
      headTiltDeg: 0,
      symmetry: 1,
    };
    const profile = classifyFace(absurd);
    expect(profile.shapePrimary).toBe("unknown");
    expect(profile.shapeSecondary).toBeNull();
    expect(profile.confidence).toBe(0);
  });

  it("expone una forma secundaria cuando dos quedan cerca", () => {
    // Punto medio entre oval y oblong: ninguna debe dominar.
    const oval = SHAPE_CENTROIDS.oval;
    const oblong = SHAPE_CENTROIDS.oblong;
    const between = atCentroid("oval", {
      widthHeightRatio:
        (oval.widthHeightRatio[0] + oblong.widthHeightRatio[0]) / 2,
    });
    const profile = classifyFace(between);
    const ranked = scoreAllShapes(between);
    const gap = ranked[0]!.score - ranked[1]!.score;

    expect(gap).toBeLessThan(CLASSIFY_THRESHOLDS.secondaryWithin);
    expect(profile.shapeSecondary).not.toBeNull();
  });

  it("una cabeza girada baja la confianza sin cambiar la forma", () => {
    const straight = classifyFace(atCentroid("square"));
    const tilted = classifyFace(atCentroid("square", { headTiltDeg: 22 }));

    expect(tilted.shapePrimary).toBe(straight.shapePrimary);
    expect(tilted.confidence).toBeLessThan(straight.confidence);
  });

  it("una cara asimétrica baja la confianza", () => {
    const symmetric = classifyFace(atCentroid("round"));
    const asymmetric = classifyFace(atCentroid("round", { symmetry: 0.4 }));
    expect(asymmetric.confidence).toBeLessThan(symmetric.confidence);
  });

  it("es determinista", () => {
    const m = atCentroid("heart");
    expect(classifyFace(m)).toEqual(classifyFace(m));
  });
});
