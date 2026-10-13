import { describe, expect, it } from "vitest";
import {
  QUALITY_THRESHOLDS,
  checkQuality,
  primaryIssue,
  type QualityIssue,
} from "../lib/face/quality";
import { LOCALES, getDictionary } from "../lib/i18n";
import { buildSyntheticFace } from "./helpers/synthetic-face";

/** Todos los problemas que el check sabe detectar. */
const ALL_ISSUES: QualityIssue[] = [
  "no-face",
  "multiple-faces",
  "incomplete-landmarks",
  "head-turned",
  "head-tilted",
  "eyes-closed",
  "face-too-small",
  "resolution-too-low",
];

/**
 * El quality check tiene dos trabajos: no analizar una foto inservible y
 * **no mandar una foto mala a un proveedor caro** → CLAUDE.md §8.4.
 *
 * Y uno de producto: cuando falla, decir qué hacer diferente.
 */

describe("quality check", () => {
  it("una foto frontal y nítida pasa", () => {
    const { landmarks, image } = buildSyntheticFace();
    const result = checkQuality([landmarks], image);
    expect(result).toEqual({ ok: true, issues: [] });
  });

  it("sin cara, para ahí mismo", () => {
    const { image } = buildSyntheticFace();
    const result = checkQuality([], image);
    expect(result.ok).toBe(false);
    expect(result.issues).toContain("no-face");
  });

  it("con más de una persona, para ahí mismo", () => {
    const { landmarks, image } = buildSyntheticFace();
    const result = checkQuality([landmarks, landmarks], image);
    expect(result.ok).toBe(false);
    expect(result.issues).toContain("multiple-faces");
  });

  it("sin iris no se analiza: faltaría la distancia interpupilar", () => {
    const { landmarks, image } = buildSyntheticFace();
    const result = checkQuality([landmarks.slice(0, 468)], image);
    expect(result.ok).toBe(false);
    expect(result.issues).toContain("incomplete-landmarks");
  });

  it("rechaza una foto de poca resolución", () => {
    const { landmarks } = buildSyntheticFace({
      cheekboneWidthPx: 150,
      image: { width: 320, height: 400 },
    });
    const result = checkQuality([landmarks], { width: 320, height: 400 });
    expect(result.issues).toContain("resolution-too-low");
  });

  it("rechaza una cara demasiado pequeña en el encuadre", () => {
    const { landmarks, image } = buildSyntheticFace({ cheekboneWidthPx: 100 });
    const result = checkQuality([landmarks], image);
    expect(result.ok).toBe(false);
    expect(result.issues).toContain("face-too-small");
  });

  it("rechaza una cabeza girada", () => {
    // 80 px de desplazamiento sobre 400 de ancho ⇒ yaw 0,4, por encima de 0,28.
    const { landmarks, image } = buildSyntheticFace({ noseOffsetPx: 80 });
    const result = checkQuality([landmarks], image);
    expect(result.ok).toBe(false);
    expect(result.issues).toContain("head-turned");
  });

  it("acepta un giro pequeño: la gente no posa como en un carnet", () => {
    const { landmarks, image } = buildSyntheticFace({ noseOffsetPx: 30 });
    expect(checkQuality([landmarks], image).ok).toBe(true);
  });

  it("rechaza una cabeza muy inclinada", () => {
    const { landmarks, image } = buildSyntheticFace({ tiltDeg: 28 });
    const result = checkQuality([landmarks], image);
    expect(result.ok).toBe(false);
    expect(result.issues).toContain("head-tilted");
  });

  it("acepta una inclinación natural", () => {
    const { landmarks, image } = buildSyntheticFace({ tiltDeg: 8 });
    expect(checkQuality([landmarks], image).ok).toBe(true);
  });

  it("rechaza ojos cerrados o entornados", () => {
    const { landmarks, image } = buildSyntheticFace({ eyeOpenness: 0.05 });
    const result = checkQuality([landmarks], image);
    expect(result.ok).toBe(false);
    expect(result.issues).toContain("eyes-closed");
  });

  it("los umbrales son configurables, no constantes mágicas", () => {
    expect(QUALITY_THRESHOLDS.minImageSide).toBeGreaterThan(0);
    expect(QUALITY_THRESHOLDS.maxYaw).toBeLessThan(1);
  });
});

describe("problema que se le cuenta al usuario", () => {
  it("una foto correcta no genera ningún problema", () => {
    const { landmarks, image } = buildSyntheticFace();
    expect(primaryIssue(checkQuality([landmarks], image))).toBeNull();
  });

  it("devuelve un solo problema, el de mayor prioridad", () => {
    // Ojos cerrados y cara pequeña a la vez: se dice lo primero, porque una
    // lista de seis correcciones no se lee y arreglar la primera suele
    // arreglar varias.
    const { landmarks, image } = buildSyntheticFace({
      eyeOpenness: 0.04,
      cheekboneWidthPx: 100,
    });
    const result = checkQuality([landmarks], image);

    expect(result.issues).toContain("eyes-closed");
    expect(result.issues).toContain("face-too-small");
    // Ojos cerrados gana a cara pequeña: está antes en la prioridad.
    expect(primaryIssue(result)).toBe("eyes-closed");
  });

  it("sin cara, el problema es la cara y no otra cosa", () => {
    const { image } = buildSyntheticFace();
    expect(primaryIssue(checkQuality([], image))).toBe("no-face");
  });

  it("los cinco idiomas tienen texto para cada problema", () => {
    // Es la red que evita que a un usuario alemán le salga un error vacío:
    // si se añade un problema nuevo, esto falla hasta que esté traducido.
    for (const locale of LOCALES) {
      const texts = getDictionary(locale).upload.quality;
      for (const issue of ALL_ISSUES) {
        expect(texts[issue]?.length ?? 0).toBeGreaterThan(0);
      }
    }
  });
});
