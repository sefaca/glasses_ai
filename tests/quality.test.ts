import { describe, expect, it } from "vitest";
import {
  QUALITY_THRESHOLDS,
  checkQuality,
  primaryIssueMessage,
} from "../lib/face/quality";
import { buildSyntheticFace } from "./helpers/synthetic-face";

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

describe("mensaje al usuario", () => {
  it("una foto correcta no genera mensaje", () => {
    const { landmarks, image } = buildSyntheticFace();
    expect(primaryIssueMessage(checkQuality([landmarks], image))).toBeNull();
  });

  it("devuelve un solo mensaje, el de mayor prioridad", () => {
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
    expect(primaryIssueMessage(result)).toMatch(/ojos/i);
  });

  it("el mensaje dice qué hacer, no qué ha fallado", () => {
    const { image } = buildSyntheticFace();
    const message = primaryIssueMessage(checkQuality([], image))!;
    expect(message).toMatch(/prueba|necesitamos/i);
  });
});
