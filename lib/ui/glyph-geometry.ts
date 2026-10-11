/**
 * Geometría del glifo de montura.
 *
 * El glifo sigue siendo la ilustración de producto de las tarjetas de
 * recomendación, mientras no tengamos derechos sobre las imágenes oficiales
 * (GA-1). Lo que ya no hace es superponerse a la foto: al elegir una montura
 * se genera la imagen real directamente.
 */
export const GLYPH = {
  viewBoxWidth: 200,
  viewBoxHeight: 80,
  /** Centro de cada lente: donde deben caer las pupilas. */
  lensCenterLeftX: 58,
  lensCenterRightX: 142,
  lensCenterY: 40,
  /** Extremo de las patillas: define el ancho real de la montura dibujada. */
  templeLeftX: 8,
  templeRightX: 192,
} as const;

