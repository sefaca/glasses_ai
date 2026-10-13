/**
 * Supabase Auth, solo para lo que hace bien: mandar un código a un correo y
 * comprobarlo.
 *
 * Nada más. La sesión la llevamos nosotros (`session.ts`), así que estos
 * tokens no se guardan ni viajan al navegador: de la respuesta solo se usa el
 * identificador de usuario.
 *
 * Se habla con su API REST directamente en vez de traer `@supabase/supabase-js`
 * → CLAUDE.md regla 2. Son dos peticiones.
 */

export type OtpResult = "sent" | "rate_limited" | "unavailable" | "error";

export type VerifyResult =
  | { ok: true; userId: string }
  | { ok: false; reason: "invalid_code" | "rate_limited" | "unavailable" | "error" };

function config(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? { url, key } : null;
}

export function authAvailable(): boolean {
  return config() !== null;
}

/**
 * Pide el envío de un código de seis dígitos.
 *
 * `should_create_user: true` hace que registrarse y entrar sean el mismo
 * gesto. Es deliberado: distinguirlos obligaría a la persona a recordar si ya
 * tenía cuenta, que es una pregunta que no debería tener que responder.
 */
export async function requestOtp(email: string): Promise<OtpResult> {
  const conf = config();
  if (!conf) return "unavailable";

  try {
    const response = await fetch(`${conf.url}/auth/v1/otp`, {
      method: "POST",
      headers: {
        apikey: conf.key,
        Authorization: `Bearer ${conf.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, create_user: true }),
    });

    if (response.ok) return "sent";
    // Supabase limita los envíos; su 429 se traduce al nuestro.
    if (response.status === 429) return "rate_limited";

    // Nunca se devuelve su cuerpo al cliente → regla 5.
    console.error("[auth] otp", response.status);
    return "error";
  } catch {
    return "error";
  }
}

/** Comprueba el código y devuelve el identificador de usuario. */
export async function verifyOtp(
  email: string,
  code: string,
): Promise<VerifyResult> {
  const conf = config();
  if (!conf) return { ok: false, reason: "unavailable" };

  try {
    const response = await fetch(`${conf.url}/auth/v1/verify`, {
      method: "POST",
      headers: {
        apikey: conf.key,
        Authorization: `Bearer ${conf.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "email", email, token: code }),
    });

    if (response.status === 429) return { ok: false, reason: "rate_limited" };
    if (!response.ok) {
      // Un código mal tecleado o caducado llega como 400/403. No se
      // distingue entre «no existe» y «ha caducado»: decirlo permitiría
      // averiguar qué direcciones están registradas.
      return { ok: false, reason: "invalid_code" };
    }

    const payload = (await response.json()) as { user?: { id?: string } };
    const userId = payload.user?.id;
    if (!userId) return { ok: false, reason: "error" };

    return { ok: true, userId };
  } catch {
    return { ok: false, reason: "error" };
  }
}
