/**
 * Catálogo de monturas.
 *
 * La parte importante de este archivo no son las medidas: es `FrameRights`.
 * D-015 quedó VALIDATED en contra — los términos estándar de afiliación
 * autorizan *mostrar* la imagen del anunciante sin modificarla, y nuestro
 * try-on genera una imagen nueva a partir de ella. Y D-002 (RULE #1) nos
 * obliga a usar la montura real, así que no hay forma de esquivarlo bajando
 * la fidelidad.
 *
 * Conclusión de diseño: los derechos no son un campo informativo, son una
 * **precondición**. Una montura sin derechos verificados no se lista ni se
 * prueba, y eso lo decide el tipo, no la buena memoria de quien programa.
 */

export type FrameShape =
  | "rectangular"
  | "square"
  | "round"
  | "oval"
  | "aviator"
  | "cat-eye"
  | "wayfarer"
  | "geometric"
  | "oversized";

export type FrameMaterial = "acetate" | "metal" | "titanium" | "mixed" | "other";

/** Familias de color, para el componente de contraste del scoring. */
export type ColorFamily =
  | "black"
  | "tortoise"
  | "brown"
  | "gold"
  | "silver"
  | "transparent"
  | "colour";

/**
 * Estado de un permiso concreto.
 * `denied` es el valor por defecto en cualquier dato nuevo: negamos salvo prueba.
 */
export type RightsStatus = "cleared" | "pending" | "denied";

export interface FrameRights {
  /** ¿Podemos **mostrar** la imagen de producto tal cual? → gate GA-1 */
  displayImage: RightsStatus;
  /**
   * ¿Podemos **derivar** una imagen nueva a partir de ella, es decir, hacer
   * try-on generativo? → gate GA-2 / D-015.
   *
   * Sobre términos estándar de Awin y Amazon esto es `denied`. Solo pasa a
   * `cleared` con autorización escrita de ese anunciante.
   */
  deriveImage: RightsStatus;
  /** ¿Podemos usar marca y modelo en títulos, URLs y metadatos? → GA-7 */
  useTrademark: RightsStatus;
  /** De dónde sale el dato. `synthetic-dev` = creado por nosotros. */
  source: string;
  /** Fecha ISO de verificación, o `null` si nadie lo ha verificado. */
  verifiedAt: string | null;
  note?: string;
}

/**
 * Fiabilidad del precio.
 *
 * Misma disciplina que `FrameRights` y que el `estimated` del scoring: un dato
 * que no hemos verificado no se presenta como un hecho. CLAUDE.md §18.4 pide
 * «precio vigente cuando esté verificado», y un número inventado mostrado como
 * precio autoritativo es exactamente lo que no podemos hacer.
 */
export type PriceStatus =
  /** Verificado contra la fuente, con fecha. Se muestra tal cual. */
  | "verified"
  /** Referencia sin verificar. Se muestra **siempre** como aproximado. */
  | "indicative"
  /** No lo sabemos. No se muestra nada. */
  | "unknown";

/** Medidas en milímetros. `null` cuando la fuente no las da — GA-4. */
export interface FrameMeasurements {
  /** Ancho total de la montura, sien a sien. El que más pesa en el encaje. */
  totalWidthMm: number | null;
  lensWidthMm: number | null;
  lensHeightMm: number | null;
  bridgeMm: number | null;
  templeMm: number | null;
}

export interface FrameProfile {
  id: string;
  slug: string;
  brand: string;
  model: string;
  shape: FrameShape;
  category: "sunglasses" | "optical";
  material: FrameMaterial;
  colorFamily: ColorFamily;
  /** Grosor aparente de la montura 0..1. 0 = al aire, 1 = muy gruesa. */
  thickness: number;
  measurements: FrameMeasurements;
  priceCents: number | null;
  priceStatus: PriceStatus;
  /** Fecha ISO de la última verificación del precio, o `null`. */
  priceCheckedAt: string | null;
  currency: "EUR";
  styleTags: string[];
  /** Ficha pública del retailer. Nunca una URL de afiliado: eso va aparte. */
  productUrl: string | null;
  /**
   * URL de afiliado. `null` mientras GA-3 esté sin resolver — no se inventa
   * un tag de afiliado que no existe.
   */
  affiliateUrl: string | null;
  /**
   * Imagen de producto. `null` ⇒ la UI dibuja un glifo SVG propio por forma.
   * Preferimos un glifo honesto a una imagen que no podemos usar.
   */
  imageUrl: string | null;
  rights: FrameRights;
  /** Interruptor manual. `false` saca la montura de todo, pase lo que pase. */
  active: boolean;
  updatedAt: string;
}

/** Derechos por defecto de cualquier dato nuevo: nada autorizado. */
export function unverifiedRights(source: string, note?: string): FrameRights {
  return {
    displayImage: "pending",
    deriveImage: "denied",
    useTrademark: "pending",
    source,
    verifiedAt: null,
    note,
  };
}
