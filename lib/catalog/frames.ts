import type {
  ColorFamily,
  FrameMaterial,
  FrameProfile,
  FrameShape,
  MeasurementsStatus,
} from "./types";
import { brandName } from "./brands";

/**
 * Catálogo de monturas reales.
 *
 * **Qué hay y qué no.** Marca, modelo y referencia son hechos públicos y
 * nombrarlos es uso nominativo (D-021). Lo que no hay es ninguna imagen suya:
 * la ficha se dibuja con nuestro propio glifo hasta que GA-1 se resuelva.
 *
 * **Sobre las medidas, con honestidad.** Las fuentes consultadas se
 * contradicen: para la RB2132 unas dan 52/55 y otras 58; los puentes apenas se
 * publican. Así que aquí **no se inventa ni un milímetro**. Donde la notación
 * de sector (lente-puente-varilla) es consistente entre fuentes, se anota como
 * `indicative`; donde no, las medidas van a `null` y `unknown`, y el motor
 * degrada solo: reparte el peso del componente de escala en lugar de
 * penalizar a la montura por un dato que falta.
 *
 * Rellenar las medidas desde las fichas oficiales de cada marca es una tarea
 * de datos pendiente y acotada, no un problema de diseño.
 */

interface FrameInput {
  id: string;
  brandId: string;
  model: string;
  reference: string | null;
  shape: FrameShape;
  material: FrameMaterial;
  colorFamily: ColorFamily;
  colorName: string;
  lensName: string;
  thickness: number;
  styleTags: string[];
  /** Notación de sector: [lente, puente, varilla]. `null` si no la sabemos. */
  notation?: [lens: number, bridge: number, temple: number] | null;
  lensHeightMm?: number | null;
  measurementsStatus: MeasurementsStatus;
  note?: string;
}

function frame(input: FrameInput): FrameProfile {
  const [lens, bridge, temple] = input.notation ?? [null, null, null];
  return {
    id: input.id,
    slug: input.id,
    brandId: input.brandId,
    brand: brandName(input.brandId),
    model: input.model,
    reference: input.reference,
    shape: input.shape,
    category: "sunglasses",
    material: input.material,
    colorFamily: input.colorFamily,
    colorName: input.colorName,
    lensName: input.lensName,
    thickness: input.thickness,
    measurements: {
      totalWidthMm: null, // casi nadie lo publica; se deriva del frontal
      lensWidthMm: lens,
      lensHeightMm: input.lensHeightMm ?? null,
      bridgeMm: bridge,
      templeMm: temple,
    },
    measurementsStatus: input.measurementsStatus,
    priceCents: null,
    priceStatus: "unknown",
    priceCheckedAt: null,
    currency: "EUR",
    styleTags: input.styleTags,
    productUrl: null,
    affiliateUrl: null,
    imageUrl: null, // sin GA-1 no hay foto oficial: se dibuja nuestro glifo
    rights: {
      displayOfficialImage: "pending",
      deriveOfficialImage: "denied",
      useLogo: "pending",
      source: "catalogo-publico",
      verifiedAt: null,
      note: input.note,
    },
    active: true,
    updatedAt: "2026-10-09",
  };
}

