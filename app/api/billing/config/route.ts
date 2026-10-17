import { NextResponse } from "next/server";
import { SESSION_COOKIE, readSession } from "@/lib/auth/session";

/**
 * Lo que el navegador necesita para abrir el checkout.
 *
 * Son tres datos y ninguno es secreto: el token de cliente de Paddle está
 * pensado para viajar al navegador, el entorno es «sandbox» o «production» y
 * el identificador es el de quien pregunta.
 *
 * Aun así va detrás de la sesión y no en una variable `NEXT_PUBLIC_`. El
 * motivo es el tercer dato: **el identificador tiene que salir de la cookie
 * firmada**, no del cliente. Si el navegador lo eligiera, cualquiera podría
 * pagar acreditando la cuenta de otro —o, peor, probar identificadores hasta
 * dar con uno válido. Al venir de aquí, el `user_id` que acompaña al pago es
 * necesariamente el de quien estaba dentro.
 */

export async function GET(request: Request) {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.slice(SESSION_COOKIE.length + 1);

  const session = await readSession(cookie);

  const token = process.env.PADDLE_CLIENT_TOKEN?.trim();
  if (!token) {
    // Todavía no se puede cobrar. Se dice, para que la UI enseñe los precios
    // sin prometer un botón que no abriría nada.
    return NextResponse.json({ status: "unconfigured" });
  }

  return NextResponse.json({
    status: "ok",
    token,
    environment:
      process.env.PADDLE_ENVIRONMENT?.trim() === "production"
        ? "production"
        : "sandbox",
    /**
     * `null` sin sesión, y no un 401.
     *
     * Comprar un pack **sí** exige cuenta, y de eso se encarga quien llama.
     * Pero retomar un pago a medias no: a esa página se llega desde un correo
     * de Paddle, posiblemente en otro navegador, y la transacción ya lleva
     * dentro a quién acreditar desde que se abrió el checkout.
     */
    userId: session?.userId ?? null,
  });
}
