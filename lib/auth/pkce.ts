/**
 * PKCE para el inicio de sesión con Google.
 *
 * Hace falta porque el intercambio ocurre **en nuestro servidor**: Supabase
 * nos devuelve un código en la URL y lo canjeamos nosotros. La alternativa
 * —el flujo implícito, que devuelve los tokens en el fragmento de la URL—
 * obligaría a leerlos en el navegador, y con ellos a meter el cliente de
 * Supabase y su clave pública en la página. No hace falta ninguna de las dos
 * cosas.
 *
 * El `verifier` viaja en una cookie `httpOnly` de vida corta. Es lo que ata
 * la vuelta de Google a la ida que salió de aquí: sin él, un código robado
 * de la barra de direcciones serviría para iniciar sesión.
 */

export const PKCE_COOKIE = "lookfit.pkce";

/** Cinco minutos: lo que tarda alguien en elegir cuenta de Google. */
export const PKCE_MAX_AGE = 5 * 60;

function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of view) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Cadena aleatoria larga, como exige la especificación. */
export function createVerifier(): string {
  return base64url(crypto.getRandomValues(new Uint8Array(48)));
}

/** SHA-256 del verifier, que es lo único que se manda a Google. */
export async function challengeFor(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return base64url(digest);
}
