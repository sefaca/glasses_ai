/**
 * Puerta de acceso para los endpoints que cuestan dinero.
 *
 * Existe por un problema concreto: el rate limiting vive en memoria del
 * proceso y en serverless cada instancia lleva su propia cuenta, así que
 * contra un script no sirve de nada. Y cada generación cuesta ~0,10 € reales.
 *
 * Esto **no es autenticación** y no pretende serlo: es un código compartido
 * que convierte una URL pública en una alfa privada. Suficiente para enseñar
 * el producto a diez personas sin que un bot vacíe la cuenta; insuficiente
 * para abrir al público, que necesita sesión anónima y rate limiting real.
 *
 * Sin `ACCESS_CODE` definido no hay puerta, que es lo que permite desarrollar
 * en local sin fricción.
 */

export type AccessResult = "open" | "granted" | "denied";

/** Cabecera por la que el cliente envía el código. */
export const ACCESS_HEADER = "x-access-code";

export function accessIsRequired(): boolean {
  return Boolean(process.env.ACCESS_CODE?.trim());
}

/**
 * Comparación en tiempo constante.
 *
 * Con un código corto el riesgo de un ataque por tiempos es teórico, pero
 * comparar con `===` filtra cuántos caracteres coinciden, y no cuesta nada
 * hacerlo bien.
 */
function equals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function checkAccess(provided: string | null): AccessResult {
  const expected = process.env.ACCESS_CODE?.trim();
  if (!expected) return "open";
  if (!provided) return "denied";
  return equals(provided.trim(), expected) ? "granted" : "denied";
}
