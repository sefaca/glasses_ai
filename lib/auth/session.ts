/**
 * Sesión de la persona registrada.
 *
 * **Es nuestra, no de Supabase.** Supabase Auth se usa solo para lo que hace
 * bien —mandar el código y comprobarlo— y a partir de ahí llevamos nosotros
 * una cookie firmada con el identificador de usuario. Así no hay que
 * refrescar tokens en el navegador ni exponer ninguna credencial de Supabase
 * al cliente.
 *
 * La cookie es **estrictamente necesaria**: sin ella no se puede saber quién
 * está autenticado, que es justo lo que la persona ha pedido al registrarse.
 * Por eso no necesita banner de consentimiento, pero **sí tiene que estar
 * declarada** en la página de cookies, y lo está.
 */

const COOKIE_NAME = "lookfit.session";

/** Treinta días. Suficiente para no reenviar códigos cada dos por tres. */
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function secret(): string | null {
  return process.env.SESSION_SECRET?.trim() || null;
}

function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of view) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return base64url(
    await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(payload)),
  );
}

/** Comparación en tiempo constante, como en la puerta de acceso. */
function equals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export interface SessionValue {
  userId: string;
  /** Epoch en segundos. */
  expiresAt: number;
}

export const SESSION_COOKIE = COOKIE_NAME;

export function authIsConfigured(): boolean {
  return Boolean(secret());
}

/** Serializa y firma. `null` si no hay secreto: sin él no se emite sesión. */
export async function createSession(userId: string): Promise<{
  value: string;
  maxAge: number;
} | null> {
  const key = secret();
  if (!key) return null;

  const expiresAt = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `${userId}.${expiresAt}`;
  return {
    value: `${payload}.${await sign(payload, key)}`,
    maxAge: MAX_AGE_SECONDS,
  };
}

/**
 * Comprueba firma y caducidad.
 *
 * Devuelve `null` ante cualquier duda. Una sesión mal formada, caducada o con
 * firma que no cuadra es lo mismo que no tener sesión: no hay un caso
 * intermedio que merezca un trato distinto.
 */
export async function readSession(
  cookieValue: string | undefined,
): Promise<SessionValue | null> {
  const key = secret();
  if (!key || !cookieValue) return null;

  const parts = cookieValue.split(".");
  if (parts.length !== 3) return null;

  const [userId, expiresRaw, signature] = parts as [string, string, string];
  const payload = `${userId}.${expiresRaw}`;
  if (!equals(await sign(payload, key), signature)) return null;

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt * 1000 < Date.now()) return null;

  return { userId, expiresAt };
}

/** Atributos de la cookie, en un solo sitio para que no diverjan. */
export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    // `Lax` y no `Strict`: con `Strict`, volver desde el correo dejaría la
    // sesión invisible en la primera carga y parecería que no ha entrado.
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
