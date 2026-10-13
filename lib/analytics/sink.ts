import type { AnalyticsEvent } from "./events";

/**
 * Dónde acaban los eventos.
 *
 * Detrás de un adaptador por la misma razón que el proveedor de try-on
 * (§29.2): hoy no hay base de datos, y esperar a tenerla para instrumentar
 * significaría perder todo el tráfico de las primeras semanas, que es
 * precisamente el que dice si las páginas funcionan.
 *
 * El trabajo difícil de la analítica no es guardar: es **saber dónde disparar
 * cada evento**. Eso queda hecho ahora y el destino se cambia luego sin tocar
 * ni un componente.
 */

export interface AnalyticsSink {
  readonly name: string;
  record(event: AnalyticsEvent): Promise<void> | void;
}

/**
 * Destino por defecto: el registro del servidor.
 *
 * En Vercel esto va a los logs del proyecto. No es consultable como una
 * tabla y **no sirve para analizar un embudo**, pero sí para comprobar que
 * los eventos se disparan donde deben y con qué datos, que es lo que hace
 * falta antes de que exista la tabla.
 *
 * Prefijo fijo para poder filtrarlos entre el resto del ruido.
 */
export const consoleSink: AnalyticsSink = {
  name: "console",
  record(event) {
    console.info("[event]", JSON.stringify(event));
  },
};

/**
 * Descarta en silencio. Para desarrollo, cuando los eventos ensucian la
 * consola más de lo que aportan.
 */
export const nullSink: AnalyticsSink = {
  name: "null",
  record() {},
};

export function getSink(): AnalyticsSink {
  return process.env.ANALYTICS_SINK === "null" ? nullSink : consoleSink;
}
