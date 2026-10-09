import type { FrameProfile } from "../../lib/catalog/types";

/**
 * Constructor de monturas para tests.
 *
 * Los tests no deben depender del contenido del catálogo: si mañana entra una
 * marca nueva o cambian unas medidas, un test de scoring no tiene por qué
 * ponerse rojo. Aquí se construye exactamente la montura que cada test
 * necesita.
 */

let counter = 0;

export function makeFrame(overrides: Partial<FrameProfile> = {}): FrameProfile {
  counter += 1;
  const id = overrides.id ?? `test-frame-${counter}`;

  return {
    id,
    slug: id,
    brandId: "test-brand",
    brand: "Marca de prueba",
    model: `Modelo ${counter}`,
    reference: null,
    shape: "rectangular",
    category: "sunglasses",
    material: "acetate",
    colorFamily: "black",
    colorName: "Negro",
    lensName: "Gris",
    thickness: 0.5,
    measurements: {
      // Frontal de 134 mm (2×58 + 18), que encaja bien en la cara sintética
      // de ~140 mm que usan los tests. Así los tests que no van de escala no
      // arrastran una penalización por anchura.
      totalWidthMm: null,
      lensWidthMm: 58,
      lensHeightMm: 42,
      bridgeMm: 18,
      templeMm: 145,
    },
    measurementsStatus: "indicative",
    priceCents: 7900,
    priceStatus: "indicative",
    priceCheckedAt: null,
    currency: "EUR",
    styleTags: [],
    productUrl: null,
    affiliateUrl: null,
    imageUrl: null,
    rights: {
      displayOfficialImage: "pending",
      deriveOfficialImage: "denied",
      useLogo: "pending",
      source: "test",
      verifiedAt: null,
    },
    active: true,
    updatedAt: "2026-10-09",
    ...overrides,
  };
}

/** Montura sin ninguna medida publicada, que es el caso más común. */
export function makeFrameWithoutMeasurements(
  overrides: Partial<FrameProfile> = {},
): FrameProfile {
  return makeFrame({
    measurements: {
      totalWidthMm: null,
      lensWidthMm: null,
      lensHeightMm: null,
      bridgeMm: null,
      templeMm: null,
    },
    measurementsStatus: "unknown",
    ...overrides,
  });
}

/**
 * Monturas de formas distintas, para tests de diversificación.
 * Todas con las mismas medidas, para que solo varíe la forma.
 */
export function makeFrameSet(): FrameProfile[] {
  const shapes = [
    "rectangular",
    "square",
    "round",
    "oval",
    "aviator",
    "cat-eye",
    "wayfarer",
    "geometric",
    "oversized",
  ] as const;

  return shapes.flatMap((shape, index) => [
    makeFrame({ id: `${shape}-a`, shape, thickness: 0.3 + index * 0.05 }),
    makeFrame({ id: `${shape}-b`, shape, thickness: 0.3 + index * 0.05 }),
  ]);
}
