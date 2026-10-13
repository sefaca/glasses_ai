"use client";

/**
 * Registro y entrada desde el navegador.
 *
 * Devuelve códigos estables, nunca texto: la traducción vive en el
 * diccionario, igual que en el resto del producto.
 *
 * No guarda nada. La sesión es una cookie `httpOnly` que pone el servidor y
 * que este código **no puede leer**, que es precisamente lo que impide que un
 * script de terceros se la lleve.
 */

export type RequestCodeResult =
  | "sent"
  | "invalid_email"
  | "rate_limited"
  | "unavailable"
  | "error";

export type VerifyCodeResult =
  | "ok"
  | "invalid_code"
  | "rate_limited"
  | "unavailable"
  | "error";

async function post(body: unknown): Promise<{ status?: string } | null> {
  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await response.json()) as { status?: string };
  } catch {
    return null;
  }
}

export async function requestCode(email: string): Promise<RequestCodeResult> {
  const payload = await post({ action: "request", email });
  const status = payload?.status;
  if (
    status === "sent" ||
    status === "invalid_email" ||
    status === "rate_limited" ||
    status === "unavailable"
  ) {
    return status;
  }
  return "error";
}

export async function verifyCode(
  email: string,
  code: string,
): Promise<VerifyCodeResult> {
  const payload = await post({ action: "verify", email, code });
  const status = payload?.status;
  if (
    status === "ok" ||
    status === "invalid_code" ||
    status === "rate_limited" ||
    status === "unavailable"
  ) {
    return status;
  }
  return "error";
}

export async function isSignedIn(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth");
    const payload = (await response.json()) as { signedIn?: boolean };
    return payload.signedIn === true;
  } catch {
    return false;
  }
}

export async function signOut(): Promise<void> {
  try {
    await fetch("/api/auth", { method: "DELETE" });
  } catch {
    // Si falla, la cookie caduca sola. No merece molestar al usuario.
  }
}
