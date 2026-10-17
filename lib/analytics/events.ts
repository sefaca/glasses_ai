/**
 * Eventos del embudo — CLAUDE.md §17.
 *
 * El objetivo del MVP es **aprender**, no tener una web bonita, y sin esto no
 * se aprende nada: Search Console cuenta lo que pasa en Google, no lo que
 * hace alguien cuando llega.
 *
 * Tres reglas que este módulo hace cumplir por tipos, no por disciplina:
 *
 * 1. **Nada de la foto.** Ni bytes, ni nombre de archivo, ni hash, ni
 *    medidas faciales → reglas 13 y 14. Lo que se puede enviar está en
 *    `EventProps` y no hay hueco donde meter otra cosa.
 * 2. **Nada que identifique a una persona.** Sin cookies, sin IP guardada,
 *    sin huella de navegador. La sesión es un identificador efímero por
 *    pestaña que se pierde al cerrarla.
 * 3. **Nombres cerrados.** Un evento nuevo se añade aquí o no compila, para
 *    que el embudo no se llene de variantes tipográficas del mismo evento.
 */

/** Los eventos mínimos de §17, más los que el producto ya puede emitir. */
export const EVENT_NAMES = [
  "landing_view",
  "click_try_free",
  "upload_started",
  "upload_completed",
  "upload_failed",
  "face_detected",
  "face_analysis_completed",
  "recommendations_viewed",
  "recommendation_clicked",
  "try_on_started",
  "try_on_completed",
  "try_on_failed",
  "compare_opened",
  "compare_frame_selected",
  "outbound_product_click",
  // Los dos lados del muro de pago: cuántos lo ven y cuántos abren el pago.
  // Sin el primero, la caída no se distingue de que nadie llegara hasta ahí.
  "credit_paywall_viewed",
  "checkout_started",
  "guide_view",
  "catalog_view",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

export function isEventName(value: string): value is EventName {
  return (EVENT_NAMES as readonly string[]).includes(value);
}

/**
 * Metadatos permitidos. Lista cerrada a propósito.
 *
 * `locale`, `shape`, `brandId` y `frameId` son datos de catálogo, no de
 * persona. `errorCode` es un código estable nuestro, nunca el mensaje del
 * proveedor. `step` sitúa el evento en el flujo.
 */
export interface EventProps {
  locale?: string;
  /** Ruta sin parámetros. Nunca una URL con query. */
  path?: string;
  frameId?: string;
  brandId?: string;
  shape?: string;
  /** Código estable, nunca texto libre del proveedor → regla 5. */
  errorCode?: string;
  step?: string;
  /** Cuántas monturas hay en comparación, por ejemplo. */
  count?: number;
  /** Milisegundos. Para latencia de generación. */
  durationMs?: number;
}

export interface AnalyticsEvent {
  name: EventName;
  props: EventProps;
  /** Identificador efímero de pestaña. No identifica a una persona. */
  sessionId: string;
  /** ISO, puesto en el servidor. El reloj del cliente no es de fiar. */
  at?: string;
}

/** Tope de tamaño del cuerpo, para que el endpoint no sea un vertedero. */
export const MAX_EVENT_BYTES = 2 * 1024;
