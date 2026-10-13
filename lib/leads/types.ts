/**
 * Lista de espera de la alfa privada.
 *
 * **Lo único que guardamos de una persona.** Todo lo demás del producto es
 * anónimo o efímero, y esto es la excepción, así que conviene que se vea de
 * un vistazo qué hay dentro: un correo, el idioma en el que lo dejó, desde
 * dónde, y cuándo consintió.
 *
 * Lo que **no** hay, y no debe añadirse sin volver a pasar por §14: nombre,
 * IP, identificador de sesión, nada de la foto y nada del perfil facial.
 * Cruzar la lista con el embudo convertiría una analítica anónima en una
 * identificada, que es justo lo que la hace aceptable hoy.
 */

/** Desde dónde se apuntó. Sirve para saber qué momento convierte. */
export const LEAD_SOURCES = [
  /** La pared del código, tras pulsar generar. La más cualificada. */
  "access_gate",
  /** Al pie de una guía o página de catálogo. */
  "content",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export function isLeadSource(value: string): value is LeadSource {
  return (LEAD_SOURCES as readonly string[]).includes(value);
}

export interface Lead {
  email: string;
  locale: string;
  source: LeadSource;
  /**
   * Cuándo aceptó. No es lo mismo que «cuándo se creó la fila»: es la prueba
   * de que hubo un acto afirmativo, y hay que poder enseñarla.
   */
  consentAt: string;
}

/**
 * Validación de correo, a propósito permisiva.
 *
 * No intenta decidir si un buzón existe —ninguna expresión puede— sino
 * descartar lo que claramente no es una dirección. Rechazar un correo válido
 * raro es peor que aceptar uno que luego rebota.
 */
const EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

export const MAX_EMAIL_LENGTH = 254;

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  return (
    trimmed.length > 0 &&
    trimmed.length <= MAX_EMAIL_LENGTH &&
    EMAIL.test(trimmed)
  );
}

/** Normaliza para que la misma persona no entre dos veces. */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}
