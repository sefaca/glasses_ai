import { NextResponse } from "next/server";
import { MAX_EVENT_BYTES, isEventName } from "@/lib/analytics/events";
import type { EventProps } from "@/lib/analytics/events";
import { getSink } from "@/lib/analytics/sink";
import { checkRateLimit, pruneRateLimits } from "@/lib/server/rate-limit";

/**
 * Recogida de eventos del embudo.
 *
 * Es de primera parte a propósito: no hay script de terceros, así que nadie
 * más que nosotros ve por dónde pasa la gente, y no hace falta banner de
 * consentimiento para una analítica que no instala cookies ni identifica a
 * nadie. Eso es también lo que permite que la página de cookies siga siendo
 * cierta.
 *
 * **La lista de metadatos es cerrada.** Lo que no está en `ALLOWED_PROPS` se
 * descarta aquí, en el servidor. No basta con que el cliente se porte bien:
 * lo que decide el cliente lo decide quien controle el navegador, y por ahí
 * es por donde entraría una medida facial o una ruta con datos dentro
 * → CLAUDE.md reglas 13 y 14.
 */

export const maxDuration = 10;

/** Generoso: son peticiones baratas y una sesión activa emite bastantes. */
const RATE_LIMIT = { limit: 120, windowMs: 10 * 60 * 1000 };

const ALLOWED_PROPS = [
  "locale",
  "path",
  "frameId",
  "brandId",
  "shape",
  "errorCode",
  "step",
  "count",
  "durationMs",
] as const;

/** Tope por campo de texto, para que nadie use esto como almacenamiento. */
const MAX_STRING = 120;

function sanitize(input: unknown): EventProps {
  if (!input || typeof input !== "object") return {};
  const source = input as Record<string, unknown>;
  const clean: Record<string, string | number> = {};

  for (const key of ALLOWED_PROPS) {
    const value = source[key];
    if (typeof value === "string" && value.length > 0) {
      // `path` sin query: una URL con parámetros puede arrastrar cualquier
      // cosa que alguien haya pegado en la barra de direcciones.
      const trimmed = (key === "path" ? value.split("?")[0]! : value).slice(
        0,
        MAX_STRING,
      );
      clean[key] = trimmed;
    } else if (typeof value === "number" && Number.isFinite(value)) {
      clean[key] = Math.round(value);
    }
  }

  return clean as EventProps;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  pruneRateLimits();
  // La IP se usa para limitar y **no se guarda**: no llega al sink.
  if (!checkRateLimit(`events:${ip}`, RATE_LIMIT).allowed) {
    return new NextResponse(null, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > MAX_EVENT_BYTES) {
    return new NextResponse(null, { status: 413 });
  }

  let body: { name?: unknown; props?: unknown; sessionId?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  if (typeof body.name !== "string" || !isEventName(body.name)) {
    return new NextResponse(null, { status: 400 });
  }

  const sessionId =
    typeof body.sessionId === "string"
      ? body.sessionId.slice(0, 64)
      : "unavailable";

  await getSink().record({
    name: body.name,
    props: sanitize(body.props),
    sessionId,
    at: new Date().toISOString(),
  });

  // 204: a `sendBeacon` no le interesa el cuerpo y así no se transmite nada.
  return new NextResponse(null, { status: 204 });
}
