import { NextResponse } from "next/server";
import { PKCE_COOKIE } from "@/lib/auth/pkce";
import {
  cookieOptions,
  createSession,
  SESSION_COOKIE,
} from "@/lib/auth/session";
import { exchangeCode } from "@/lib/auth/supabase";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

/**
 * La vuelta de Google.
 *
 * Canjea el código por el usuario **en el servidor** y deja nuestra cookie de
 * sesión. Ni un token de Supabase llega al navegador.
 *
 * Siempre se vuelve a `/probar`, que es de donde se salió: quien inició
 * sesión estaba a mitad de probarse unas gafas, y devolverlo a la portada
 * sería hacerle repetir la foto.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  const stored = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${PKCE_COOKIE}=`))
    ?.slice(PKCE_COOKIE.length + 1);

  const [verifier, langRaw] = (stored ?? "").split(".");
  const lang = langRaw && isLocale(langRaw) ? langRaw : DEFAULT_LOCALE;

  // Mismo criterio que al salir: se vuelve al origen desde el que se fue.
  const back = (outcome: string) =>
    `${url.origin}/${lang}/probar${outcome ? `?auth=${outcome}` : ""}`;

  // Sin código o sin verifier no hay nada que canjear. Puede ser alguien que
  // canceló en la pantalla de Google, y eso no es un error que mostrar.
  if (!code || !verifier) {
    return NextResponse.redirect(back(code ? "error" : ""));
  }

  const result = await exchangeCode(code, verifier);
  if (!result.ok) return NextResponse.redirect(back("error"));

  const session = await createSession(result.userId);
  if (!session) return NextResponse.redirect(back("unavailable"));

  const response = NextResponse.redirect(back("ok"));
  response.cookies.set(
    SESSION_COOKIE,
    session.value,
    cookieOptions(session.maxAge),
  );
  // El verifier ya cumplió: se tira para que no sirva dos veces.
  response.cookies.set(PKCE_COOKIE, "", cookieOptions(0));
  return response;
}
