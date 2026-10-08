import type {
  ColorFamily,
  FrameMaterial,
  FrameProfile,
  FrameShape,
} from "./types";
import { unverifiedRights } from "./types";

/**
 * Catálogo semilla de desarrollo.
 *
 * Son monturas **sintéticas, nuestras**: especificaciones inventadas y un glifo
 * SVG propio en vez de foto. Por eso sus derechos son `cleared` — el activo lo
 * hemos hecho nosotros, no hay anunciante al que pedir permiso.
 *
 * Existen para desarrollar y testear el motor de recomendación sin tocar
 * material de marca mientras GA-1, GA-2 y GA-7 siguen sin resolver.
 *
 * Al final del archivo hay dos monturas de marca real con derechos `pending`.
 * No son un descuido: son el fixture que demuestra que el muro funciona. Si
 * algún día aparecen en una lista pública, hay un bug.
 */

interface DevFrameInput {
  slug: string;
  model: string;
  shape: FrameShape;
  material: FrameMaterial;
  colorFamily: ColorFamily;
  thickness: number;
  totalWidthMm: number;
  lensWidthMm: number;
  lensHeightMm: number;
  bridgeMm: number;
  priceCents: number;
  styleTags: string[];
}

const DEV_BRAND = "Estudio";

function dev(input: DevFrameInput): FrameProfile {
  return {
    id: `dev-${input.slug}`,
    slug: input.slug,
    brand: DEV_BRAND,
    model: input.model,
    shape: input.shape,
    category: "sunglasses",
    material: input.material,
    colorFamily: input.colorFamily,
    thickness: input.thickness,
    measurements: {
      totalWidthMm: input.totalWidthMm,
      lensWidthMm: input.lensWidthMm,
      lensHeightMm: input.lensHeightMm,
      bridgeMm: input.bridgeMm,
      templeMm: 145,
    },
    priceCents: input.priceCents,
    currency: "EUR",
    styleTags: input.styleTags,
    productUrl: null,
    affiliateUrl: null,
    imageUrl: null, // la UI dibuja un glifo por forma
    rights: {
      displayImage: "cleared",
      deriveImage: "cleared",
      useTrademark: "cleared",
      source: "synthetic-dev",
      verifiedAt: "2026-10-08",
      note: "Montura sintética propia. Sin material de marca.",
    },
    active: true,
    updatedAt: "2026-10-08",
  };
}

