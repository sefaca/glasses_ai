import { NextResponse } from "next/server";
import {
  authIsConfigured,
  cookieOptions,
  createSession,
  readSession,
  SESSION_COOKIE,
} from "@/lib/auth/session";
import { authAvailable, requestOtp, verifyOtp } from "@/lib/auth/supabase";
import { isValidEmail, normalizeEmail } from "@/lib/leads/types";
import { checkRateLimit, pruneRateLimits } from "@/lib/server/rate-limit";

/**
 * Registro y entrada, que aquí son lo mismo.
 *
 * Dos acciones en una ruta porque comparten validación, límites y la
 * disciplina de no filtrar quién está registrado:
 *
 * - `request`: manda un código de seis dígitos al correo.
 * - `verify`: lo comprueba y deja la cookie de sesión.
 *
 * **Nunca se dice si una dirección existe.** `request` responde lo mismo para
 * un correo conocido y para uno nuevo, y `verify` no distingue entre código
 * incorrecto y código caducado. Lo contrario convertiría esto en una forma
 * de averiguar quién está registrado.
 *
 * El correo **no se registra en ningún log**, ni siquiera al fallar
 * → CLAUDE.md regla 14.
 */

export const maxDuration = 15;

/** Estrecho: pedir código es mandar un correo, y eso se abusa rápido. */
const REQUEST_LIMIT = { limit: 4, windowMs: 15 * 60 * 1000 };
/** Más holgado, pero lejos de permitir probar un millón de códigos. */
const VERIFY_LIMIT = { limit: 10, windowMs: 15 * 60 * 1000 };

const MAX_BODY_BYTES = 1024;

export async function POST(request: Request) {
  if (!authIsConfigured() || !authAvailable()) {
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  let body: { action?: unknown; email?: unknown; code?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  if (typeof body.email !== "string" || !isValidEmail(body.email)) {
    return NextResponse.json({ status: "invalid_email" }, { status: 400 });
  }
  const email = normalizeEmail(body.email);

  pruneRateLimits();

  if (body.action === "request") {
    if (!checkRateLimit(`auth-request:${ip}`, REQUEST_LIMIT).allowed) {
      return NextResponse.json({ status: "rate_limited" }, { status: 429 });
    }

    const result = await requestOtp(email);
    if (result === "sent") return NextResponse.json({ status: "sent" });
    return NextResponse.json(
      { status: result },
      { status: result === "rate_limited" ? 429 : 502 },
    );
  }

  if (body.action === "verify") {
    if (!checkRateLimit(`auth-verify:${ip}`, VERIFY_LIMIT).allowed) {
      return NextResponse.json({ status: "rate_limited" }, { status: 429 });
    }

    const code = typeof body.code === "string" ? body.code.trim() : "";
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ status: "invalid_code" }, { status: 400 });
    }

    const result = await verifyOtp(email, code);
    if (!result.ok) {
      return NextResponse.json(
        { status: result.reason },
        { status: result.reason === "invalid_code" ? 400 : 502 },
      );
    }

    const session = await createSession(result.userId);
    if (!session) {
      return NextResponse.json({ status: "unavailable" }, { status: 503 });
    }

    const response = NextResponse.json({ status: "ok" });
    response.cookies.set(
      SESSION_COOKIE,
      session.value,
      cookieOptions(session.maxAge),
    );
    return response;
  }

  return NextResponse.json({ status: "invalid" }, { status: 400 });
}

/** Quién soy. La usa la interfaz para saber si enseñar el panel o no. */
export async function GET(request: Request) {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);

  const session = await readSession(cookie);
  // Nunca se devuelve el identificador: la interfaz solo necesita saber si
  // hay sesión, y lo que no sale no se puede filtrar.
  return NextResponse.json({ signedIn: session !== null });
}

/** Cerrar sesión: borrar la cookie. */
export async function DELETE() {
  const response = NextResponse.json({ status: "ok" });
  response.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
  return response;
}
