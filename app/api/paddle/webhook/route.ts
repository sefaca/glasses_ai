import { NextResponse } from "next/server";
import { packByPriceId } from "@/lib/billing/packs";
import { parsePurchase, verifySignature } from "@/lib/billing/paddle";
import { recordPurchase } from "@/lib/usage/store";

/**
 * El aviso de pago de Paddle.
 *
 * Es el único sitio donde el saldo de alguien sube, así que las reglas son
 * más duras que en el resto del producto:
 *
 * - **Primero la firma, después todo lo demás.** No se parsea, no se registra
 *   y no se toca la base hasta saber que el aviso es de Paddle.
 * - **El código de respuesta es la señal de reintento.** Paddle reenvía
 *   mientras no reciba un 2xx. Por eso un fallo de base devuelve 500 —para
 *   que vuelva a intentarlo— y un aviso repetido devuelve 200, porque ya está
 *   hecho y reintentarlo no arreglaría nada.
 * - **Nada del cuerpo sale por el log.** Lleva correo y país de quien compra.
 */

export const maxDuration = 15;

/** Sin tope, un cuerpo enorme obligaría a leerlo entero antes de descartarlo. */
const MAX_BODY_BYTES = 128 * 1024;

export async function POST(request: Request) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    // Sin secreto no hay forma de distinguir a Paddle de cualquiera. Devolver
    // 500 y no 200 es a propósito: Paddle lo reintenta y el pago no se pierde
    // mientras se configura la variable.
    console.error("[paddle] falta PADDLE_WEBHOOK_SECRET");
    return NextResponse.json({ status: "unconfigured" }, { status: 500 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ status: "too_large" }, { status: 413 });
  }

  const signed = await verifySignature({
    rawBody: raw,
    header: request.headers.get("paddle-signature"),
    secret,
  });
  if (!signed) {
    // 401 y punto. No se dice qué falló: ni la ventana de tiempo ni el
    // formato, porque eso ayudaría a quien esté probando.
    return NextResponse.json({ status: "unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const purchase = parsePurchase(
    payload,
    (priceId) => packByPriceId(priceId)?.generations ?? null,
  );

  // Puede ser otro tipo de aviso, o uno que no sabemos acreditar. En los dos
  // casos **200**: no es un fallo nuestro y reintentarlo daría igual.
  if (!purchase) {
    return NextResponse.json({ status: "ignored" });
  }

  const result = await recordPurchase(purchase);

  if (result === "error") {
    console.error("[paddle] no se pudo acreditar", purchase.transactionId);
    return NextResponse.json({ status: "retry" }, { status: 500 });
  }

  return NextResponse.json({ status: result });
}
