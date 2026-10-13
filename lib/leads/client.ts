"use client";

import type { LeadSource } from "./types";

/**
 * Alta en la lista de espera, desde el navegador.
 *
 * Devuelve un código estable, no un texto: la traducción vive en el
 * diccionario como todo lo demás, y así un idioma nuevo no se queda con
 * mensajes en español.
 */

export type LeadResult =
  | "ok"
  | "invalid_email"
  | "rate_limited"
  /** No hay destino configurado. La UI lo dice en vez de fingir. */
  | "unavailable"
  | "error";

export async function joinWaitlist(
  email: string,
  locale: string,
  source: LeadSource,
): Promise<LeadResult> {
  let response: Response;
  try {
    response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale, source }),
    });
  } catch {
    return "error";
  }

  if (response.ok) return "ok";

  try {
    const payload = (await response.json()) as { status?: string };
    const status = payload.status;
    if (
      status === "invalid_email" ||
      status === "rate_limited" ||
      status === "unavailable"
    ) {
      return status;
    }
  } catch {
    // Cuerpo ilegible: se trata como error genérico.
  }

  return "error";
}
