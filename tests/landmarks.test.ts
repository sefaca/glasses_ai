import { describe, expect, it } from "vitest";
import { classifyFace } from "../lib/face/classify";
import {
  estimateYaw,
  extractMeasurements,
  eyeOpenness,
  faceCoverage,
} from "../lib/face/landmarks";
import { buildSyntheticFace } from "./helpers/synthetic-face";

describe("extracción de medidas", () => {
  it("convierte una geometría conocida en los ratios esperados", () => {
    // Pómulos 400, frente 340, mandíbula 320, alto 500, interpupilar 180.
    // El ancho de referencia es el máximo de las tres anchuras: 400.
    const { landmarks, image } = buildSyntheticFace();
    const m = extractMeasurements(landmarks, image)!;

    expect(m.widthHeightRatio).toBeCloseTo(400 / 500, 6);
    expect(m.cheekboneWidthRatio).toBeCloseTo(1, 6);
    expect(m.foreheadWidthRatio).toBeCloseTo(340 / 400, 6);
    expect(m.jawWidthRatio).toBeCloseTo(320 / 400, 6);
    expect(m.eyeDistanceRatio).toBeCloseTo(180 / 400, 6);
  });

  it("es independiente del formato de la foto", () => {
    // El fallo que esto previene: MediaPipe normaliza 0..1 **por eje**, así que
    // en una foto 4:3 un dx de 0,1 no mide lo mismo que un dy de 0,1. Si no se
    // multiplica por ancho y alto antes de medir, todas las proporciones salen
    // sesgadas por el formato de la foto en lugar de por la cara.
    const vertical = buildSyntheticFace({ image: { width: 1000, height: 1250 } });
    const horizontal = buildSyntheticFace({ image: { width: 1250, height: 1000 } });

    const a = extractMeasurements(vertical.landmarks, vertical.image)!;
    const b = extractMeasurements(horizontal.landmarks, horizontal.image)!;

    expect(a.widthHeightRatio).toBeCloseTo(b.widthHeightRatio, 6);
    expect(a.jawWidthRatio).toBeCloseTo(b.jawWidthRatio, 6);
    expect(a.foreheadWidthRatio).toBeCloseTo(b.foreheadWidthRatio, 6);
    expect(a.eyeDistanceRatio).toBeCloseTo(b.eyeDistanceRatio, 6);
  });

  it("el ancho de referencia es el máximo de las tres anchuras", () => {
    // Rostro de corazón: la frente es el tercio más ancho, así que es ella la
    // que vale 1 y la mandíbula queda muy por debajo.
    const { landmarks, image } = buildSyntheticFace({
      foreheadWidthPx: 420,
      cheekboneWidthPx: 400,
      jawWidthPx: 280,
    });
    const m = extractMeasurements(landmarks, image)!;

    expect(m.foreheadWidthRatio).toBeCloseTo(1, 6);
    expect(m.cheekboneWidthRatio).toBeCloseTo(400 / 420, 6);
    expect(m.jawWidthRatio).toBeCloseTo(280 / 420, 6);
  });

  it("mide la inclinación de la línea entre pupilas", () => {
    const { landmarks, image } = buildSyntheticFace({ tiltDeg: 15 });
    expect(extractMeasurements(landmarks, image)!.headTiltDeg).toBeCloseTo(15, 4);
  });

  it("un rostro simétrico da simetría 1 y uno desplazado, menos", () => {
    const simetrico = buildSyntheticFace();
    const torcido = buildSyntheticFace({ asymmetryPx: 40 });

    expect(
      extractMeasurements(simetrico.landmarks, simetrico.image)!.symmetry,
    ).toBeCloseTo(1, 6);
    expect(
      extractMeasurements(torcido.landmarks, torcido.image)!.symmetry,
    ).toBeLessThan(1);
  });

  it("devuelve null sin iris en vez de inventar la distancia interpupilar", () => {
    const { landmarks, image } = buildSyntheticFace();
    expect(extractMeasurements(landmarks.slice(0, 468), image)).toBeNull();
  });

  it("devuelve null con una imagen de tamaño imposible", () => {
    const { landmarks } = buildSyntheticFace();
    expect(extractMeasurements(landmarks, { width: 0, height: 0 })).toBeNull();
  });
});

describe("señales auxiliares", () => {
  it("el proxy de giro es 0 de frente y crece al desplazar la nariz", () => {
    const frente = buildSyntheticFace();
    expect(estimateYaw(frente.landmarks, frente.image)).toBeCloseTo(0, 6);

    // Nariz 60 px fuera del centro sobre 400 de ancho ⇒ 2·60/400 = 0,3.
    const girado = buildSyntheticFace({ noseOffsetPx: 60 });
    expect(estimateYaw(girado.landmarks, girado.image)).toBeCloseTo(0.3, 6);
  });

  it("mide la apertura de cada ojo", () => {
    const { landmarks, image } = buildSyntheticFace({ eyeOpenness: 0.25 });
    expect(eyeOpenness(landmarks, image, "left")).toBeCloseTo(0.25, 6);
    expect(eyeOpenness(landmarks, image, "right")).toBeCloseTo(0.25, 6);
  });

  it("mide cuánto del ancho de la foto ocupa la cara", () => {
    const { landmarks, image } = buildSyntheticFace({
      cheekboneWidthPx: 300,
      image: { width: 1000, height: 1000 },
    });
    expect(faceCoverage(landmarks, image)).toBeCloseTo(0.3, 6);
  });
});

describe("integración: landmarks → perfil facial", () => {
  it("una geometría equilibrada se clasifica como ovalada", () => {
    // Cierra el circuito puro completo: puntos → medidas → clasificación, sin
    // red neuronal ni navegador de por medio.
    const { landmarks, image } = buildSyntheticFace();
    const profile = classifyFace(extractMeasurements(landmarks, image)!);

    expect(profile.shapePrimary).toBe("oval");
    expect(profile.confidence).toBeGreaterThan(0.5);
  });

  it("una mandíbula estrecha y frente ancha se clasifica como corazón", () => {
    const { landmarks, image } = buildSyntheticFace({
      foreheadWidthPx: 400,
      cheekboneWidthPx: 400,
      jawWidthPx: 272, // 0,68 del ancho de referencia
      faceHeightPx: 500,
    });
    const profile = classifyFace(extractMeasurements(landmarks, image)!);
    expect(profile.shapePrimary).toBe("heart");
  });

  it("una cabeza girada reduce la confianza del perfil", () => {
    const recto = buildSyntheticFace();
    const inclinado = buildSyntheticFace({ tiltDeg: 18 });

    const a = classifyFace(extractMeasurements(recto.landmarks, recto.image)!);
    const b = classifyFace(
      extractMeasurements(inclinado.landmarks, inclinado.image)!,
    );
    expect(b.confidence).toBeLessThan(a.confidence);
  });
});
