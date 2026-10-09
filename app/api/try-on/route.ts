import { NextResponse } from "next/server";
import { findFrameById } from "@/lib/catalog";
import { canLabelAsProduct, canTryOn } from "@/lib/catalog/rights";
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
    return NextResponse.json(
      { status: "failed", errorCode: result.errorCode ?? "unknown" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    status: "completed",
    resultUrl: result.resultUrl,
    /**
     * Si la fidelidad no está medida, la UI **no puede** presentar esto como
     * ese producto → RULE #1. Lo decide el servidor, no la vista.
     */
    labelAsProduct: canLabelAsProduct(frame, provider.assetOwnership),
    simulated: !hasRealProvider(),
  });
}

function badRequest(errorCode: string) {
  return NextResponse.json({ status: "failed", errorCode }, { status: 400 });
}
