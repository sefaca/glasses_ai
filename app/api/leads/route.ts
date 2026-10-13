import { NextResponse } from "next/server";
import { getLeadStore } from "@/lib/leads/store";
import {
  MAX_EMAIL_LENGTH,
  isLeadSource,
  isValidEmail,
  normalizeEmail,
} from "@/lib/leads/types";
import { checkRateLimit, pruneRateLimits } from "@/lib/server/rate-limit";

/**
 * Alta en la lista de espera.
 *
 * Es el único endpoint del producto que recibe un dato personal, así que es
 * el que más disciplina necesita:
 *
 * - **No se registra el correo**, ni siquiera en un error. Lo que sale por el
 *   log es el origen y el idioma → regla 14.
 * - **No se responde si un correo ya estaba en la lista.** Parece inofensivo
 *   y es un oráculo: permitiría a cualquiera comprobar si una dirección
 *   concreta se apuntó. La respuesta es la misma en los dos casos.
 * - **Sin destino configurado se responde «no disponible»**, no «gracias».
 *   Prometer un aviso que nadie podrá enviar es mentir.
 */

export const maxDuration = 10;

/** Estrecho: nadie necesita apuntarse cinco veces en diez minutos. */
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

const MAX_BODY_BYTES = 1024;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  pruneRateLimits();
  if (!checkRateLimit(`leads:${ip}`, RATE_LIMIT).allowed) {
    return NextResponse.json({ status: "rate_limited" }, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  let body: { email?: unknown; locale?: unknown; source?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  if (
    typeof body.email !== "string" ||
    body.email.length > MAX_EMAIL_LENGTH ||
    !isValidEmail(body.email)
  ) {
    return NextResponse.json({ status: "invalid_email" }, { status: 400 });
  }

  const source =
    typeof body.source === "string" && isLeadSource(body.source)
      ? body.source
      : "content";
  const locale =
    typeof body.locale === "string" ? body.locale.slice(0, 8) : "es";

  const store = getLeadStore();
  const result = await store.save({
    email: normalizeEmail(body.email),
    locale,
    source,
    consentAt: new Date().toISOString(),
  });

  if (!result.ok) {
    return NextResponse.json(
      { status: result.reason },
      { status: result.reason === "unavailable" ? 503 : 502 },
    );
  }

  // Misma respuesta tanto si es nueva como si ya estaba: ver cabecera.
  return NextResponse.json({ status: "ok" });
}
