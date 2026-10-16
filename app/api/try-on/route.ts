import { NextResponse } from "next/server";
import { findFrameById } from "@/lib/catalog";
import { canLabelAsProduct, canTryOn } from "@/lib/catalog/rights";
import { SESSION_COOKIE, readSession } from "@/lib/auth/session";
import {
  ANON_COOKIE,
  anonCookieOptions,
  createAnonId,
  readAnonId,
} from "@/lib/usage/anon";
import { decide, type Subject } from "@/lib/usage/quota";
import { readCounts, recordGeneration, usageIsConfigured } from "@/lib/usage/store";
import { ACCESS_HEADER, checkAccess } from "@/lib/server/access";
import { checkRateLimit, pruneRateLimits } from "@/lib/server/rate-limit";
import { buildTryOnPrompt, PROMPT_VERSION } from "@/lib/tryon/prompt";
import { getTryOnProvider, hasRealProvider } from "@/lib/tryon/registry";
import { waitForResult } from "@/lib/tryon/wait";

/**
 * Generación de try-on. **Servidor**, porque la clave no puede tocar el
 * navegador → CLAUDE.md regla 6.
 *
 * Decisiones que conviene no deshacer sin pensarlo:
 *
 * - **La foto no se guarda en ningún sitio.** Llega en el cuerpo, se manda al
 *   proveedor y el resultado vuelve en línea. Sin storage no hay retención
 *   que gestionar, que es la lectura más estricta de §14.
 * - **No se registra nada de la imagen** — ni bytes, ni nombre, ni hash
 *   → reglas 13 y 14. Lo único observable es proveedor, coste y latencia.
 * - El error que sale es **un código estable**, nunca el del proveedor
 *   → regla 5.
 */

/**
 * La generación tarda; sin esto la plataforma corta la petición.
 * (`runtime` no se declara: con `cacheComponents` Next no lo admite, y el
 * runtime de Node ya es el de por defecto en los route handlers.)
 */
export const maxDuration = 60;

/** Tope por ventana. Cada generación cuesta dinero real. */
const RATE_LIMIT = { limit: 12, windowMs: 10 * 60 * 1000 };

/** Tope de tamaño del cuerpo, coherente con la validación de cliente. */
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

const ACCEPTED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

interface TryOnRequestBody {
  frameId?: unknown;
  mimeType?: unknown;
  imageBase64?: unknown;
}

