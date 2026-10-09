import type { FrameProfile } from "./types";

/**
 * El precio es un dato interno, **no se muestra en nuestra UI** → D-019.
 *
 * Razón: un precio junto a una montura en nuestra interfaz se lee como
 * *nuestro* precio, y da a entender que vendemos nosotros. No vendemos: somos
 * una capa de descubrimiento que lleva a la tienda del retailer, y es ahí
 * donde el precio tiene sentido y es el suyo.
 *
 * Para qué sigue existiendo el dato: lo necesita el filtro de presupuesto y
 * vendrá en el feed de afiliación cuando haya uno.
 */

/**
 * Precio del que podemos fiarnos para filtrar y puntuar.
 *
 * `null` cuando no hay precio o cuando no está verificado lo suficiente para
 * afirmar nada sobre él. La diferencia importa: un precio `unknown` **no debe
 * colarse** en una búsqueda con presupuesto, porque no podemos sostener que
 * encaje.
 */
export function reliablePriceCents(frame: FrameProfile): number | null {
  if (frame.priceCents === null) return null;
  switch (frame.priceStatus) {
    case "verified":
    case "indicative":
      return frame.priceCents;
    case "unknown":
      return null;
  }
}
