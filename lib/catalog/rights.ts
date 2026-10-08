import type { FrameProfile } from "./types";

/**
 * El muro de gates, en código.
 *
 * Todas las puertas niegan por defecto. Si un día alguien añade una montura
 * nueva y se olvida de los derechos, la montura simplemente no aparece — que
 * es el fallo correcto. El fallo incorrecto sería publicarla.
 */

/** Cómo obtiene el proveedor de try-on el activo que pinta sobre la cara. */
export type TryOnAssetOwnership =
  /**
   * Clase A. El activo es un modelo 3D del proveedor, licenciado por él.
   * No reproduce ni altera la imagen del anunciante → D-016.
   */
  | "provider"
  /**
   * Clase B. El activo es la imagen oficial del producto, que el modelo
   * generativo deriva. Es justo lo que los términos estándar prohíben.
   */
  | "advertiser-image"
  /** Desarrollo. No sale nada hacia ningún proveedor real. */
  | "mock";

export function canDisplayFrameImage(frame: FrameProfile): boolean {
  return frame.rights.displayImage === "cleared";
}

export function canUseTrademark(frame: FrameProfile): boolean {
  return frame.rights.useTrademark === "cleared";
}

/** Derivar la imagen oficial. Hoy, `false` para cualquier marca real. */
export function canDeriveFrameImage(frame: FrameProfile): boolean {
  return frame.rights.deriveImage === "cleared";
}

/**
 * ¿Se puede listar públicamente?
 *
 * Mostrar marca y modelo es uso de marca, así que exige `useTrademark`. La
 * imagen no es imprescindible: sin ella dibujamos un glifo propio y la ficha
 * sigue siendo honesta.
 */
export function isPubliclyListable(frame: FrameProfile): boolean {
  return frame.active && canUseTrademark(frame);
}

/**
 * ¿Se puede ofrecer try-on de esta montura con este proveedor?
 *
 * Con un proveedor de Clase A el activo es suyo y los derechos de derivación
 * se resolvieron aguas arriba, así que basta con poder listarla. Con Clase B
 * hace falta autorización explícita de derivación.
 */
export function canTryOn(
  frame: FrameProfile,
  ownership: TryOnAssetOwnership,
): boolean {
  if (!isPubliclyListable(frame)) return false;
  switch (ownership) {
    case "provider":
      return true;
    case "advertiser-image":
      return canDeriveFrameImage(frame);
    case "mock":
      return true;
  }
}

/** Por qué una montura no se puede probar. Para UI y para depurar. */
export function tryOnBlockedReason(
  frame: FrameProfile,
  ownership: TryOnAssetOwnership,
): string | null {
  if (canTryOn(frame, ownership)) return null;
  if (!frame.active) return "frame-inactive";
  if (!canUseTrademark(frame)) return "trademark-not-cleared";
  if (ownership === "advertiser-image" && !canDeriveFrameImage(frame)) {
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
