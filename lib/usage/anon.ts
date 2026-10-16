import { cookieOptions } from "../auth/session";

/**
 * Identificador de sesión anónima, **firmado por el servidor**.
 *
 * Hace falta porque el cupo gratuito se cuenta contra algo, y ese algo no
 * puede venir del navegador sin más: un identificador que el cliente elige es
 * un contador que el cliente reinicia cuando quiere.
 *
 * Firmado no significa infalible. Quien borre la cookie recibe otra y otra
 * gratis. Eso es aceptable y está contemplado: lo que de verdad acota el
 * gasto es el **tope global diario**, no este. Este solo evita que haga falta
 * mala fe para saltárselo.
 *
 * No identifica a nadie: es un número aleatorio sin relación con la persona,
 * y no se cruza con la lista de espera ni con la analítica.
 */

const COOKIE_NAME = "lookfit.anon";

/** Un año. Más que la vida útil de una decisión de compra de gafas. */
const MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

function secret(): string | null {
  return process.env.SESSION_SECRET?.trim() || null;
}

function base64url(bytes: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
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

function equals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const ANON_COOKIE = COOKIE_NAME;

/** Lee el identificador si la firma cuadra. `null` ante cualquier duda. */
export async function readAnonId(
  cookieValue: string | undefined,
): Promise<string | null> {
  const key = secret();
  if (!key || !cookieValue) return null;

  const parts = cookieValue.split(".");
  if (parts.length !== 2) return null;

  const [id, signature] = parts as [string, string];
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(id)) return null;
  return equals(await sign(id, key), signature) ? id : null;
}

/** Crea uno nuevo, ya firmado y listo para la cookie. */
export async function createAnonId(): Promise<{
  id: string;
  value: string;
  maxAge: number;
} | null> {
  const key = secret();
  if (!key) return null;

  const id = crypto.randomUUID().replace(/-/g, "");
  return {
    id,
    value: `${id}.${await sign(id, key)}`,
    maxAge: MAX_AGE_SECONDS,
  };
}

export function anonCookieOptions() {
  return cookieOptions(MAX_AGE_SECONDS);
}
