import { NextResponse } from "next/server";
import { cookieOptions } from "@/lib/auth/session";
import {
  PKCE_COOKIE,
  PKCE_MAX_AGE,
  challengeFor,
  createVerifier,
} from "@/lib/auth/pkce";
import { googleAuthorizeUrl } from "@/lib/auth/supabase";
import { isLocale, DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * Empieza el inicio de sesión con Google.
 *
 * Guarda el `verifier` en una cookie de vida corta y manda a Supabase, que
 * manda a Google. La vuelta la recoge `/api/auth/callback`.
 *
 * El idioma viaja en la cookie junto al verifier, no en la URL de vuelta: así
 * quien vuelve aterriza en el idioma desde el que se fue, sin que ese dato
 * ande dando saltos por parámetros que cualquiera puede cambiar.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  /*
   * El origen sale de la propia petición, no de `SITE_URL`.
   *
   * Así funciona igual en local, en una previsualización de Vercel y en
   * producción, sin configurar nada: quien empieza en un sitio vuelve a ese
   * sitio. Con una constante, en local te mandaría a producción a mitad del
   * inicio de sesión. Cada origen que se use tiene que estar permitido en
   * Supabase (Authentication → URL Configuration).
   */
  const origin = url.origin;
  const langParam = url.searchParams.get("lang") ?? "";
  const lang = isLocale(langParam) ? langParam : DEFAULT_LOCALE;

  const verifier = createVerifier();
  const challenge = await challengeFor(verifier);

  const authorize = googleAuthorizeUrl(
    `${origin}/api/auth/callback`,
    challenge,
  );
  if (!authorize) {
    return NextResponse.redirect(`${origin}/${lang}/probar?auth=unavailable`);
  }

  const response = NextResponse.redirect(authorize);
  response.cookies.set(
    PKCE_COOKIE,
    `${verifier}.${lang}`,
    cookieOptions(PKCE_MAX_AGE),
  );
  return response;
}