export const FRAMES: FrameProfile[] = [
  // ── Ray-Ban ───────────────────────────────────────────────────────────
  frame({
    id: "ray-ban-aviator-rb3025",
    brandId: "ray-ban",
    model: "Aviator Classic",
    reference: "RB3025",
    shape: "aviator",
    material: "metal",
    colorFamily: "gold",
    colorName: "Dorado",
    lensName: "G-15 Verde",
    thickness: 0.18,
    styleTags: ["clasicas", "retro"],
    notation: [58, 14, 135],
    lensHeightMm: 50,
    measurementsStatus: "indicative",
    note: "Tallas 55/58/62; 58 es la estándar. Puente 14 común a toda la línea.",
  }),
  frame({
    id: "ray-ban-wayfarer-rb2140",
    brandId: "ray-ban",
    model: "Wayfarer Original",
    reference: "RB2140",
    shape: "wayfarer",
    material: "acetate",
    colorFamily: "black",
    colorName: "Negro",
    lensName: "G-15 Verde",
    thickness: 0.78,
    styleTags: ["clasicas"],
    notation: [50, 22, 150],
    lensHeightMm: 43,
    measurementsStatus: "indicative",
    note: "Tallas citadas 47/50/54.",
  }),
  frame({
    id: "ray-ban-new-wayfarer-rb2132",
    brandId: "ray-ban",
    model: "New Wayfarer",
    reference: "RB2132",
    shape: "wayfarer",
    material: "acetate",
    colorFamily: "black",
    colorName: "Negro",
    lensName: "G-15 Verde",
    thickness: 0.68,
    styleTags: ["clasicas", "modernas"],
    notation: [52, 18, 145],
    lensHeightMm: 41,
    measurementsStatus: "indicative",
    note: "Fuentes en desacuerdo: 52/55 frente a 58. Reverificar en ficha oficial.",
  }),
  frame({
    id: "ray-ban-clubmaster-rb3016",
    brandId: "ray-ban",
    model: "Clubmaster",
    reference: "RB3016",
    shape: "geometric",
    material: "mixed",
    colorFamily: "black",
    colorName: "Negro / Dorado",
    lensName: "G-15 Verde",
    thickness: 0.52,
    styleTags: ["clasicas", "retro"],
    notation: [51, 21, 145],
    lensHeightMm: 40,
    measurementsStatus: "indicative",
    note: "Tallas 49/51, con 55 en alguna fuente.",
  }),
  frame({
    id: "ray-ban-clubmaster-havana-rb3016",
    brandId: "ray-ban",
    model: "Clubmaster Havana",
    reference: "RB3016",
    shape: "geometric",
    material: "mixed",
    colorFamily: "tortoise",
    colorName: "Havana / Dorado",
    lensName: "G-15 Verde",
    thickness: 0.52,
    styleTags: ["clasicas", "retro"],
    notation: [51, 21, 145],
    lensHeightMm: 40,
    measurementsStatus: "indicative",
  }),
  frame({
    id: "ray-ban-round-metal-rb3447",
    brandId: "ray-ban",
    model: "Round Metal",
    reference: "RB3447",
    shape: "round",
    material: "metal",
    colorFamily: "gold",
    colorName: "Dorado",
    lensName: "G-15 Verde",
    thickness: 0.2,
    styleTags: ["retro", "minimalistas"],
    notation: [50, 21, 145],
    lensHeightMm: 50,
    measurementsStatus: "indicative",
    note: "Tallas citadas 47/50/53.",
  }),
  frame({
    id: "ray-ban-justin-rb4165",
    brandId: "ray-ban",
    model: "Justin",
    reference: "RB4165",
    shape: "rectangular",
    material: "acetate",
    colorFamily: "black",
    colorName: "Negro mate",
    lensName: "Gris degradado",
    thickness: 0.72,
    styleTags: ["modernas", "oversized"],
    notation: [54, 16, 145],
    lensHeightMm: 48,
    measurementsStatus: "indicative",
    note: "Tallas citadas 51 y 54/55.",
  }),

  // ── Persol ────────────────────────────────────────────────────────────
  frame({
    id: "persol-714",
    brandId: "persol",
    model: "714 Steve McQueen",
    reference: "PO0714",
    shape: "aviator",
    material: "acetate",
    colorFamily: "tortoise",
    colorName: "Havana",
    lensName: "Azul polarizada",
    thickness: 0.55,
    styleTags: ["clasicas", "retro"],
    notation: null,
    measurementsStatus: "unknown",
    note: "Aviador plegable. Medidas pendientes de ficha oficial.",
  }),
  frame({
    id: "persol-649",
    brandId: "persol",
    model: "649",
    reference: "PO0649",
    shape: "square",
    material: "acetate",
    colorFamily: "tortoise",
    colorName: "Havana",
    lensName: "Cristal verde",
    thickness: 0.6,
    styleTags: ["clasicas", "retro"],
    notation: null,
    measurementsStatus: "unknown",
  }),

  // ── Oakley ────────────────────────────────────────────────────────────
  frame({
    id: "oakley-holbrook",
    brandId: "oakley",
    model: "Holbrook",
    reference: "OO9102",
    shape: "square",
    material: "other",
    colorFamily: "black",
    colorName: "Negro pulido",
    lensName: "Prizm",
    thickness: 0.7,
    styleTags: ["deportivas", "modernas"],
    notation: null,
    measurementsStatus: "unknown",
    note: "Medidas pendientes de ficha oficial.",
  }),
  frame({
    id: "oakley-frogskins",
    brandId: "oakley",
    model: "Frogskins",
    reference: "OO9013",
    shape: "wayfarer",
    material: "other",
    colorFamily: "black",
    colorName: "Negro",
    lensName: "Prizm",
    thickness: 0.65,
    styleTags: ["deportivas", "retro"],
    notation: null,
    measurementsStatus: "unknown",
  }),

  // ── Oliver Peoples ────────────────────────────────────────────────────
  frame({
    id: "oliver-peoples-gregory-peck",
    brandId: "oliver-peoples",
    model: "Gregory Peck Sun",
    reference: "OV5186S",
    shape: "round",
    material: "acetate",
    colorFamily: "tortoise",
    colorName: "Dark Mahogany",
    lensName: "Gris degradado",
    thickness: 0.5,
    styleTags: ["clasicas", "retro", "minimalistas"],
    notation: null,
    measurementsStatus: "unknown",
  }),

  // ── Carrera · Polaroid ────────────────────────────────────────────────
  frame({
    id: "carrera-champion",
    brandId: "carrera",
    model: "Champion",
    reference: null,
    shape: "aviator",
    material: "mixed",
    colorFamily: "black",
    colorName: "Negro",
    lensName: "Espejada",
    thickness: 0.4,
    styleTags: ["deportivas", "retro"],
    notation: null,
    measurementsStatus: "unknown",
  }),
  frame({
    id: "polaroid-pld-6125",
    brandId: "polaroid",
    model: "PLD 6125",
    reference: "PLD6125",
    shape: "square",
    material: "acetate",
    colorFamily: "black",
    colorName: "Negro",
    lensName: "Polarizada gris",
    thickness: 0.66,
    styleTags: ["clasicas"],
    notation: null,
    measurementsStatus: "unknown",
  }),

  // ── Warby Parker ──────────────────────────────────────────────────────
  frame({
    id: "warby-parker-durand",
    brandId: "warby-parker",
    model: "Durand",
    reference: null,
    shape: "round",
    material: "acetate",
    colorFamily: "brown",
    colorName: "Striped Sassafras",
    lensName: "Gris",
    thickness: 0.55,
    styleTags: ["clasicas", "minimalistas"],
    notation: null,
    measurementsStatus: "unknown",
  }),

  // ── España ────────────────────────────────────────────────────────────
  frame({
    id: "hawkers-warwick",
    brandId: "hawkers",
    model: "Warwick",
    reference: null,
    shape: "wayfarer",
    material: "acetate",
    colorFamily: "black",
    colorName: "Negro",
    lensName: "Polarizada",
    thickness: 0.7,
    styleTags: ["clasicas"],
    notation: null,
    measurementsStatus: "unknown",
    note: "Programa de afiliación localizado en Awin ES (anunciante 19686) [T].",
  }),
  frame({
    id: "hawkers-one",
    brandId: "hawkers",
    model: "One",
    reference: null,
    shape: "wayfarer",
    material: "acetate",
    colorFamily: "tortoise",
    colorName: "Habana",
    lensName: "Gris",
    thickness: 0.68,
    styleTags: ["clasicas", "modernas"],
    notation: null,
    measurementsStatus: "unknown",
  }),
  frame({
    id: "meller-nayah",
    brandId: "meller",
    model: "Nayah",
    reference: null,
    shape: "cat-eye",
    material: "acetate",
    colorFamily: "tortoise",
    colorName: "Tigris",
    lensName: "Carbón",
    thickness: 0.5,
    styleTags: ["modernas", "retro"],
    notation: null,
    measurementsStatus: "unknown",
  }),
  frame({
    id: "mr-boho-jordaan",
    brandId: "mr-boho",
    model: "Jordaan",
    reference: null,
    shape: "round",
    material: "metal",
    colorFamily: "gold",
    colorName: "Dorado",
    lensName: "Verde clásica",
    thickness: 0.22,
    styleTags: ["minimalistas", "retro"],
    notation: null,
    measurementsStatus: "unknown",
  }),
  frame({
    id: "parafina-ebro",
    brandId: "parafina",
    model: "Ebro",
    reference: null,
    shape: "rectangular",
    material: "other",
    colorFamily: "black",
    colorName: "Negro reciclado",
    lensName: "Gris polarizada",
    thickness: 0.58,
    styleTags: ["minimalistas", "modernas"],
    notation: null,
    measurementsStatus: "unknown",
    note: "Montura de plástico reciclado del océano.",
  }),
  frame({
    id: "komono-francis",
    brandId: "komono",
    model: "Francis",
    reference: null,
    shape: "oval",
    material: "acetate",
    colorFamily: "black",
    colorName: "Negro",
    lensName: "Gris",
    thickness: 0.45,
    styleTags: ["minimalistas", "modernas"],
    notation: null,
    measurementsStatus: "unknown",
  }),

  // ── Oversized / diseño ────────────────────────────────────────────────
  frame({
    id: "gentle-monster-papas",
    brandId: "gentle-monster",
    model: "Papas",
    reference: null,
    shape: "oversized",
    material: "acetate",
    colorFamily: "tortoise",
    colorName: "Havana",
    lensName: "Marrón degradado",
    thickness: 0.88,
    styleTags: ["oversized", "modernas"],
    notation: null,
    measurementsStatus: "unknown",
  }),
  frame({
    id: "mykita-lite",
    brandId: "mykita",
    model: "Lite",
    reference: null,
    shape: "oval",
    material: "titanium",
    colorFamily: "silver",
    colorName: "Plata mate",
    lensName: "Gris",
    thickness: 0.15,
    styleTags: ["minimalistas"],
    notation: null,
    measurementsStatus: "unknown",
  }),
];

/**
 * Cobertura de datos del catálogo. Para saber qué falta sin adivinarlo.
 */
export function catalogCoverage() {
  const total = FRAMES.length;
  const withMeasurements = FRAMES.filter(
    (f) => f.measurementsStatus !== "unknown",
  ).length;
  const withReference = FRAMES.filter((f) => f.reference !== null).length;
  const withPrice = FRAMES.filter((f) => f.priceStatus !== "unknown").length;
  const withImageRights = FRAMES.filter(
    (f) => f.rights.displayOfficialImage === "cleared",
  ).length;

  return { total, withMeasurements, withReference, withPrice, withImageRights };
}
