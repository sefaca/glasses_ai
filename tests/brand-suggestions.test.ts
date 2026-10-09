import { describe, expect, it } from "vitest";
import type { Brand } from "../lib/catalog/brands";
import { classifyFace, SHAPE_CENTROIDS } from "../lib/face/classify";
import { NEUTRAL_FACE } from "../lib/face/neutral";
import { EMPTY_PREFERENCES, type FaceProfile } from "../lib/face/types";
import {
  suggestBrands,
  suggestionsAreMeaningful,
} from "../lib/recommendations/brands";
import { makeFrame } from "./helpers/frame";

/**
 * Sugerencia de marcas por rostro.
 *
 * La propiedad que importa: **el orden sale del catálogo de cada marca
 * puntuado contra esta cara**, no de su fama. Y si no hay cara, no hay
 * sugerencia que presentar.
 */

function faceOf(shape: keyof typeof SHAPE_CENTROIDS): FaceProfile {
  const c = SHAPE_CENTROIDS[shape];
  return classifyFace({
    widthHeightRatio: c.widthHeightRatio[0],
    jawWidthRatio: c.jawWidthRatio[0],
    foreheadWidthRatio: c.foreheadWidthRatio[0],
    cheekboneWidthRatio: c.cheekboneWidthRatio[0],
    eyeDistanceRatio: 0.45,
    headTiltDeg: 0,
    symmetry: 1,
  });
}

function brand(id: string, name: string): Brand {
  return {
    id,
    slug: id,
    name,
    group: null,
    country: "España",
    tier: "accessible",
    approachability: "high",
    tagline: "",
    active: true,
  };
}

/** Una casa de monturas angulares y otra de redondeadas. */
const ANGULAR = brand("angular", "Angular");
const CURVA = brand("curva", "Curva");
const BRANDS = [ANGULAR, CURVA];

const FRAMES = [
  makeFrame({ id: "a1", brandId: "angular", shape: "rectangular" }),
  makeFrame({ id: "a2", brandId: "angular", shape: "square" }),
  makeFrame({ id: "a3", brandId: "angular", shape: "wayfarer" }),
  makeFrame({ id: "c1", brandId: "curva", shape: "round" }),
  makeFrame({ id: "c2", brandId: "curva", shape: "oval" }),
  makeFrame({ id: "c3", brandId: "curva", shape: "aviator" }),
];

describe("sugerencia de marcas", () => {
  it("un rostro redondeado pone por delante la casa angular", () => {
    const [first] = suggestBrands(
      faceOf("round"),
      EMPTY_PREFERENCES,
      FRAMES,
      BRANDS,
    );
    expect(first!.brand.id).toBe("angular");
  });

  it("un rostro cuadrado invierte el orden", () => {
    const [first] = suggestBrands(
      faceOf("square"),
      EMPTY_PREFERENCES,
      FRAMES,
      BRANDS,
    );
    expect(first!.brand.id).toBe("curva");
  });

  it("informa de cuántas monturas tiene y con qué formas destaca", () => {
    const [first] = suggestBrands(
      faceOf("round"),
      EMPTY_PREFERENCES,
      FRAMES,
      BRANDS,
    );
    expect(first!.frameCount).toBe(3);
    expect(first!.topShapes.length).toBeGreaterThan(0);
  });

  it("omite las marcas sin monturas en el catálogo", () => {
    const vacia = brand("vacia", "Vacía");
    const result = suggestBrands(faceOf("oval"), EMPTY_PREFERENCES, FRAMES, [
      ...BRANDS,
      vacia,
    ]);
    expect(result.map((s) => s.brand.id)).not.toContain("vacia");
  });

  it("respeta la categoría declarada", () => {
    const graduadas = FRAMES.map((f) => ({ ...f, category: "optical" as const }));
    expect(
      suggestBrands(faceOf("oval"), EMPTY_PREFERENCES, graduadas, BRANDS),
    ).toHaveLength(0);
  });

  it("es determinista", () => {
    const face = faceOf("heart");
    const a = suggestBrands(face, EMPTY_PREFERENCES, FRAMES, BRANDS);
    const b = suggestBrands(face, EMPTY_PREFERENCES, [...FRAMES].reverse(), BRANDS);
    expect(a.map((s) => s.brand.id)).toEqual(b.map((s) => s.brand.id));
  });

  it("promedia solo las mejores, no todo el catálogo", () => {
    // Una casa con muchas monturas malas y tres buenas no debe hundirse: lo
    // que importa es si tiene algo bueno para ti.
    const conRelleno = [
      ...FRAMES,
      ...Array.from({ length: 10 }, (_, i) =>
        makeFrame({ id: `relleno-${i}`, brandId: "angular", shape: "round" }),
      ),
    ];
    const face = faceOf("round");
    const sinRelleno = suggestBrands(face, EMPTY_PREFERENCES, FRAMES, BRANDS);
    const con = suggestBrands(face, EMPTY_PREFERENCES, conRelleno, BRANDS);

    const antes = sinRelleno.find((s) => s.brand.id === "angular")!.score;
    const despues = con.find((s) => s.brand.id === "angular")!.score;
    expect(despues).toBeCloseTo(antes, 10);
  });
});

describe("cuándo NO presentar la sugerencia", () => {
  it("sin cara todas las marcas empatan y no hay nada que sugerir", () => {
    // Con perfil neutro la geometría puntúa plana. Presentar ese empate como
    // personalización sería falsa personalización.
    const result = suggestBrands(
      NEUTRAL_FACE,
      EMPTY_PREFERENCES,
      FRAMES,
      BRANDS,
    );
    expect(suggestionsAreMeaningful(result)).toBe(false);
  });

  it("con cara real sí hay diferencia que enseñar", () => {
    const result = suggestBrands(
      faceOf("round"),
      EMPTY_PREFERENCES,
      FRAMES,
      BRANDS,
    );
    expect(suggestionsAreMeaningful(result)).toBe(true);
  });

  it("una sola marca nunca es una sugerencia", () => {
    const result = suggestBrands(faceOf("round"), EMPTY_PREFERENCES, FRAMES, [
      ANGULAR,
    ]);
    expect(suggestionsAreMeaningful(result)).toBe(false);
  });
});
