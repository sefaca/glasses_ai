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

export type PasswordResult =
  | { ok: true; userId: string }
  /** El correo existe y la contraseña no es esa. */
  | { ok: false; reason: "wrong_password" }
  /** La contraseña no cumple el mínimo que exige Supabase. */
  | { ok: false; reason: "weak_password" }
  | { ok: false; reason: "rate_limited" | "unavailable" | "error" };

function config(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? { url, key } : null;
}

export function authAvailable(): boolean {
  return config() !== null;
}

/**
 * Entrar o registrarse, que aquí son el mismo gesto.
 *
 * Se intenta **iniciar sesión primero** y, si no cuadra, se crea la cuenta.
 * Es el orden correcto por una razón concreta: Supabase devuelve el mismo
 * error para «no existe» y para «contraseña incorrecta», a propósito, para
 * que nadie pueda averiguar qué direcciones están registradas. Si el alta
 * falla porque ya existe, entonces —y solo entonces— sabemos que lo que
 * había era una contraseña incorrecta.
 */
export async function signInOrUp(
  email: string,
  password: string,
): Promise<PasswordResult> {
  const conf = config();
  if (!conf) return { ok: false, reason: "unavailable" };

  const signedIn = await post(conf, "/auth/v1/token?grant_type=password", {
    email,
    password,
  });
  if (signedIn.status === 200) {
    const userId = (signedIn.body as { user?: { id?: string } })?.user?.id;
    return userId ? { ok: true, userId } : { ok: false, reason: "error" };
  }
  if (signedIn.status === 429) return { ok: false, reason: "rate_limited" };

  const signedUp = await post(conf, "/auth/v1/signup", { email, password });
  if (signedUp.status === 200) {
    const body = signedUp.body as { user?: { id?: string }; id?: string };
    const userId = body?.user?.id ?? body?.id;
    return userId ? { ok: true, userId } : { ok: false, reason: "error" };
  }
  if (signedUp.status === 429) return { ok: false, reason: "rate_limited" };

  const message = String(
    (signedUp.body as { msg?: string; error_description?: string })?.msg ??
      (signedUp.body as { error_description?: string })?.error_description ??
      "",
  ).toLowerCase();

  // Ya existía: lo que falló antes era la contraseña.
  if (message.includes("already") || message.includes("registered")) {
    return { ok: false, reason: "wrong_password" };
  }
  if (message.includes("password")) return { ok: false, reason: "weak_password" };

  console.error("[auth] signup", signedUp.status);
  return { ok: false, reason: "error" };
}

/** URL a la que mandar a alguien para que elija su cuenta de Google. */
export function googleAuthorizeUrl(
  redirectTo: string,
  challenge: string,
): string | null {
  const conf = config();
  if (!conf) return null;

  const params = new URLSearchParams({
    provider: "google",
    redirect_to: redirectTo,
    code_challenge: challenge,
    code_challenge_method: "s256",
  });
  return `${conf.url}/auth/v1/authorize?${params.toString()}`;
}

/** Canjea el código de la vuelta por el usuario. */
export async function exchangeCode(
  code: string,
  verifier: string,
): Promise<{ ok: true; userId: string } | { ok: false }> {
  const conf = config();
  if (!conf) return { ok: false };

  const result = await post(conf, "/auth/v1/token?grant_type=pkce", {
    auth_code: code,
    code_verifier: verifier,
  });
  if (result.status !== 200) {
    console.error("[auth] pkce", result.status);
    return { ok: false };
  }

  const userId = (result.body as { user?: { id?: string } })?.user?.id;
  return userId ? { ok: true, userId } : { ok: false };
}

/** Una sola forma de hablar con Supabase, para no repetir cabeceras. */
async function post(
  conf: { url: string; key: string },
  path: string,
  body: unknown,
): Promise<{ status: number; body: unknown }> {
  try {
    const response = await fetch(`${conf.url}${path}`, {
      method: "POST",
      headers: {
        apikey: conf.key,
        Authorization: `Bearer ${conf.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    // Nunca se devuelve este cuerpo al cliente → regla 5.
    return { status: response.status, body: await response.json().catch(() => null) };
  } catch {
    return { status: 0, body: null };
  }
}
