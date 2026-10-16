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

export type SignInResult =
  | "ok"
  | "invalid_email"
  | "weak_password"
  | "wrong_password"
  | "rate_limited"
  | "unavailable"
  | "error";

/** Entrar o registrarse: el servidor decide cuál de las dos. */
export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult> {
  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = (await response.json()) as { status?: string };
    const status = payload.status;
    if (
      status === "ok" ||
      status === "invalid_email" ||
      status === "weak_password" ||
      status === "wrong_password" ||
      status === "rate_limited" ||
      status === "unavailable"
    ) {
      return status;
    }
    return "error";
  } catch {
    return "error";
  }
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