export async function POST(request: Request) {
  // Identificación por IP: es lo único disponible sin sesión, y §15 avisa de
  // que no debe ser el único mecanismo. Cuando haya sesión anónima, se suma.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  /**
   * La puerta va antes que nada: si no está autorizado, no se gasta ni una
   * comprobación más y desde luego no se llama al proveedor.
   *
   * Dos formas de pasar, y basta con una:
   *
   * - **Cuenta.** Es el camino normal desde que existe el registro.
   * - **Código compartido.** Se mantiene porque es lo que permite enseñar el
   *   producto a alguien sin pedirle que se registre, y porque si el envío
   *   de correos falla, sin él nadie podría entrar.
   */
  const cookies = (request.headers.get("cookie") ?? "")
    .split(";")
    .map((part) => part.trim());
  const cookieValue = (name: string) =>
    cookies
      .find((part) => part.startsWith(`${name}=`))
      ?.slice(name.length + 1);

  const session = await readSession(cookieValue(SESSION_COOKIE));
  const signedIn = session !== null;

  /**
   * Quién puede generar, y bajo qué cuenta.
   *
   * Hasta ahora el código compartido era un **muro**: sin él no pasaba nadie,
   * ni siquiera para su primera prueba. Eso tenía sentido mientras no había
   * forma de contar el gasto, y dejó de tenerla al existir la contabilidad
   * → D-032.
   *
   * Ahora el código es un **salvoconducto**, no una puerta: salta el cupo
   * gratuito —sirve para enseñar el producto sin agotarlo— pero **no salta el
   * tope diario**. Ni nosotros podemos vaciar la cuenta por descuido.
   *
   * Y el anónimo entra sin nada, con su generación gratis, **siempre que se
   * pueda contar**. Si no hay contabilidad configurada se vuelve al régimen
   * de alfa privada: código o nada. Nunca se abre a ciegas.
   */
  const access = checkAccess(request.headers.get(ACCESS_HEADER));
  const hasSharedCode = access === "open" || access === "granted";

  pruneRateLimits();
  const limit = checkRateLimit(`try-on:${ip}`, RATE_LIMIT);
  if (!limit.allowed) {
    return NextResponse.json(
      { status: "failed", errorCode: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: TryOnRequestBody;
  try {
    body = (await request.json()) as TryOnRequestBody;
  } catch {
    return badRequest("invalid_input");
  }

  const { frameId, mimeType, imageBase64 } = body;
  if (
    typeof frameId !== "string" ||
    typeof mimeType !== "string" ||
    typeof imageBase64 !== "string"
  ) {
    return badRequest("invalid_input");
  }
  if (!ACCEPTED_MIME.has(mimeType)) return badRequest("invalid_input");

  // base64 ocupa ~4/3 de los bytes reales.
  if ((imageBase64.length * 3) / 4 > MAX_IMAGE_BYTES) {
    return badRequest("invalid_input");
  }

  const frame = findFrameById(frameId);
  if (!frame) return badRequest("invalid_input");

  /**
   * El cupo, **antes** de llamar al proveedor.
   *
   * Es lo único que convierte el gasto en acotado: hasta ahora el freno era
   * un contador en memoria del proceso, y en serverless cada instancia lleva
   * la suya. Aquí hay tres topes —por sesión, por cuenta y global diario— y
   * el que de verdad protege la factura es el tercero.
   *
   * **Falla cerrado**: si no se puede consultar el contador, se deniega.
   * Denegar deja a alguien sin probar un rato; permitir deja la factura
   * abierta. No es simétrico.
   */
  let anonId = await readAnonId(cookieValue(ANON_COOKIE));
  let freshAnon: Awaited<ReturnType<typeof createAnonId>> = null;

  if (!signedIn && !anonId) {
    freshAnon = await createAnonId();
    anonId = freshAnon?.id ?? null;
  }

  const subject: Subject | null = signedIn
    ? { type: "user", id: session.userId }
    : anonId
      ? { type: "anon", id: anonId }
      : null;

  const quotaReady = usageIsConfigured() && subject !== null;

  // Sin contabilidad y sin código no hay forma segura de dejar pasar a nadie.
  if (!quotaReady && !hasSharedCode) {
    return quotaDenied("access_denied", 401, freshAnon);
  }

  if (quotaReady) {
    const counts = await readCounts(subject);
    if (!counts.ok) {
      return quotaDenied("usage_unavailable", 503, freshAnon);
    }

    const verdict = decide(subject, counts.counts);
    // El tope diario no lo salta nadie, ni con código.
    if (!verdict.allowed && verdict.reason === "daily_cap") {
      return quotaDenied("daily_cap", 503, freshAnon);
    }
    if (!verdict.allowed && !hasSharedCode) {
      return quotaDenied(verdict.reason, 402, freshAnon);
    }
  }

  const provider = getTryOnProvider();
  // El muro de gates también aquí: que el cliente pida algo no autoriza nada.
  if (!canTryOn(frame, provider.assetOwnership)) {
    return NextResponse.json(
      { status: "failed", errorCode: "content_rejected" },
      { status: 403 },
    );
  }

  const job = await provider.createTryOn({
    frameId: frame.id,
    userImage: { mimeType, base64: imageBase64 },
    framePrompt: buildTryOnPrompt(frame),
  });
  // Un generativo resuelve dentro de `createTryOn`; uno con cola devuelve
  // `queued`. La ruta no tiene por qué saber cuál hay detrás.
  const result = await waitForResult(provider, job.id);

  // Observabilidad sin datos personales → §29.6 y reglas 13-14.
  console.info("[try-on]", {
    provider: provider.name,
    promptVersion: PROMPT_VERSION,
    frameId: frame.id,
    status: result.status,
    errorCode: result.errorCode,
    costCents: result.billable ? result.costEstimateCents : 0,
  });

  if (result.status !== "completed" || !result.resultUrl) {
    // Una generación fallida no gasta cupo → regla 11.
    return NextResponse.json(
      { status: "failed", errorCode: result.errorCode ?? "unknown" },
      { status: 502 },
    );
  }

  if (quotaReady && result.billable) {
    await recordGeneration({
      subject,
      frameId: frame.id,
      provider: provider.name,
      costCents: result.costEstimateCents,
    });
  }

  const response = NextResponse.json({
    status: "completed",
    resultUrl: result.resultUrl,
    /**
     * Si la fidelidad no está medida, la UI **no puede** presentar esto como
     * ese producto → RULE #1. Lo decide el servidor, no la vista.
     */
    labelAsProduct: canLabelAsProduct(frame, provider.assetOwnership),
    simulated: !hasRealProvider(),
  });

  // La cookie anónima se emite con la respuesta, no antes: si la petición se
  // hubiera rechazado, no tiene sentido haber marcado el navegador.
  if (freshAnon) {
    response.cookies.set(ANON_COOKIE, freshAnon.value, anonCookieOptions());
  }
  return response;
}

/**
 * Respuesta de cupo agotado.
 *
 * Lleva la cookie anónima aunque deniegue: si no, cada intento crearía un
 * sujeto nuevo y el cupo no contaría nada.
 */
function quotaDenied(
  errorCode: string,
  status: number,
  freshAnon: { value: string } | null,
) {
  const response = NextResponse.json(
    { status: "failed", errorCode },
    { status },
  );
  if (freshAnon) {
    response.cookies.set(ANON_COOKIE, freshAnon.value, anonCookieOptions());
  }
  return response;
}

function badRequest(errorCode: string) {
  return NextResponse.json({ status: "failed", errorCode }, { status: 400 });
}