export const DEV_FRAMES: FrameProfile[] = [
  dev({
    slug: "linea-01",
    model: "Línea 01",
    shape: "rectangular",
    material: "acetate",
    colorFamily: "black",
    thickness: 0.65,
    totalWidthMm: 140,
    lensWidthMm: 54,
    lensHeightMm: 38,
    bridgeMm: 18,
    priceCents: 5900,
    styleTags: ["clasicas", "minimalistas"],
  }),
  dev({
    slug: "linea-02",
    model: "Línea 02",
    shape: "rectangular",
    material: "metal",
    colorFamily: "silver",
    thickness: 0.25,
    totalWidthMm: 136,
    lensWidthMm: 52,
    lensHeightMm: 35,
    bridgeMm: 19,
    priceCents: 7900,
    styleTags: ["minimalistas", "modernas"],
  }),
  dev({
    slug: "bloque-01",
    model: "Bloque 01",
    shape: "square",
    material: "acetate",
    colorFamily: "tortoise",
    thickness: 0.8,
    totalWidthMm: 144,
    lensWidthMm: 55,
    lensHeightMm: 46,
    bridgeMm: 18,
    priceCents: 8900,
    styleTags: ["modernas", "oversized"],
  }),
  dev({
    slug: "bloque-02",
    model: "Bloque 02",
    shape: "square",
    material: "acetate",
    colorFamily: "transparent",
    thickness: 0.7,
    totalWidthMm: 138,
    lensWidthMm: 51,
    lensHeightMm: 44,
    bridgeMm: 20,
    priceCents: 4900,
    styleTags: ["modernas"],
  }),
  dev({
    slug: "circulo-01",
    model: "Círculo 01",
    shape: "round",
    material: "metal",
    colorFamily: "gold",
    thickness: 0.2,
    totalWidthMm: 134,
    lensWidthMm: 47,
    lensHeightMm: 47,
    bridgeMm: 21,
    priceCents: 6900,
    styleTags: ["retro", "minimalistas"],
  }),
  dev({
    slug: "circulo-02",
    model: "Círculo 02",
    shape: "round",
    material: "acetate",
    colorFamily: "brown",
    thickness: 0.6,
    totalWidthMm: 139,
    lensWidthMm: 49,
    lensHeightMm: 48,
    bridgeMm: 20,
    priceCents: 5400,
    styleTags: ["retro"],
  }),
  dev({
    slug: "elipse-01",
    model: "Elipse 01",
    shape: "oval",
    material: "metal",
    colorFamily: "silver",
    thickness: 0.22,
    totalWidthMm: 133,
    lensWidthMm: 50,
    lensHeightMm: 36,
    bridgeMm: 19,
    priceCents: 3900,
    styleTags: ["minimalistas", "clasicas"],
  }),
  dev({
    slug: "gota-01",
    model: "Gota 01",
    shape: "aviator",
    material: "metal",
    colorFamily: "gold",
    thickness: 0.18,
    totalWidthMm: 142,
    lensWidthMm: 58,
    lensHeightMm: 50,
    bridgeMm: 14,
    priceCents: 9900,
    styleTags: ["clasicas", "retro"],
  }),
  dev({
    slug: "gota-02",
    model: "Gota 02",
    shape: "aviator",
    material: "titanium",
    colorFamily: "black",
    thickness: 0.2,
    totalWidthMm: 147,
    lensWidthMm: 61,
    lensHeightMm: 52,
    bridgeMm: 14,
    priceCents: 15900,
    styleTags: ["clasicas", "deportivas"],
  }),
  dev({
    slug: "felina-01",
    model: "Felina 01",
    shape: "cat-eye",
    material: "acetate",
    colorFamily: "black",
    thickness: 0.55,
    totalWidthMm: 137,
    lensWidthMm: 53,
    lensHeightMm: 40,
    bridgeMm: 17,
    priceCents: 7400,
    styleTags: ["retro", "modernas"],
  }),
  dev({
    slug: "felina-02",
    model: "Felina 02",
    shape: "cat-eye",
    material: "mixed",
    colorFamily: "tortoise",
    thickness: 0.45,
    totalWidthMm: 141,
    lensWidthMm: 55,
    lensHeightMm: 42,
    bridgeMm: 17,
    priceCents: 11900,
    styleTags: ["modernas", "oversized"],
  }),
  dev({
    slug: "clasica-01",
    model: "Clásica 01",
    shape: "wayfarer",
    material: "acetate",
    colorFamily: "black",
    thickness: 0.75,
    totalWidthMm: 145,
    lensWidthMm: 54,
    lensHeightMm: 43,
    bridgeMm: 18,
    priceCents: 6400,
    styleTags: ["clasicas"],
  }),
  dev({
    slug: "clasica-02",
    model: "Clásica 02",
    shape: "wayfarer",
    material: "acetate",
    colorFamily: "tortoise",
    thickness: 0.7,
    totalWidthMm: 140,
    lensWidthMm: 52,
    lensHeightMm: 41,
    bridgeMm: 18,
    priceCents: 2900,
    styleTags: ["clasicas", "retro"],
  }),
  dev({
    slug: "prisma-01",
    model: "Prisma 01",
    shape: "geometric",
    material: "metal",
    colorFamily: "colour",
    thickness: 0.3,
    totalWidthMm: 138,
    lensWidthMm: 51,
    lensHeightMm: 44,
    bridgeMm: 20,
    priceCents: 10900,
    styleTags: ["modernas"],
  }),
  dev({
    slug: "amplia-01",
    model: "Amplia 01",
    shape: "oversized",
    material: "acetate",
    colorFamily: "brown",
    thickness: 0.85,
    totalWidthMm: 151,
    lensWidthMm: 60,
    lensHeightMm: 52,
    bridgeMm: 16,
    priceCents: 12900,
    styleTags: ["oversized", "modernas"],
  }),
  dev({
    slug: "amplia-02",
    model: "Amplia 02",
    shape: "oversized",
    material: "acetate",
    colorFamily: "black",
    thickness: 0.9,
    totalWidthMm: 155,
    lensWidthMm: 62,
    lensHeightMm: 55,
    bridgeMm: 15,
    priceCents: 21900,
    styleTags: ["oversized"],
  }),
  dev({
    slug: "pista-01",
    model: "Pista 01",
    shape: "geometric",
    material: "other",
    colorFamily: "colour",
    thickness: 0.5,
    totalWidthMm: 148,
    lensWidthMm: 64,
    lensHeightMm: 40,
    bridgeMm: 14,
    priceCents: 8400,
    styleTags: ["deportivas", "modernas"],
  }),
];

/**
 * Fixture del muro de gates. Marcas reales, derechos sin verificar.
 * `isPubliclyListable()` debe devolver `false` para ambas. Hay un test que
 * lo comprueba, porque esto es precisamente lo que no puede romperse.
 */
export const BLOCKED_FRAMES: FrameProfile[] = [
  {
    id: "blocked-rb3025",
    slug: "ray-ban-aviator-rb3025",
    brand: "Ray-Ban",
    model: "Aviator Classic RB3025",
    shape: "aviator",
    category: "sunglasses",
    material: "metal",
    colorFamily: "gold",
    thickness: 0.18,
    measurements: {
      totalWidthMm: null,
      lensWidthMm: null,
      lensHeightMm: null,
      bridgeMm: null,
      templeMm: null,
    },
    priceCents: null,
    currency: "EUR",
    styleTags: ["clasicas"],
    productUrl: null,
    affiliateUrl: null,
    imageUrl: null,
    rights: unverifiedRights(
      "placeholder",
      "Sin programa de afiliación ni autorización. D-015: la derivación está denegada por los términos estándar.",
    ),
    active: true,
    updatedAt: "2026-10-08",
  },
  {
    id: "blocked-hawkers-warwick",
    slug: "hawkers-warwick",
    brand: "Hawkers",
    model: "Warwick",
    shape: "wayfarer",
    category: "sunglasses",
    material: "acetate",
    colorFamily: "black",
    thickness: 0.7,
    measurements: {
      totalWidthMm: null,
      lensWidthMm: null,
      lensHeightMm: null,
      bridgeMm: null,
      templeMm: null,
    },
    priceCents: null,
    currency: "EUR",
    styleTags: ["clasicas"],
    productUrl: null,
    affiliateUrl: null,
    imageUrl: null,
    rights: unverifiedRights(
      "awin-merchant-19686",
      "Programa localizado en Awin ES [T], sin reverificar. Nada autorizado todavía.",
    ),
    active: true,
    updatedAt: "2026-10-08",
  },
];

/** Todo lo que hay en el catálogo, listable o no. */
export const ALL_FRAMES: FrameProfile[] = [...DEV_FRAMES, ...BLOCKED_FRAMES];
