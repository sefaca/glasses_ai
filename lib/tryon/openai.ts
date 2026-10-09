import {
  type TryOnErrorCode,
  type TryOnInput,
  type TryOnJob,
  type TryOnProvider,
  type TryOnResult,
} from "./provider";

/**
 * Proveedor generativo de OpenAI — la ruta `model-prior` de D-022.
 *
 * Como el de Gemini: no recibe ninguna imagen del anunciante, solo la foto
 * del usuario y una descripción en texto de la montura. Los términos de
 * afiliación no le aplican; su límite es la fidelidad.
 *
 * **Por qué existe además del de Gemini:** las seis simulaciones del mockup
 * del fundador las generó este modelo, así que su fidelidad ya se ha visto
 * sobre su propia cara. Eso no sustituye a GT-1 —ver una imagen sabiendo qué
 * montura es no es un test ciego— pero sí es la señal más directa que tenemos.
 *
 * **Solo servidor.** La clave no puede tocar el navegador → regla 6.
 */

const ENDPOINT = "https://api.openai.com/v1/images/edits";

/**
 * Coste aproximado por imagen, en céntimos de euro.
 *
 * **Atención:** OpenAI factura las imágenes **por tokens**, no con una tarifa
 * plana, así que esto es una estimación para la contabilidad de §29.6 y no un
 * precio. Depende del tamaño, de la calidad y de los reintentos. El número
 * real hay que leerlo del panel de facturación tras las primeras llamadas.
 */
const APPROX_COST_CENTS: Record<string, number> = {
  "gpt-image-2": 10,
  "gpt-image-2.5-flare": 8,
  "gpt-image-2.5-sunburst": 18,
};

export interface OpenAIProviderOptions {
  apiKey: string;
  model?: string;
  /** `auto` conserva el formato de la foto, que en retrato importa. */
  size?: "auto" | "1024x1024" | "1024x1536" | "1536x1024";
  quality?: "low" | "medium" | "high" | "auto";
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  now?: () => number;
}

interface ImagesResponse {
  data?: Array<{ b64_json?: string; url?: string }>;
  error?: { message?: string; code?: string };
}

export class OpenAITryOnProvider implements TryOnProvider {
  readonly name: string;
  readonly assetOwnership = "model-prior" as const;
  readonly costPerTryOnCents: number;
  readonly supportsPhotoInput = true;
  readonly supportsLiveCamera = false;

  private readonly apiKey: string;
  private readonly model: string;
  private readonly size: string;
  private readonly quality: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;
  private readonly now: () => number;
  private readonly results = new Map<string, TryOnResult>();
  private counter = 0;

  constructor(options: OpenAIProviderOptions) {
    if (typeof window !== "undefined") {
      throw new Error(
        "OpenAITryOnProvider solo puede instanciarse en servidor: la clave nunca toca el navegador.",
      );
    }
    if (!options.apiKey) {
      throw new Error("OpenAITryOnProvider requiere una API key.");
    }

    this.apiKey = options.apiKey;
    this.model = options.model ?? "gpt-image-2";
    this.size = options.size ?? "auto";
    this.quality = options.quality ?? "high";
    this.timeoutMs = options.timeoutMs ?? 120_000;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.now = options.now ?? (() => Date.now());
    this.name = `openai:${this.model}`;
    this.costPerTryOnCents = APPROX_COST_CENTS[this.model] ?? 12;
  }

  async createTryOn(input: TryOnInput): Promise<TryOnJob> {
    const id = `oai-${++this.counter}-${this.now()}`;

    if (!input.userImage || !input.framePrompt) {
      return this.store(this.failed(id, input, "invalid_input"));
    }

    try {
      const dataUrl = await this.edit(input.userImage, input.framePrompt);
      return this.store({
        ...this.base(id, input),
        status: "completed",
        resultUrl: dataUrl,
        errorCode: null,
        completedAt: new Date(this.now()).toISOString(),
        billable: true,
      });
    } catch (error) {
      // Regla 5: hacia fuera, código estable. El mensaje de OpenAI puede
      // llevar detalles de la organización o de la cuota.
      return this.store(this.failed(id, input, toErrorCode(error)));
    }
  }

  async getJob(jobId: string): Promise<TryOnResult> {
    const job = this.results.get(jobId);
    if (!job) throw new Error(`openai: job desconocido ${jobId}`);
    return { ...job };
  }

  private async edit(
    image: { mimeType: string; base64: string },
    prompt: string,
  ): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const form = new FormData();
      form.append("model", this.model);
      form.append("prompt", prompt);
      form.append("n", "1");
      form.append("size", this.size);
      form.append("quality", this.quality);
      form.append(
        "image",
        new Blob([decodeBase64(image.base64)], { type: image.mimeType }),
        "photo.jpg",
      );
      // `input_fidelity` NO se envía: las fuentes consultadas discrepan sobre
      // si sigue aceptándose, y un campo desconocido puede tumbar una
      // petición válida. Los modelos actuales ya procesan la referencia en
      // alta fidelidad por defecto.

      const response = await this.fetchImpl(ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${this.apiKey}` },
        signal: controller.signal,
        body: form,
      });

      const payload = (await response
        .json()
        .catch(() => ({}))) as ImagesResponse;

      if (!response.ok) {
        throw new ProviderError(statusToErrorCode(response.status));
      }

      const first = payload.data?.[0];
      if (first?.b64_json) {
        return `data:image/png;base64,${first.b64_json}`;
      }
      // Algunos modelos devuelven URL temporal en lugar de bytes.
      if (first?.url) return first.url;

      throw new ProviderError("content_rejected");
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
  if (status === 401 || status === 403) return "content_rejected";
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
 * base64 → `ArrayBuffer` propio.
 *
 * Se recorta en lugar de devolver el `Buffer` tal cual porque Node reutiliza
 * un pool de memoria: el `buffer` subyacente suele ser mayor que los bytes
 * que nos interesan, y pasarlo entero metería basura en el multipart.
 */
function decodeBase64(base64: string): ArrayBuffer {
  const buffer = Buffer.from(base64, "base64");
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}
