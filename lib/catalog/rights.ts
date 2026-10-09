import type { FrameProfile } from "./types";

/**
 * El muro de gates, en código. **Revisado el 2026-10-09** → D-021.
 *
 * La versión anterior exigía permiso escrito de marca para *listar* una
 * montura, y eso era un error: **nombrar el producto al que enlazas es uso
 * nominativo** y es lo que hace todo el sector de referencia. Si no se pudiera
 * nombrar un producto, no existirían ni los comparadores ni la afiliación.
 *
 * Lo que sí está gateado son tres cosas distintas, que antes estaban
 * mezcladas en una:
 *
 *   1. mostrar la imagen OFICIAL del producto          → GA-1
 *   2. DERIVAR una imagen nueva de esa imagen oficial  → GA-2, denegado por
 *      los términos estándar (D-015)
 *   3. usar el LOGOTIPO de la marca como gráfico       → distinto de nombrarla
 *
 * Y hay una cuarta vía que no toca ninguna de las tres: generar la imagen
 * desde el conocimiento del modelo, sin partir de ningún archivo del
 * anunciante. Ahí la restricción no es de derechos sino de **fidelidad**, que
 * es RULE #1 y se mide con GT-1.
 *
 * Esto no es asesoramiento jurídico: es lectura de términos publicados. Antes
 * de producción lo revisa un profesional.
 */

/** Cómo obtiene el proveedor de try-on el activo que pinta sobre la cara. */
export type TryOnAssetOwnership =
  /** Clase A. Modelo 3D del proveedor, con derechos resueltos aguas arriba. */
  | "provider"
  /** Clase B sobre feed. Deriva de la imagen oficial: lo que D-015 cierra. */
  | "advertiser-image"
  /**
   * Clase B desde el conocimiento del modelo. No parte de ningún archivo del
   * anunciante, así que los términos de afiliación no le aplican. Su límite
   * es la fidelidad, no el permiso.
   */
  | "model-prior"
  /** Desarrollo. No sale nada hacia ningún proveedor real. */
  | "mock";

/**
 * ¿Hemos medido que este proveedor reproduce monturas identificables?
 *
 * Es GT-1 de B1: test ciego de 3 opciones, umbral del 70 % sobre un azar del
 * 33 %. **Nadie lo ha medido todavía**, así que es `false` y toda imagen
 * generada se etiqueta como simulación de estilo, no como ese producto.
 *
 * Cuando GT-1 pase, esto se pone a `true` y la misma imagen puede llevar
 * marca, modelo y referencia. La diferencia entre un producto y otro la
 * decide una medición, no una opinión.
 */
export const GENERATIVE_FIDELITY_VERIFIED = false;

export function canDisplayOfficialImage(frame: FrameProfile): boolean {
  return frame.rights.displayOfficialImage === "cleared";
}

export function canDeriveOfficialImage(frame: FrameProfile): boolean {
  return frame.rights.deriveOfficialImage === "cleared";
}

export function canUseLogo(frame: FrameProfile): boolean {
  return frame.rights.useLogo === "cleared";
}

/**
 * ¿Se puede listar públicamente?
 *
 * Solo exige que esté activa. Nombrarla por marca, modelo y referencia es uso
 * nominativo; si no tenemos su imagen, dibujamos nuestro propio esquema y la
 * ficha sigue siendo honesta.
 */
export function isPubliclyListable(frame: FrameProfile): boolean {
  return frame.active;
}

export function canTryOn(
  frame: FrameProfile,
  ownership: TryOnAssetOwnership,
): boolean {
  if (!isPubliclyListable(frame)) return false;
  switch (ownership) {
    case "provider":
      return true;
    case "advertiser-image":
      return canDeriveOfficialImage(frame);
    case "model-prior":
      // Generar no requiere permiso sobre ningún archivo ajeno. Lo que
      // requiere es no mentir sobre el resultado, y de eso se encarga
      // `canLabelAsProduct`.
      return true;
    case "mock":
      return true;
  }
}

/**
 * ¿Podemos decir que **esa imagen es ese producto**?
 *
 * Es la pregunta que de verdad importa y la que RULE #1 (D-002) gobierna.
 * Con un activo del proveedor o con la imagen oficial autorizada, sí. Con una
 * imagen generada desde el conocimiento del modelo, solo si GT-1 ha
 * demostrado que la montura resulta identificable.
 */
export function canLabelAsProduct(
  frame: FrameProfile,
  ownership: TryOnAssetOwnership,
): boolean {
  switch (ownership) {
    case "provider":
      return isPubliclyListable(frame);
    case "advertiser-image":
      return canDeriveOfficialImage(frame);
    case "model-prior":
      return GENERATIVE_FIDELITY_VERIFIED;
    case "mock":
      return false;
  }
}

/** Por qué una montura no se puede probar. Para UI y para depurar. */
export function tryOnBlockedReason(
  frame: FrameProfile,
  ownership: TryOnAssetOwnership,
): string | null {
  if (canTryOn(frame, ownership)) return null;
  if (!frame.active) return "frame-inactive";
  if (ownership === "advertiser-image" && !canDeriveOfficialImage(frame)) {
    return "derivative-rights-not-cleared";
  }
  return "unknown";
}

/**
 * Salida al exterior. Si no hay URL de afiliado aprobada, se enlaza la ficha
 * pública sin tag: preferimos un click sin comisión a un tag inventado.
 */
export function outboundUrl(frame: FrameProfile): string | null {
  return frame.affiliateUrl ?? frame.productUrl;
}
