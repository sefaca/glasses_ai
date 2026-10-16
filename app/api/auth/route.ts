import { NextResponse } from "next/server";
import {
  authIsConfigured,
  cookieOptions,
  createSession,
  readSession,
  SESSION_COOKIE,
} from "@/lib/auth/session";
import { authAvailable, signInOrUp } from "@/lib/auth/supabase";
import { isValidEmail, normalizeEmail } from "@/lib/leads/types";
import { checkRateLimit, pruneRateLimits } from "@/lib/server/rate-limit";

/**
 * Entrar y registrarse, que aquí son el mismo gesto.
 *
 * Nadie debería tener que recordar si ya tenía cuenta: se intenta entrar y,
 * si no, se crea. La lógica de por qué ese orden está en `supabase.ts`.
 *
 * **Nunca se dice si una dirección existe.** Solo cuando el alta falla por
 * duplicado sabemos que la contraseña era incorrecta, y entonces el mensaje
 * habla de la contraseña, no de la cuenta.
 *
 * El correo y la contraseña **no se registran en ningún log**, ni al fallar
 * → CLAUDE.md regla 14.
 */

export const maxDuration = 15;

/** Estrecho: es donde se prueban contraseñas. */
const LIMIT = { limit: 8, windowMs: 15 * 60 * 1000 };

const MAX_BODY_BYTES = 2048;

/** El mínimo de Supabase son 6; pedimos 8 porque no cuesta nada. */
const MIN_PASSWORD = 8;

export async function POST(request: Request) {
  if (!authIsConfigured() || !authAvailable()) {
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  pruneRateLimits();
  if (!checkRateLimit(`auth:${ip}`, LIMIT).allowed) {
    return NextResponse.json({ status: "rate_limited" }, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  if (typeof body.email !== "string" || !isValidEmail(body.email)) {
    return NextResponse.json({ status: "invalid_email" }, { status: 400 });
  }
  if (typeof body.password !== "string" || body.password.length < MIN_PASSWORD) {
    return NextResponse.json({ status: "weak_password" }, { status: 400 });
  }

  const result = await signInOrUp(normalizeEmail(body.email), body.password);
  if (!result.ok) {
    const status =
      result.reason === "rate_limited"
        ? 429
        : result.reason === "unavailable"
          ? 503
          : result.reason === "error"
            ? 502
            : 400;
    return NextResponse.json({ status: result.reason }, { status });
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

/** Quién soy. La interfaz solo necesita saber si hay sesión, no quién. */
export async function GET(request: Request) {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);

  return NextResponse.json({ signedIn: (await readSession(cookie)) !== null });
}

/** Cerrar sesión. */
export async function DELETE() {
  const response = NextResponse.json({ status: "ok" });
  response.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
  return response;
}
