"use client";

import type { EventName, EventProps } from "./events";

/**
 * Emisor de eventos del navegador.
 *
 * Tres decisiones que importan:
 *
 * - **`sendBeacon` cuando existe.** Un `fetch` normal se cancela si la
 *   persona navega justo después de pulsar, y el evento que más interesa
 *   —el clic que se lleva a alguien fuera— es exactamente el que ocurre al
 *   salir. `sendBeacon` sobrevive a eso.
 * - **Nunca rompe la interfaz.** Si falla, falla en silencio. Perder un
 *   evento es un problema nuestro; que un error de analítica rompa una
 *   generación que cuesta dinero, es un problema del usuario.
 * - **`sessionStorage`, no cookie.** Se pierde al cerrar la pestaña, no viaja
 *   entre pestañas y no permite seguir a nadie entre visitas. Por eso las
 *   páginas legales pueden seguir diciendo, con verdad, que no instalamos
 *   cookies.
 */

const SESSION_KEY = "lookfit.session";

/** Identificador efímero de pestaña. No identifica a una persona. */
function sessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
    window.sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    // Ventana privada o almacenamiento bloqueado: el evento se manda igual,
    // sin agrupar por sesión. Mejor un dato suelto que ninguno.
    return "unavailable";
  }
}

export function track(name: EventName, props: EventProps = {}): void {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    name,
    props: { path: window.location.pathname, ...props },
    sessionId: sessionId(),
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/events",
        new Blob([body], { type: "application/json" }),
      );
      return;
    }
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Silencio deliberado: ver cabecera.
  }
}
