/**
 * Geometría del glifo de montura. **Única fuente de verdad.**
 *
 * La usan dos sitios que tienen que estar de acuerdo o la superposición se
 * descoloca: `components/ui/FrameGlyph.tsx`, que dibuja, y `lib/face/overlay.ts`,
 * que calcula dónde colocarlo sobre una cara. Si estas constantes y el dibujo
 * divergen, las gafas aparecen torcidas o de otro tamaño.
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

/** Separación entre centros de lente, en unidades del viewBox. */
export const GLYPH_PUPIL_DISTANCE =
  GLYPH.lensCenterRightX - GLYPH.lensCenterLeftX;

/**
 * Anchura sien a sien del dibujo, en unidades del viewBox.
 *
 * Es menor que el viewBox: hay margen a los lados. Por eso, para que una
 * montura de 140 mm mida 140 mm sobre la cara, el SVG hay que renderizarlo
 * algo más ancho que la montura.
 */
export const GLYPH_FRAME_WIDTH = GLYPH.templeRightX - GLYPH.templeLeftX;
