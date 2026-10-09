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

/**
 * Tres permisos distintos, que antes estaban mezclados en uno.
 *
 * **Nombrar** la montura por marca, modelo y referencia no está aquí a
 * propósito: es uso nominativo y no requiere permiso. Lo que requiere permiso
 * es usar *sus activos* → D-021.
 */
export interface FrameRights {
  /** Mostrar la imagen **oficial** del producto tal cual → GA-1 */
  displayOfficialImage: RightsStatus;
  /**
   * **Derivar** una imagen nueva a partir de la oficial → GA-2 / D-015.
   *
   * Sobre términos estándar de Awin y Amazon es `denied`: su licencia cubre
   * publicar «without modification». Solo pasa a `cleared` con autorización
   * escrita de ese anunciante.
   */
  deriveOfficialImage: RightsStatus;
  /** Usar el **logotipo** de la marca como gráfico. Distinto de nombrarla. */
  useLogo: RightsStatus;
  /** De dónde sale el dato. */
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
  /**
   * Ancho total sien a sien. Rara vez se publica: las marcas dan la notación
   * de tres números (lente-puente-varilla), no el total.
   */
  totalWidthMm: number | null;
  lensWidthMm: number | null;
  lensHeightMm: number | null;
  bridgeMm: number | null;
  templeMm: number | null;
}

/**
 * Fiabilidad de las medidas, con la misma disciplina que el precio.
 *
 * Importa porque **las fuentes se contradicen**: para la RB2132 unas dan 52/55
 * y otras 58, y los puentes apenas se publican. La fuente fiable es la
 * notación impresa en la varilla o la ficha oficial del fabricante.
 */
export type MeasurementsStatus = "verified" | "indicative" | "unknown";

/**
 * Anchura del frontal: lo que de verdad ocupa la montura en la cara.
 *
 * Si no hay ancho total publicado —que es lo normal— se calcula de los dos
 * datos que sí publica todo el mundo. No es una estimación: es aritmética
 * sobre valores declarados. Queda algo por debajo del total real, porque
 * excluye el vuelo de las bisagras.
 */
export function frameFrontWidthMm(frame: {
  measurements: FrameMeasurements;
}): number | null {
  const { totalWidthMm, lensWidthMm, bridgeMm } = frame.measurements;
  if (totalWidthMm !== null) return totalWidthMm;
  if (lensWidthMm === null || bridgeMm === null) return null;
  return 2 * lensWidthMm + bridgeMm;
}

export interface FrameProfile {
  id: string;
  slug: string;
  /** Referencia a `lib/catalog/brands.ts`. La marca es una entidad, no texto. */
  brandId: string;
  /** Nombre de la marca, desnormalizado para no resolver en cada render. */
  brand: string;
  model: string;
  /**
   * Referencia comercial del modelo, como la usa el sector: «RB3016».
   * `null` en las casas sintéticas, que no tienen referencias reales.
   */
  reference: string | null;
  shape: FrameShape;
  category: "sunglasses" | "optical";
  material: FrameMaterial;
  colorFamily: ColorFamily;
  /** Nombre comercial del color: «Negro / Dorado», «Havana». */
  colorName: string;
  /** Color de lente, como lo nombra el sector: «G-15 Verde», «Prizm». */
  lensName: string;
  /** Grosor aparente de la montura 0..1. 0 = al aire, 1 = muy gruesa. */
  thickness: number;
  measurements: FrameMeasurements;
  measurementsStatus: MeasurementsStatus;
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

/**
 * Derechos por defecto de cualquier dato nuevo: ningún activo ajeno
 * autorizado. La montura **sí se puede listar y nombrar**, porque eso no
 * depende de estos permisos.
 */
export function unverifiedRights(source: string, note?: string): FrameRights {
  return {
    displayOfficialImage: "pending",
    deriveOfficialImage: "denied",
    useLogo: "pending",
    source,
    verifiedAt: null,
    note,
  };
}
