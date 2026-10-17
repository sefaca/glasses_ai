/**
 * Lo que llega de Paddle: comprobar que es suyo y entender qué dice.
 *
 * Todo aquí es **puro**: recibe el cuerpo en crudo y la cabecera, y devuelve
 * un veredicto. Sin red y sin base de datos, para poder probar con el
 * ejemplo real de un aviso.
 */

/**
 * Comprueba la firma de un aviso.
 *
 * Esta función es **la puerta del dinero**. Un endpoint que inserta créditos
 * sin comprobar la firma es un formulario público para regalar generaciones:
 * la URL acaba siendo conocida y el cuerpo es JSON que cualquiera redacta.
 *
 * Paddle manda `ts=<epoch>;h1=<hmac hex>` y firma el texto `<ts>:<cuerpo>`.
 * Importa que sea **el cuerpo en crudo**: si se parsea y se vuelve a
 * serializar, cambia un espacio y la firma deja de cuadrar.
 */
export async function verifySignature(input: {
  rawBody: string;
  header: string | null;
  secret: string;
  /** Inyectable para poder probar el rechazo por antigüedad. */
  now?: number;
}): Promise<boolean> {
  if (!input.header || !input.secret) return false;

  let ts: string | null = null;
  let h1: string | null = null;
  for (const part of input.header.split(";")) {
    const [key, value] = part.split("=");
    if (key?.trim() === "ts") ts = value?.trim() ?? null;
    if (key?.trim() === "h1") h1 = value?.trim() ?? null;
  }
  if (!ts || !h1) return false;

  // Ventana de cinco minutos. Sin ella, quien capturase un aviso válido
  // podría reenviarlo años después; la firma seguiría siendo correcta.
  const seconds = Number(ts);
  if (!Number.isFinite(seconds)) return false;
  const now = input.now ?? Date.now();
  if (Math.abs(now / 1000 - seconds) > 300) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(input.secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${ts}:${input.rawBody}`),
  );

  const expected = Array.from(new Uint8Array(mac))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return timingSafeEqual(expected, h1.toLowerCase());
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export interface Purchase {
  userId: string;
  generations: number;
  transactionId: string;
  priceId: string | null;
  amountCents: number | null;
  currency: string | null;
}

/**
 * Saca la compra de un aviso `transaction.completed`.
 *
 * Devuelve `null` cuando el aviso es de otro tipo o le falta algo
 * imprescindible. **Un aviso sin `user_id` no se adivina**: sin saber a quién
 * acreditar, apuntarlo a cualquiera sería peor que no apuntarlo, y queda el
 * registro en Paddle para resolverlo a mano.
 */
export function parsePurchase(
  payload: unknown,
  generationsFor: (priceId: string) => number | null,
): Purchase | null {
  if (typeof payload !== "object" || payload === null) return null;
  const event = payload as Record<string, unknown>;
  if (event.event_type !== "transaction.completed") return null;

  const data = event.data as Record<string, unknown> | undefined;
  if (!data) return null;

  const transactionId = typeof data.id === "string" ? data.id : null;
  if (!transactionId) return null;

  const custom = data.custom_data as Record<string, unknown> | undefined;
  const userId = typeof custom?.user_id === "string" ? custom.user_id : null;
  if (!userId) return null;

  const items = Array.isArray(data.items) ? data.items : [];

  let generations = 0;
  let priceId: string | null = null;

  for (const raw of items) {
    const item = raw as Record<string, unknown>;
    const price = item.price as Record<string, unknown> | undefined;
    const id = typeof price?.id === "string" ? price.id : null;
    if (!id) continue;

    // La cantidad del propio precio en Paddle manda sobre nuestra copia:
    // así se puede crear un pack nuevo desde su panel sin desplegar.
    const priceCustom = price?.custom_data as Record<string, unknown> | undefined;
    const declared = Number(priceCustom?.generations);
    const perUnit = Number.isFinite(declared) && declared > 0
      ? Math.floor(declared)
      : generationsFor(id);
    if (!perUnit) continue;

    const quantity = Number(item.quantity);
    generations += perUnit * (Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1);
    priceId ??= id;
  }

  // Un pago por algo que no reconocemos no acredita nada. Preferimos que el
  // usuario reclame —y quede trazado— a inventar una cifra.
  if (generations <= 0) return null;

  const details = data.details as Record<string, unknown> | undefined;
  const totals = details?.totals as Record<string, unknown> | undefined;
  const total = Number(totals?.grand_total);

  return {
    userId,
    generations,
    transactionId,
    priceId,
    // Paddle da los importes en la unidad mínima de la divisa, ya en texto.
    amountCents: Number.isFinite(total) ? Math.round(total) : null,
    currency: typeof data.currency_code === "string" ? data.currency_code : null,
  };
}
