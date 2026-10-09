import {
  type TryOnErrorCode,
  type TryOnInput,
  type TryOnJob,
  type TryOnProvider,
  type TryOnResult,
} from "./provider";

/**
 * Proveedor generativo de Google — la ruta `model-prior` de D-022.
 *
 * No recibe ninguna imagen del anunciante: solo la foto del usuario y una
 * **descripción en texto** de la montura, construida con datos públicos. Por
 * eso los términos de afiliación no le aplican, y por eso su límite es la
 * fidelidad y no el permiso.
 *
 * **Solo se instancia en servidor.** La clave no puede tocar el navegador
 * → CLAUDE.md regla 6. El constructor lo comprueba en vez de confiar.
 */

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";

/**
 * Coste de lista por imagen, en céntimos de euro, a 2026-10-09.
 * Se declara aquí para que la contabilidad de coste (§29.6) no dependa de
 * que alguien recuerde actualizarlo en otro sitio.
 */
const COST_CENTS: Record<string, number> = {
  "gemini-3.1-flash-lite-image": 3,
  "gemini-3.1-flash-image": 6,
  "gemini-3-pro-image": 11,
  "gemini-nano-banana-2.1": 6,
};

export interface GeminiProviderOptions {
  apiKey: string;
  /** Por defecto, el equilibrio entre coste y calidad. */
  model?: string;
  /** `1K` basta para comparar en pantalla y cuesta menos que `2K`. */
  imageSize?: "512px" | "1K" | "2K" | "4K";
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  now?: () => number;
}

interface InteractionsResponse {
  output_image?: { data?: string; mime_type?: string };
  steps?: Array<{
    type?: string;
    content?: Array<{ type?: string; data?: string; mime_type?: string }>;
  }>;
}

export class GeminiTryOnProvider implements TryOnProvider {
  readonly name: string;
  readonly assetOwnership = "model-prior" as const;
  readonly costPerTryOnCents: number;
  readonly supportsPhotoInput = true;
  readonly supportsLiveCamera = false;

  private readonly apiKey: string;
  private readonly model: string;
  private readonly imageSize: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;
  private readonly now: () => number;
  private readonly results = new Map<string, TryOnResult>();
  private counter = 0;

  constructor(options: GeminiProviderOptions) {
    if (typeof window !== "undefined") {
      throw new Error(
        "GeminiTryOnProvider solo puede instanciarse en servidor: la clave nunca toca el navegador.",
      );
    }
    if (!options.apiKey) {
      throw new Error("GeminiTryOnProvider requiere una API key.");
    }

    this.apiKey = options.apiKey;
    this.model = options.model ?? "gemini-3.1-flash-image";
    this.imageSize = options.imageSize ?? "1K";
    this.timeoutMs = options.timeoutMs ?? 60_000;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.now = options.now ?? (() => Date.now());
    this.name = `gemini:${this.model}`;
    this.costPerTryOnCents = COST_CENTS[this.model] ?? 11;
  }

  async createTryOn(input: TryOnInput): Promise<TryOnJob> {
    const id = `gem-${++this.counter}-${this.now()}`;

    if (!input.userImage || !input.framePrompt) {
      return this.store(this.failed(id, input, "invalid_input"));
    }

    try {
      const dataUrl = await this.generate(
        input.userImage,
        input.framePrompt,
      );
      return this.store({
        ...this.base(id, input),
        status: "completed",
        resultUrl: dataUrl,
        errorCode: null,
        completedAt: new Date(this.now()).toISOString(),
        billable: true,
      });
    } catch (error) {
      // Regla 5: hacia fuera solo sale un código estable, nunca el error del
      // proveedor, que puede llevar detalles de la petición o de la clave.
      return this.store(this.failed(id, input, toErrorCode(error)));
    }
  }

  async getJob(jobId: string): Promise<TryOnResult> {
    const job = this.results.get(jobId);
    if (!job) throw new Error(`gemini: job desconocido ${jobId}`);
    return { ...job };
  }

  private async generate(
    image: { mimeType: string; base64: string },
    prompt: string,
  ): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImpl(ENDPOINT, {
        method: "POST",
        headers: {
          "x-goog-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          input: [
            { type: "text", text: prompt },
            {
              type: "image",
              mime_type: image.mimeType,
              data: image.base64,
            },
          ],
          response_format: {
            type: "image",
            mime_type: "image/jpeg",
            image_size: this.imageSize,
          },
        }),
      });

      if (!response.ok) {
        throw new ProviderError(statusToErrorCode(response.status));
      }

      const payload = (await response.json()) as InteractionsResponse;
      const generated = extractImage(payload);
      if (!generated) throw new ProviderError("content_rejected");

      return `data:${generated.mimeType};base64,${generated.data}`;
    } finally {
      clearTimeout(timer);
    }
  }

  private base(id: string, input: TryOnInput): TryOnResult {
    return {
      id,
      provider: this.name,
      providerJobId: id,
      status: "queued",
      frameId: input.frameId,
      costEstimateCents: this.costPerTryOnCents,
      createdAt: new Date(this.now()).toISOString(),
      resultUrl: null,
      errorCode: null,
      completedAt: null,
      billable: true,
    };
  }

  private failed(
    id: string,
    input: TryOnInput,
    errorCode: TryOnErrorCode,
  ): TryOnResult {
    return {
      ...this.base(id, input),
      status: "failed",
      errorCode,
      completedAt: new Date(this.now()).toISOString(),
      // Regla 11: una generación fallida nunca consume crédito.
      billable: false,
    };
  }

  private store(result: TryOnResult): TryOnResult {
    this.results.set(result.id, result);
    return { ...result };
  }
}

class ProviderError extends Error {
  constructor(readonly code: TryOnErrorCode) {
    super(code);
  }
}

function statusToErrorCode(status: number): TryOnErrorCode {
  if (status === 429) return "rate_limited";
  if (status === 400) return "invalid_input";
  if (status === 403) return "content_rejected";
  if (status >= 500) return "provider_unavailable";
  return "unknown";
}

function toErrorCode(error: unknown): TryOnErrorCode {
  if (error instanceof ProviderError) return error.code;
  if (error instanceof Error && error.name === "AbortError") {
    return "provider_timeout";
  }
  return "provider_unavailable";
}

/**
 * La respuesta trae la imagen en dos sitios según el caso. Se miran los dos
 * antes de darla por fallida.
 */
function extractImage(
  payload: InteractionsResponse,
): { data: string; mimeType: string } | null {
  if (payload.output_image?.data) {
    return {
      data: payload.output_image.data,
      mimeType: payload.output_image.mime_type ?? "image/jpeg",
    };
  }

  for (const step of payload.steps ?? []) {
    for (const item of step.content ?? []) {
      if (item.type === "image" && item.data) {
        return { data: item.data, mimeType: item.mime_type ?? "image/jpeg" };
      }
    }
  }

  return null;
}
