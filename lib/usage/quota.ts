/**
 * Las reglas del cupo. **Funciones puras**, para poder probarlas sin red.
 *
 * Tres topes, y cada uno tapa un agujero distinto:
 *
 * 1. **Por sesión anónima** — frena al curioso que recarga.
 * 2. **Por cuenta** — frena a quien se registra y espera barra libre.
 * 3. **Global diario** — es el único que acota el gasto de verdad. Los dos
 *    primeros se saltan tirando la sesión o creando cuentas; este no.
 *
 * El tercero es el que importa. Sin él, el peor caso no tiene techo.
 */

export type Subject =
  | { type: "anon"; id: string }
  | { type: "user"; id: string };

/**
 * Cuántas gratis da cada uno → [D-029](docs/DECISION_LOG.md#d-029).
 *
 * Dos en total: una sin cuenta y otra al registrarse. La segunda no es
 * generosidad, es lo que permite **comparar dos monturas**, que es la
 * hipótesis entera del producto: con una sola generación nunca se ve en qué
 * nos diferenciamos de entrar en la web de la marca.
 */
export const FREE_ALLOWANCE = {
  anon: 1,
  user: 2,
} as const;

/**
 * Tope global diario, en número de generaciones.
 *
 * Es un **límite de gasto**, no de producto: a 0,10 € cada una, 50 son 5 €
 * al día como máximo absoluto. Configurable por entorno para poder subirlo
 * sin desplegar cuando haya ingresos que lo respalden.
 */
export function dailyCap(): number {
  const raw = Number(process.env.DAILY_GENERATION_CAP);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 50;
}

export type QuotaDecision =
  | { allowed: true; remaining: number }
  /** Agotó lo suyo. Puede registrarse o, cuando exista, comprar. */
  | { allowed: false; reason: "free_exhausted" }
  /** El sitio llegó a su tope del día. No es culpa suya. */
  | { allowed: false; reason: "daily_cap" }
  /** No se pudo consultar el contador. Se deniega a propósito. */
  | { allowed: false; reason: "unavailable" };

export interface UsageCounts {
  /** Generaciones que lleva este sujeto. */
  subject: number;
  /** Generaciones que lleva el sitio entero hoy. */
  today: number;
  /** Generaciones compradas. Cero para una sesión anónima. */
  purchased: number;
}

/**
 * Decide si se puede generar.
 *
 * El orden importa: **el tope global se comprueba primero**. Si el sitio ha
 * llegado a su límite del día, da igual que a esta persona le queden gratis;
 * lo que se está protegiendo es la factura, no su cupo.
 */
export function decide(
  subject: Subject,
  counts: UsageCounts,
  cap = dailyCap(),
): QuotaDecision {
  if (counts.today >= cap) return { allowed: false, reason: "daily_cap" };

  // Lo gratuito y lo comprado van al mismo saco: a quien genera le da igual
  // de dónde sale, y separarlo obligaría a decidir cuál se gasta primero.
  const allowance = FREE_ALLOWANCE[subject.type] + counts.purchased;
  if (counts.subject >= allowance) {
    return { allowed: false, reason: "free_exhausted" };
  }

  return { allowed: true, remaining: allowance - counts.subject - 1 };
}
